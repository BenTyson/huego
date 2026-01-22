// Export utilities for HueGo
// Generates various output formats for palettes

import type { Color, ExportFormat } from "./types";

// ============================================
// CSS Variables Export
// ============================================

export function exportCSS(colors: Color[], prefix: string = "color"): string {
  const lines = [
    "/* HueGo Palette - CSS Variables */",
    "/* https://huego.app */",
    "",
    ":root {",
  ];

  colors.forEach((color, index) => {
    const name = `--${prefix}-${index + 1}`;
    lines.push(`  ${name}: ${color.hex};`);
  });

  // Add semantic names
  lines.push("");
  lines.push("  /* Semantic aliases */");
  if (colors[0]) lines.push(`  --${prefix}-primary: ${colors[0].hex};`);
  if (colors[1]) lines.push(`  --${prefix}-secondary: ${colors[1].hex};`);
  if (colors[2]) lines.push(`  --${prefix}-accent: ${colors[2].hex};`);
  if (colors[3]) lines.push(`  --${prefix}-background: ${colors[3].hex};`);
  if (colors[4]) lines.push(`  --${prefix}-surface: ${colors[4].hex};`);

  lines.push("}");

  return lines.join("\n");
}

// ============================================
// SCSS Variables Export
// ============================================

export function exportSCSS(colors: Color[], prefix: string = "color"): string {
  const lines = [
    "// HueGo Palette - SCSS Variables",
    "// https://huego.app",
    "",
  ];

  colors.forEach((color, index) => {
    lines.push(`$${prefix}-${index + 1}: ${color.hex};`);
  });

  lines.push("");
  lines.push("// Semantic aliases");
  if (colors[0]) lines.push(`$${prefix}-primary: ${colors[0].hex};`);
  if (colors[1]) lines.push(`$${prefix}-secondary: ${colors[1].hex};`);
  if (colors[2]) lines.push(`$${prefix}-accent: ${colors[2].hex};`);
  if (colors[3]) lines.push(`$${prefix}-background: ${colors[3].hex};`);
  if (colors[4]) lines.push(`$${prefix}-surface: ${colors[4].hex};`);

  lines.push("");
  lines.push("// As a map");
  lines.push("$palette: (");
  colors.forEach((color, index) => {
    const comma = index < colors.length - 1 ? "," : "";
    lines.push(`  "${index + 1}": ${color.hex}${comma}`);
  });
  lines.push(");");

  return lines.join("\n");
}

// ============================================
// Tailwind Config Export
// ============================================

export function exportTailwind(colors: Color[]): string {
  const colorObj: Record<string, string> = {};

  colors.forEach((color, index) => {
    colorObj[`${index + 1}`] = color.hex;
  });

  // Add semantic names
  if (colors[0]) colorObj["primary"] = colors[0].hex;
  if (colors[1]) colorObj["secondary"] = colors[1].hex;
  if (colors[2]) colorObj["accent"] = colors[2].hex;
  if (colors[3]) colorObj["background"] = colors[3].hex;
  if (colors[4]) colorObj["surface"] = colors[4].hex;

  const config = `// HueGo Palette - Tailwind Config
// https://huego.app
// Add to your tailwind.config.js

module.exports = {
  theme: {
    extend: {
      colors: {
        palette: ${JSON.stringify(colorObj, null, 8).replace(/"/g, "'").split("\n").map((line, i) => i === 0 ? line : "        " + line.trim()).join("\n")}
      }
    }
  }
}

// Usage: bg-palette-primary, text-palette-accent, etc.`;

  return config;
}

// ============================================
// JSON Export
// ============================================

export function exportJSON(colors: Color[], pretty: boolean = true): string {
  const data = {
    name: "HueGo Palette",
    source: "https://huego.app",
    colors: colors.map((color, index) => ({
      index: index + 1,
      hex: color.hex,
      rgb: color.rgb,
      hsl: {
        h: color.hsl.h,
        s: color.hsl.s,
        l: color.hsl.l,
      },
      name: color.name,
      role: ["primary", "secondary", "accent", "background", "surface"][index] || null,
    })),
  };

  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}

// ============================================
// Array Export (Simple)
// ============================================

export function exportArray(colors: Color[]): string {
  return `// HueGo Palette
const palette = [
${colors.map((c) => `  "${c.hex}",`).join("\n")}
];`;
}

// ============================================
// SVG Export
// ============================================

export function exportSVG(colors: Color[], width: number = 500, height: number = 100): string {
  const colorWidth = width / colors.length;

  const rects = colors
    .map(
      (color, index) =>
        `  <rect x="${index * colorWidth}" y="0" width="${colorWidth}" height="${height}" fill="${color.hex}"/>`
    )
    .join("\n");

  const labels = colors
    .map((color, index) => {
      const x = index * colorWidth + colorWidth / 2;
      const y = height / 2;
      const textColor = color.contrastColor === "white" ? "#ffffff" : "#000000";
      return `  <text x="${x}" y="${y}" fill="${textColor}" font-family="monospace" font-size="12" text-anchor="middle" dominant-baseline="middle">${color.hex}</text>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <!-- HueGo Palette - https://huego.app -->
${rects}
${labels}
</svg>`;
}

// ============================================
// PNG Export (Canvas-based)
// ============================================

export async function exportPNG(
  colors: Color[],
  width: number = 1200,
  height: number = 300
): Promise<Blob | null> {
  if (typeof window === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const colorWidth = width / colors.length;

  // Draw color rectangles
  colors.forEach((color, index) => {
    ctx.fillStyle = color.hex;
    ctx.fillRect(index * colorWidth, 0, colorWidth, height);
  });

  // Draw hex labels
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  colors.forEach((color, index) => {
    const x = index * colorWidth + colorWidth / 2;
    const y = height / 2;
    ctx.fillStyle = color.contrastColor === "white" ? "#ffffff" : "#000000";
    ctx.fillText(color.hex, x, y);
  });

  // Draw color names below hex
  ctx.font = "14px sans-serif";
  colors.forEach((color, index) => {
    const x = index * colorWidth + colorWidth / 2;
    const y = height / 2 + 25;
    ctx.fillStyle = color.contrastColor === "white" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)";
    ctx.fillText(color.name, x, y);
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

// ============================================
// Download Helpers
// ============================================

export function downloadText(content: string, filename: string, mimeType: string = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================
// Copy to Clipboard
// ============================================

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// Export Format Types
// ============================================

// Re-export ExportFormat from types.ts for backward compatibility
export type { ExportFormat } from "./types";

export interface ExportOption {
  id: ExportFormat;
  label: string;
  description: string;
  extension: string;
  mimeType: string;
}

export const exportOptions: ExportOption[] = [
  {
    id: "css",
    label: "CSS Variables",
    description: "Ready-to-use CSS custom properties",
    extension: ".css",
    mimeType: "text/css",
  },
  {
    id: "scss",
    label: "SCSS Variables",
    description: "Sass/SCSS variable definitions",
    extension: ".scss",
    mimeType: "text/x-scss",
  },
  {
    id: "tailwind",
    label: "Tailwind Config",
    description: "Extend your Tailwind palette",
    extension: ".js",
    mimeType: "text/javascript",
  },
  {
    id: "json",
    label: "JSON",
    description: "Structured data with all color info",
    extension: ".json",
    mimeType: "application/json",
  },
  {
    id: "array",
    label: "JavaScript Array",
    description: "Simple hex array for JS/TS",
    extension: ".js",
    mimeType: "text/javascript",
  },
  {
    id: "svg",
    label: "SVG Image",
    description: "Vector palette image",
    extension: ".svg",
    mimeType: "image/svg+xml",
  },
  {
    id: "png",
    label: "PNG Image",
    description: "Shareable palette image",
    extension: ".png",
    mimeType: "image/png",
  },
];

// ============================================
// Main Export Function
// ============================================

export async function exportPalette(
  format: ExportFormat,
  colors: Color[],
  action: "copy" | "download" = "copy"
): Promise<boolean> {
  let content: string;
  let blob: Blob | null = null;
  const option = exportOptions.find((o) => o.id === format);

  if (!option) return false;

  switch (format) {
    case "css":
      content = exportCSS(colors);
      break;
    case "scss":
      content = exportSCSS(colors);
      break;
    case "tailwind":
      content = exportTailwind(colors);
      break;
    case "json":
      content = exportJSON(colors);
      break;
    case "array":
      content = exportArray(colors);
      break;
    case "svg":
      content = exportSVG(colors);
      break;
    case "png":
      blob = await exportPNG(colors);
      if (!blob) return false;
      if (action === "download") {
        downloadBlob(blob, `huego-palette${option.extension}`);
        return true;
      }
      // For copy, we can't copy PNG to clipboard easily
      return false;
    default:
      return false;
  }

  if (action === "copy") {
    return copyToClipboard(content);
  } else {
    downloadText(content, `huego-palette${option.extension}`, option.mimeType);
    return true;
  }
}
