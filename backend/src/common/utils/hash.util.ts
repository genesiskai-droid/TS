import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-ctr';
const IV_LENGTH = 16;
const SALT_ROUNDS = 10;

export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, SALT_ROUNDS, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
};

export const verifyPassword = (
  password: string,
  hashedPassword: string,
): boolean => {
  const [salt, originalHash] = hashedPassword.split(':');
  const hash = crypto
    .pbkdf2Sync(password, salt, SALT_ROUNDS, 64, 'sha512')
    .toString('hex');
  return hash === originalHash;
};

export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateOtp = (length: number = 6): string => {
  return crypto
    .randomInt(0, Math.pow(10, length))
    .toString()
    .padStart(length, '0');
};

export const encrypt = (text: string, key: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

export const decrypt = (encryptedText: string, key: string): string => {
  const [ivHex, encrypted] = encryptedText.split(':');
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(key, 'hex'),
    Buffer.from(ivHex, 'hex'),
  );
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
