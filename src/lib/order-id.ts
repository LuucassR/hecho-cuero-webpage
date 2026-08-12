import { randomBytes } from "node:crypto";

// Excludes visually ambiguous characters (0/O, 1/I/L) to keep order codes easy to read and type.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const LENGTH = 12;

export function generateOrderId(): string {
  const bytes = randomBytes(LENGTH);
  let id = "";
  for (let i = 0; i < LENGTH; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return id;
}
