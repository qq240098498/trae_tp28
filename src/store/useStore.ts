import { create } from 'zustand';
import type { Device, WiFi, DeviceFormData, WiFiFormData } from '@/types';
import { loadDevices, saveDevices, loadWifis, saveWifis, generateId } from '@/utils/storage';
import { encrypt, deriveKey, hashPassword, setMasterPasswordHash, verifyMasterPassword, isMasterPasswordSet } from '@/utils/encryption';
import { mockDevices, mockWifis } from '@/utils/mockData';

interface StoreState {
  devices: Device[];
  wifis: WiFi[];
  loading: boolean;
  encryptionKey: string | null;
  masterPasswordSet: boolean;
  initStore: () => void;
  setMasterPassword: (password: string) => boolean;
  unlock: (password: string) => boolean;
  lock: () => void;
  addDevice: (data: DeviceFormData) => void;
  updateDevice: (id: string, data: DeviceFormData) => void;
  deleteDevice: (id: string) => void;
  addWiFi: (data: WiFiFormData) => boolean;
  updateWiFi: (id: string, data: WiFiFormData) => boolean;
  deleteWiFi: (id: string) => void;
  loadMockData: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  devices: [],
  wifis: [],
  loading: false,
  encryptionKey: null,
  masterPasswordSet: false,

  initStore: () => {
    const hasPassword = isMasterPasswordSet();
    set({ masterPasswordSet: hasPassword });
    if (!hasPassword) {
      const savedDevices = loadDevices();
      const savedWifis = loadWifis();
      set({
        devices: savedDevices.length > 0 ? savedDevices : [],
        wifis: savedWifis.length > 0 ? savedWifis : [],
        masterPasswordSet: false
      });
    } else {
      const savedDevices = loadDevices();
      const savedWifis = loadWifis();
      set({
        devices: savedDevices.length > 0 ? savedDevices : [],
        wifis: savedWifis.length > 0 ? savedWifis : [],
      });
    }
  },

  setMasterPassword: (password: string): boolean => {
    if (password.length < 4) return false;
    const hash = hashPassword(password);
    setMasterPasswordHash(hash);
    const key = deriveKey(password);
    set({ encryptionKey: key, masterPasswordSet: true });
    return true;
  },

  unlock: (password: string): boolean => {
    if (!verifyMasterPassword(password)) return false;
    const key = deriveKey(password);
    set({ encryptionKey: key });
    return true;
  },

  lock: () => {
    set({ encryptionKey: null });
  },

  addDevice: (data: DeviceFormData) => {
    const now = new Date().toISOString();
    const newDevice: Device = {
      id: generateId(),
      ...data,
      created_at: now,
      updated_at: now
    };
    const devices = [...get().devices, newDevice];
    set({ devices });
    saveDevices(devices);
  },

  updateDevice: (id: string, data: DeviceFormData) => {
    const devices = get().devices.map(d =>
      d.id === id
        ? { ...d, ...data, updated_at: new Date().toISOString() }
        : d
    );
    set({ devices });
    saveDevices(devices);
  },

  deleteDevice: (id: string) => {
    const devices = get().devices.filter(d => d.id !== id);
    set({ devices });
    saveDevices(devices);
  },

  addWiFi: (data: WiFiFormData): boolean => {
    const key = get().encryptionKey;
    if (!key) return false;

    const now = new Date().toISOString();
    const newWiFi: WiFi = {
      id: generateId(),
      ssid: data.ssid,
      password_encrypted: encrypt(data.password, key),
      band: data.band,
      notes: data.notes,
      is_router: data.is_router,
      router_ip: data.router_ip,
      router_password_encrypted: data.router_password ? encrypt(data.router_password, key) : undefined,
      created_at: now,
      updated_at: now
    };
    const wifis = [...get().wifis, newWiFi];
    set({ wifis });
    saveWifis(wifis);
    return true;
  },

  updateWiFi: (id: string, data: WiFiFormData): boolean => {
    const key = get().encryptionKey;
    if (!key) return false;

    const wifis = get().wifis.map(w =>
      w.id === id
        ? {
            ...w,
            ssid: data.ssid,
            password_encrypted: encrypt(data.password, key),
            band: data.band,
            notes: data.notes,
            is_router: data.is_router,
            router_ip: data.router_ip,
            router_password_encrypted: data.router_password ? encrypt(data.router_password, key) : undefined,
            updated_at: new Date().toISOString()
          }
        : w
    );
    set({ wifis });
    saveWifis(wifis);
    return true;
  },

  deleteWiFi: (id: string) => {
    const wifis = get().wifis.filter(w => w.id !== id);
    set({ wifis });
    saveWifis(wifis);
  },

  loadMockData: () => {
    set({ devices: mockDevices, wifis: mockWifis });
    saveDevices(mockDevices);
    saveWifis(mockWifis);
  }
}));
