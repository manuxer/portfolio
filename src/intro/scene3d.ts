/**
 * The intro's 3D stage (three.js), in the manner of Apple's translucent "Liquid Glass" UI:
 * every part of the logo is a piece of glass with softly rounded rims, refracting the
 * stage's light backdrop of brand-coloured glows (backdrop.ts) and catching the light of
 * a soft studio. World units are the logo's own units, with the origin at the centre of
 * the stage and y pointing up; the canvas fills the overlay.
 *
 * - Parts that change shape (the yellow notch, and each stripe ↔ accent) are rebuilt
 *   from corner-matched outlines whenever their `t` changes (at most once a frame), so
 *   they turn from one clean shape into the other; while travelling they lift towards
 *   the viewer, so they never pass through each other or the M.
 * - Letter bodies are centred on their own middles, so they can slide out of the mark.
 * - A soft shadow (the pieces' silhouettes, blurred) darkens the backdrop behind them,
 *   so clear glass still reads on a light stage; the glass refracts it too.
 * - `settle` condenses the glass into the flat logo: the rims sharpen, the glass turns
 *   solid, the shadow goes and the light turns flat and even, so at the end the 3D outline
 *   and colours are exactly the flat logo's and the flat mark can take over unseen.
 */
import {
  AmbientLight,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  ShaderMaterial,
  ShapeUtils,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
  type Material,
  type ColorRepresentation,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { LOGO_STRIPES } from "@/lib/logo";
import { bodyHalves, compactPlacement, FULL_CENTER, FULL_LETTERS, FULL_M, STAGE, stripeShape, type Pt } from "./geometry";

export interface Look3D {
  /** Thickness of each piece of glass, in logo units (the mark is 464 wide). */
  depth: number;
  /** How round the rims are: radius across the face (it also rounds the corners) and in depth. */
  round: number;
  roundDepth: number;
  /** How far (logo units) a travelling stripe/accent lifts towards the viewer mid-flight. */
  lift: number;
  /** Camera field of view (degrees): lower is flatter, higher is more dramatic. */
  fov: number;
  glass: {
    /** Tint of the M and letters' glass. */
    body: ColorRepresentation;
    /** The stripes' glass is tinted their colours, this much lighter (0–1). */
    stripes: number;
    /** 0 is perfectly clear; higher frosts what's seen through it. `frost` is Act 1's start. */
    roughness: number;
    frost: number;
    /** Index of refraction (glass ≈ 1.5) and rainbow fringing at the rims. */
    ior: number;
    dispersion: number;
  };
  /** Soft shadow behind the glass: how dark, how far down and how soft (stage units). */
  shadow: { opacity: number; offset: number; blur: number };
  /** The light parts' flat colour at the end (the header logo's ink). */
  ink: ColorRepresentation;
}

/** A part whose outline changes: animate `t` from 0 (main logo) to 1 (full logo). */
export interface Morph {
  mesh: Mesh;
  t: number;
}

export interface Scene3D {
  canvas: HTMLCanvasElement;
  /** Resolves once shaders are compiled and a first frame is drawn (so Act 1 doesn't stall). */
  ready: Promise<void>;
  /** Scales the whole logo (z → 0 flattens it). */
  root: Group;
  /** The M (body + yellow notch). Main logo: `compact` transform; full logo: identity. */
  mark: Group;
  compact: { x: number; scale: number };
  notch: Morph;
  /** One per accent, in FULL_LETTERS order (U has two). */
  accents: (Morph & { letter: number })[];
  /** Letter bodies in FULL_LETTERS order, each centred on its middle; `homes` are their places. */
  bodies: Mesh[];
  homes: Vector3[];
  /** Turn the studio reflections (radians) to sweep a highlight across the glass. */
  environment: { yaw: number };
  /** 1 = frosted (`glass.frost`), 0 = clear (`glass.roughness`). */
  frost: { t: number };
  /** 0 = glass, 1 = the flat logo: sharp, solid and evenly lit, in its exact colours. */
  settle: { t: number };
  /** Re-fits the canvas to the overlay and the picture to the stage (repaint the backdrop first). */
  resize(): void;
  render(): void;
  dispose(): void;
}

const [CX, CY] = FULL_CENTER;
/** Logo units (y down) → world (origin at the stage centre, y up). */
const toWorld = ([x, y]: Pt) => new Vector2(x - CX, -(y - CY));

/** Counter-clockwise (in world space). */
function canonical(points: Vector2[]) {
  return ShapeUtils.isClockWise(points) ? [...points].reverse() : [...points];
}

const centroid = (pts: Vector2[]) => pts.reduce((c, p) => c.add(p), new Vector2()).divideScalar(pts.length);

/** Centred on its centroid and scaled to unit RMS radius, to compare shapes regardless of size and place. */
function normalised(pts: Vector2[]) {
  const c = centroid(pts);
  const r = Math.sqrt(pts.reduce((s, p) => s + p.distanceToSquared(c), 0) / pts.length) || 1;
  return pts.map((p) => p.clone().sub(c).divideScalar(r));
}

/**
 * Corner-matched outlines for a morph between two convex shapes: the shape with fewer
 * corners gains one (a repeated corner or an edge midpoint), and both are paired corner
 * to corner in whichever arrangement keeps their shapes closest, so the in-between
 * shapes are clean polygons rather than blends.
 */
function matchCorners(a: Vector2[], b: Vector2[]): [Vector2[], Vector2[]] {
  const grow = (pts: Vector2[], n: number): Vector2[][] => {
    if (pts.length >= n) return [pts];
    const options: Vector2[][] = [];
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length];
      options.push([...pts.slice(0, i + 1), p.clone(), ...pts.slice(i + 1)]); // repeat a corner
      options.push([...pts.slice(0, i + 1), p.clone().lerp(q, 0.5), ...pts.slice(i + 1)]); // split an edge
    });
    return options.flatMap((o) => grow(o, n));
  };
  const n = Math.max(a.length, b.length);
  let best: [Vector2[], Vector2[]] = [a, b];
  let bestCost = Infinity;
  for (const A of grow(a, n)) {
    for (const B of grow(b, n)) {
      const nA = normalised(A);
      const nB = normalised(B);
      for (let k = 0; k < n; k++) {
        const cost = nA.reduce((s, p, i) => s + p.distanceToSquared(nB[(i + k) % n]), 0);
        if (cost < bestCost) {
          bestCost = cost;
          best = [A, B.map((_, i) => B[(i + k) % n])];
        }
      }
    }
  }
  return best;
}

/** Drops points sitting on (or almost on) their neighbour: repeated corners would break the rims. */
const dedupe = (pts: Vector2[]) => pts.filter((p, i) => p.distanceTo(pts[(i + 1) % pts.length]) > 0.5);

/** Outward unit normal of the edge a→b of a counter-clockwise outline. */
const outward = (a: Vector2, b: Vector2) => new Vector2(b.y - a.y, a.x - b.x).normalize();

/**
 * Insets a counter-clockwise outline by d: each edge moves inwards, and edges too short to
 * survive that drop out (their neighbours then meet). Empty if the outline vanishes.
 */
function inset(points: Vector2[], d: number): Vector2[] {
  let edges = points.map((p, i) => {
    const dir = points[(i + 1) % points.length].clone().sub(p).normalize();
    return { from: p.clone().add(new Vector2(-dir.y, dir.x).multiplyScalar(d)), dir };
  });
  const meet = (a: (typeof edges)[number], b: (typeof edges)[number]) => {
    const den = a.dir.x * b.dir.y - a.dir.y * b.dir.x;
    if (Math.abs(den) < 1e-9) return b.from.clone(); // in line: carry straight on
    const t = ((b.from.x - a.from.x) * b.dir.y - (b.from.y - a.from.y) * b.dir.x) / den;
    return a.from.clone().addScaledVector(a.dir, t);
  };
  for (;;) {
    const n = edges.length;
    if (n < 3) return [];
    const corners = edges.map((e, i) => meet(edges[(i + n - 1) % n], e)); // where edge i begins
    const kept = edges.filter((e, i) => corners[(i + 1) % n].clone().sub(corners[i]).dot(e.dir) > 0);
    if (kept.length === n) return corners;
    edges = kept;
  }
}

const ARC = Math.PI / 12; // rounded corners: a point every 15° of turn
const RINGS = 6; // points across each rounded rim

/**
 * A piece of glass: `outline` (counter-clockwise) extruded `depth` deep, its rims rounded
 * with radius r across the face (so are its corners) and rz in depth. Its widest outline
 * is `outline`, and the front of that lies on z = 0. Normals follow the rounded surface,
 * so it shades smoothly, with no facets or creases.
 */
function slab(outline: Vector2[], depth: number, r: number, rz: number): BufferGeometry {
  let core = r > 0 ? dedupe(inset(outline, r)) : outline;
  if (core.length < 3) [core, r] = [outline, 0]; // too small to round
  // Round the core: each rim point sits at `at` + `off` × (offset), facing `face`.
  const at: Vector2[] = [];
  const off: Vector2[] = [];
  const face: Vector2[] = [];
  const first: number[] = []; // each core corner's first rim point
  core.forEach((p, i) => {
    const n1 = outward(core[(i + core.length - 1) % core.length], p);
    const n2 = outward(p, core[(i + 1) % core.length]);
    const turn = Math.atan2(n1.x * n2.y - n1.y * n2.x, n1.dot(n2));
    first.push(at.length);
    if (turn > 1e-3) {
      const steps = Math.ceil(turn / ARC);
      for (let s = 0; s <= steps; s++) {
        const n = n1.clone().rotateAround(new Vector2(), (turn * s) / steps);
        at.push(p);
        off.push(n);
        face.push(n);
      }
    } else {
      const m = n1.clone().add(n2);
      at.push(p);
      off.push(m.clone().divideScalar(1 + n1.dot(n2)));
      face.push(m.normalize());
    }
  });
  // Profile: front face → rounded rim → straight band → rounded rim → back face.
  const band = Math.max(0, depth - 2 * rz);
  const profile: [number, number][] = []; // [angle round the rim, z of its centre]
  for (let j = 0; j <= RINGS; j++) profile.push([(Math.PI / 2) * (1 - j / RINGS), 0]);
  for (let j = 0; j <= RINGS; j++) profile.push([(-Math.PI / 2) * (j / RINGS), -band]);
  const n = at.length;
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  const normal = new Vector3();
  for (const [phi, z] of profile) {
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    for (let k = 0; k < n; k++) {
      pos.push(at[k].x + off[k].x * r * c, at[k].y + off[k].y * r * c, z + rz * s);
      normal.set(face[k].x * (rz || 1) * c, face[k].y * (rz || 1) * c, (r || 1) * s).normalize();
      nor.push(normal.x, normal.y, normal.z);
    }
  }
  for (let j = 0; j < profile.length - 1; j++) {
    for (let k = 0; k < n; k++) {
      const a = j * n + k;
      const b = j * n + ((k + 1) % n);
      idx.push(a, a + n, b + n, a, b + n, b);
    }
  }
  const back = (profile.length - 1) * n;
  for (const tri of ShapeUtils.triangulateShape(core, [])) {
    const [a, b, c] = tri.map((i) => first[i]);
    if (ShapeUtils.area(tri.map((i) => core[i])) > 0) idx.push(a, b, c, back + a, back + c, back + b);
    else idx.push(a, c, b, back + a, back + b, back + c);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new Float32BufferAttribute(nor, 3));
  g.setIndex(idx);
  return g;
}

export interface Scene3DOptions {
  /** Also run on a software renderer (review mode); otherwise such devices get the flat intro. */
  allowSoftware: boolean;
  /** The GPU dropped the canvas (not called after `dispose`). */
  onLost: () => void;
}

/**
 * `host` is the overlay-sized layer the canvas fills, `frame` the stage's box (one logo unit
 * there is one stage unit on screen), `backdrop` the painted backdrop the glass refracts.
 */
export function createScene3D(
  host: HTMLElement,
  frame: HTMLElement,
  backdrop: HTMLCanvasElement,
  look: Look3D,
  compactScale: number,
  options: Scene3DOptions,
): Scene3D | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: !options.allowSoftware,
    });
  } catch {
    return null; // no WebGL, or only a software renderer: the intro runs its flat version
  }
  // Not every browser flags a software renderer as a performance caveat; its name gives it away.
  const gl = renderer.getContext();
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const gpu = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  if (!options.allowSoftware && /swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu)) {
    renderer.dispose();
    renderer.forceContextLoss();
    return null;
  }
  // Checking every shader for errors waits on each compile; keep it to development.
  renderer.debug.checkShaderErrors = import.meta.env.DEV;
  // What the glass refracts is soft and blurred anyway: half resolution is plenty.
  renderer.transmissionResolutionScale = 0.5;
  const canvas = renderer.domElement;
  canvas.className = "intro-canvas";
  host.appendChild(canvas);
  let disposed = false;
  canvas.addEventListener("webglcontextlost", () => !disposed && options.onLost());

  const scene = new Scene();
  // The backdrop fills the canvas exactly as the page layer behind it, so the two match, with
  // the glass's soft shadow on it. It's drawn first, as an opaque part of the scene, so the
  // glass refracts it.
  const backdropTexture = new CanvasTexture(backdrop);
  backdropTexture.colorSpace = SRGBColorSpace;
  // The shadow: the pieces in white at low resolution, blurred into a second target.
  const silhouettes = new WebGLRenderTarget(1, 1);
  const shadow = new WebGLRenderTarget(1, 1);
  const quad = new PlaneGeometry(2, 2);
  const fullScreen = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = position.xy * 0.5 + 0.5;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }`;
  const blur = new ShaderMaterial({
    uniforms: { source: { value: silhouettes.texture }, radius: { value: new Vector2() } },
    vertexShader: fullScreen,
    fragmentShader: /* glsl */ `
      uniform sampler2D source;
      uniform vec2 radius;
      varying vec2 vUv;
      void main() {
        float s = 0.0;
        // 5 × 5 taps with Gaussian weights (they sum to ≈ 2π).
        for (int i = -2; i <= 2; i++) {
          for (int j = -2; j <= 2; j++) {
            s += exp(-0.5 * float(i * i + j * j)) * texture2D(source, vUv + radius * vec2(float(i), float(j)) * 0.5).r;
          }
        }
        gl_FragColor = vec4(vec3(s / 6.2832), 1.0);
      }`,
    depthTest: false,
    depthWrite: false,
  });
  const blurScene = new Scene();
  const blurMesh = new Mesh(quad, blur);
  blurMesh.frustumCulled = false;
  blurScene.add(blurMesh);
  const ground = new ShaderMaterial({
    uniforms: {
      backdrop: { value: backdropTexture },
      shadow: { value: shadow.texture },
      opacity: { value: look.shadow.opacity },
      offset: { value: new Vector2() }, // in uv
    },
    vertexShader: fullScreen,
    fragmentShader: /* glsl */ `
      uniform sampler2D backdrop;
      uniform sampler2D shadow;
      uniform float opacity;
      uniform vec2 offset;
      varying vec2 vUv;
      void main() {
        float s = texture2D(shadow, vUv + offset).r;
        gl_FragColor = texture2D(backdrop, vUv) * vec4(vec3(1.0 - opacity * s), 1.0);
        #include <colorspace_fragment>
      }`,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  const groundMesh = new Mesh(quad, ground);
  groundMesh.frustumCulled = false;
  groundMesh.renderOrder = -2;
  scene.add(groundMesh);
  const silhouette = new MeshBasicMaterial({ color: "#ffffff" });
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envMap = pmrem.fromScene(room, 0.04).texture;
  scene.environment = envMap;

  const camera = new PerspectiveCamera(look.fov, 1, 10, 20000);
  const studio = { env: 1.3, key: 2.2, fill: 0.6, rim: 1.4, ambient: 0.4 };
  const key = new DirectionalLight("#ffffff", studio.key);
  key.position.set(-700, 900, 1000);
  const fill = new DirectionalLight("#fff4ea", studio.fill);
  fill.position.set(900, -300, 600);
  const rim = new DirectionalLight("#eef2ff", studio.rim);
  rim.position.set(600, 700, -900);
  const ambient = new AmbientLight("#ffffff", studio.ambient);
  scene.add(key, fill, rim, ambient);

  // Not tone-mapped: once the light settles to flat, each part shows its exact colour.
  const glass = (color: ColorRepresentation) =>
    new MeshPhysicalMaterial({
      color,
      metalness: 0,
      roughness: look.glass.roughness,
      transmission: 1,
      thickness: look.depth * 1.5,
      ior: look.glass.ior,
      dispersion: look.glass.dispersion,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      toneMapped: false,
    });
  // Each material's glass tint, and its flat colour once settled.
  const white = new Color("#ffffff");
  const tints: [Color, Color][] = [
    [new Color(look.glass.body), new Color(look.ink)],
    ...LOGO_STRIPES.map((s): [Color, Color] => [new Color(s.fill).lerp(white, look.glass.stripes), new Color(s.fill)]),
  ];
  const materials = tints.map(([tint]) => glass(tint));
  const [bodyMat, ...stripeMats] = materials;

  // Every piece rebuilds from its outline when its shape or the rims change: at most once a
  // frame, just before it's drawn.
  let soft = 1; // 1 = rounded rims, 0 = sharp (settled)
  const pending = new Set<() => void>();
  const pieces: (() => void)[] = [];
  /** A glass piece; `unit` scales its depth and rims (a stripe of the main logo is a bigger one's). */
  const piece = (mesh: Mesh, outline: () => Vector2[], unit = () => 1) => {
    const rebuild = () => {
      const u = unit();
      mesh.geometry.dispose();
      mesh.geometry = slab(outline(), look.depth * u, look.round * u * soft, look.roundDepth * u * soft);
    };
    rebuild();
    pieces.push(rebuild);
    return rebuild;
  };

  const morph = (from: Vector2[], to: Vector2[], material: MeshPhysicalMaterial, lift: number, z = 0, unit0 = 1): Morph => {
    const [a, b] = matchCorners(canonical(from), canonical(to));
    const mesh = new Mesh(new BufferGeometry(), material);
    let t = 0;
    const rebuild = piece(
      mesh,
      () => dedupe(a.map((p, i) => p.clone().lerp(b[i], t))),
      () => unit0 + (1 - unit0) * t,
    );
    mesh.position.z = z;
    return {
      mesh,
      get t() {
        return t;
      },
      set t(v: number) {
        if (v === t) return;
        t = v;
        pending.add(rebuild);
        mesh.position.z = z + lift * Math.sin(Math.PI * v); // travel in front, land flush
      },
    };
  };

  const root = new Group();
  scene.add(root);

  // The M: same shape in both logos, so it only moves and re-scales; its two halves are two
  // pieces of glass that meet below the V. Its notch morphs between the main logo's yellow
  // stripe and the full logo's yellow triangle.
  const mark = new Group();
  const markCentre = toWorld([232, 208.5]);
  const compact = { x: -markCentre.x * compactScale, scale: compactScale };
  // An invisible wall just behind the M, the size of its box: it writes depth but no colour,
  // so letters waiting behind the logo stay hidden (even through the V) until they slide out.
  const wall = new Mesh(new PlaneGeometry(462, 415), new MeshBasicMaterial({ colorWrite: false }));
  wall.position.set(toWorld([232, 209.5]).x, toWorld([232, 209.5]).y, -look.depth - 4);
  wall.renderOrder = -1;
  mark.add(wall);
  for (const half of bodyHalves()) {
    const mesh = new Mesh(new BufferGeometry(), bodyMat);
    piece(mesh, () => canonical(half.map(toWorld)));
    mark.add(mesh);
  }
  const notch = morph(stripeShape(0).map(toWorld), FULL_M.notch.map(toWorld), stripeMats[0], 0);
  mark.add(notch.mesh);
  root.add(mark);

  // Accents start as stripes of the main logo (placed on the stage) and end in their letters.
  // A letter with two accents (U) starts both from the whole stripe, one a hair behind, and splits.
  const placement = compactPlacement(compactScale);
  const accents = FULL_LETTERS.flatMap((letter, li) =>
    letter.accents.map((accent, k) => {
      const m = morph(
        stripeShape(letter.stripe).map((p) => toWorld(placement.toStage(p))),
        accent.map(toWorld),
        stripeMats[letter.stripe],
        look.lift * (1 + 0.35 * li),
        -2 * k,
        compactScale,
      );
      root.add(m.mesh);
      return Object.assign(m, { letter: li });
    }),
  );

  // Letter bodies, centred on their middles (so they can slide out of the mark); `homes` are their places.
  const homes: Vector3[] = [];
  const bodies = FULL_LETTERS.map((letter) => {
    const outline = canonical(letter.body.map(toWorld));
    const c = centroid(outline);
    const mesh = new Mesh(new BufferGeometry(), bodyMat);
    piece(mesh, () => outline.map((p) => p.clone().sub(c)));
    homes.push(new Vector3(c.x, c.y, 0));
    mesh.position.copy(homes[homes.length - 1]);
    mesh.visible = false; // hidden inside the mark until they emerge
    root.add(mesh);
    return mesh;
  });

  let frostT = 0;
  const frost = {
    get t() {
      return frostT;
    },
    set t(v: number) {
      frostT = v;
      materials.forEach((m) => (m.roughness = look.glass.roughness + (look.glass.frost - look.glass.roughness) * v));
    },
  };

  // Glass → the flat logo: at t = 1 each part is sharp, solid and shows its exact flat colour.
  let settleT = 0;
  const settle = {
    get t() {
      return settleT;
    },
    set t(v: number) {
      settleT = v;
      const k = 1 - v;
      scene.environmentIntensity = studio.env * k;
      key.intensity = studio.key * k;
      fill.intensity = studio.fill * k;
      rim.intensity = studio.rim * k;
      ambient.intensity = studio.ambient * k + Math.PI * v; // π × albedo = the colour itself
      // Never exactly 0: switching transmission or clearcoat off would recompile the shaders.
      materials.forEach((m, i) => {
        m.transmission = Math.max(k, 1e-4);
        m.clearcoat = Math.max(k, 1e-4);
        m.color.copy(tints[i][0]).lerp(tints[i][1], v);
      });
      ground.uniforms.opacity.value = look.shadow.opacity * k;
      if (soft !== k) {
        soft = k;
        pieces.forEach((f) => pending.add(f));
      }
    },
  };

  const environment = {
    get yaw() {
      return scene.environmentRotation.y;
    },
    set yaw(v: number) {
      scene.environmentRotation.y = v;
    },
  };

  // Start as the main logo.
  mark.position.x = compact.x;
  mark.scale.setScalar(compact.scale);

  const resize = () => {
    const view = host.getBoundingClientRect();
    const stage = frame.getBoundingClientRect();
    // Zoom changes the pixel ratio; very large screens draw at up to ~5 megapixels.
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2, Math.sqrt(5e6 / Math.max(1, view.width * view.height))));
    renderer.setSize(view.width, view.height);
    backdropTexture.needsUpdate = true;
    // One logo unit on the z = 0 plane is exactly as many pixels as on the flat stage, and
    // the origin sits on the stage's centre.
    const pxPerUnit = stage.width / STAGE.w;
    camera.aspect = view.width / view.height;
    camera.position.set(0, 0, view.height / 2 / (pxPerUnit * Math.tan((look.fov * Math.PI) / 360)));
    camera.lookAt(0, 0, 0);
    const cx = stage.left + stage.width / 2 - view.left;
    const cy = stage.top + stage.height / 2 - view.top;
    camera.setViewOffset(view.width, view.height, view.width / 2 - cx, view.height / 2 - cy, view.width, view.height);
    // The shadow, in uv of the canvas: offset down, blurred by `blur` stage units.
    silhouettes.setSize(Math.ceil(view.width / 8), Math.ceil(view.height / 8));
    shadow.setSize(Math.ceil(view.width / 8), Math.ceil(view.height / 8));
    ground.uniforms.offset.value.set(0, (look.shadow.offset * pxPerUnit) / view.height);
    blur.uniforms.radius.value.set((look.shadow.blur * pxPerUnit) / view.width, (look.shadow.blur * pxPerUnit) / view.height);
  };

  const meshes: Mesh[] = [];
  root.traverse((o) => o instanceof Mesh && o !== wall && meshes.push(o));
  const glassOf = new Map<Mesh, Material>(meshes.map((m) => [m, m.material as Material]));
  const render = () => {
    pending.forEach((f) => f());
    pending.clear();
    // The shadow's source: the pieces in white (the wall still hides letters behind the M).
    if (ground.uniforms.opacity.value > 0) {
      meshes.forEach((m) => (m.material = silhouette));
      groundMesh.visible = false;
      renderer.setRenderTarget(silhouettes);
      renderer.setClearColor(0x000000, 1);
      renderer.clear();
      renderer.render(scene, camera);
      renderer.setRenderTarget(shadow);
      renderer.render(blurScene, camera);
      renderer.setRenderTarget(null);
      renderer.setClearColor(0x000000, 0);
      groundMesh.visible = true;
      meshes.forEach((m) => (m.material = glassOf.get(m)!));
    }
    renderer.render(scene, camera);
  };

  // Compile shaders in the background (parallel where the GPU allows) and draw one frame with
  // everything showing, so buffers are uploaded and the first animated frame doesn't stall.
  // Then let the page composite the (still invisible) canvas once, as a first composite can
  // be slow too.
  resize();
  const ready = renderer.compileAsync(scene, camera).then(() => {
    if (disposed) return;
    bodies.forEach((m) => (m.visible = true));
    render();
    bodies.forEach((m) => (m.visible = false));
    return new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });

  return {
    canvas,
    ready,
    root,
    mark,
    compact,
    notch,
    accents,
    bodies,
    homes,
    environment,
    frost,
    settle,
    resize,
    render,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      root.traverse((o) => o instanceof Mesh && o.geometry.dispose());
      [...materials, wall.material, silhouette, ground, blur].forEach((m) => m.dispose());
      quad.dispose();
      silhouettes.dispose();
      shadow.dispose();
      backdropTexture.dispose();
      envMap.dispose();
      pmrem.dispose();
      room.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
