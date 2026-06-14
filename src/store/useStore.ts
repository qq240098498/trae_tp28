import { create } from 'zustand';
import type { Device, WiFi, DeviceFormData, WiFiFormData, ConnectedDeviceRecord, ConnectedDeviceRecordFormData, RouterCapacityConfig, RouterCapacityConfigFormData, RouterMemo, RouterMemoFormData } from '@/types';
import { loadDevices, saveDevices, loadWifis, saveWifis, generateId, loadConnectedDevices, saveConnectedDevices, loadRouterCapacity, saveRouterCapacity, loadRouterMemos, saveRouterMemos } from '@/utils/storage';
import { encrypt, deriveKey, hashPassword, setMasterPasswordHash, verifyMasterPassword, isMasterPasswordSet } from '@/utils/encryption';
import { mockDevices, mockWifis } from '@/utils/mockData';

interface StoreState {
  devices: Device[];
  wifis: WiFi[];
  connectedDevices: ConnectedDeviceRecord[];
  routerCapacityConfigs: RouterCapacityConfig[];
  routerMemos: RouterMemo[];
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
  addConnectedDevice: (data: ConnectedDeviceRecordFormData) => void;
  updateConnectedDevice: (id: string, data: ConnectedDeviceRecordFormData) => void;
  deleteConnectedDevice: (id: string) => void;
  addRouterCapacity: (data: RouterCapacityConfigFormData) => void;
  updateRouterCapacity: (id: string, data: RouterCapacityConfigFormData) => void;
  deleteRouterCapacity: (id: string) => void;
  addRouterMemo: (data: RouterMemoFormData) => boolean;
  updateRouterMemo: (id: string, data: RouterMemoFormData) => boolean;
  deleteRouterMemo: (id: string) => void;
  loadMockData: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  devices: [],
  wifis: [],
  connectedDevices: [],
  routerCapacityConfigs: [],
  routerMemos: [],
  loading: false,
  encryptionKey: null,
  masterPasswordSet: false,

  initStore: () => {
    const hasPassword = isMasterPasswordSet();
    set({ masterPasswordSet: hasPassword });
    const savedDevices = loadDevices();
    const savedWifis = loadWifis();
    const savedConnectedDevices = loadConnectedDevices();
    const savedRouterCapacity = loadRouterCapacity();
    const savedRouterMemos = loadRouterMemos();
    set({
      devices: savedDevices.length > 0 ? savedDevices : [],
      wifis: savedWifis.length > 0 ? savedWifis : [],
      connectedDevices: savedConnectedDevices.length > 0 ? savedConnectedDevices : [],
      routerCapacityConfigs: savedRouterCapacity.length > 0 ? savedRouterCapacity : [],
      routerMemos: savedRouterMemos.length > 0 ? savedRouterMemos : [],
      masterPasswordSet: hasPassword
    });
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

  addConnectedDevice: (data: ConnectedDeviceRecordFormData) => {
    const now = new Date().toISOString();
    const newRecord: ConnectedDeviceRecord = {
      id: generateId(),
      ...data,
      created_at: now,
      updated_at: now
    };
    const connectedDevices = [...get().connectedDevices, newRecord];
    set({ connectedDevices });
    saveConnectedDevices(connectedDevices);
  },

  updateConnectedDevice: (id: string, data: ConnectedDeviceRecordFormData) => {
    const connectedDevices = get().connectedDevices.map(r =>
      r.id === id
        ? { ...r, ...data, updated_at: new Date().toISOString() }
        : r
    );
    set({ connectedDevices });
    saveConnectedDevices(connectedDevices);
  },

  deleteConnectedDevice: (id: string) => {
    const connectedDevices = get().connectedDevices.filter(r => r.id !== id);
    set({ connectedDevices });
    saveConnectedDevices(connectedDevices);
  },

  addRouterCapacity: (data: RouterCapacityConfigFormData) => {
    const now = new Date().toISOString();
    const newConfig: RouterCapacityConfig = {
      id: generateId(),
      ...data,
      created_at: now,
      updated_at: now
    };
    const routerCapacityConfigs = [...get().routerCapacityConfigs, newConfig];
    set({ routerCapacityConfigs });
    saveRouterCapacity(routerCapacityConfigs);
  },

  updateRouterCapacity: (id: string, data: RouterCapacityConfigFormData) => {
    const routerCapacityConfigs = get().routerCapacityConfigs.map(c =>
      c.id === id
        ? { ...c, ...data, updated_at: new Date().toISOString() }
        : c
    );
    set({ routerCapacityConfigs });
    saveRouterCapacity(routerCapacityConfigs);
  },

  deleteRouterCapacity: (id: string) => {
    const routerCapacityConfigs = get().routerCapacityConfigs.filter(c => c.id !== id);
    set({ routerCapacityConfigs });
    saveRouterCapacity(routerCapacityConfigs);
  },

  addRouterMemo: (data: RouterMemoFormData): boolean => {
    const key = get().encryptionKey;
    if (!key) return false;

    const now = new Date().toISOString();
    const newMemo: RouterMemo = {
      id: generateId(),
      router_name: data.router_name,
      admin_address: data.admin_address,
      admin_username: data.admin_username,
      admin_password_encrypted: encrypt(data.admin_password, key),
      broadband_account: data.broadband_account,
      broadband_password_encrypted: data.broadband_password ? encrypt(data.broadband_password, key) : undefined,
      wifi_id: data.wifi_id,
      model: data.model,
      location: data.location,
      notes: data.notes,
      created_at: now,
      updated_at: now
    };
    const routerMemos = [...get().routerMemos, newMemo];
    set({ routerMemos });
    saveRouterMemos(routerMemos);
    return true;
  },

  updateRouterMemo: (id: string, data: RouterMemoFormData): boolean => {
    const key = get().encryptionKey;
    if (!key) return false;

    const routerMemos = get().routerMemos.map(m =>
      m.id === id
        ? {
            ...m,
            router_name: data.router_name,
            admin_address: data.admin_address,
            admin_username: data.admin_username,
            admin_password_encrypted: encrypt(data.admin_password, key),
            broadband_account: data.broadband_account,
            broadband_password_encrypted: data.broadband_password ? encrypt(data.broadband_password, key) : undefined,
            wifi_id: data.wifi_id,
            model: data.model,
            location: data.location,
            notes: data.notes,
            updated_at: new Date().toISOString()
          }
        : m
    );
    set({ routerMemos });
    saveRouterMemos(routerMemos);
    return true;
  },

  deleteRouterMemo: (id: string) => {
    const routerMemos = get().routerMemos.filter(m => m.id !== id);
    set({ routerMemos });
    saveRouterMemos(routerMemos);
  },

  loadMockData: () => {
    set({ devices: mockDevices, wifis: mockWifis });
    saveDevices(mockDevices);
    saveWifis(mockWifis);
  }
}));
