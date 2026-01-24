// Anonymous user fingerprinting for rate limiting and like tracking
// Uses a combination of browser characteristics to create a stable identifier

const FINGERPRINT_KEY = "huego-fingerprint";

function generateFingerprint(): string {
  // Generate a random ID as fallback/base
  const randomPart = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now().toString(36);

  if (typeof window === "undefined") {
    return `server-${randomPart}-${timestamp}`;
  }

  // Collect browser characteristics
  const components: string[] = [];

  // Screen info
  components.push(`${screen.width}x${screen.height}`);
  components.push(`${screen.colorDepth}`);

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown");

  // Language
  components.push(navigator.language || "unknown");

  // Platform
  components.push(navigator.platform || "unknown");

  // Hardware concurrency
  components.push(String(navigator.hardwareConcurrency || 0));

  // Create hash from components
  const componentString = components.join("|");
  let hash = 0;
  for (let i = 0; i < componentString.length; i++) {
    const char = componentString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Combine hash with random part for uniqueness
  return `${Math.abs(hash).toString(36)}-${randomPart}`;
}

export function getFingerprint(): string {
  if (typeof window === "undefined") {
    return generateFingerprint();
  }

  // Check localStorage first
  let fingerprint = localStorage.getItem(FINGERPRINT_KEY);

  if (!fingerprint) {
    fingerprint = generateFingerprint();
    localStorage.setItem(FINGERPRINT_KEY, fingerprint);
  }

  return fingerprint;
}

export function getAuthorDisplayName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("huego-author-name");
}

export function setAuthorDisplayName(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("huego-author-name", name);
}
