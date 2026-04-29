import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Home, ClipboardList, ConciergeBell, Bot, Music, Wifi, Settings, Phone,
  ChevronRight, MapPin, Thermometer, Droplets, Wind, Coffee, SmartphoneCharging,
  Headphones, Newspaper, Clock, Navigation, CheckCircle2, VolumeX, Snowflake,
  Sun, MessageSquare, PhoneCall, CloudSun, Languages, Play, Pause,
  SkipBack, SkipForward, Shuffle, ListVideo, Eye, EyeOff, RefreshCw, Maximize,
  QrCode, ShieldCheck, Car, Lightbulb, Grid3X3, Lock, Send, BellRing,
  Copy, Signal, UserRound, Heart, Flame, ThumbsUp, Radio, SlidersHorizontal,
  Search, ExternalLink, Utensils, LocateFixed, Loader2, Film, Check, X,
  Route, Bell, Gauge, Power, Minus, Plus
} from 'lucide-react';
import carMarkerUrl from './assets/car-marker.svg';
import './styles.css';

const START = [114.411265, 38.067183];
const FALLBACK_ROUTE = [
  [114.411265, 38.067183], [114.413521, 38.066422], [114.416817, 38.065164],
  [114.421241, 38.063579], [114.428968, 38.061344], [114.437702, 38.058843],
  [114.446991, 38.056120], [114.456201, 38.052945], [114.463372, 38.049188],
  [114.468120, 38.045812], [114.471381, 38.042531]
];

const navItems = [
  { id: 'home', icon: Home, label: '首页' },
  { id: 'trip', icon: ClipboardList, label: '行程' },
  { id: 'service', icon: ConciergeBell, label: '服务' },
  { id: 'ai', icon: Bot, label: 'AI 管家' },
  { id: 'entertainment', icon: Music, label: '娱乐' },
  { id: 'wifi', icon: Wifi, label: 'Wi-Fi' },
  { id: 'settings', icon: Settings, label: '设置' }
];

const driverRoutePresets = [
  { name: '新百广场', lng: 114.4711636, lat: 38.0425316 },
  { name: '石家庄站', lng: 114.482873, lat: 38.010856 },
  { name: '河北博物院', lng: 114.530081, lat: 38.043214 },
  { name: '万象城', lng: 114.476466, lat: 38.043546 }
];

const screens = {
  home: HomeScreen,
  trip: TripScreen,
  service: ServiceScreen,
  ai: AiScreen,
  entertainment: EntertainmentScreen,
  wifi: WifiScreen,
  settings: SettingsScreen
};

const apiBase = (() => {
  if (window.__RIDELUX_API__) return window.__RIDELUX_API__;
  if (location.protocol === 'file:' || location.port === '5173') return 'http://127.0.0.1:5174';
  return '';
})();

const defaultState = {
  requests: [],
  notifications: [],
  settings: {
    temperature: 24,
    seat: '通风',
    lights: true,
    shade: '全关',
    mute: false,
    privacy: false,
    wifiPassword: 'A88888888'
  },
  route: {
    id: 'local',
    start: { name: '良城逸园', lng: START[0], lat: START[1] },
    destination: { name: '新百广场', lng: 114.471381, lat: 38.042531 },
    coords: FALLBACK_ROUTE,
    distance: estimateDistance(FALLBACK_ROUTE),
    duration: estimateDistance(FALLBACK_ROUTE) / 8.5,
    source: 'fallback',
    instruction: '沿路线行驶'
  }
};

function App() {
  const isDriver = location.pathname.startsWith('/driver') || new URLSearchParams(location.search).get('app') === 'driver';
  return isDriver ? <DriverApp /> : <PassengerApp />;
}

function PassengerApp() {
  const ride = useRideState();
  const [activeTab, setActiveTab] = useState('home');
  const [currentTime, setCurrentTime] = useState('');
  const [seedPrompt, setSeedPrompt] = useState('');
  const [entertainmentTab, setEntertainmentTab] = useState('music');
  const Screen = screens[activeTab] || HomeScreen;

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const actions = {
    go: setActiveTab,
    goAi(prompt) {
      setSeedPrompt(prompt || '');
      setActiveTab('ai');
    },
    goEntertainment(tab = 'music') {
      setEntertainmentTab(tab);
      setActiveTab('entertainment');
    },
    async request(label, type = 'service', detail = '') {
      const item = await ride.call('/api/service-request', {
        method: 'POST',
        body: JSON.stringify({ label, type, detail })
      });
      ride.toast(`已通知司机：${item.label}`);
      return item;
    },
    async setting(patch) {
      const next = await ride.call('/api/settings', {
        method: 'POST',
        body: JSON.stringify(patch)
      });
      ride.toast('设置已同步');
      return next;
    }
  };

  return (
    <div className="app-shell">
      <PassengerSidebar activeTab={activeTab} setActiveTab={setActiveTab} request={actions.request} />
      <main className="main-surface">
        <AmbientBackground />
        <div className="main-scroll custom-scrollbar">
          <Screen
            time={currentTime}
            ride={ride}
            actions={actions}
            seedPrompt={seedPrompt}
            clearSeedPrompt={() => setSeedPrompt('')}
            entertainmentTab={entertainmentTab}
            setEntertainmentTab={setEntertainmentTab}
          />
        </div>
      </main>
      <ToastStack toasts={ride.toasts} dismiss={ride.dismissToast} />
    </div>
  );
}

function PassengerSidebar({ activeTab, setActiveTab, request }) {
  return (
    <aside className="sidebar">
      <div className="flex flex-col items-center gap-2">
        <div className="brand-orb">M</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
          >
            <item.icon size={26} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <button className="call-button" onClick={() => request('一键呼叫服务', 'call', '乘客点击侧栏一键呼叫')}>
        <Phone size={19} />
        <span>一键呼叫</span>
      </button>
    </aside>
  );
}

function HomeScreen({ time, ride, actions }) {
  const route = ride.state.route || defaultState.route;
  const requests = ride.state.requests.filter((item) => item.status !== 'done').slice(0, 2);
  return (
    <ScreenFrame title="尊享旅程" subtitle="欢迎乘坐，祝您旅途愉快" time={time}>
      <section className="hero-banner">
        <div className="hero-image" />
        <div className="hero-line" />
        <div className="relative z-10">
          <h2 className="mb-3 text-4xl font-light">下午好，</h2>
          <h3 className="text-3xl font-medium tracking-wide">愿您享受这段舒适旅程</h3>
          <div className="mt-6 h-1 w-12 rounded-full bg-[#D9B87F] shadow-[0_0_10px_rgba(217,184,127,0.8)]" />
        </div>
        <button className="hero-cta" onClick={() => actions.go('trip')}>
          <Route size={18} />
          查看实时行程
        </button>
      </section>

      <div className="grid min-h-0 flex-1 grid-cols-[.9fr_1.7fr] gap-5">
        <div className="grid min-h-0 grid-rows-[1fr_170px] gap-5">
          <Panel className="p-6">
            <CardTitle icon={MapPin} title="行程概览" action={() => actions.go('trip')} />
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="label">目的地</p>
                <p className="text-2xl font-medium">{route.destination?.name || '目的地'}</p>
                <p className="mt-4 text-sm text-[#8B94A5]">路线来源：{route.source === 'osrm' ? '真实导航路线' : '备用路线'}</p>
              </div>
              <MiniMap coords={route.coords || FALLBACK_ROUTE} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="剩余距离" value={`${((route.distance || 0) / 1000).toFixed(1)} km`} />
              <MiniStat label="预计剩余" value={`${Math.max(1, Math.round((route.duration || 0) / 60))} 分钟`} />
            </div>
          </Panel>

          <Panel className="p-6">
            <CardTitle icon={Bot} title="AI 管家" action={() => actions.go('ai')} />
            <div className="grid h-[90px] grid-cols-2 gap-3">
              <QuickCard icon={MessageSquare} title="智能问答" desc="接入 Gemini" onClick={() => actions.goAi('请根据当前行程给我一些建议')} />
              <QuickCard icon={MapPin} title="景点推荐" desc="结合位置" onClick={() => actions.goAi('推荐当前附近适合顺路去的景点')} />
            </div>
          </Panel>
        </div>

        <div className="grid min-h-0 grid-rows-[270px_170px_96px] gap-5">
          <div className="grid grid-cols-[1.2fr_.9fr] gap-5">
            <Panel className="relative overflow-hidden p-6">
              <SeatArt />
              <CardTitle icon={Wind} title="舒适体验" action={() => actions.go('settings')} />
              <div className="relative z-10 flex h-[190px] flex-col justify-between">
                <div>
                  <p className="label">车内温度</p>
                  <p className="text-5xl font-light">{ride.state.settings.temperature}<span className="ml-1 text-2xl">°C</span></p>
                  <p className="mt-2 text-sm text-[#D9B87F]">{ride.state.settings.mute ? '静音模式已开启' : '舒适宜人'}</p>
                </div>
                <div className="comfort-grid">
                  <Metric icon={Wind} color="text-green-400" label="车内空气" value="优" />
                  <Metric icon={Droplets} color="text-blue-400" label="湿度" value="45%" />
                  <Metric icon={Gauge} color="text-[#D9B87F]" label="平稳度" value="92" />
                </div>
              </div>
            </Panel>

            <Panel className="p-6">
              <CardTitle title="便捷服务" action={() => actions.go('service')} />
              <div className="grid h-[190px] grid-cols-3 gap-3">
                <ServiceTile icon={Coffee} title="矿泉水" desc="通知司机" onClick={() => actions.request('矿泉水', 'service')} />
                <ServiceTile icon={Wind} title="纸巾" desc="通知司机" onClick={() => actions.request('纸巾', 'service')} />
                <ServiceTile icon={SmartphoneCharging} title="充电线" desc="通知司机" onClick={() => actions.request('充电线', 'service')} />
              </div>
            </Panel>
          </div>

          <div className="grid grid-cols-[1.2fr_.9fr] gap-5">
            <Panel className="p-6">
              <CardTitle icon={Music} title="娱乐" action={() => actions.goEntertainment('music')} />
              <div className="grid h-[90px] grid-cols-4 gap-3">
                <IconTile icon={Music} label="音乐" onClick={() => actions.goEntertainment('music')} />
                <IconTile icon={Newspaper} label="资讯" onClick={() => actions.goEntertainment('news')} />
                <IconTile icon={MessageSquare} label="段子" onClick={() => actions.goEntertainment('jokes')} />
                <IconTile icon={Film} label="视频" onClick={() => actions.goEntertainment('video')} />
              </div>
            </Panel>
            <Panel className="relative overflow-hidden p-6">
              <CardTitle icon={Wifi} title="Wi-Fi" action={() => actions.go('wifi')} />
              <div className="flex items-end justify-between">
                <div>
                  <p className="mb-2 text-xl font-medium">RideLux_8888</p>
                  <p className="flex items-center text-sm text-[#8B94A5]"><span className="mr-2 h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />已连接</p>
                </div>
                <button className="gold-outline" onClick={() => actions.go('wifi')}>查看</button>
              </div>
            </Panel>
          </div>

          <BottomControlBar settings={ride.state.settings} actions={actions} requests={requests} />
        </div>
      </div>
    </ScreenFrame>
  );
}

function TripScreen({ time, ride }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const carMarkerRef = useRef(null);
  const animationRef = useRef(null);
  const [mapStatus, setMapStatus] = useState('地图加载中...');
  const [live, setLive] = useState({ progress: 0, distanceLeft: '--', eta: '--', speed: '0', arrival: '--:--' });
  const route = ride.state.route || defaultState.route;

  useEffect(() => {
    let disposed = false;
    loadMapLibre().then(() => {
      if (disposed || !mapContainer.current || mapRef.current) return;
      const map = new window.maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/dark',
        center: [114.443, 38.055],
        zoom: 13.2,
        pitch: 62,
        bearing: -18,
        attributionControl: false
      });
      mapRef.current = map;
      map.addControl(new window.maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
      map.on('load', () => {
        if (!disposed) {
          map.resize();
          setMapStatus('3D 地图已加载');
          renderRoute(map, route, setLive);
          requestAnimationFrame(() => map.resize());
        }
      });
    }).catch(() => setMapStatus('地图加载失败'));
    return () => {
      disposed = true;
      cancelAnimationFrame(animationRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        carMarkerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current?.isStyleLoaded()) renderRoute(mapRef.current, route, setLive, carMarkerRef, animationRef);
  }, [route?.id]);

  function renderRoute(map, currentRoute, setLiveState, markerRef = carMarkerRef, rafRef = animationRef) {
    const coords = currentRoute.coords?.length ? currentRoute.coords : FALLBACK_ROUTE;
    drawMapRoute(map, coords);
    fitMapRoute(map, coords);

    if (!markerRef.current) {
      const shell = document.createElement('div');
      shell.className = 'car-marker-shell';
      const img = document.createElement('img');
      img.src = carMarkerUrl;
      img.alt = 'RideLux vehicle';
      img.className = 'car-marker-img';
      shell.appendChild(img);
      markerRef.current = new window.maplibregl.Marker({ element: shell, rotationAlignment: 'map', pitchAlignment: 'map' }).setLngLat(coords[0]).addTo(map);
    }

    startSmoothRouteAnimation(map, markerRef.current, coords, currentRoute, setLiveState, rafRef);
    setMapStatus(currentRoute.source === 'osrm' ? '真实路线已加载' : '备用路线已加载');
  }

  return (
    <ScreenFrame title="行程" subtitle="实时掌握路线、时间与到达进度" time={time}>
      <div className="map-panel">
        <div ref={mapContainer} className="absolute inset-0" />
        <div className="map-vignette" />
        <div className="next-card">
          <Navigation size={48} className="rotate-45 text-[#D9B87F]" />
          <div className="min-w-0">
            <p className="truncate text-3xl font-medium">{route.instruction || '沿路线行驶'}</p>
            <p className="mt-1 text-[#8B94A5]">司机下发路线 | 前往{route.destination?.name}</p>
            <div className="mt-4 flex gap-2"><span className="h-1.5 w-8 rounded-full bg-[#D9B87F] shadow-[0_0_8px_#D9B87F]" /><span className="h-1.5 w-3 rounded-full bg-[#2A3448]" /><span className="h-1.5 w-3 rounded-full bg-[#2A3448]" /></div>
          </div>
        </div>
        <div className="map-status">{mapStatus}</div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Clock} label="预计剩余" value={live.eta} unit="分钟" />
        <StatCard icon={Navigation} label="剩余距离" value={live.distanceLeft} unit="公里" />
        <StatCard icon={CheckCircle2} label="预计到达" value={live.arrival} />
        <StatCard icon={Thermometer} label="当前时速" value={live.speed} unit="km/h" />
      </div>

      <Panel className="p-7">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-6 right-6 top-3 h-px bg-[#2A3448]" />
          <div className="absolute left-6 top-3 h-px bg-[#D9B87F] shadow-[0_0_10px_#D9B87F]" style={{ width: `${Math.min(82, 20 + live.progress * 62)}%` }} />
          {['北京金融街购物中心', '金融街南街', '复兴门内大街', '建国门桥', route.destination?.name || '目的地'].map((desc, i) => {
            const active = live.progress > i / 4 - 0.08;
            const current = Math.abs(live.progress - i / 4) < 0.13;
            return (
              <div key={`${desc}-${i}`} className="relative flex w-[20%] flex-col items-center text-center">
                <div className={`timeline-dot ${current ? 'current' : active ? 'passed' : ''}`}>{active && !current ? <CheckCircle2 size={14} /> : null}</div>
                <p className={`max-w-[150px] truncate text-sm ${active ? 'text-white' : 'text-[#8B94A5]'}`}>{desc}</p>
                <p className="mt-1 text-[11px] text-[#8B94A5]">{i === 4 ? `${live.arrival} 预计到达` : `14:${12 + i * 6}`}</p>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid flex-1 grid-cols-3 gap-4">
        <BottomInfo icon={Car} title="路况提示" desc={route.source === 'osrm' ? '真实路线已同步' : '正在使用备用路线'} />
        <BottomInfo icon={Wind} title="舒适模式" desc={`空调 ${ride.state.settings.temperature}°C | 座椅${ride.state.settings.seat}`} />
        <BottomInfo icon={Droplets} title="平稳驾驶提醒" desc="本次行程平稳度 92 分" />
      </div>
    </ScreenFrame>
  );
}

function ServiceScreen({ time, ride, actions }) {
  const settings = ride.state.settings;
  const services = [
    { label: '矿泉水', icon: Coffee, run: () => actions.request('矿泉水', 'service') },
    { label: '纸巾', icon: Wind, run: () => actions.request('纸巾', 'service') },
    { label: '充电线', icon: SmartphoneCharging, run: () => actions.request('充电线', 'service') },
    { label: '调高空调', icon: Plus, run: () => actions.setting({ temperature: Math.min(30, settings.temperature + 1) }).then(() => actions.request('调高空调', 'comfort')) },
    { label: '调低空调', icon: Minus, run: () => actions.setting({ temperature: Math.max(16, settings.temperature - 1) }).then(() => actions.request('调低空调', 'comfort')) },
    { label: '需要安静', icon: VolumeX, run: () => actions.setting({ mute: true }).then(() => actions.request('需要安静', 'comfort')) }
  ];
  return (
    <ScreenFrame title="服务" subtitle="无需开口，轻点即可通知司机" time={time}>
      <div className="grid grid-cols-3 gap-5">
        {services.map((service) => (
          <button key={service.label} className="large-action-card" onClick={service.run}>
            <service.icon size={44} className="text-[#D9B87F]" strokeWidth={1.7} />
            <p className="mt-4 text-lg font-medium">{service.label}</p>
            <span className="mt-4 h-px w-8 rounded-full bg-[#D9B87F]/35" />
          </button>
        ))}
      </div>

      <Panel className="gold-band p-4">
        <div className="flex items-center">
          <span className="mr-4 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#D9B87F]"><Bell size={17} /></span>
          <span className="font-medium text-[#D9B87F]">司机端实时接收请求；完成状态会同步回乘客端</span>
        </div>
      </Panel>

      <div className="min-h-0 flex-1">
        <p className="mb-3 px-2 text-sm text-[#8B94A5]">请求记录</p>
        <div className="custom-scrollbar max-h-[260px] space-y-3 overflow-auto pr-2">
          {ride.state.requests.length ? ride.state.requests.map((req) => <RequestRow key={req.id} req={req} />) : <EmptyLine text="还没有服务请求" />}
        </div>
      </div>

      <button className="primary-bar-button" onClick={() => actions.request('一键呼叫服务', 'call')}>
        <BellRing className="mr-3" />
        一键呼叫服务
      </button>
    </ScreenFrame>
  );
}

function AiScreen({ time, ride, actions, seedPrompt, clearSeedPrompt }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '您好，我是您的 AI 向导管家。Gemini key 配好后，我会根据行程、位置和服务状态实时回答。' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seedPrompt) {
      setInput(seedPrompt);
      clearSeedPrompt();
    }
  }, [seedPrompt, clearSeedPrompt]);

  async function ask(message = input) {
    const text = message.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const data = await ride.call('/api/ai', {
        method: 'POST',
        body: JSON.stringify({
          message: text,
          context: JSON.stringify({ route: ride.state.route, settings: ride.state.settings })
        })
      });
      setMessages((prev) => [...prev, { role: 'assistant', text: data.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: `Gemini 暂不可用：${error.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenFrame title="AI 管家" subtitle="陪伴、推荐、解答，一路更懂您" time={time}>
      <div className="grid min-h-0 flex-1 grid-cols-[1.2fr_.8fr] gap-5">
        <Panel className="flex min-h-0 flex-col overflow-hidden p-6">
          <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto pr-3">
            {messages.map((msg, index) => <ChatBubble key={`${msg.role}-${index}`} role={msg.role} text={msg.text} />)}
            {loading && <ChatBubble role="assistant" text="正在调用 Gemini..." loading />}
          </div>
          <div className="mt-4 border-t border-[#222B3B] pt-4">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {['附近美食推荐', '帮我规划到达后的路线', '当前天气如何', '翻译：请帮我拿一瓶水'].map((tag) => (
                <button key={tag} className="chip" onClick={() => ask(tag)}>{tag}</button>
              ))}
            </div>
            <div className="relative">
              <input
                className="input pr-14"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && ask()}
                placeholder="请输入您的问题..."
              />
              <button className="icon-send" onClick={() => ask()}><Send size={20} /></button>
            </div>
          </div>
        </Panel>

        <RestaurantPanel ride={ride} actions={actions} />
      </div>

      <Panel className="grid h-[88px] grid-cols-4 items-center rounded-[2rem] px-8">
        <ToolButton icon={PhoneCall} title="快速呼叫" desc="联系服务专员" onClick={() => actions.request('AI 快速呼叫', 'call')} />
        <ToolButton icon={Navigation} title="路线规划" desc="查看导航" onClick={() => actions.go('trip')} />
        <ToolButton icon={CloudSun} title="天气查询" desc="GPS 实况天气" onClick={() => actions.goAi('查询当前位置天气，并给我出行建议')} />
        <ToolButton icon={Languages} title="翻译助手" desc="Gemini 翻译" onClick={() => actions.goAi('请把这句话翻译成英文：请稍微调低空调')} />
      </Panel>
    </ScreenFrame>
  );
}

function RestaurantPanel({ ride }) {
  const [restaurants, setRestaurants] = useState([]);
  const [status, setStatus] = useState('点击定位获取附近餐厅');
  const [loading, setLoading] = useState(false);

  async function loadByPosition(position) {
    setLoading(true);
    try {
      const data = await ride.call(`/api/restaurants?lat=${position.lat}&lng=${position.lng}`);
      setRestaurants(data.restaurants || []);
      setStatus(`${data.restaurants?.length || 0} 家真实 GPS 附近餐厅`);
    } catch (error) {
      setStatus(`餐厅 API 失败：${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function locate() {
    if (!navigator.geolocation) {
      setStatus('当前浏览器不支持 GPS 定位');
      return;
    }
    setStatus('正在请求 GPS 权限...');
    navigator.geolocation.getCurrentPosition(
      (pos) => loadByPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setStatus(`GPS 定位失败：${err.message}`),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  }

  const destination = ride.state.route.destination;
  return (
    <Panel className="flex min-h-0 flex-col p-6">
      <div className="mb-5 flex items-center justify-between">
        <span className="flex items-center font-medium"><Utensils size={18} className="mr-2 text-[#D9B87F]" />附近餐厅</span>
        <button className="small-gold-button" onClick={locate}>{loading ? <Loader2 className="animate-spin" size={14} /> : <LocateFixed size={14} />} GPS</button>
      </div>
      <p className="mb-3 text-xs text-[#8B94A5]">{status}</p>
      <button className="mb-4 rounded-xl border border-[#2A3448] px-3 py-2 text-left text-xs text-[#8B94A5] transition-colors hover:border-[#D9B87F]/50 hover:text-[#D9B87F]" onClick={() => loadByPosition({ lat: destination.lat, lng: destination.lng })}>
        使用当前目的地附近：{destination.name}
      </button>
      <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
        {restaurants.length ? restaurants.slice(0, 12).map((item) => <RestaurantCard key={item.id} item={item} />) : <EmptyLine text="等待 GPS 或目的地查询" />}
      </div>
    </Panel>
  );
}

function EntertainmentScreen({ time, ride, entertainmentTab, setEntertainmentTab }) {
  return (
    <ScreenFrame title="娱乐" subtitle="音乐、资讯、段子、视频都连接真实媒体或 API" time={time}>
      <div className="mb-5 flex gap-4">
        {[
          ['music', Music, '音乐'],
          ['news', Newspaper, '资讯'],
          ['jokes', MessageSquare, '段子'],
          ['video', Film, '视频']
        ].map(([id, Icon, label]) => (
          <button key={id} className={`media-tab ${entertainmentTab === id ? 'active' : ''}`} onClick={() => setEntertainmentTab(id)}>
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>
      {entertainmentTab === 'music' && <MusicPlayer ride={ride} />}
      {entertainmentTab === 'news' && <NewsPanel ride={ride} />}
      {entertainmentTab === 'jokes' && <JokePanel ride={ride} />}
      {entertainmentTab === 'video' && <VideoPanel ride={ride} />}
    </ScreenFrame>
  );
}

function MusicPlayer({ ride }) {
  const audioRef = useRef(null);
  const [query, setQuery] = useState('lofi jazz');
  const [tracks, setTracks] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = tracks[index];

  async function searchMusic(term = query) {
    const data = await ride.call(`/api/music?term=${encodeURIComponent(term)}`);
    setTracks(data.tracks || []);
    setIndex(0);
    setPlaying(false);
  }

  useEffect(() => { searchMusic('lofi jazz').catch(() => {}); }, []);
  useEffect(() => {
    if (!audioRef.current || !current) return;
    audioRef.current.src = current.previewUrl;
    if (playing) audioRef.current.play().catch(() => setPlaying(false));
  }, [current]);

  function toggle() {
    if (!current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  }

  function next() {
    setIndex((value) => tracks.length ? (value + 1) % tracks.length : 0);
    setPlaying(true);
  }

  return (
    <div className="grid min-h-0 flex-1 grid-cols-[1fr_.9fr] gap-5">
      <Panel className="flex min-h-0 flex-col p-6">
        <div className="mb-5 flex gap-3">
          <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && searchMusic()} />
          <button className="square-button" onClick={() => searchMusic()}><Search size={18} /></button>
        </div>
        <div className="player-hero">
          <img src={current?.artworkUrl100?.replace('100x100', '600x600') || 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1000&auto=format&fit=crop'} alt="" />
          <div className="min-w-0">
            <h3 className="truncate text-3xl font-medium">{current?.trackName || '选择一首音乐'}</h3>
            <p className="mt-2 text-lg text-[#8B94A5]">{current?.artistName || 'iTunes Preview API'}</p>
            <audio ref={audioRef} onEnded={next} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} controls className="mt-5 w-full" />
            <div className="mt-6 flex items-center gap-7">
              <button className="ghost-icon" onClick={() => setIndex(Math.floor(Math.random() * Math.max(1, tracks.length)))}><Shuffle size={20} /></button>
              <button className="ghost-icon" onClick={() => setIndex((index - 1 + tracks.length) % tracks.length)}><SkipBack size={28} /></button>
              <button className="play-button" onClick={toggle}>{playing ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} />}</button>
              <button className="ghost-icon" onClick={next}><SkipForward size={28} /></button>
              <Heart className="text-[#8B94A5]" />
            </div>
          </div>
        </div>
      </Panel>
      <Panel className="custom-scrollbar min-h-0 overflow-auto p-4">
        {tracks.map((track, i) => (
          <button key={track.trackId} className={`track-row ${i === index ? 'active' : ''}`} onClick={() => { setIndex(i); setPlaying(true); }}>
            <img src={track.artworkUrl100} alt="" />
            <span className="min-w-0 text-left"><b className="truncate">{track.trackName}</b><small className="truncate">{track.artistName}</small></span>
          </button>
        ))}
      </Panel>
    </div>
  );
}

function NewsPanel({ ride }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    ride.call('/api/news').then((data) => setArticles(data.articles || [])).finally(() => setLoading(false));
  }, []);
  return (
    <Panel className="custom-scrollbar min-h-0 flex-1 overflow-auto p-6">
      {loading && <LoadingLine text="正在加载 GDELT 新闻 API..." />}
      <div className="grid grid-cols-2 gap-4">
        {articles.map((article) => (
          <a key={article.url} className="news-card" href={article.url} target="_blank" rel="noreferrer">
            {article.socialimage && <img src={article.socialimage} alt="" />}
            <span><b>{article.title}</b><small>{article.sourcecountry || 'News'} · {article.domain}</small></span>
            <ExternalLink size={16} />
          </a>
        ))}
      </div>
    </Panel>
  );
}

function JokePanel({ ride }) {
  const [jokes, setJokes] = useState([]);
  useEffect(() => { ride.call('/api/jokes').then((data) => setJokes(data.jokes || [])); }, []);
  function speak(text) {
    if ('speechSynthesis' in window) speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }
  return (
    <Panel className="custom-scrollbar min-h-0 flex-1 overflow-auto p-6">
      <div className="grid grid-cols-2 gap-4">
        {jokes.map((joke) => (
          <div className="joke-card" key={joke.id}>
            <p>{joke.setup}</p>
            <b>{joke.punchline}</b>
            <button className="small-gold-button self-end" onClick={() => speak(`${joke.setup}. ${joke.punchline}`)}><Play size={14} />朗读</button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function VideoPanel({ ride }) {
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  useEffect(() => { ride.call('/api/videos').then((data) => setVideos(data.videos || [])); }, []);
  const current = videos[index];
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[1.3fr_.7fr] gap-5">
      <Panel className="overflow-hidden p-5">
        {current ? <video className="h-full w-full rounded-2xl bg-black object-contain" src={current.url} poster={current.poster} controls autoPlay /> : <LoadingLine text="正在加载公开视频源..." />}
      </Panel>
      <Panel className="custom-scrollbar min-h-0 overflow-auto p-4">
        {videos.map((video, i) => (
          <button className={`video-row ${i === index ? 'active' : ''}`} key={video.url} onClick={() => setIndex(i)}>
            <img src={video.poster} alt="" />
            <span><b>{video.title}</b><small>{video.description}</small></span>
          </button>
        ))}
      </Panel>
    </div>
  );
}

function WifiScreen({ time, ride, actions }) {
  const [showPwd, setShowPwd] = useState(false);
  const password = ride.state.settings.wifiPassword;
  const qrData = encodeURIComponent(`WIFI:T:WPA;S:RideLux_8888;P:${password};;`);

  async function copyPassword() {
    await navigator.clipboard.writeText(password);
    ride.toast('Wi-Fi 密码已复制');
  }

  function refreshPassword() {
    const next = `A${Math.floor(10000000 + Math.random() * 89999999)}`;
    actions.setting({ wifiPassword: next });
  }

  return (
    <ScreenFrame title="Wi-Fi" subtitle="高速网络，畅快连接" time={time}>
      <section className="wifi-hero">
        <div className="wifi-waves" />
        <div className="relative z-10">
          <Wifi size={32} className="mb-4 text-[#D9B87F]" />
          <h2 className="mb-3 text-4xl font-medium">RideLux_8888</h2>
          <span className="status-pill"><span className="green-dot" />已连接</span>
        </div>
        <div className="self-end rounded-full border border-[#D9B87F]/30 bg-[#D9B87F]/10 px-4 py-2 text-[#D9B87F]"><ShieldCheck size={18} className="mr-2 inline" />安全保护中</div>
      </section>
      <div className="grid h-[220px] grid-cols-[1fr_.9fr_1fr] gap-5">
        <Panel className="flex flex-col justify-between p-6">
          <div className="flex items-center"><Lock size={18} className="mr-2 text-[#8B94A5]" />网络密码</div>
          <div className="flex items-center justify-between rounded-2xl border border-[#2A3448] bg-[#1A2232] p-4"><span className="font-mono text-2xl tracking-widest">{showPwd ? password : '••••••••'}</span><button onClick={() => setShowPwd(!showPwd)}>{showPwd ? <EyeOff /> : <Eye />}</button></div>
          <div className="grid grid-cols-2 gap-3"><WifiButton icon={Copy} onClick={copyPassword}>复制密码</WifiButton><WifiButton icon={RefreshCw} onClick={refreshPassword}>刷新密码</WifiButton></div>
        </Panel>
        <Panel className="flex flex-col items-center justify-center p-6">
          <div className="mb-4 flex w-full items-center justify-center"><Maximize size={18} className="mr-auto text-[#8B94A5]" />扫码连接<span className="ml-auto w-[18px]" /></div>
          <img className="mb-3 h-32 w-32 rounded-xl bg-white p-2" alt="Wi-Fi QR code" src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrData}`} />
          <p className="text-[11px] text-[#8B94A5]">二维码随密码实时更新</p>
        </Panel>
        <Panel className="p-6">
          <div className="mb-5 flex items-center"><Signal className="mr-2 h-5 w-5 text-[#8B94A5]" />连接状态</div>
          {[
            ['当前状态', '已连接'],
            ['网络强度', '强'],
            ['安全性', 'WPA2'],
            ['已连接设备', '3 台']
          ].map(([key, value], i) => <InfoLine key={key} label={key} value={value} last={i === 3} />)}
        </Panel>
      </div>
      <Panel className="grid grid-cols-3 gap-4 p-5">
        {['打开手机 Wi-Fi', '选择 RideLux_8888', '输入密码或扫码连接'].map((title, i) => <Step key={title} num={i + 1} title={title} />)}
      </Panel>
      <ControlPanel settings={ride.state.settings} actions={actions} />
    </ScreenFrame>
  );
}

function SettingsScreen({ time, ride, actions }) {
  const settings = ride.state.settings;
  const tiles = [
    { icon: Thermometer, title: '空调温度', desc: `${settings.temperature}°C`, action: () => actions.setting({ temperature: settings.temperature >= 26 ? 22 : settings.temperature + 1 }) },
    { icon: Car, title: '座椅调节', desc: settings.seat, action: () => actions.setting({ seat: settings.seat === '通风' ? '加热' : settings.seat === '加热' ? '按摩' : '通风' }) },
    { icon: Sun, title: '氛围灯', desc: settings.lights ? '柔和模式' : '关闭', action: () => actions.setting({ lights: !settings.lights }) },
    { icon: Grid3X3, title: '窗帘控制', desc: settings.shade, action: () => actions.setting({ shade: settings.shade === '全关' ? '半开' : settings.shade === '半开' ? '全开' : '全关' }) },
    { icon: VolumeX, title: '静音模式', desc: settings.mute ? '开启' : '关闭', action: () => actions.setting({ mute: !settings.mute }) },
    { icon: ShieldCheck, title: '隐私模式', desc: settings.privacy ? '开启' : '关闭', action: () => actions.setting({ privacy: !settings.privacy }) }
  ];
  return (
    <ScreenFrame title="设置" subtitle="调整车内体验、隐私与偏好" time={time}>
      <div className="grid flex-1 grid-cols-3 gap-5">
        {tiles.map((item) => (
          <button key={item.title} className="settings-tile" onClick={item.action}>
            <item.icon size={36} className="text-[#D9B87F]" />
            <span><b>{item.title}</b><small>{item.desc}</small></span>
            <ChevronRight className="ml-auto text-[#8B94A5]" />
          </button>
        ))}
      </div>
      <Panel className="p-5">
        <p className="mb-3 text-[#8B94A5]">系统同步</p>
        <div className="grid grid-cols-4 gap-3 text-sm">
          <InfoBadge label="乘客端" value="在线" />
          <InfoBadge label="司机端" value="SSE 实时" />
          <InfoBadge label="AI" value={apiBase ? '后端代理' : '静态不可用'} />
          <InfoBadge label="路线" value={ride.state.route.source === 'osrm' ? '真实路线' : '备用路线'} />
        </div>
      </Panel>
    </ScreenFrame>
  );
}

function DriverApp() {
  const ride = useRideState();
  const [query, setQuery] = useState('新百广场');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);

  async function searchDestination() {
    setBusy(true);
    try {
      const data = await ride.call(`/api/geocode?q=${encodeURIComponent(query)}`);
      setResults(data.results || []);
    } finally {
      setBusy(false);
    }
  }

  async function sendRoute(destination = selected || results[0]) {
    if (!destination) return;
    setBusy(true);
    try {
      await ride.call('/api/route', {
        method: 'POST',
        body: JSON.stringify({ destination })
      });
      ride.toast(`路线已发送给乘客端：${destination.name}`);
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(id, status) {
    await ride.call(`/api/service-request/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status })
    });
    ride.toast(`请求状态已更新：${status}`);
  }

  return (
    <div className="app-shell driver-shell">
      <aside className="sidebar">
        <div className="brand-orb">D</div>
        <div className="driver-nav-title">司机端</div>
        <a className="driver-link" href="/">乘客端</a>
      </aside>
      <main className="main-surface">
        <AmbientBackground />
        <div className="main-scroll custom-scrollbar">
          <ScreenFrame title="司机工作台" subtitle="接收乘客请求，并向乘客端实时下发导航路线" time={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}>
            <div className="grid min-h-0 flex-1 grid-cols-[1fr_1fr] gap-5">
              <Panel className="flex min-h-0 flex-col p-6">
                <CardTitle icon={Route} title="路线下发" />
                <div className="mb-4 flex gap-3">
                  <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && searchDestination()} />
                  <button className="square-button" aria-label="搜索目的地" onClick={searchDestination}>{busy ? <Loader2 className="animate-spin" /> : <Search />}</button>
                </div>
                <div className="mb-4 grid grid-cols-4 gap-2">
                  {driverRoutePresets.map((preset) => (
                    <button key={preset.name} className="preset-route" onClick={() => sendRoute(preset)}>{preset.name}</button>
                  ))}
                </div>
                <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-auto pr-2">
                  {results.map((item) => (
                    <button key={`${item.lat}-${item.lng}`} className={`driver-result ${selected === item ? 'active' : ''}`} onClick={() => setSelected(item)}>
                      <MapPin size={18} />
                      <span>{item.name}</span>
                    </button>
                  ))}
                  {!results.length && <EmptyLine text="搜索目的地后选择路线" />}
                </div>
                <button className="primary-bar-button mt-5" onClick={() => sendRoute()} disabled={busy || (!selected && !results.length)}>
                  <Navigation className="mr-3" />
                  发送导航路线给乘客端
                </button>
              </Panel>

              <Panel className="flex min-h-0 flex-col p-6">
                <CardTitle icon={Bell} title="乘客请求" />
                <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-auto pr-2">
                  {ride.state.requests.length ? ride.state.requests.map((req) => (
                    <div key={req.id} className="driver-request">
                      <div>
                        <p className="font-medium">{req.label}</p>
                        <p className="text-xs text-[#8B94A5]">{new Date(req.createdAt).toLocaleTimeString()} · {req.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="small-gold-button" onClick={() => setStatus(req.id, 'accepted')}><Check size={14} />接单</button>
                        <button className="small-gold-button" onClick={() => setStatus(req.id, 'done')}><CheckCircle2 size={14} />完成</button>
                      </div>
                    </div>
                  )) : <EmptyLine text="暂无乘客请求" />}
                </div>
              </Panel>
            </div>

            <Panel className="grid grid-cols-4 gap-3 p-5">
              <InfoBadge label="乘客端请求" value={`${ride.state.requests.length} 条`} />
              <InfoBadge label="当前路线" value={ride.state.route.destination?.name || '未设置'} />
              <InfoBadge label="路线来源" value={ride.state.route.source === 'osrm' ? 'OSRM' : '备用'} />
              <InfoBadge label="同步方式" value="SSE" />
            </Panel>
          </ScreenFrame>
        </div>
      </main>
      <ToastStack toasts={ride.toasts} dismiss={ride.dismissToast} />
    </div>
  );
}

function ScreenFrame({ title, subtitle, time, children }) {
  return (
    <div className="screen-frame">
      <TopBar title={title} subtitle={subtitle} time={time} />
      {children}
    </div>
  );
}

function TopBar({ title, subtitle, time }) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div className="min-w-0">
        <h1 className="mb-2 truncate text-[32px] font-medium tracking-wide text-[#D9B87F]">{title}</h1>
        <p className="text-sm text-[#8B94A5]">{subtitle}</p>
      </div>
      <div className="flex shrink-0 space-x-3 text-sm text-[#8B94A5]">
        <Pill icon={Thermometer}>24°C</Pill>
        <Pill icon={Clock}>{time || '14:30'}</Pill>
        <Pill icon={Wifi} />
      </div>
    </div>
  );
}

function Pill({ icon: Icon, children }) {
  return <div className="top-pill"><Icon size={16} className={children ? 'mr-2' : ''} />{children && <span>{children}</span>}</div>;
}

function Panel({ children, className = '' }) {
  return <div className={`panel ${className}`}>{children}</div>;
}

function CardTitle({ icon: Icon, title, action }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex min-w-0 items-center text-[#8B94A5]">{Icon && <Icon size={18} className="mr-2 text-[#D9B87F]" />}<span className="truncate">{title}</span></div>
      {action && <button onClick={action} className="rounded-full p-1 text-[#8B94A5] transition-colors hover:text-[#D9B87F]"><ChevronRight size={18} /></button>}
    </div>
  );
}

function BottomControlBar({ settings, actions, requests }) {
  return (
    <Panel className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center gap-3 rounded-[2rem] px-5 py-3">
      <Control icon={Car} label="座椅调节" active={settings.seat} onClick={() => actions.setting({ seat: settings.seat === '通风' ? '加热' : settings.seat === '加热' ? '按摩' : '通风' })} />
      <Control icon={Sun} label="氛围灯" active={settings.lights ? '开启' : '关闭'} onClick={() => actions.setting({ lights: !settings.lights })} />
      <button className="trip-center-button" onClick={() => actions.go('trip')}><Car size={30} /><span>行程中</span></button>
      <Control icon={Grid3X3} label="遮阳帘" active={settings.shade} onClick={() => actions.setting({ shade: settings.shade === '全关' ? '半开' : settings.shade === '半开' ? '全开' : '全关' })} />
      <Control icon={VolumeX} label="静音模式" active={settings.mute ? '开启' : '关闭'} onClick={() => actions.setting({ mute: !settings.mute })} />
      {requests?.length ? <span className="request-badge">{requests.length}</span> : null}
    </Panel>
  );
}

function Control({ icon: Icon, label, active, onClick }) {
  return <button className="control-button" onClick={onClick}><Icon size={22} /><span>{label}</span><small>{active}</small></button>;
}

function ControlPanel({ settings, actions }) {
  return (
    <Panel className="flex flex-1 flex-col justify-center p-6">
      <div className="mb-5 flex items-center justify-between px-2"><span className="text-[#8B94A5]">系统与舒适控制</span><ChevronRight size={18} className="text-[#8B94A5]" /></div>
      <div className="grid grid-cols-5 gap-4">
        <ToolButton icon={Thermometer} title="空调温度" desc={`${settings.temperature}°C`} onClick={() => actions.setting({ temperature: settings.temperature >= 27 ? 22 : settings.temperature + 1 })} />
        <ToolButton icon={Car} title="座椅调节" desc={settings.seat} onClick={() => actions.setting({ seat: settings.seat === '通风' ? '加热' : '按摩' })} />
        <ToolButton icon={Sun} title="氛围灯" desc={settings.lights ? '柔和模式' : '关闭'} onClick={() => actions.setting({ lights: !settings.lights })} />
        <ToolButton icon={Grid3X3} title="窗帘控制" desc={settings.shade} onClick={() => actions.setting({ shade: settings.shade === '全关' ? '全开' : '全关' })} />
        <ToolButton icon={ShieldCheck} title="隐私模式" desc={settings.privacy ? '开启' : '关闭'} onClick={() => actions.setting({ privacy: !settings.privacy })} />
      </div>
    </Panel>
  );
}

function QuickCard({ icon: Icon, title, desc, onClick }) {
  return <button className="quick-card" onClick={onClick}><span><Icon size={18} /></span><b>{title}</b><small>{desc}</small></button>;
}

function ServiceTile({ icon: Icon, title, desc, onClick }) {
  return <button className="service-tile" onClick={onClick}><Icon size={24} /><b>{title}</b><small>{desc}</small></button>;
}

function IconTile({ icon: Icon, label, onClick }) {
  return <button className="icon-tile" onClick={onClick}><Icon size={20} /><span>{label}</span></button>;
}

function MiniMap({ coords }) {
  const points = (coords || FALLBACK_ROUTE).map(([lng, lat]) => `${(lng - 114.39) * 1200},${(38.08 - lat) * 1300}`).join(' ');
  return (
    <div className="relative h-24 w-32 overflow-hidden rounded-xl border border-[#222B3B] bg-[#0A0E17]">
      <svg width="100%" height="100%" viewBox="0 0 120 80" preserveAspectRatio="none">
        <polyline points={points} stroke="#D9B87F" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="25" cy="60" r="4" fill="#54d6b0" />
        <circle cx="98" cy="20" r="4" fill="#D9B87F" />
      </svg>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
    </div>
  );
}

function SeatArt() {
  return (
    <div className="absolute bottom-0 right-0 h-48 w-48 opacity-35">
      <svg viewBox="0 0 100 100" fill="none" stroke="#D9B87F" strokeWidth="1" className="h-full w-full">
        <path d="M30,80 Q40,40 35,20 Q50,10 65,20 Q60,40 70,80 Z" fill="#1A253A" strokeWidth="0.5" />
        <path d="M25,50 Q40,45 50,55" stroke="#FF7E67" strokeWidth="1.5" />
        <path d="M30,65 Q45,60 55,70" stroke="#FF7E67" strokeWidth="1.5" />
        <path d="M40,30 Q50,25 60,35" stroke="#FF7E67" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function Metric({ icon: Icon, color, label, value }) {
  return <div className="flex min-w-0 items-center"><Icon size={18} className={`mr-2 ${color}`} /><div className="min-w-0"><p className="truncate text-[11px] text-[#8B94A5]">{label}</p><p className="truncate text-sm">{value}</p></div></div>;
}

function MiniStat({ label, value }) {
  return <div className="rounded-2xl border border-[#2A3448] bg-[#1A2232] p-3"><p className="text-xs text-[#8B94A5]">{label}</p><p className="mt-1 text-xl">{value}</p></div>;
}

function StatCard({ icon: Icon, label, value, unit }) {
  return <Panel className="relative flex h-[118px] flex-col items-center justify-center p-5"><Icon size={18} className="absolute left-4 top-4 text-[#8B94A5]" /><p className="mb-2 text-sm text-[#8B94A5]">{label}</p><p className="text-4xl font-light">{value}<span className="ml-2 text-lg text-[#8B94A5]">{unit}</span></p></Panel>;
}

function BottomInfo({ icon: Icon, title, desc }) {
  return <Panel className="flex items-center justify-between p-5"><span className="flex min-w-0 items-center"><span className="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#2A3448] bg-[#111722]"><Icon size={20} className="text-[#D9B87F]" /></span><span className="min-w-0"><p className="truncate">{title}</p><p className="truncate text-sm text-[#8B94A5]">{desc}</p></span></span><ChevronRight size={20} className="text-[#8B94A5]" /></Panel>;
}

function RequestRow({ req }) {
  const statusMap = { pending: '待接单', accepted: '司机已接单', done: '已完成' };
  return <div className="flex items-center justify-between rounded-2xl border border-[#222B3B]/70 bg-[#111722]/70 p-4"><div className="min-w-0"><p className="truncate">已申请：{req.label}</p><p className="mt-1 text-xs text-[#8B94A5]">{new Date(req.createdAt).toLocaleTimeString()}</p></div><span className="rounded-full border border-[#D9B87F]/30 px-3 py-1 text-sm text-[#D9B87F]">{statusMap[req.status] || req.status}</span></div>;
}

function ChatBubble({ role, text, loading }) {
  const ai = role === 'assistant';
  return (
    <div className={`flex max-w-[88%] items-start ${ai ? '' : 'ml-auto flex-row-reverse'}`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2A3448] bg-[#1A2232] ${ai ? 'mr-4' : 'ml-4'}`}>{ai ? <Bot size={20} className="text-[#D9B87F]" /> : <UserRound size={18} className="text-[#8B94A5]" />}</div>
      <div className={`rounded-2xl border p-4 leading-relaxed ${ai ? 'rounded-tl-sm border-[#2A3448] bg-[#1A2232]' : 'rounded-tr-sm border-[#D9B87F]/30 bg-[#2A2216] text-[#D9B87F]'}`}>{loading ? <Loader2 className="animate-spin" /> : text}</div>
    </div>
  );
}

function RestaurantCard({ item }) {
  const mapUrl = `https://www.openstreetmap.org/?mlat=${item.lat}&mlon=${item.lng}#map=18/${item.lat}/${item.lng}`;
  return <a className="restaurant-card" href={mapUrl} target="_blank" rel="noreferrer"><span><b>{item.name}</b><small>{item.cuisine} · {item.distance ? `${item.distance} 米` : '距离未知'}</small></span><ExternalLink size={14} /></a>;
}

function ToolButton({ icon: Icon, title, desc, onClick }) {
  return <button className="tool-button" onClick={onClick}><Icon size={28} strokeWidth={1.6} /><span><b>{title}</b><small>{desc}</small></span></button>;
}

function WifiButton({ icon: Icon, children, onClick }) {
  return <button className="wifi-button" onClick={onClick}><Icon size={16} />{children}</button>;
}

function InfoLine({ label, value, last }) {
  return <div className={`flex items-center justify-between py-3 text-sm ${last ? '' : 'border-b border-[#2A3448]'}`}><span className="text-[#8B94A5]">{label}</span><span>{value}</span></div>;
}

function Step({ num, title }) {
  return <div className="flex items-center justify-center"><span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#D9B87F] text-xs font-bold text-black">{num}</span><span><p className="text-sm">{title}</p><p className="text-[10px] text-[#8B94A5]">真实网络信息</p></span></div>;
}

function InfoBadge({ label, value }) {
  return <div className="rounded-2xl border border-[#2A3448] bg-[#1A2232] p-3"><p className="text-xs text-[#8B94A5]">{label}</p><p className="mt-1 truncate text-lg text-white">{value}</p></div>;
}

function EmptyLine({ text }) {
  return <div className="rounded-2xl border border-dashed border-[#2A3448] p-5 text-center text-sm text-[#8B94A5]">{text}</div>;
}

function LoadingLine({ text }) {
  return <div className="flex items-center gap-2 text-sm text-[#8B94A5]"><Loader2 size={16} className="animate-spin" />{text}</div>;
}

function ToastStack({ toasts, dismiss }) {
  return <div className="toast-stack">{toasts.map((toast) => <button key={toast.id} className="toast" onClick={() => dismiss(toast.id)}>{toast.text}</button>)}</div>;
}

function AmbientBackground() {
  return <><div className="ambient ambient-blue" /><div className="ambient ambient-gold" /><div className="motion-grid" /></>;
}

function useRideState() {
  const [state, setState] = useState(defaultState);
  const [toasts, setToasts] = useState([]);

  const toast = (text) => {
    const item = { id: crypto.randomUUID(), text };
    setToasts((prev) => [item, ...prev].slice(0, 4));
    setTimeout(() => dismissToast(item.id), 4200);
  };

  const dismissToast = (id) => setToasts((prev) => prev.filter((item) => item.id !== id));

  async function call(path, options = {}) {
    const res = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`);
    return data;
  }

  useEffect(() => {
    call('/api/state').then(setState).catch((error) => toast(`后端未连接：${error.message}`));
    const source = new EventSource(`${apiBase}/api/events`);
    const updateState = (event) => setState(JSON.parse(event.data));
    source.addEventListener('state', updateState);
    source.addEventListener('route', () => call('/api/state').then(setState));
    source.addEventListener('request', () => call('/api/state').then(setState));
    source.addEventListener('request-status', () => call('/api/state').then(setState));
    source.onerror = () => {};
    return () => source.close();
  }, []);

  return { state, setState, call, toasts, toast, dismissToast };
}

function loadMapLibre() {
  return new Promise((resolve, reject) => {
    if (window.maplibregl) return resolve();
    if (!document.getElementById('maplibre-css')) {
      const css = document.createElement('link');
      css.id = 'maplibre-css';
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css';
      document.head.appendChild(css);
    }
    if (document.getElementById('maplibre-js')) return waitForMapLibre(resolve, reject);
    const script = document.createElement('script');
    script.id = 'maplibre-js';
    script.src = 'https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js';
    script.onload = () => waitForMapLibre(resolve, reject);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function waitForMapLibre(resolve, reject) {
  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    if (window.maplibregl) {
      clearInterval(timer);
      resolve();
    } else if (attempts > 100) {
      clearInterval(timer);
      reject(new Error('maplibre timeout'));
    }
  }, 50);
}

function drawMapRoute(map, coords) {
  const data = { type: 'Feature', geometry: { type: 'LineString', coordinates: coords }, properties: {} };
  if (map.getSource('route')) {
    map.getSource('route').setData(data);
    return;
  }
  map.addSource('route', { type: 'geojson', data });
  map.addLayer({ id: 'route-glow', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ffb86a', 'line-width': 30, 'line-opacity': 0.42, 'line-blur': 10 } });
  map.addLayer({ id: 'route-main', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ffc783', 'line-width': 12, 'line-opacity': 1 } });
  map.addLayer({ id: 'route-core', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#fff4d8', 'line-width': 4, 'line-opacity': 1 } });
}

function fitMapRoute(map, coords) {
  const bounds = coords.reduce((box, coord) => box.extend(coord), new window.maplibregl.LngLatBounds(coords[0], coords[0]));
  map.fitBounds(bounds, { padding: 95, pitch: 62, bearing: -18, duration: 900 });
}

function startSmoothRouteAnimation(map, marker, coords, route, setLive, rafRef) {
  cancelAnimationFrame(rafRef.current);
  const metrics = buildRouteMetrics(coords);
  const total = metrics.total || 1;
  const simDuration = Math.min(62000, Math.max(22000, (route.duration || 600) * 1000 / 14));
  const started = performance.now();
  let lastCamera = 0;
  let lastLive = 0;

  const frame = (now) => {
    const progress = ((now - started) % simDuration) / simDuration;
    const point = pointAtDistance(metrics, total * progress);
    marker.setLngLat(point.coord);
    const markerImage = marker.getElement().querySelector('.car-marker-img');
    if (markerImage) markerImage.style.transform = `rotate(${point.bearing}deg)`;
    if (now - lastCamera > 650) {
      map.easeTo({ center: point.coord, zoom: 15.5, pitch: 64, bearing: point.bearing - 20, duration: 620 });
      lastCamera = now;
    }
    if (now - lastLive > 450) {
      const leftMeters = Math.max(0, (route.distance || total) * (1 - progress));
      const leftSeconds = Math.max(0, (route.duration || 600) * (1 - progress));
      setLive({
        progress,
        distanceLeft: (leftMeters / 1000).toFixed(1),
        eta: Math.max(1, Math.round(leftSeconds / 60)).toString(),
        speed: (42 + Math.round(Math.sin(progress * 18) * 8)).toString(),
        arrival: new Date(Date.now() + leftSeconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      });
      lastLive = now;
    }
    rafRef.current = requestAnimationFrame(frame);
  };
  rafRef.current = requestAnimationFrame(frame);
}

function buildRouteMetrics(coords) {
  const segments = [];
  let total = 0;
  for (let i = 1; i < coords.length; i += 1) {
    const from = coords[i - 1];
    const to = coords[i];
    const length = haversine(from, to);
    const bearing = calcBearing(from, to);
    segments.push({ from, to, length, start: total, end: total + length, bearing });
    total += length;
  }
  return { segments, total };
}

function pointAtDistance(metrics, distance) {
  const seg = metrics.segments.find((item) => distance <= item.end) || metrics.segments.at(-1);
  if (!seg) return { coord: START, bearing: 0 };
  const t = Math.min(1, Math.max(0, (distance - seg.start) / seg.length));
  return {
    coord: [seg.from[0] + (seg.to[0] - seg.from[0]) * t, seg.from[1] + (seg.to[1] - seg.from[1]) * t],
    bearing: seg.bearing
  };
}

function estimateDistance(coords) {
  let total = 0;
  for (let i = 1; i < coords.length; i += 1) total += haversine(coords[i - 1], coords[i]);
  return total;
}

function haversine(a, b) {
  const R = 6371000;
  const toRad = (x) => x * Math.PI / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function calcBearing(a, b) {
  const toRad = (d) => d * Math.PI / 180;
  const toDeg = (r) => r * 180 / Math.PI;
  const lon1 = toRad(a[0]);
  const lon2 = toRad(b[0]);
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

createRoot(document.getElementById('root')).render(<App />);
