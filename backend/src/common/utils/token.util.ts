import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  exp?: number;
}

const getKey = (salt: Buffer, passphrase: string): Buffer => {
  return crypto.pbkdf2Sync(passphrase, salt, ITERATIONS, KEY_LENGTH, 'sha512');
};

export const generateSecureToken = (
  payload: TokenPayload,
  secret: string,
): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = getKey(salt, secret);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const payloadString = JSON.stringify({
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  let encrypted = cipher.update(payloadString, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

export const verifySecureToken = (
  token: string,
  secret: string,
): TokenPayload | null => {
  try {
    const [saltHex, ivHex, authTagHex, encrypted] = token.split(':');
    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = getKey(salt, secret);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const payload = JSON.parse(decrypted) as TokenPayload;

    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

export const generateApiKey = (): string => {
  return `ts360_${crypto.randomBytes(32).toString('hex')}`;
};
