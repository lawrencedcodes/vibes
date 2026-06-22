import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const SECRET = process.env.SESSION_SECRET || "local_development_secret_key_needs_to_be_at_least_32_characters_long";
// Derive a 32-byte key from the secret using scrypt
const KEY = crypto.scryptSync(SECRET, "google-token-salt", 32);

/**
 * Encrypts a plain text string using AES-256-CBC.
 * Returns the IV and encrypted text joined by a colon.
 */
export function encryptText(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts an AES-256-CBC encrypted string format ("iv:encryptedText").
 */
export function decryptText(encryptedText: string): string {
  const parts = encryptedText.split(":");
  const ivHex = parts[0];
  const encrypted = parts[1];
  
  if (!ivHex || !encrypted) {
    throw new Error("Invalid encrypted text format");
  }
  
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
