import amazon from "@/assets/clients/amazon.svg";
import usps from "@/assets/clients/usps.svg";
import standardChartered from "@/assets/clients/standard-chartered.svg";
import infosys from "@/assets/clients/infosys.svg";
import fidelity from "@/assets/clients/fidelity.svg";

export interface Client {
  name: string;
  /** One-colour SVG, used as a CSS mask so it takes the theme's text colour. */
  logo: string;
  /** Width ÷ height of the logo's viewBox. */
  ratio: number;
  /** Optical size tweak for logos that read small at equal area (default 1). */
  scale?: number;
}

/** Companies and clients shown in the home-page logo carousel, in order. */
export const clients: Client[] = [
  { name: "Amazon", logo: amazon, ratio: 3.318 },
  { name: "USPS.com", logo: usps, ratio: 8.484 },
  { name: "Standard Chartered", logo: standardChartered, ratio: 2.551, scale: 1.18 },
  { name: "Infosys", logo: infosys, ratio: 2.709, scale: 1.08 },
  { name: "Fidelity Investments", logo: fidelity, ratio: 4.62, scale: 1.12 },
];
