import type { Device, WiFi, ConnectedDeviceRecord, RouterCapacityConfig, RouterMemo } from '@/types';

const DEVICES_KEY = 'home_net_devices';
const WIFIS_KEY = 'home_net_wifis';
const CONNECTED_DEVICES_KEY = 'home_net_connected_devices';
const ROUTER_CAPACITY_KEY = 'home_net_router_capacity';
const ROUTER_MEMOS_KEY = 'home_net_router_memos';

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

export const loadConnectedDevices = (): ConnectedDeviceRecord[] => {
  try {
    const data = localStorage.getItem(CONNECTED_DEVICES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveConnectedDevices = (records: ConnectedDeviceRecord[]): void => {
  localStorage.setItem(CONNECTED_DEVICES_KEY, JSON.stringify(records));
};

export const loadRouterCapacity = (): RouterCapacityConfig[] => {
  try {
    const data = localStorage.getItem(ROUTER_CAPACITY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveRouterCapacity = (configs: RouterCapacityConfig[]): void => {
  localStorage.setItem(ROUTER_CAPACITY_KEY, JSON.stringify(configs));
};

export const loadRouterMemos = (): RouterMemo[] => {
  try {
    const data = localStorage.getItem(ROUTER_MEMOS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveRouterMemos = (memos: RouterMemo[]): void => {
  localStorage.setItem(ROUTER_MEMOS_KEY, JSON.stringify(memos));
};
