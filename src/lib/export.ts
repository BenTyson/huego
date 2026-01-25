// Export utilities for HueGo
// Generates various output formats for palettes

import type { Color, ExportFormat, ShadeScale } from "./types";
import { generateShadeScale } from "./shade-scale";
import jsPDF from "jspdf";
import { hexToRgb, hexToHsl, hexToOklch } from "./colors";

// ============================================
// Tailwind Export Types
// ============================================

export type TailwindVersion = "v3" | "v4";
export type ColorSpace = "hex" | "oklch" | "rgb" | "hsl";

export interface TailwindExportOptions {
  version: TailwindVersion;
  colorSpace: ColorSpace;
  includeShades: boolean;
}

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
// Tailwind Config Export with Shade Scales
// ============================================

export function exportTailwindWithShades(colors: Color[]): string {
  const roleNames = ["primary", "secondary", "accent", "background", "surface"];

  // Build the color configuration object
  const colorConfig: Record<string, Record<string, string> | string> = {};

  colors.forEach((color, index) => {
    const roleName = roleNames[index] || `color-${index + 1}`;
    const scale: ShadeScale = generateShadeScale(color.hex);

    // Create the shade scale object with DEFAULT pointing to original color
    colorConfig[roleName] = {
      "50": scale[50],
      "100": scale[100],
      "200": scale[200],
      "300": scale[300],
      "400": scale[400],
      "500": scale[500],
      "600": scale[600],
      "700": scale[700],
      "800": scale[800],
      "900": scale[900],
      "950": scale[950],
      DEFAULT: color.hex,
    };
  });

  // Format the configuration nicely
  const formatColorObj = (obj: Record<string, string>, indent: number): string => {
    const spaces = " ".repeat(indent);
    const lines = Object.entries(obj).map(([key, value]) => {
      const keyStr = key === "DEFAULT" || /^\d+$/.test(key) ? key : `'${key}'`;
      return `${spaces}${keyStr}: '${value}',`;
    });
    return lines.join("\n");
  };

  const colorLines = Object.entries(colorConfig).map(([name, shades]) => {
    if (typeof shades === "string") {
      return `        ${name}: '${shades}',`;
    }
    return `        ${name}: {\n${formatColorObj(shades as Record<string, string>, 10)}\n        },`;
  });

  const config = `// HueGo Palette - Tailwind Config with Shade Scales
// https://huego.app
// Add to your tailwind.config.js

module.exports = {
  theme: {
    extend: {
      colors: {
${colorLines.join("\n")}
      }
    }
  }
}

// Usage examples:
// bg-primary-500      - Primary color at 500 shade
// text-accent-200     - Accent color at 200 shade
// bg-primary          - Primary at DEFAULT (your original color)
// border-secondary-700`;

  return config;
}

// ============================================
// Tailwind Config Export with Version/ColorSpace Options
// ============================================

/**
 * Convert color name to a URL-safe slug
 */
function slugifyColorName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove duplicate hyphens
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Format a color value in the specified color space
 */
function formatColorValue(hex: string, space: ColorSpace): string {
  switch (space) {
    case "hex":
      return hex.toLowerCase();
    case "oklch": {
      const oklch = hexToOklch(hex);
      return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)})`;
    }
    case "rgb": {
      const rgb = hexToRgb(hex);
      return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
    }
    case "hsl": {
      const hsl = hexToHsl(hex);
      return `hsl(${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%)`;
    }
  }
}

/**
 * Export Tailwind configuration with version and color space options
 */
export function exportTailwindWithOptions(
  colors: Color[],
  options: TailwindExportOptions
): string {
  const { version, colorSpace, includeShades } = options;

  if (version === "v4") {
    return exportTailwindV4(colors, colorSpace, includeShades);
  } else {
    return exportTailwindV3(colors, colorSpace, includeShades);
  }
}

/**
 * Export Tailwind v3 configuration (JS module.exports format)
 */
function exportTailwindV3(
  colors: Color[],
  colorSpace: ColorSpace,
  includeShades: boolean
): string {
  const colorConfig: Record<string, Record<string, string> | string> = {};

  colors.forEach((color) => {
    const colorName = slugifyColorName(color.name) || "color";

    if (includeShades) {
      const scale = generateShadeScale(color.hex);
      const shadeObj: Record<string, string> = {};

      // Add all shade levels
      const shadeLevels: (keyof ShadeScale)[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
      shadeLevels.forEach((level) => {
        shadeObj[level.toString()] = formatColorValue(scale[level], colorSpace);
      });

      // Add DEFAULT pointing to original color
      shadeObj["DEFAULT"] = formatColorValue(color.hex, colorSpace);

      colorConfig[colorName] = shadeObj;
    } else {
      colorConfig[colorName] = formatColorValue(color.hex, colorSpace);
    }
  });

  // Format the configuration
  const formatValue = (value: Record<string, string> | string, indent: number): string => {
    if (typeof value === "string") {
      return `'${value}'`;
    }

    const spaces = " ".repeat(indent);
    const innerSpaces = " ".repeat(indent + 2);
    const entries = Object.entries(value).map(([key, val]) => {
      const keyStr = key === "DEFAULT" ? "DEFAULT" : /^\d+$/.test(key) ? key : `'${key}'`;
      return `${innerSpaces}${keyStr}: '${val}',`;
    });
    return `{\n${entries.join("\n")}\n${spaces}}`;
  };

  const colorEntries = Object.entries(colorConfig).map(([name, value]) => {
    return `        '${name}': ${formatValue(value, 8)},`;
  });

  const config = `// HueGo Palette - Tailwind v3 Config
// https://huego.app
// Add to your tailwind.config.js

module.exports = {
  theme: {
    extend: {
      colors: {
${colorEntries.join("\n")}
      }
    }
  }
}`;

  return config;
}

/**
 * Export Tailwind v4 configuration (CSS @theme format)
 */
function exportTailwindV4(
  colors: Color[],
  colorSpace: ColorSpace,
  includeShades: boolean
): string {
  const lines: string[] = [
    "/* HueGo Palette - Tailwind v4 Config */",
    "/* https://huego.app */",
    "/* Add to your main CSS file */",
    "",
    "@theme {",
  ];

  colors.forEach((color) => {
    const colorName = slugifyColorName(color.name) || "color";

    if (includeShades) {
      const scale = generateShadeScale(color.hex);
      const shadeLevels: (keyof ShadeScale)[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

      shadeLevels.forEach((level) => {
        const value = formatColorValue(scale[level], colorSpace);
        lines.push(`  --color-${colorName}-${level}: ${value};`);
      });

      // Add default (no suffix) pointing to original
      const defaultValue = formatColorValue(color.hex, colorSpace);
      lines.push(`  --color-${colorName}: ${defaultValue};`);
      lines.push("");
    } else {
      const value = formatColorValue(color.hex, colorSpace);
      lines.push(`  --color-${colorName}: ${value};`);
    }
  });

  // Remove trailing empty line if present
  if (lines[lines.length - 1] === "") {
    lines.pop();
  }

  lines.push("}");

  return lines.join("\n");
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
// PDF Export
// ============================================

export async function exportPDF(colors: Color[]): Promise<Blob> {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header
  doc.setFontSize(28);
  doc.setTextColor(30, 30, 30);
  doc.text("HueGo Palette", 20, 25);

  // Color swatches
  const swatchWidth = (pageWidth - 40) / colors.length;
  const swatchHeight = 70;
  const swatchY = 45;

  colors.forEach((color, i) => {
    const x = 20 + i * swatchWidth;

    // Draw swatch rectangle
    doc.setFillColor(color.rgb.r, color.rgb.g, color.rgb.b);
    doc.rect(x, swatchY, swatchWidth - 2, swatchHeight, "F");

    // Hex label on swatch
    doc.setFontSize(14);
    if (color.contrastColor === "white") {
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setTextColor(0, 0, 0);
    }
    doc.text(color.hex, x + (swatchWidth - 2) / 2, swatchY + swatchHeight / 2, {
      align: "center",
    });

    // Color name below hex
    doc.setFontSize(10);
    doc.text(color.name, x + (swatchWidth - 2) / 2, swatchY + swatchHeight / 2 + 8, {
      align: "center",
    });
  });

  // Color details table
  const tableY = swatchY + swatchHeight + 20;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.text("Color Details", 20, tableY);

  doc.setFontSize(9);
  const colWidth = (pageWidth - 40) / colors.length;
  const headerY = tableY + 10;

  // Table headers for each color
  colors.forEach((color, i) => {
    const x = 20 + i * colWidth;
    const lineHeight = 5;

    // Color index
    doc.setFont("helvetica", "bold");
    doc.text(`Color ${i + 1}`, x, headerY);

    doc.setFont("helvetica", "normal");
    // Hex
    doc.text(`HEX: ${color.hex}`, x, headerY + lineHeight);
    // RGB
    doc.text(`RGB: ${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`, x, headerY + lineHeight * 2);
    // HSL
    doc.text(
      `HSL: ${Math.round(color.hsl.h)}°, ${Math.round(color.hsl.s)}%, ${Math.round(color.hsl.l)}%`,
      x,
      headerY + lineHeight * 3
    );
    // Contrast
    doc.text(`Contrast: ${color.contrastColor}`, x, headerY + lineHeight * 4);
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text("Generated with HueGo - huego.app", 20, pageHeight - 10);

  return doc.output("blob");
}

// ============================================
// ASE Export (Adobe Swatch Exchange)
// ============================================

export function exportASE(colors: Color[]): Blob {
  // Calculate total size needed
  let totalSize = 12; // Header (4) + version (4) + block count (4)

  colors.forEach((color) => {
    // Block type (2) + block length (4) + name length (2) + name UTF-16BE + null (2)
    // + color model (4) + RGB floats (12) + color type (2)
    const nameLen = color.name.length + 1; // +1 for null terminator
    const blockDataSize = 2 + nameLen * 2 + 4 + 12 + 2;
    totalSize += 2 + 4 + blockDataSize; // block type + block length + data
  });

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  let offset = 0;

  // Header: "ASEF"
  view.setUint8(offset++, 0x41); // A
  view.setUint8(offset++, 0x53); // S
  view.setUint8(offset++, 0x45); // E
  view.setUint8(offset++, 0x46); // F

  // Version 1.0
  view.setUint16(offset, 1, false);
  offset += 2;
  view.setUint16(offset, 0, false);
  offset += 2;

  // Block count
  view.setUint32(offset, colors.length, false);
  offset += 4;

  // Color entries
  colors.forEach((color) => {
    // Block type (0x0001 = color entry)
    view.setUint16(offset, 0x0001, false);
    offset += 2;

    // Block length (everything after this field)
    const nameLen = color.name.length + 1; // +1 for null terminator
    const blockLen = 2 + nameLen * 2 + 4 + 12 + 2;
    view.setUint32(offset, blockLen, false);
    offset += 4;

    // Name length (in UTF-16 code units, including null)
    view.setUint16(offset, nameLen, false);
    offset += 2;

    // Name (UTF-16BE)
    for (let i = 0; i < color.name.length; i++) {
      view.setUint16(offset, color.name.charCodeAt(i), false);
      offset += 2;
    }
    // Null terminator
    view.setUint16(offset, 0, false);
    offset += 2;

    // Color model "RGB "
    view.setUint8(offset++, 0x52); // R
    view.setUint8(offset++, 0x47); // G
    view.setUint8(offset++, 0x42); // B
    view.setUint8(offset++, 0x20); // space

    // RGB values (0-1 floats, big-endian)
    view.setFloat32(offset, color.rgb.r / 255, false);
    offset += 4;
    view.setFloat32(offset, color.rgb.g / 255, false);
    offset += 4;
    view.setFloat32(offset, color.rgb.b / 255, false);
    offset += 4;

    // Color type (0 = global)
    view.setUint16(offset, 0, false);
    offset += 2;
  });

  return new Blob([buffer], { type: "application/octet-stream" });
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
  {
    id: "pdf",
    label: "PDF Document",
    description: "Printable presentation with color details",
    extension: ".pdf",
    mimeType: "application/pdf",
  },
  {
    id: "ase",
    label: "Adobe Swatch (ASE)",
    description: "For Photoshop, Illustrator, InDesign",
    extension: ".ase",
    mimeType: "application/octet-stream",
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
    case "pdf":
      blob = await exportPDF(colors);
      if (action === "download") {
        downloadBlob(blob, `huego-palette${option.extension}`);
        return true;
      }
      // For copy, we can't copy PDF to clipboard easily
      return false;
    case "ase":
      blob = exportASE(colors);
      if (action === "download") {
        downloadBlob(blob, `huego-palette${option.extension}`);
        return true;
      }
      // For copy, ASE is binary - can't copy to clipboard
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
