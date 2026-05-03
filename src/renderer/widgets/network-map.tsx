import React, { useEffect, useState } from 'react';
import type { WidgetPlugin } from '@shared/widget-plugin';

interface Device {
  ip: string;
  mac: string;
  iface?: string;
}

const NetworkMap: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const d = await window.api.net.arp();
    setDevices(d.sort((a, b) => ipNum(a.ip) - ipNum(b.ip)));
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="col fill" style={{ gap: 6, minHeight: 0 }}>
      <div className="row" style={{ alignItems: 'center', gap: 8 }}>
        <span className="metric-label">LOCAL DEVICES</span>
        <span className="muted mono" style={{ fontSize: 11, marginLeft: 'auto' }}>{devices.length} found</span>
        <button className="chip" onClick={refresh}>{loading ? '⏳' : '↻'}</button>
      </div>
      <div className="net-list no-drag">
        {devices.length === 0 && !loading && <div className="muted mono">No devices in ARP table</div>}
        {devices.map((d) => (
          <div key={d.mac} className="net-item">
            <span className="net-ip mono">{d.ip}</span>
            <span className="net-mac mono">{d.mac}</span>
            {d.iface && <span className="net-iface mono">{d.iface}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

function ipNum(ip: string): number {
  const p = ip.split('.').map(Number);
  return ((p[0] || 0) * 16777216) + ((p[1] || 0) * 65536) + ((p[2] || 0) * 256) + (p[3] || 0);
}

export const NetworkMapWidget: WidgetPlugin = {
  id: 'network-map',
  title: 'Network Map',
  description: 'Devices in your local ARP table — IP, MAC, interface',
  category: 'system',
  defaultSize: { w: 4, h: 2 },
  themeable: true,
  component: NetworkMap
};
