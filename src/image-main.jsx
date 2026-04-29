import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './image-ui.css';

const PAGES = {
  home: { title: '首页', icon: '🏠' },
  trip: { title: '行程', icon: '🗺️' },
  service: { title: '服务', icon: '🛎️' },
  ai: { title: 'AI 管家', icon: '✨' },
  entertainment: { title: '娱乐', icon: '🎬' },
  wifi: { title: 'Wi‑Fi', icon: '📶' }
};

const NAV = [
  { id: 'home', label: '首页', icon: '🏠' },
  { id: 'trip', label: '行程', icon: '🗺️' },
  { id: 'service', label: '服务', icon: '🛎️' },
  { id: 'ai', label: 'AI 管家', icon: '✨' },
  { id: 'entertainment', label: '娱乐', icon: '🎬' },
  { id: 'wifi', label: 'Wi‑Fi', icon: '📶' }
];

const QUICK_ACTIONS = [
  { label: '座椅调节', request: '座椅调节', icon: '🪑' },
  { label: '氛围灯', request: '氛围灯', icon: '💡' },
  { label: '遮阳帘', request: '遮阳帘', icon: '🌅' },
  { label: '静音模式', request: '静音模式', icon: '🔇' }
];

const SERVICE_ITEMS = [
  { label: '矿泉水', request: '矿泉水', icon: '💧' },
  { label: '纸巾', request: '纸巾', icon: '🧻' },
  { label: '充电线', request: '充电线', icon: '🔌' },
  { label: '调高空调', request: '调高空调', icon: '🔺' },
  { label: '调低空调', request: '调低空调', icon: '🔻' },
  { label: '需要安静', request: '需要安静', icon: '🤫' }
];

const ENTERTAINMENT_ITEMS = [
  { label: '播放音乐', request: '播放音乐', icon: '🎵', gradient: 'from-purple-500 to-pink-500' },
  { label: '热门资讯', request: '查看热门资讯', icon: '📰', gradient: 'from-blue-500 to-cyan-500' },
  { label: '搞笑段子', request: '查看搞笑段子', icon: '😄', gradient: 'from-orange-500 to-yellow-500' },
  { label: '精选短视频', request: '查看精选短视频', icon: '🎥', gradient: 'from-red-500 to-rose-500' },
  { label: '轻松电台', request: '播放轻松电台', icon: '📻', gradient: 'from-green-500 to-emerald-500' }
];

const AI_SUGGESTIONS = [
  { label: '附近美食', request: '附近美食推荐', icon: '🍜' },
  { label: '景点推荐', request: '景点推荐', icon: '🏞️' },
  { label: '附近商场', request: '附近商场推荐', icon: '🏬' },
  { label: '行程小贴士', request: '行程小贴士', icon: '💡' }
];

function App() {
  const isDriver = location.pathname.startsWith('/driver') || new URLSearchParams(location.search).get('app') === 'driver';
  return isDriver ? <DriverConsole /> : <PassengerImageApp />;
}

function PassengerImageApp() {
  const [page, setPage] = useState('home');
  const [toasts, setToasts] = useState([]);
  const current = PAGES[page] || PAGES.home;

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
        body: JSON.stringify({ label, type: 'modern-ui', detail: '乘客在现代 UI 界面点击' })
      });
    } catch {}
  }

  function tap(item) {
    if (item.target) return setPage(item.target);
    if (PAGES[item.id]) return setPage(item.id);
    if (item.request) return sendRequest(item.request);
  }

  return (
    <main className="modern-app" aria-label="RideLux 后排管家">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-logo">M</span>
          <span className="brand-name">RideLux</span>
        </div>
        <div className="header-status">
          <span className="status-dot"></span>
          <span className="status-text">行程中</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="app-content">
        {page === 'home' && (
          <HomePage onTap={tap} />
        )}
        {page === 'trip' && (
          <TripPage onTap={tap} />
        )}
        {page === 'service' && (
          <ServicePage onTap={tap} />
        )}
        {page === 'ai' && (
          <AIPage onTap={tap} />
        )}
        {page === 'entertainment' && (
          <EntertainmentPage onTap={tap} />
        )}
        {page === 'wifi' && (
          <WiFiPage onTap={tap} />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {NAV.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${page === item.id ? 'active' : ''}`}
            onClick={() => tap(item)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <ToastStack toasts={toasts} />
    </main>
  );
}

function HomePage({ onTap }) {
  return (
    <div className="page home-page">
      <div className="welcome-section">
        <h1 className="welcome-title">欢迎乘坐 RideLux</h1>
        <p className="welcome-subtitle">尊享出行体验，从此刻开始</p>
      </div>

      <div className="quick-actions">
        <h2 className="section-title">快捷服务</h2>
        <div className="action-grid">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              className="action-card"
              onClick={() => onTap(action)}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="info-cards">
        <div className="info-card trip-preview" onClick={() => onTap({ target: 'trip' })}>
          <span className="card-icon">🗺️</span>
          <div className="card-content">
            <h3>查看实时行程</h3>
            <p>了解当前路线与预计到达时间</p>
          </div>
          <span className="card-arrow">›</span>
        </div>
        <div className="info-card service-preview" onClick={() => onTap({ target: 'service' })}>
          <span className="card-icon">🛎️</span>
          <div className="card-content">
            <h3>舒适体验</h3>
            <p>定制您的专属车内环境</p>
          </div>
          <span className="card-arrow">›</span>
        </div>
      </div>

      <div className="promo-row">
        <div className="promo-card ai-promo" onClick={() => onTap({ target: 'ai' })}>
          <span className="promo-icon">✨</span>
          <span className="promo-label">AI 管家</span>
        </div>
        <div className="promo-card entertainment-promo" onClick={() => onTap({ target: 'entertainment' })}>
          <span className="promo-icon">🎬</span>
          <span className="promo-label">娱乐</span>
        </div>
        <div className="promo-card wifi-promo" onClick={() => onTap({ target: 'wifi' })}>
          <span className="promo-icon">📶</span>
          <span className="promo-label">Wi‑Fi</span>
        </div>
      </div>
    </div>
  );
}

function TripPage({ onTap }) {
  return (
    <div className="page trip-page">
      <div className="map-placeholder">
        <div className="map-content">
          <span className="map-icon">🗺️</span>
          <p>实时路况显示区域</p>
        </div>
      </div>
      
      <div className="trip-info">
        <div className="trip-status">
          <span className="status-badge">行驶中</span>
          <span className="eta">预计 15:30 到达</span>
        </div>
        <div className="trip-details">
          <p className="destination">目的地：上海浦东国际机场</p>
          <p className="distance">剩余距离 28.5 km</p>
        </div>
      </div>

      <div className="trip-actions">
        <button className="trip-action-btn" onClick={() => onTap({ request: '路况提示' })}>
          📢 路况提示
        </button>
        <button className="trip-action-btn" onClick={() => onTap({ target: 'service' })}>
          🛎️ 舒适模式
        </button>
        <button className="trip-action-btn" onClick={() => onTap({ request: '平稳驾驶提醒' })}>
          🚗 平稳驾驶
        </button>
      </div>
    </div>
  );
}

function ServicePage({ onTap }) {
  return (
    <div className="page service-page">
      <h2 className="page-title">服务请求</h2>
      <div className="service-grid">
        {SERVICE_ITEMS.map((item) => (
          <button
            key={item.label}
            className="service-card"
            onClick={() => onTap(item)}
          >
            <span className="service-icon">{item.icon}</span>
            <span className="service-label">{item.label}</span>
          </button>
        ))}
      </div>
      <button className="call-service-btn" onClick={() => onTap({ request: '一键呼叫服务' })}>
        📞 一键呼叫服务专员
      </button>
    </div>
  );
}

function AIPage({ onTap }) {
  return (
    <div className="page ai-page">
      <div className="ai-header">
        <span className="ai-avatar">✨</span>
        <h2 className="ai-title">AI 智能管家</h2>
        <p className="ai-subtitle">有什么可以帮您的吗？</p>
      </div>

      <div className="ai-suggestions">
        <h3 className="suggestion-title">推荐查询</h3>
        <div className="suggestion-grid">
          {AI_SUGGESTIONS.map((item) => (
            <button
              key={item.label}
              className="suggestion-chip"
              onClick={() => onTap(item)}
            >
              <span className="chip-icon">{item.icon}</span>
              <span className="chip-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ai-input-area">
        <input type="text" placeholder="输入您的问题..." className="ai-input" />
        <button className="ai-send-btn" onClick={() => onTap({ request: 'AI 管家咨询' })}>
          发送
        </button>
      </div>

      <div className="ai-quick-links">
        <button className="quick-link" onClick={() => onTap({ request: '快速呼叫服务专员' })}>📞 快速呼叫</button>
        <button className="quick-link" onClick={() => onTap({ target: 'trip' })}>🗺️ 路线规划</button>
        <button className="quick-link" onClick={() => onTap({ request: '天气查询' })}>🌤️ 天气查询</button>
        <button className="quick-link" onClick={() => onTap({ request: '翻译助手' })}>🌐 翻译助手</button>
      </div>
    </div>
  );
}

function EntertainmentPage({ onTap }) {
  return (
    <div className="page entertainment-page">
      <h2 className="page-title">娱乐中心</h2>
      <div className="entertainment-grid">
        {ENTERTAINMENT_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`entertainment-card gradient-${item.gradient}`}
            onClick={() => onTap(item)}
          >
            <span className="entertainment-icon">{item.icon}</span>
            <span className="entertainment-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function WiFiPage({ onTap }) {
  return (
    <div className="page wifi-page">
      <div className="wifi-header">
        <span className="wifi-icon">📶</span>
        <h2>车载 Wi-Fi</h2>
      </div>
      
      <div className="wifi-card">
        <div className="wifi-info">
          <p className="wifi-ssid">网络名称：RideLux_Guest</p>
          <p className="wifi-password">密码：88888888</p>
        </div>
        <div className="wifi-actions">
          <button className="wifi-action-btn" onClick={() => onTap({ request: '复制 Wi‑Fi 密码' })}>
            📋 复制密码
          </button>
          <button className="wifi-action-btn" onClick={() => onTap({ request: '重新显示 Wi‑Fi 密码' })}>
            👁️ 重新显示
          </button>
        </div>
        <div className="qr-placeholder">
          <span className="qr-icon">📱</span>
          <p>扫码连接 Wi-Fi</p>
        </div>
      </div>

      <div className="quick-controls">
        <h3 className="controls-title">快速控制</h3>
        <div className="control-row">
          <button className="control-btn" onClick={() => onTap({ target: 'service' })}>🌡️ 空调</button>
          <button className="control-btn" onClick={() => onTap({ request: '座椅调节' })}>🪑 座椅</button>
          <button className="control-btn" onClick={() => onTap({ request: '氛围灯' })}>💡 氛围灯</button>
          <button className="control-btn" onClick={() => onTap({ request: '窗帘控制' })}>🌅 窗帘</button>
          <button className="control-btn" onClick={() => onTap({ request: '隐私模式' })}>🔒 隐私</button>
        </div>
      </div>
    </div>
  );
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
