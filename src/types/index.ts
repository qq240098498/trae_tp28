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

export type ConnectedDeviceCategory = 'phone' | 'computer' | 'smarthome' | 'tablet' | 'tv' | 'wearable' | 'other';

export interface ConnectedDeviceRecord {
  id: string;
  category: ConnectedDeviceCategory;
  name: string;
  count: number;
  wifi_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ConnectedDeviceRecordFormData {
  category: ConnectedDeviceCategory;
  name: string;
  count: number;
  wifi_id?: string;
  notes?: string;
}

export interface RouterCapacityConfig {
  id: string;
  name: string;
  max_devices: number;
  wifi_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RouterCapacityConfigFormData {
  name: string;
  max_devices: number;
  wifi_id?: string;
  notes?: string;
}

export const connectedDeviceCategoryLabels: Record<ConnectedDeviceCategory, string> = {
  phone: '手机',
  computer: '电脑',
  smarthome: '智能家居',
  tablet: '平板',
  tv: '电视/盒子',
  wearable: '可穿戴设备',
  other: '其他'
};

export const connectedDeviceCategoryIcons: Record<ConnectedDeviceCategory, string> = {
  phone: '📱',
  computer: '💻',
  smarthome: '🏠',
  tablet: '📟',
  tv: '📺',
  wearable: '⌚',
  other: '🔌'
};
