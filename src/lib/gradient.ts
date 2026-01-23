// Gradient generation utilities for HueGo
// Creates beautiful gradients from palette colors

import type { Color } from "./types";

export type GradientType = "linear" | "radial" | "conic" | "mesh";

export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export interface LinearGradientConfig {
  type: "linear";
  angle: number; // 0-360 degrees
  stops: GradientStop[];
}

export interface RadialGradientConfig {
  type: "radial";
  shape: "circle" | "ellipse";
  position: { x: number; y: number }; // 0-100 percentage
  stops: GradientStop[];
}

export interface ConicGradientConfig {
  type: "conic";
  angle: number; // Starting angle
  position: { x: number; y: number }; // Center position
  stops: GradientStop[];
}

export interface MeshGradientConfig {
  type: "mesh";
  colors: string[]; // 4 colors for mesh points
  intensity: number; // 0-100 blur intensity
}

export type GradientConfig =
  | LinearGradientConfig
  | RadialGradientConfig
  | ConicGradientConfig
  | MeshGradientConfig;

/**
 * Generate a linear gradient from palette colors
 */
export function generateLinearGradient(
  colors: Color[],
  angle: number = 90
): LinearGradientConfig {
  const stops: GradientStop[] = colors.map((color, index) => ({
    color: color.hex,
    position: (index / (colors.length - 1)) * 100,
  }));

  return {
    type: "linear",
    angle,
    stops,
  };
}

/**
 * Generate a radial gradient from palette colors
 */
export function generateRadialGradient(
  colors: Color[],
  shape: "circle" | "ellipse" = "circle",
  position: { x: number; y: number } = { x: 50, y: 50 }
): RadialGradientConfig {
  const stops: GradientStop[] = colors.map((color, index) => ({
    color: color.hex,
    position: (index / (colors.length - 1)) * 100,
  }));

  return {
    type: "radial",
    shape,
    position,
    stops,
  };
}

/**
 * Generate a conic gradient from palette colors
 */
export function generateConicGradient(
  colors: Color[],
  angle: number = 0,
  position: { x: number; y: number } = { x: 50, y: 50 }
): ConicGradientConfig {
  const stops: GradientStop[] = colors.map((color, index) => ({
    color: color.hex,
    position: (index / colors.length) * 100,
  }));

  // Add first color at end for smooth loop
  if (colors.length > 0) {
    stops.push({
      color: colors[0].hex,
      position: 100,
    });
  }

  return {
    type: "conic",
    angle,
    position,
    stops,
  };
}

/**
 * Generate a mesh gradient from palette colors
 * Uses 4 corner colors to create organic blob effect
 */
export function generateMeshGradient(
  colors: Color[],
  intensity: number = 60
): MeshGradientConfig {
  // Use first 4 colors, or repeat if less
  const meshColors: string[] = [];
  for (let i = 0; i < 4; i++) {
    meshColors.push(colors[i % colors.length].hex);
  }

  return {
    type: "mesh",
    colors: meshColors,
    intensity,
  };
}

/**
 * Convert gradient config to CSS string
 */
export function gradientToCSS(config: GradientConfig): string {
  switch (config.type) {
    case "linear":
      return linearGradientToCSS(config);
    case "radial":
      return radialGradientToCSS(config);
    case "conic":
      return conicGradientToCSS(config);
    case "mesh":
      return meshGradientToCSS(config);
    default:
      return "";
  }
}

function linearGradientToCSS(config: LinearGradientConfig): string {
  const stops = config.stops
    .map((s) => `${s.color} ${s.position}%`)
    .join(", ");
  return `linear-gradient(${config.angle}deg, ${stops})`;
}

function radialGradientToCSS(config: RadialGradientConfig): string {
  const stops = config.stops
    .map((s) => `${s.color} ${s.position}%`)
    .join(", ");
  return `radial-gradient(${config.shape} at ${config.position.x}% ${config.position.y}%, ${stops})`;
}

function conicGradientToCSS(config: ConicGradientConfig): string {
  const stops = config.stops
    .map((s) => `${s.color} ${s.position}%`)
    .join(", ");
  return `conic-gradient(from ${config.angle}deg at ${config.position.x}% ${config.position.y}%, ${stops})`;
}

function meshGradientToCSS(config: MeshGradientConfig): string {
  // Mesh gradient is created using multiple radial gradients
  // This creates an organic, blob-like effect
  const [c1, c2, c3, c4] = config.colors;
  const blur = config.intensity;

  return `
    radial-gradient(at 0% 0%, ${c1} 0%, transparent ${blur}%),
    radial-gradient(at 100% 0%, ${c2} 0%, transparent ${blur}%),
    radial-gradient(at 100% 100%, ${c3} 0%, transparent ${blur}%),
    radial-gradient(at 0% 100%, ${c4} 0%, transparent ${blur}%)
  `.replace(/\s+/g, " ").trim();
}

/**
 * Generate full CSS rule for gradient background
 */
export function generateGradientCSS(
  config: GradientConfig,
  selector: string = ".gradient"
): string {
  const gradient = gradientToCSS(config);

  if (config.type === "mesh") {
    // Mesh needs a base background color
    const baseColor = config.colors[0];
    return `${selector} {
  background-color: ${baseColor};
  background-image: ${gradient};
  background-size: 100% 100%;
}`;
  }

  return `${selector} {
  background: ${gradient};
}`;
}

/**
 * Preset gradient angles
 */
export const gradientAnglePresets = [
  { label: "→", angle: 90 },
  { label: "↘", angle: 135 },
  { label: "↓", angle: 180 },
  { label: "↙", angle: 225 },
  { label: "←", angle: 270 },
  { label: "↖", angle: 315 },
  { label: "↑", angle: 0 },
  { label: "↗", angle: 45 },
];

/**
 * Preset radial positions
 */
export const radialPositionPresets = [
  { label: "Center", position: { x: 50, y: 50 } },
  { label: "Top Left", position: { x: 0, y: 0 } },
  { label: "Top Right", position: { x: 100, y: 0 } },
  { label: "Bottom Left", position: { x: 0, y: 100 } },
  { label: "Bottom Right", position: { x: 100, y: 100 } },
];

/**
 * Export gradient as CSS variables
 */
export function exportGradientAsCSS(
  config: GradientConfig,
  name: string = "palette"
): string {
  const lines = [
    "/* HueGo Gradient - CSS */",
    "/* https://huego.app */",
    "",
  ];

  // Add color variables
  if (config.type === "mesh") {
    config.colors.forEach((color, i) => {
      lines.push(`--${name}-color-${i + 1}: ${color};`);
    });
  } else {
    config.stops.forEach((stop, i) => {
      lines.push(`--${name}-color-${i + 1}: ${stop.color};`);
    });
  }

  lines.push("");
  lines.push(`--${name}-gradient: ${gradientToCSS(config)};`);
  lines.push("");
  lines.push(generateGradientCSS(config, `.${name}-bg`));

  return lines.join("\n");
}
