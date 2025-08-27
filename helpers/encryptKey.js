import crypto from "crypto";

const ENCRYPTION_SECRET_RAW = process.env.ENCRYPTION_SECRET || "default_secret";
const ENCRYPTION_SECRET = Buffer.from(ENCRYPTION_SECRET_RAW.padEnd(32, "0").slice(0, 32), "utf8");
const IV_LENGTH = 16; // AES block size

export function encryptKey(key) {
    if (!key) {
        return null;
    }
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_SECRET, iv);
    let encrypted = cipher.update(key, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

export function decryptKey(encrypted) {
  if (!encrypted) return null;
  const [ivHex, encryptedText] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_SECRET, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
