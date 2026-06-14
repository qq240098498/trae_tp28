export type DeviceType = 'router' | 'switch' | 'nas' | 'speaker' | 'camera' | 'tvbox' | 'other';

export type WiFiBand = '2.4G' | '5G' | 'dual';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  ip_address?: string;
  mac_address?: string;
  location: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WiFi {
  id: string;
  ssid: string;
  password_encrypted: string;
  band: WiFiBand;
  notes?: string;
  is_router: boolean;
  router_ip?: string;
  router_password_encrypted?: string;
  created_at: string;
  updated_at: string;
}

export interface AppState {
  devices: Device[];
  wifis: WiFi[];
  loading: boolean;
  masterPasswordSet: boolean;
}

export interface DeviceFormData {
  name: string;
  type: DeviceType;
  ip_address?: string;
  mac_address?: string;
  location: string;
  notes?: string;
}

export interface WiFiFormData {
  ssid: string;
  password: string;
  band: WiFiBand;
  notes?: string;
  is_router: boolean;
  router_ip?: string;
  router_password?: string;
}

export const deviceTypeLabels: Record<DeviceType, string> = {
  router: '路由器',
  switch: '交换机',
  nas: 'NAS存储',
  speaker: '智能音箱',
  camera: '摄像头',
  tvbox: '电视盒子',
  other: '其他设备'
};

export const wifiBandLabels: Record<WiFiBand, string> = {
  '2.4G': '2.4G',
  '5G': '5G',
  'dual': '双频'
};
