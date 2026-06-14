import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'home_net_master_key';

export const deriveKey = (password: string): string => {
  const salt = 'home-network-manager-salt-v1';
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1000
  });
  return key.toString();
};

export const encrypt = (data: string, key: string): string => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

export const decrypt = (encryptedData: string, key: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8) || null;
  } catch {
    return null;
  }
};

export const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

export const setMasterPasswordHash = (hash: string): void => {
  localStorage.setItem(STORAGE_KEY, hash);
};

export const getMasterPasswordHash = (): string | null => {
  return localStorage.getItem(STORAGE_KEY);
};

export const verifyMasterPassword = (password: string): boolean => {
  const storedHash = getMasterPasswordHash();
  if (!storedHash) return false;
  return hashPassword(password) === storedHash;
};

export const isMasterPasswordSet = (): boolean => {
  return getMasterPasswordHash() !== null;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    setTimeout(async () => {
      try {
        await navigator.clipboard.writeText('');
      } catch {
        // Ignore clipboard clear errors
      }
    }, 30000);
    return true;
  } catch {
    return false;
  }
};
