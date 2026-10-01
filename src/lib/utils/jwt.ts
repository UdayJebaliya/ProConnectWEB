interface JwtClaims {
  sub?: string;
  exp?: number;
  [claim: string]: unknown;
}

/**
 * Decodes (without verifying) the payload of a JWT. Used only to read the
 * `sub` (user id) claim off the activation token embedded in the "set your
 * password" email link — actual verification happens server-side.
 */
export function decodeJwtClaims(token: string): JwtClaims | null {
  const segments = token.split(".");
  if (segments.length !== 3) return null;

  try {
    const payload = segments[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((char) => "%" + char.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}

export function getUserIdFromActivationToken(token: string): number | null {
  const claims = decodeJwtClaims(token);
  const sub = claims?.sub;
  if (sub === undefined) return null;
  const id = Number(sub);
  return Number.isFinite(id) ? id : null;
}
