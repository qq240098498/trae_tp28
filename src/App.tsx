import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Devices } from '@/pages/Devices';
import { WiFi } from '@/pages/WiFi';
import { Passwords } from '@/pages/Passwords';
import { ConnectedDevices } from '@/pages/ConnectedDevices';
import { RouterMemo } from '@/pages/RouterMemo';
import { useStore } from '@/store/useStore';

export default function App() {
  const initStore = useStore(state => state.initStore);
  const lock = useStore(state => state.lock);

  useEffect(() => {
    initStore();
  }, [initStore]);

  return (
    <Router>
      <Routes>
        <Route element={<Layout onLock={lock} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/connected" element={<ConnectedDevices />} />
          <Route path="/wifi" element={<WiFi />} />
          <Route path="/passwords" element={<Passwords />} />
          <Route path="/router-memo" element={<RouterMemo />} />
        </Route>
      </Routes>
    </Router>
  );
}
