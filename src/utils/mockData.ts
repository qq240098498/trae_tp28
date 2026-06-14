import type { Device, WiFi } from '@/types';

export const mockDevices: Device[] = [
  {
    id: 'dev1',
    name: '主路由器',
    type: 'router',
    ip_address: '192.168.1.1',
    mac_address: 'AA:BB:CC:DD:EE:01',
    location: '客厅电视柜',
    notes: '华硕 AX86U',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'dev2',
    name: '交换机',
    type: 'switch',
    ip_address: '192.168.1.2',
    mac_address: 'AA:BB:CC:DD:EE:02',
    location: '书房弱电箱',
    notes: 'TP-Link 8口千兆',
    created_at: '2024-01-15T10:35:00Z',
    updated_at: '2024-01-15T10:35:00Z'
  },
  {
    id: 'dev3',
    name: '群晖 NAS',
    type: 'nas',
    ip_address: '192.168.1.10',
    mac_address: 'AA:BB:CC:DD:EE:03',
    location: '书房',
    notes: 'DS920+，4x8TB',
    created_at: '2024-01-15T10:40:00Z',
    updated_at: '2024-01-15T10:40:00Z'
  },
  {
    id: 'dev4',
    name: '小爱音箱 Pro',
    type: 'speaker',
    ip_address: '192.168.1.20',
    location: '客厅',
    notes: '控制客厅灯光',
    created_at: '2024-01-15T10:45:00Z',
    updated_at: '2024-01-15T10:45:00Z'
  },
  {
    id: 'dev5',
    name: '门口摄像头',
    type: 'camera',
    ip_address: '192.168.1.30',
    mac_address: 'AA:BB:CC:DD:EE:05',
    location: '大门门口',
    notes: '小米智能摄像机3 Pro',
    created_at: '2024-01-15T10:50:00Z',
    updated_at: '2024-01-15T10:50:00Z'
  },
  {
    id: 'dev6',
    name: '小米电视盒子',
    type: 'tvbox',
    ip_address: '192.168.1.40',
    location: '主卧',
    notes: '小米盒子4S Max',
    created_at: '2024-01-15T10:55:00Z',
    updated_at: '2024-01-15T10:55:00Z'
  }
];

export const mockWifis: WiFi[] = [
  {
    id: 'wifi1',
    ssid: 'HomeNetwork_2.4G',
    password_encrypted: 'U2FsdGVkX1+sampleencryptedpassword',
    band: '2.4G',
    notes: '智能家居专用',
    is_router: true,
    router_ip: '192.168.1.1',
    router_password_encrypted: 'U2FsdGVkX1+samplerouterpassword',
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T11:00:00Z'
  },
  {
    id: 'wifi2',
    ssid: 'HomeNetwork_5G',
    password_encrypted: 'U2FsdGVkX1+anothersamplepassword',
    band: '5G',
    notes: '手机电脑高速上网',
    is_router: true,
    router_ip: '192.168.1.1',
    router_password_encrypted: 'U2FsdGVkX1+samplerouterpassword',
    created_at: '2024-01-15T11:05:00Z',
    updated_at: '2024-01-15T11:05:00Z'
  },
  {
    id: 'wifi3',
    ssid: 'Guest_Network',
    password_encrypted: 'U2FsdGVkX1+guestnetworkpassword',
    band: 'dual',
    notes: '访客网络，限速',
    is_router: false,
    created_at: '2024-01-15T11:10:00Z',
    updated_at: '2024-01-15T11:10:00Z'
  }
];
