import crypto from 'crypto';

export class PasswordUtil {
  /**
   * Hashes a plain text password using scrypt with a random 16-byte salt
   */
  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  /**
   * Securely compares a plain text password with a stored salt:hash string
   */
  static verifyPassword(password: string, storedHash?: string): boolean {
    if (!storedHash) return false;
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;

    try {
      const keyBuffer = Buffer.from(key, 'hex');
      const derivedKey = crypto.scryptSync(password, salt, 64);
      return crypto.timingSafeEqual(keyBuffer, derivedKey);
    } catch {
      return false;
    }
  }
}
