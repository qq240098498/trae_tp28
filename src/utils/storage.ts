import type { Device, WiFi } from '@/types';

const DEVICES_KEY = 'home_net_devices';
const WIFIS_KEY = 'home_net_wifis';

export const loadDevices = (): Device[] => {
  try {
    const data = localStorage.getItem(DEVICES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveDevices = (devices: Device[]): void => {
  localStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
};

export const loadWifis = (): WiFi[] => {
  try {
    const data = localStorage.getItem(WIFIS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveWifis = (wifis: WiFi[]): void => {
  localStorage.setItem(WIFIS_KEY, JSON.stringify(wifis));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
