import type { RecallState } from "../domain";
export const BACKUP_PREFIX = "RCL2-";
const LEGACY_PREFIX = "RCL1-";
const encode = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};
const decode = (value: string) => {
  let base = value.replace(/-/g, "+").replace(/_/g, "/");
  while (base.length % 4) base += "=";
  return new TextDecoder().decode(
    Uint8Array.from(atob(base), (char) => char.charCodeAt(0)),
  );
};
export const createBackup = (state: RecallState) =>
  BACKUP_PREFIX + encode(JSON.stringify(state));
export const readBackup = (raw: string): unknown => {
  if (!raw || raw.length > 120000) throw new Error("Código inválido");
  const prefix = raw.startsWith(BACKUP_PREFIX)
    ? BACKUP_PREFIX
    : raw.startsWith(LEGACY_PREFIX)
      ? LEGACY_PREFIX
      : null;
  if (!prefix) throw new Error("Código inválido");
  return JSON.parse(decode(raw.slice(prefix.length)));
};
