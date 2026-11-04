import { Component, Fragment, createElement, type ComponentType, type CSSProperties, type ReactNode } from "react";

/*
 * A small player for the Sandbox prototypes.
 *
 * Each prototype is a self-contained `.dc.html` file: an HTML template with
 * {{holes}}, <sc-if> / <sc-for> blocks, a <helmet> of styles, and a logic class
 * (`class Component extends DCLogic`) that steps through a timed sequence of
 * frames. The template is parsed once and rendered with React, so elements keep
 * their identity between frames and CSS transitions/animations play as designed.
 */

type Scope = Record<string, unknown>;

type TNode =
  | { kind: "text"; value: string }
  | { kind: "el"; tag: string; attrs: [string, string][]; children: TNode[] }
  | { kind: "if"; value: string; children: TNode[] }
  | { kind: "for"; list: string; as: string; children: TNode[] };

export interface ParsedPrototype {
  title: string;
  css: string;
  fonts: string[];
  nodes: TNode[];
  script: string;
}

const WHOLE_HOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
const HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;

function compile(node: Node): TNode | null {
  if (node.nodeType === Node.TEXT_NODE) {
    const value = node.nodeValue ?? "";
    // Formatting whitespace between tags collapses to a single space, as HTML would render it.
    return { kind: "text", value: /^\s+$/.test(value) ? " " : value };
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const el = node as Element;
  const children = [...el.childNodes].map(compile).filter((n): n is TNode => n !== null);
  const tag = el.localName;
  if (tag === "sc-if") return { kind: "if", value: el.getAttribute("value") ?? "", children };
  if (tag === "sc-for") return { kind: "for", list: el.getAttribute("list") ?? "", as: el.getAttribute("as") ?? "item", children };
  const attrs = [...el.attributes]
    .filter((a) => !a.name.startsWith("hint-"))
    .map((a) => [a.name, a.value] as [string, string]);
  return { kind: "el", tag, attrs, children };
}

export function parsePrototype(source: string): ParsedPrototype {
  const doc = new DOMParser().parseFromString(source, "text/html");
  const root = doc.querySelector("x-dc");
  if (!root) throw new Error("Prototype has no <x-dc> root");
  const helmet = root.querySelector("helmet");
  const css = helmet ? [...helmet.querySelectorAll("style")].map((s) => s.textContent ?? "").join("\n") : "";
  const fonts = helmet
    ? [...helmet.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute("href") ?? "").filter(Boolean)
    : [];
  helmet?.remove();
  const nodes = [...root.childNodes].map(compile).filter((n): n is TNode => n !== null);
  const script = doc.querySelector("script[data-dc-script]")?.textContent ?? "";
  return { title: doc.title, css, fonts, nodes, script };
}

function lookup(path: string, scope: Scope): unknown {
  const expr = path.trim();
  if (expr === "true") return true;
  if (expr === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
  let value: unknown = scope;
  for (const key of expr.split(".")) {
    if (value == null) return undefined;
    value = (value as Record<string, unknown>)[key];
  }
  return value;
}

function interpolate(text: string, scope: Scope): unknown {
  const whole = text.match(WHOLE_HOLE);
  if (whole) return lookup(whole[1], scope);
  if (!text.includes("{{")) return text;
  return text.replace(HOLE, (_, p: string) => {
    const v = lookup(p, scope);
    return v == null ? "" : String(v);
  });
}

const camel = (name: string) => name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

/** "a: b; c: url(x;y)" → { a: "b", c: "url(x;y)" } — splits only on top-level semicolons. */
function parseStyle(css: string): CSSProperties {
  const out: Record<string, string> = {};
  let depth = 0;
  let quote = "";
  let start = 0;
  const push = (decl: string) => {
    const i = decl.indexOf(":");
    if (i < 0) return;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop || !value) return;
    const key = prop.startsWith("--") ? prop : camel(prop.startsWith("-") ? prop.slice(1).replace(/^./, (c) => c.toUpperCase()) : prop);
    out[key] = value;
  };
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (quote) {
      if (ch === quote) quote = "";
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === ";" && depth === 0) {
      push(css.slice(start, i));
      start = i + 1;
    }
  }
  push(css.slice(start));
  return out as CSSProperties;
}

const ATTR_ALIASES: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  viewbox: "viewBox",
  readonly: "readOnly",
  maxlength: "maxLength",
  colspan: "colSpan",
  rowspan: "rowSpan",
  autocomplete: "autoComplete",
};

function propName(name: string): string {
  if (ATTR_ALIASES[name]) return ATTR_ALIASES[name];
  if (name.startsWith("aria-") || name.startsWith("data-")) return name;
  if (/^on[a-z]+$/.test(name)) return "on" + name[2].toUpperCase() + name.slice(3);
  return name.includes("-") ? camel(name) : name;
}

function renderNodes(nodes: TNode[], scope: Scope): ReactNode[] {
  return nodes.map((node, i) => <Fragment key={i}>{renderNode(node, scope)}</Fragment>);
}

function renderNode(node: TNode, scope: Scope): ReactNode {
  switch (node.kind) {
    case "text": {
      const v = interpolate(node.value, scope);
      return v == null || typeof v === "boolean" ? null : String(v);
    }
    case "if":
      return lookup(node.value.replace(/^\s*\{\{|\}\}\s*$/g, ""), scope) ? renderNodes(node.children, scope) : null;
    case "for": {
      const list = lookup(node.list.replace(/^\s*\{\{|\}\}\s*$/g, ""), scope);
      if (!Array.isArray(list)) return null;
      return list.map((item, $index) => (
        <Fragment key={$index}>{renderNodes(node.children, { ...scope, [node.as]: item, $index })}</Fragment>
      ));
    }
    case "el": {
      const props: Record<string, unknown> = {};
      for (const [name, raw] of node.attrs) {
        const value = interpolate(raw, scope);
        const key = propName(name);
        if (key === "style") props.style = typeof value === "string" ? parseStyle(value) : value;
        else props[key] = value;
      }
      const children = renderNodes(node.children, scope);
      return createElement(node.tag, props, ...(children.length ? children : []));
    }
  }
}

/** Shared play/pause switch for one player instance. */
export interface PlaybackControl {
  paused: boolean;
  resumers: Set<() => void>;
}

export function createControl(paused: boolean): PlaybackControl {
  return { paused, resumers: new Set() };
}

export function setPaused(control: PlaybackControl, paused: boolean) {
  control.paused = paused;
  if (!paused) control.resumers.forEach((resume) => resume());
}

type Updater = Parameters<Component["setState"]>[0];

/**
 * Turns a parsed prototype into a React component. The prototype's own logic
 * class extends the DCLogic base defined here; pausing holds back the next
 * frame update until playback resumes.
 */
export function buildPrototype(proto: ParsedPrototype, control: PlaybackControl): ComponentType {
  class DCLogic extends Component<Record<string, unknown>, Record<string, unknown>> {
    private pending: [Updater, (() => void) | undefined] | null = null;

    constructor(props: Record<string, unknown>) {
      super(props);
      control.resumers.add(() => {
        const next = this.pending;
        if (!next) return;
        this.pending = null;
        Component.prototype.setState.call(this, next[0], next[1]);
      });
    }

    setState(update: Updater, callback?: () => void) {
      if (control.paused) {
        this.pending = [update, callback];
        return;
      }
      super.setState(update, callback);
    }

    renderVals(): Scope {
      return {};
    }

    render() {
      return <>{renderNodes(proto.nodes, this.renderVals())}</>;
    }
  }

  const factory = new Function("DCLogic", `${proto.script}\nreturn Component;`) as (base: typeof DCLogic) => ComponentType;
  return factory(DCLogic);
}
