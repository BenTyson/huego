// File operation utilities for HueGo
// Consolidates download and clipboard operations

/**
 * Download a file with the given content
 */
export function downloadFile(
  content: string | Blob,
  filename: string,
  mimeType: string = "text/plain"
): void {
  const blob = content instanceof Blob
    ? content
    : new Blob([content], { type: mimeType });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 * Returns true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}

/**
 * Read text from clipboard
 * Returns null if failed
 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    return await navigator.clipboard.readText();
  } catch (err) {
    console.error("Failed to read from clipboard:", err);
    return null;
  }
}

/**
 * Generate a filename with timestamp
 */
export function generateFilename(
  base: string,
  extension: string,
  includeTimestamp: boolean = false
): string {
  if (includeTimestamp) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    return `${base}-${timestamp}.${extension}`;
  }
  return `${base}.${extension}`;
}

/**
 * Get MIME type for common file extensions
 */
export function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    json: "application/json",
    css: "text/css",
    scss: "text/x-scss",
    svg: "image/svg+xml",
    png: "image/png",
    pdf: "application/pdf",
    txt: "text/plain",
    html: "text/html",
    js: "text/javascript",
    ts: "text/typescript",
  };
  return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
}

/**
 * Read a file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/**
 * Read a file as data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
