import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './image-ui.css';

const PAGES = {
  home: { title: '首页', image: '/ui/home.svg' },
  trip: { title: '行程', image: '/ui/trip.svg' },
  service: { title: '服务', image: '/ui/service.svg' },
  ai: { title: 'AI 管家', image: '/ui/ai.svg' },
  entertainment: { title: '娱乐', image: '/ui/entertainment.svg' },
  wifi: { title: 'Wi‑Fi', image: '/ui/wifi.svg' }
};

const NAV = [
  { id: 'home', label: '首页', x: 0, y: 7, w: 13, h: 11 },
  { id: 'trip', label: '行程', x: 0, y: 18, w: 13, h: 11 },
  { id: 'service', label: '服务', x: 0, y: 30, w: 13, h: 11 },
  { id: 'ai', label: 'AI 管家', x: 0, y: 42, w: 13, h: 11 },
  { id: 'entertainment', label: '娱乐', x: 0, y: 54, w: 13, h: 11 },
  { id: 'wifi', label: 'Wi‑Fi', x: 0, y: 66, w: 13, h: 11 }
];

const HOTSPOTS = {
  home: [
    { label: '查看实时行程', target: 'trip', x: 14, y: 15, w: 84, h: 19 },
    { label: '行程概览', target: 'trip', x: 15, y: 35, w: 27, h: 30 },
    { label: '舒适体验', target: 'service', x: 42, y: 35, w: 27, h: 30 },
    { label: '矿泉水', request: '矿泉水', x: 70, y: 42, w: 8.5, h: 20 },
    { label: '纸巾', request: '纸巾', x: 79, y: 42, w: 8.5, h: 20 },
    { label: '充电线', request: '充电线', x: 88, y: 42, w: 8.5, h: 20 },
    { label: 'AI 管家', target: 'ai', x: 15, y: 65, w: 27, h: 18 },
    { label: '娱乐', target: 'entertainment', x: 42, y: 65, w: 27, h: 18 },
    { label: 'Wi‑Fi', target: 'wifi', x: 69, y: 65, w: 29, h: 18 },
    { label: '座椅调节', request: '座椅调节', x: 16, y: 84, w: 18, h: 12 },
    { label: '氛围灯', request: '氛围灯', x: 34, y: 84, w: 14, h: 12 },
    { label: '行程中', target: 'trip', x: 48, y: 82, w: 9, h: 15 },
    { label: '遮阳帘', request: '遮阳帘', x: 57, y: 84, w: 19, h: 12 },
    { label: '静音模式', request: '静音模式', x: 76, y: 84, w: 22, h: 12 },
    { label: '一键呼叫', request: '一键呼叫服务', x: 1, y: 82, w: 12, h: 10 }
  ],
  trip: [
    { label: '路况提示', request: '路况提示', x: 15, y: 84, w: 25, h: 11 },
    { label: '舒适模式', target: 'service', x: 41, y: 84, w: 26, h: 11 },
    { label: '平稳驾驶提醒', request: '平稳驾驶提醒', x: 68, y: 84, w: 29, h: 11 },
    { label: '一键呼叫', request: '一键呼叫服务', x: 1, y: 84, w: 12, h: 10 }
  ],
  service: [
    { label: '矿泉水', request: '矿泉水', x: 15, y: 15, w: 26, h: 22 },
    { label: '纸巾', request: '纸巾', x: 42, y: 15, w: 26, h: 22 },
    { label: '充电线', request: '充电线', x: 68, y: 15, w: 27, h: 22 },
    { label: '调高空调', request: '调高空调', x: 15, y: 38, w: 26, h: 22 },
    { label: '调低空调', request: '调低空调', x: 42, y: 38, w: 26, h: 22 },
    { label: '需要安静', request: '需要安静', x: 68, y: 38, w: 27, h: 22 },
    { label: '一键呼叫服务', request: '一键呼叫服务', x: 15, y: 82, w: 80, h: 9 }
  ],
  ai: [
    { label: '附近美食', request: '附近美食推荐', x: 14, y: 65, w: 11, h: 7 },
    { label: '景点推荐', request: '景点推荐', x: 25, y: 65, w: 11, h: 7 },
    { label: '附近商场', request: '附近商场推荐', x: 36, y: 65, w: 11, h: 7 },
    { label: '行程小贴士', request: '行程小贴士', x: 48, y: 65, w: 11, h: 7 },
    { label: '发送', request: 'AI 管家咨询', x: 14, y: 74, w: 45, h: 9 },
    { label: '查看详情', request: '查看餐厅详情', x: 86, y: 34, w: 10, h: 7 },
    { label: '快速呼叫', request: '快速呼叫服务专员', x: 12, y: 88, w: 20, h: 9 },
    { label: '路线规划', target: 'trip', x: 33, y: 88, w: 20, h: 9 },
    { label: '天气查询', request: '天气查询', x: 54, y: 88, w: 20, h: 9 },
    { label: '翻译助手', request: '翻译助手', x: 75, y: 88, w: 21, h: 9 }
  ],
  entertainment: [
    { label: '播放音乐', request: '播放音乐', x: 36, y: 27, w: 22, h: 13 },
    { label: '热门资讯', request: '查看热门资讯', x: 10, y: 40, w: 28, h: 32 },
    { label: '搞笑段子', request: '查看搞笑段子', x: 39, y: 40, w: 27, h: 32 },
    { label: '精选短视频', request: '查看精选短视频', x: 66, y: 40, w: 31, h: 32 },
    { label: '轻松电台', request: '播放轻松电台', x: 10, y: 74, w: 88, h: 22 }
  ],
  wifi: [
    { label: '复制密码', request: '复制 Wi‑Fi 密码', x: 15, y: 60, w: 12, h: 8 },
    { label: '重新显示', request: '重新显示 Wi‑Fi 密码', x: 27, y: 60, w: 12, h: 8 },
    { label: '扫码连接', request: '扫码连接 Wi‑Fi', x: 41, y: 42, w: 19, h: 26 },
    { label: '空调温度', target: 'service', x: 13, y: 86, w: 17, h: 10 },
    { label: '座椅调节', request: '座椅调节', x: 30, y: 86, w: 17, h: 10 },
    { label: '氛围灯', request: '氛围灯', x: 47, y: 86, w: 17, h: 10 },
    { label: '窗帘控制', request: '窗帘控制', x: 64, y: 86, w: 17, h: 10 },
    { label: '隐私模式', request: '隐私模式', x: 81, y: 86, w: 17, h: 10 }
  ]
};

function App() {
  const isDriver = location.pathname.startsWith('/driver') || new URLSearchParams(location.search).get('app') === 'driver';
  return isDriver ? <DriverConsole /> : <PassengerImageApp />;
}

function PassengerImageApp() {
  const [page, setPage] = useState('home');
  const [toasts, setToasts] = useState([]);
  const current = PAGES[page] || PAGES.home;
  const hotspots = useMemo(() => [...NAV, ...(HOTSPOTS[page] || [])], [page]);

  function toast(text) {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((list) => [...list, { id, text }]);
    window.setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 2600);
  }

  async function sendRequest(label) {
    toast(`已通知司机：${label}`);
    try {
      await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, type: 'image-hotspot', detail: '乘客在图片底图版界面点击' })
      });
    } catch {}
  }

  function tap(h) {
    if (h.target) return setPage(h.target);
    if (PAGES[h.id]) return setPage(h.id);
    if (h.request) return sendRequest(h.request);
  }

  return <main className="image-ui-app" aria-label="RideLux 图片底图版乘客端">
    <img className="image-ui-bg" src={current.image} alt={`${current.title} 页面底图`} draggable="false" />
    <div className="hotspot-layer">
      {hotspots.map((h, i) => <button key={`${page}-${h.id || h.label}-${i}`} className="hotspot" title={h.label} aria-label={h.label} onClick={() => tap(h)} style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }} />)}
    </div>
    <div className="image-ui-page-chip">{current.title}</div>
    <ToastStack toasts={toasts} />
  </main>;
}

function ToastStack({ toasts }) {
  return <div className="image-toast-stack">{toasts.map((t) => <div key={t.id} className="image-toast">{t.text}</div>)}</div>;
}

function DriverConsole() {
  const [state, setState] = useState({ requests: [], route: null });
  const [loading, setLoading] = useState(false);

  async function loadState() {
    try {
      const r = await fetch('/api/state');
      if (r.ok) setState(await r.json());
    } catch {}
  }

  useEffect(() => {
    loadState();
    const timer = window.setInterval(loadState, 2500);
    return () => window.clearInterval(timer);
  }, []);

  async function completeRequest(id) {
    setLoading(true);
    try {
      await fetch(`/api/service-request/${id}/status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'done', driverNote: '司机已完成' }) });
      await loadState();
    } finally { setLoading(false); }
  }

  async function sendDefaultRoute() {
    setLoading(true);
    try {
      await fetch('/api/route/default', { method: 'POST' });
      await loadState();
    } finally { setLoading(false); }
  }

  const pending = (state.requests || []).filter((item) => item.status !== 'done');

  return <main className="driver-console"><section className="driver-panel"><div><p className="driver-kicker">RideLux Driver</p><h1>司机端控制台</h1><p>接收乘客请求、下发行程路线。</p></div><button className="driver-primary" disabled={loading} onClick={sendDefaultRoute}>下发默认路线</button><div className="driver-grid"><div className="driver-card"><h2>待处理请求</h2>{pending.length ? pending.map((request) => <div className="driver-request-row" key={request.id}><div><b>{request.label}</b><small>{new Date(request.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></div><button onClick={() => completeRequest(request.id)}>完成</button></div>) : <p className="driver-empty">暂无待处理请求</p>}</div><div className="driver-card"><h2>当前路线</h2><p className="driver-route">{state.route?.destination?.name || '未下发目的地'}</p><p className="driver-muted">乘客端是图片底图版；服务请求仍通过线上 API 同步。</p></div></div></section></main>;
}

createRoot(document.getElementById('root')).render(<App />);
