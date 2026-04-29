import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Home, ClipboardList, ConciergeBell, Bot, Music, Wifi, Settings, Phone,
  ChevronRight, MapPin, Thermometer, Droplets, Wind, Coffee, SmartphoneCharging,
  Headphones, Newspaper, Clock, Navigation, CheckCircle2, VolumeX, Snowflake,
  Sun, MessageSquare, PhoneCall, CloudSun, Languages, Play, Pause,
  SkipBack, SkipForward, Shuffle, ListVideo, Eye, EyeOff, RefreshCw, Maximize,
  QrCode, ShieldCheck, Car, Lightbulb, Grid3X3, Lock, Send, BellRing,
  Copy, Signal, UserRound, Heart, Flame, ThumbsUp, Radio, SlidersHorizontal
} from 'lucide-react';
import './styles.css';

const navItems = [
  { id: 'home', icon: Home, label: '首页' },
  { id: 'trip', icon: ClipboardList, label: '行程' },
  { id: 'service', icon: ConciergeBell, label: '服务' },
  { id: 'ai', icon: Bot, label: 'AI 管家' },
  { id: 'entertainment', icon: Music, label: '娱乐' },
  { id: 'wifi', icon: Wifi, label: 'Wi-Fi' },
  { id: 'settings', icon: Settings, label: '设置' }
];

const gold = '#D9B87F';
const screens = {
  home: HomeScreen,
  trip: TripScreen,
  service: ServiceScreen,
  ai: AiScreen,
  entertainment: EntertainmentScreen,
  wifi: WifiScreen,
  settings: SettingsScreen
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTime, setCurrentTime] = useState('');
  const Screen = screens[activeTab] || HomeScreen;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#06090F] text-white select-none">
      <aside className="z-20 flex w-32 shrink-0 flex-col justify-between border-r border-[#222B3B]/50 bg-[#06090F] py-5">
        <div className="flex flex-col items-center space-y-2">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#D9B87F] to-[#8C7043] shadow-[0_0_15px_rgba(217,184,127,0.3)]">
            <span className="text-xl font-bold text-black">M</span>
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex h-20 w-24 flex-col items-center justify-center rounded-2xl border-l-4 transition-all duration-300 ${
                activeTab === item.id
                  ? 'border-[#D9B87F] bg-gradient-to-r from-[#D9B87F]/10 to-transparent text-[#D9B87F]'
                  : 'border-transparent text-[#8B94A5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={28} className="mb-2" strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[13px] font-medium tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="px-4">
          <button className="flex w-full flex-col items-center justify-center rounded-xl border border-[#D9B87F]/30 bg-[#D9B87F]/5 py-3 text-[#D9B87F] transition-colors hover:bg-[#D9B87F]/10">
            <Phone size={20} className="mb-1" />
            <span className="text-[11px]">一键呼叫</span>
          </button>
        </div>
      </aside>

      <main className="relative flex flex-1 flex-col overflow-hidden bg-[#06090F]">
        <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-[50%] w-[50%] rounded-full bg-[#1A253C] opacity-40 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#3D2C1C] opacity-30 blur-[120px]" />
        <div className="custom-scrollbar z-10 flex flex-1 flex-col overflow-y-auto p-10">
          <Screen time={currentTime} />
        </div>
      </main>
    </div>
  );
}

function TopBar({ title, subtitle, time }) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="mb-2 text-[32px] font-medium tracking-wide text-[#D9B87F]">{title}</h1>
        <p className="text-sm text-[#8B94A5]">{subtitle}</p>
      </div>
      <div className="flex space-x-3 text-sm text-[#8B94A5]">
        <Pill icon={Thermometer}>24°C</Pill>
        <Pill icon={Clock}>{time || '14:30'}</Pill>
        <Pill icon={Wifi} />
      </div>
    </div>
  );
}

function Pill({ icon: Icon, children }) {
  return (
    <div className="flex items-center rounded-full border border-[#222B3B] bg-[#111722]/80 px-4 py-2 backdrop-blur-md">
      <Icon size={16} className={children ? 'mr-2' : ''} />
      {children && <span>{children}</span>}
    </div>
  );
}

function Panel({ children, className = '' }) {
  return <div className={`border border-[#222B3B] bg-[#111722]/80 shadow-lg backdrop-blur-md ${className}`}>{children}</div>;
}

function HomeScreen({ time }) {
  return (
    <div className="flex h-full flex-col animate-fade-in">
      <TopBar title="尊享旅程" subtitle="欢迎乘坐，祝您旅途愉快" time={time} />
      <section className="relative mb-6 flex h-[220px] items-center overflow-hidden rounded-3xl border border-[#222B3B] bg-gradient-to-r from-[#0D1525] to-[#1A253A] px-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617369528738-f9478f7f2b05?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06090F] via-transparent to-transparent" />
        <div className="absolute left-1/4 top-1/2 h-px w-full -rotate-12 bg-gradient-to-r from-transparent via-[#D9B87F] to-transparent opacity-50 shadow-[0_0_20px_#D9B87F]" />
        <div className="relative z-10">
          <h2 className="mb-4 text-4xl font-light">下午好，</h2>
          <h3 className="text-3xl font-medium tracking-wide">愿您享受这段舒适旅程</h3>
          <div className="mt-6 h-1 w-12 rounded-full bg-[#D9B87F] shadow-[0_0_10px_rgba(217,184,127,0.8)]" />
        </div>
      </section>

      <div className="mb-6 flex flex-1 gap-6">
        <div className="flex w-[35%] flex-col gap-6">
          <Panel className="flex flex-1 flex-col rounded-3xl p-6">
            <CardTitle icon={MapPin} title="行程概览" />
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="mb-1 text-sm text-[#8B94A5]">预计到达</p>
                <p className="text-4xl font-light">18:45</p>
              </div>
              <MiniMap />
            </div>
            <p className="mb-1 text-sm text-[#8B94A5]">剩余距离</p>
            <p className="text-xl"><span className="text-3xl">12.4</span> 公里</p>
          </Panel>
          <Panel className="flex h-[160px] flex-col justify-between rounded-3xl p-6">
            <CardTitle icon={Bot} title="AI 管家" iconClass="text-[#D9B87F]" />
            <div className="flex h-full gap-3 pb-2">
              <QuickCard icon={MessageSquare} title="智能问答" desc="为您解答" />
              <QuickCard icon={MapPin} title="景点推荐" desc="发现周边" />
            </div>
          </Panel>
        </div>

        <div className="flex w-[65%] flex-col gap-6">
          <div className="flex h-[260px] gap-6">
            <Panel className="relative flex-1 overflow-hidden rounded-3xl p-6">
              <SeatArt />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <CardTitle icon={Wind} title="舒适体验" />
                  <p className="mb-1 text-sm text-[#8B94A5]">车内温度</p>
                  <div className="flex items-end"><span className="text-5xl font-light">24</span><span className="mb-1 ml-1 text-2xl">°C</span></div>
                  <p className="mt-2 text-sm text-[#D9B87F]">舒适宜人</p>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[#222B3B]/50 bg-[#090D15]/50 p-4 backdrop-blur-sm">
                  <Metric icon={Wind} color="text-green-400" label="车内空气" value="优" />
                  <Divider />
                  <Metric icon={Droplets} color="text-blue-400" label="湿度" value="45%" />
                  <Divider />
                  <Metric icon={Bot} color="text-gray-400" label="PM2.5" value="12" />
                </div>
              </div>
            </Panel>
            <Panel className="flex w-[45%] flex-col rounded-3xl p-6">
              <CardTitle title="便捷服务" />
              <div className="flex flex-1 gap-3">
                <ServiceTile icon={Coffee} title="矿泉水" desc="免费提供" />
                <ServiceTile icon={Wind} title="纸巾" desc="免费提供" />
                <ServiceTile icon={SmartphoneCharging} title="充电线" desc="多种接口" />
              </div>
            </Panel>
          </div>

          <div className="flex h-[160px] gap-6">
            <Panel className="flex flex-1 flex-col justify-between rounded-3xl p-6">
              <CardTitle icon={Music} title="娱乐" iconClass="text-[#D9B87F]" />
              <div className="flex h-full gap-4 pb-2">
                <IconTile icon={Music} label="音乐" />
                <IconTile icon={Newspaper} label="资讯" />
                <IconTile icon={Headphones} label="有声书" />
              </div>
            </Panel>
            <Panel className="relative flex w-[45%] flex-col justify-between overflow-hidden rounded-3xl p-6">
              <div className="absolute right-[-20%] top-[-20%] h-40 w-40 rounded-full border border-white/5" />
              <div className="absolute right-[-10%] top-[-10%] h-32 w-32 rounded-full border border-white/5" />
              <CardTitle icon={Wifi} title="Wi-Fi" />
              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <p className="mb-2 text-xl font-medium tracking-wide">RideLux_8888</p>
                  <p className="flex items-center text-sm text-[#8B94A5]"><span className="mr-2 h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />已连接</p>
                </div>
                <button className="rounded-full border border-[#D9B87F] px-4 py-2 text-sm text-[#D9B87F] transition-colors hover:bg-[#D9B87F]/10">查看 Wi-Fi</button>
              </div>
            </Panel>
          </div>
        </div>
      </div>
      <BottomControlBar />
    </div>
  );
}

function CardTitle({ icon: Icon, title, iconClass = '' }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center text-[#8B94A5]">
        {Icon && <Icon size={18} className={`mr-2 ${iconClass}`} />}
        <span>{title}</span>
      </div>
      <ChevronRight size={18} className="text-[#8B94A5]" />
    </div>
  );
}

function QuickCard({ icon: Icon, title, desc }) {
  return (
    <button className="flex flex-1 items-center rounded-2xl border border-[#2A3448] bg-[#1A2232] p-3 transition-colors hover:bg-[#222B3D]">
      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#D9B87F]/10"><Icon size={18} className="text-[#D9B87F]" /></div>
      <div className="text-left"><p className="text-sm">{title}</p><p className="text-[11px] text-[#8B94A5]">{desc}</p></div>
    </button>
  );
}

function MiniMap() {
  return (
    <div className="relative h-24 w-32 overflow-hidden rounded-xl border border-[#222B3B] bg-[#0A0E17]">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M10,80 Q30,60 50,70 T90,20" stroke="#D9B87F" strokeWidth="2" fill="none" />
        <circle cx="10" cy="80" r="3" fill="#fff" />
        <circle cx="90" cy="20" r="4" fill="#D9B87F" />
      </svg>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
    </div>
  );
}

function SeatArt() {
  return (
    <div className="absolute bottom-0 right-0 h-48 w-48 opacity-40">
      <svg viewBox="0 0 100 100" fill="none" stroke="#D9B87F" strokeWidth="1" className="h-full w-full opacity-50">
        <path d="M30,80 Q40,40 35,20 Q50,10 65,20 Q60,40 70,80 Z" fill="#1A253A" strokeWidth="0.5" />
        <path d="M25,50 Q40,45 50,55" stroke="#FF7E67" strokeWidth="1.5" />
        <path d="M30,65 Q45,60 55,70" stroke="#FF7E67" strokeWidth="1.5" />
        <path d="M40,30 Q50,25 60,35" stroke="#FF7E67" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function Metric({ icon: Icon, color, label, value }) {
  return <div className="flex items-center"><Icon size={18} className={`mr-2 ${color}`} /><div><p className="text-[11px] text-[#8B94A5]">{label}</p><p className="text-sm">{value}</p></div></div>;
}

function Divider() {
  return <div className="h-8 w-px bg-[#2A3448]" />;
}

function ServiceTile({ icon: Icon, title, desc }) {
  return (
    <button className="group flex flex-1 flex-col items-center justify-center rounded-2xl border border-[#2A3448] bg-[#1A2232] transition-colors hover:border-[#D9B87F]/50">
      <Icon size={24} className="mb-3 text-[#D9B87F] transition-transform group-hover:scale-110" />
      <span className="mb-1 text-sm">{title}</span>
      <span className="text-[10px] text-[#8B94A5]">{desc}</span>
    </button>
  );
}

function IconTile({ icon: Icon, label }) {
  return <button className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-[#2A3448] bg-[#1A2232] transition-colors hover:bg-[#222B3D]"><Icon size={20} className="mb-2" /><span className="text-sm text-[#8B94A5]">{label}</span></button>;
}

function BottomControlBar() {
  return (
    <div className="relative mt-auto flex h-[90px] items-center justify-between rounded-[2.5rem] border border-[#222B3B] bg-[#111722]/90 px-10 shadow-2xl backdrop-blur-xl">
      <Control icon={Car} label="座椅调节" />
      <Divider />
      <Control icon={Sun} label="氛围灯" />
      <div className="relative -top-6 flex flex-1 justify-center">
        <button className="group relative flex h-[100px] w-[100px] flex-col items-center justify-center rounded-full border-4 border-[#111722] bg-gradient-to-b from-[#1E2638] to-[#0A0E17] shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(217,184,127,0.2)] ring-2 ring-[#D9B87F]/30 transition-transform hover:scale-105">
          <Car size={32} className="z-10 mb-1 text-[#D9B87F]" />
          <span className="z-10 text-[13px] font-medium text-[#D9B87F]">行程中</span>
        </button>
      </div>
      <Control icon={Grid3X3} label="遮阳帘" />
      <Divider />
      <Control icon={VolumeX} label="静音模式" />
    </div>
  );
}

function Control({ icon: Icon, label }) {
  return <button className="flex flex-1 flex-col items-center justify-center space-y-2 text-[#8B94A5] transition-colors hover:text-white"><Icon size={24} /><span className="text-[12px]">{label}</span></button>;
}

const fallbackRoute = [
  [114.411265, 38.067183], [114.413521, 38.066422], [114.416817, 38.065164],
  [114.421241, 38.063579], [114.428968, 38.061344], [114.437702, 38.058843],
  [114.446991, 38.056120], [114.456201, 38.052945], [114.463372, 38.049188],
  [114.468120, 38.045812], [114.471381, 38.042531]
];

function TripScreen({ time }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => (t + 1) % 100), 1100);
    return () => clearInterval(timer);
  }, []);
  const progress = tick / 99;
  const eta = Math.max(1, Math.round(36 * (1 - progress)));
  const distance = (12.4 * (1 - progress)).toFixed(1);
  const arrival = new Date(Date.now() + eta * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="flex h-full flex-col animate-fade-in">
      <TopBar title="行程" subtitle="实时掌握路线、时间与到达进度" time={time} />
      <div className="relative mb-6 h-[45%] shrink-0 overflow-hidden rounded-3xl border border-[#222B3B] bg-[#0A0E17] shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(217,184,127,0.12),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.03)_25%,transparent_25%),linear-gradient(45deg,rgba(255,255,255,0.025)_25%,transparent_25%)] bg-[size:100%_100%,34px_34px,34px_34px]" />
        <RouteSvg progress={progress} />
        <div className="pointer-events-none absolute left-6 top-6 z-10 flex items-start space-x-6 rounded-2xl border border-[#222B3B] bg-[#111722]/90 p-6 shadow-2xl backdrop-blur-xl">
          <Navigation size={48} className="mt-1 rotate-45 text-[#D9B87F]" />
          <div>
            <p className="mb-2 text-3xl font-medium">前方 600 米右转</p>
            <p className="text-[#8B94A5]">进入金融街南街</p>
            <div className="mt-4 flex gap-2"><span className="h-1.5 w-8 rounded-full bg-[#D9B87F] shadow-[0_0_8px_#D9B87F]" /><span className="h-1.5 w-3 rounded-full bg-[#2A3448]" /><span className="h-1.5 w-3 rounded-full bg-[#2A3448]" /></div>
          </div>
        </div>
      </div>
      <div className="mb-6 flex gap-4">
        {[
          { label: '预计剩余', value: eta, unit: '分钟', icon: Clock },
          { label: '剩余距离', value: distance, unit: '公里', icon: Navigation },
          { label: '预计到达', value: arrival, unit: '', icon: CheckCircle2 },
          { label: '当前时速', value: 44 + Math.round(Math.sin(progress * 12) * 7), unit: 'km/h', icon: Thermometer }
        ].map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>
      <Panel className="mb-6 rounded-3xl p-8">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-6 right-6 top-3 h-px bg-[#2A3448]" />
          <div className="absolute left-6 top-3 h-px bg-[#D9B87F] shadow-[0_0_10px_#D9B87F]" style={{ width: `${35 + progress * 35}%` }} />
          {['北京金融街购物中心', '金融街南街', '复兴门内大街', '建国门桥', '国贸三期写字楼'].map((desc, i) => (
            <div key={desc} className="relative flex w-[20%] flex-col items-center text-center">
              <div className={`mb-4 flex h-6 w-6 items-center justify-center rounded-full ${i < 2 ? 'bg-[#D9B87F]' : i === 2 ? 'bg-[#D9B87F] shadow-[0_0_15px_#D9B87F] ring-4 ring-[#111722]' : 'bg-[#2A3448]'}`}>
                {i < 2 ? <CheckCircle2 size={14} className="text-[#111722]" /> : i === 2 ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
              </div>
              <p className={i <= 2 ? 'text-sm text-white' : 'text-sm text-[#8B94A5]'}>{desc}</p>
              <p className="mt-1 text-[11px] text-[#8B94A5]">{i === 4 ? `${arrival} 预计到达` : `14:${12 + i * 6}`}</p>
            </div>
          ))}
        </div>
      </Panel>
      <div className="flex flex-1 gap-4">
        <BottomInfo icon={Car} title="路况提示" desc="前方道路畅通" />
        <BottomInfo icon={Wind} title="舒适模式" desc="空调 24°C | 座椅通风" />
        <BottomInfo icon={Droplets} title="平稳驾驶提醒" desc="本次行程平稳度 92 分" />
      </div>
    </div>
  );
}

function RouteSvg({ progress }) {
  const p = fallbackRoute.map(([x, y]) => `${(x - 114.39) * 2600},${(38.08 - y) * 3000}`).join(' ');
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 260 150" preserveAspectRatio="none">
      <polyline points={p} fill="none" stroke="#ffb86a" strokeWidth="12" strokeOpacity=".22" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={p} fill="none" stroke="#ffc783" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={p} fill="none" stroke="#fff0c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={55 + progress * 150} cy={38 + Math.sin(progress * 8) * 22} r="6" fill="#ffd49a" filter="drop-shadow(0 0 10px #ffb86a)" />
    </svg>
  );
}

function StatCard({ icon: Icon, label, value, unit }) {
  return <Panel className="group relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl p-6 transition-colors hover:border-[#D9B87F]/30"><Icon size={18} className="absolute left-4 top-4 text-[#8B94A5]" /><p className="mb-2 text-sm text-[#8B94A5]">{label}</p><p className="text-4xl font-light">{value} <span className="ml-1 text-lg text-[#8B94A5]">{unit}</span></p></Panel>;
}

function BottomInfo({ icon: Icon, title, desc }) {
  return <button className="group flex flex-1 items-center justify-between rounded-2xl border border-[#2A3448] bg-[#1A2232] p-5 transition-colors hover:bg-[#222B3D]"><span className="flex items-center"><span className="mr-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#2A3448] bg-[#111722]"><Icon size={20} className="text-[#D9B87F]" /></span><span className="text-left"><p className="mb-1">{title}</p><p className="text-sm text-[#8B94A5]">{desc}</p></span></span><ChevronRight size={20} className="text-[#8B94A5]" /></button>;
}

function ServiceScreen({ time }) {
  const services = [
    { label: '矿泉水', icon: Coffee }, { label: '纸巾', icon: Wind }, { label: '充电线', icon: SmartphoneCharging },
    { label: '调高空调', icon: Snowflake }, { label: '调低空调', icon: Snowflake }, { label: '需要安静', icon: VolumeX }
  ];
  return (
    <div className="flex h-full flex-col animate-fade-in">
      <TopBar title="服务" subtitle="无需开口，轻点即可通知司机" time={time} />
      <div className="mb-8 grid grid-cols-3 gap-6">
        {services.map((service) => (
          <button key={service.label} className="group flex h-40 flex-col items-center justify-center rounded-3xl border border-[#222B3B] bg-[#111722]/80 shadow-lg backdrop-blur-md transition-all hover:border-[#D9B87F]/50 hover:bg-[#1A2232]">
            <service.icon size={48} className="mb-4 text-[#D9B87F] opacity-80 transition-all group-hover:scale-110 group-hover:opacity-100" strokeWidth={1.5} />
            <p className="text-lg font-medium">{service.label}</p>
            <div className="mt-4 h-px w-6 bg-[#2A3448] transition-colors group-hover:bg-[#D9B87F]/50" />
          </button>
        ))}
      </div>
      <div className="relative mb-8 flex items-center justify-between overflow-hidden rounded-2xl border border-[#D9B87F]/30 bg-gradient-to-r from-[#1A202A] via-[#242A38] to-[#1A202A] p-4 shadow-[0_0_30px_rgba(217,184,127,0.05)]">
        <div className="flex items-center"><span className="mr-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#D9B87F]"><CheckCircle2 size={16} className="text-[#D9B87F]" /></span><span className="font-medium tracking-wide text-[#D9B87F]">已通知司机，预计 1 分钟内响应</span></div>
      </div>
      <div className="flex flex-1 flex-col">
        <p className="mb-4 px-2 text-sm text-[#8B94A5]">最近请求</p>
        {['矿泉水', '调低空调'].map((item, i) => <RequestRow key={item} item={item} time={`14:${28 - i * 7}`} />)}
        <button className="mt-auto flex w-full items-center justify-center rounded-[2rem] bg-gradient-to-r from-[#8C7043] via-[#D9B87F] to-[#8C7043] py-6 text-xl font-medium text-black shadow-[0_10px_30px_rgba(217,184,127,0.3)] transition-shadow hover:shadow-[0_10px_40px_rgba(217,184,127,0.5)]"><BellRing className="mr-3" />一键呼叫服务</button>
        <p className="mt-6 flex items-center justify-center text-center text-sm text-[#8B94A5]"><ShieldCheck size={16} className="mr-2" />您的请求将静默通知司机，保障您的隐私与舒适体验</p>
      </div>
    </div>
  );
}

function RequestRow({ item, time }) {
  return <div className="mb-3 flex items-center justify-between rounded-2xl border border-[#222B3B]/50 bg-[#111722]/50 p-4 backdrop-blur-sm"><div className="flex items-center"><CheckCircle2 size={20} className="mr-4 text-[#8B94A5]" /><span>已申请：{item}</span></div><div className="flex items-center text-sm text-[#8B94A5]"><span className="mr-6">{time}</span><span className="text-[#D9B87F]">已完成</span></div></div>;
}

function AiScreen({ time }) {
  return (
    <div className="flex h-full flex-col animate-fade-in">
      <TopBar title="AI 管家" subtitle="陪伴、推荐、解答，一路更懂您" time={time} />
      <div className="mb-6 flex h-0 flex-1 gap-6">
        <Panel className="relative flex flex-1 flex-col overflow-hidden rounded-3xl p-6">
          <div className="custom-scrollbar relative z-10 flex flex-1 flex-col space-y-6 overflow-y-auto pr-4 pt-4">
            <ChatBubble ai>您好，我是您的 AI 向导管家，<br />有问题尽管问我，我随时为您服务~</ChatBubble>
            <ChatBubble mine>附近有什么适合晚餐的地方？</ChatBubble>
            <div className="text-center text-xs text-[#4A5568]">14:28</div>
            <ChatBubble ai wide>
              <p className="mb-4 text-[#E0E5F0]">为您推荐以下晚餐好去处：</p>
              {['精致餐厅：环境优雅，适合约会或商务宴请', '地道风味：本地特色，口味地道，性价比高', '人气推荐：评分高，口碑好，备受本地人喜爱'].map((line) => <p key={line} className="mb-2 flex text-sm"><Coffee size={16} className="mr-3 mt-0.5 shrink-0 text-[#D9B87F]" />{line}</p>)}
            </ChatBubble>
          </div>
          <div className="relative z-10 mt-auto border-t border-[#222B3B] pt-4">
            <div className="mb-4 flex gap-3 overflow-x-auto pb-2">
              {['附近美食', '景点推荐', '附近商场', '行程小贴士'].map((tag) => <button key={tag} className="whitespace-nowrap rounded-full border border-[#2A3448] bg-[#1A2232] px-4 py-2 text-sm text-[#8B94A5] transition-colors hover:border-[#D9B87F]/50 hover:text-[#D9B87F]">{tag}</button>)}
            </div>
            <div className="relative flex items-center"><input placeholder="请输入您的问题..." className="w-full rounded-2xl border border-[#2A3448] bg-[#1A2232] py-4 pl-6 pr-16 text-white placeholder-[#4A5568] outline-none transition-colors focus:border-[#D9B87F]/50" /><button className="absolute right-4 p-2 text-[#D9B87F]"><Send size={20} /></button></div>
          </div>
        </Panel>
        <Panel className="flex w-[40%] flex-col rounded-3xl p-6">
          <div className="mb-6 flex items-center justify-between"><span className="flex items-center font-medium"><Bot size={18} className="mr-2 text-[#D9B87F]" />为您推荐</span><button className="flex items-center text-sm text-[#8B94A5]">换一批 <RefreshCw size={14} className="ml-1" /></button></div>
          <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-2">
            {restaurants.map((item) => <FoodCard key={item.title} {...item} />)}
          </div>
        </Panel>
      </div>
      <Panel className="flex h-[90px] items-center justify-around rounded-[2.5rem] px-8 shadow-2xl">
        {[
          { title: '快速呼叫', desc: '联系服务专员', icon: PhoneCall },
          { title: '路线规划', desc: '智能规划行程', icon: Navigation },
          { title: '天气查询', desc: '出行天气早知道', icon: CloudSun },
          { title: '翻译助手', desc: '多语言实时翻译', icon: Languages }
        ].map((tool) => <ToolButton key={tool.title} {...tool} />)}
      </Panel>
    </div>
  );
}

function ChatBubble({ ai, mine, wide, children }) {
  return <div className={`flex max-w-[85%] items-start ${mine ? 'self-end flex-row-reverse' : ''}`}><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2A3448] bg-[#1A2232] ${mine ? 'ml-4' : 'mr-4'}`}>{ai ? <Bot size={20} className="text-[#D9B87F]" /> : <UserRound size={18} className="text-[#8B94A5]" />}</div><div className={`${wide ? 'w-full' : ''} rounded-2xl ${ai ? 'rounded-tl-sm border-[#2A3448] bg-[#1A2232] text-[#E0E5F0]' : 'rounded-tr-sm border-[#D9B87F]/30 bg-gradient-to-r from-[#2A2216] to-[#1A1813] text-[#D9B87F]'} border p-4 leading-relaxed`}>{children}</div></div>;
}

const restaurants = [
  { img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000&auto=format&fit=crop', title: '云庭西餐厅', desc: '西餐 | 浪漫优雅', dist: '1.2 公里' },
  { img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1000&auto=format&fit=crop', title: '川渝小馆', desc: '川菜 | 地道风味', dist: '1.6 公里' },
  { img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop', title: '江畔·日料料理', desc: '日料 | 精致料理', dist: '2.1 公里' }
];

function FoodCard({ img, title, desc, dist }) {
  return <div className="group flex h-[120px] overflow-hidden rounded-2xl border border-[#2A3448] bg-[#1A2232] transition-colors hover:border-[#D9B87F]/50"><div className="h-full w-[45%] bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} /><div className="flex flex-1 flex-col justify-between p-4"><div><h4 className="mb-1 font-medium">{title}</h4><p className="text-xs text-[#8B94A5]">{desc}</p></div><div className="flex items-center justify-between"><p className="flex items-center text-xs text-[#8B94A5]"><MapPin size={12} className="mr-1" />{dist}</p><button className="rounded-full border border-[#2A3448] px-3 py-1 text-xs text-[#8B94A5] group-hover:border-[#D9B87F] group-hover:text-[#D9B87F]">查看详情</button></div></div></div>;
}

function ToolButton({ icon: Icon, title, desc }) {
  return <button className="group flex items-center gap-4"><Icon size={32} className="text-[#D9B87F] opacity-80 transition-transform group-hover:scale-110 group-hover:opacity-100" strokeWidth={1.5} /><span className="text-left"><p className="mb-1 text-sm">{title}</p><p className="text-[11px] text-[#8B94A5]">{desc}</p></span></button>;
}

function EntertainmentScreen({ time }) {
  const bars = useMemo(() => Array.from({ length: 30 }, (_, i) => Math.max(20, Math.sin(i * 0.4) * 80 + 18)), []);
  return (
    <div className="flex h-full flex-col animate-fade-in">
      <div className="mb-8 flex items-end justify-between">
        <div><h1 className="mb-2 text-[32px] font-medium tracking-wide text-[#D9B87F]">娱乐</h1><p className="mb-4 text-sm text-[#8B94A5]">放松心情，享受旅途时光</p><div className="flex space-x-8 text-lg font-medium">{['音乐', '资讯', '段子', '视频'].map((tab, i) => <button key={tab} className={i === 0 ? 'border-b-2 border-[#D9B87F] pb-2 text-[#D9B87F]' : 'pb-2 text-[#8B94A5] hover:text-white'}>{tab}</button>)}</div></div>
        <div className="mb-4 flex space-x-3 text-sm text-[#8B94A5]"><Pill icon={Thermometer}>24°C</Pill><Pill icon={Clock}>{time || '14:30'}</Pill><Pill icon={Wifi} /></div>
      </div>
      <Panel className="mb-6 flex items-center rounded-3xl p-6 shadow-xl">
        <div className="mr-8 h-[180px] w-[280px] overflow-hidden rounded-2xl bg-[url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center shadow-lg" />
        <div className="flex-1">
          <div className="mb-6 flex items-start justify-between"><div><h3 className="mb-2 flex items-center text-3xl font-medium">星空下的旅途 <Heart className="ml-4 h-5 w-5 text-[#8B94A5]" /></h3><p className="text-lg text-[#8B94A5]">Gentle Journey</p></div><div className="mr-10 flex h-12 items-center gap-1">{bars.map((h, i) => <div key={i} className="w-1 origin-bottom animate-pulsebar rounded-full bg-[#D9B87F]" style={{ height: `${h}%`, animationDelay: `${i * 45}ms`, opacity: Math.max(0.35, Math.sin(i * 0.4)) }} />)}</div></div>
          <div className="mb-6 flex items-center gap-4"><span className="text-sm text-[#8B94A5]">01:42</span><div className="relative h-1.5 flex-1 rounded-full bg-[#2A3448]"><div className="absolute h-full w-1/3 rounded-full bg-[#D9B87F]" /><div className="absolute left-1/3 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D9B87F] shadow-[0_0_10px_#D9B87F]" /></div><span className="text-sm text-[#8B94A5]">04:35</span></div>
          <div className="flex items-center space-x-8"><Shuffle size={20} className="text-[#8B94A5]" /><SkipBack size={28} /><button className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#D9B87F] to-[#8C7043] text-[#111722] shadow-[0_0_20px_rgba(217,184,127,0.3)]"><Pause fill="currentColor" size={28} /></button><SkipForward size={28} /><ListVideo size={20} className="text-[#8B94A5]" /></div>
        </div>
      </Panel>
      <div className="mb-6 flex h-[260px] gap-6">
        <FeedPanel icon={Newspaper} title="热门资讯" items={newsItems} />
        <JokePanel />
        <FeedPanel icon={Play} title="精选短视频" items={videoItems} video />
      </div>
      <div className="flex flex-1 flex-col"><div className="mb-4 flex items-center pl-2"><Radio className="mr-2 h-5 w-5 text-[#8B94A5]" />轻松电台</div><div className="flex flex-1 gap-4">{radioItems.map((item) => <RadioCard key={item.title} {...item} />)}</div></div>
    </div>
  );
}

const newsItems = [
  { title: '新能源汽车市场迎来新一轮政策利好', sub: '36分钟前', img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938cb?w=200&h=120&fit=crop' },
  { title: '中国空间站最新影像曝光', sub: '1小时前', img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=200&h=120&fit=crop', hot: true },
  { title: '秋日自驾路线推荐：最美湖山环线', sub: '2小时前', img: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=200&h=120&fit=crop' }
];
const videoItems = [
  { title: '海岸公路的日落时刻美到窒息', sub: '12.4万次播放', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&h=120&fit=crop' },
  { title: '林间偶遇小鹿，治愈瞬间', sub: '8.7万次播放', img: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=200&h=120&fit=crop' },
  { title: '在星空下露营是种怎样的体验', sub: '15.6万次播放', img: 'https://images.unsplash.com/photo-1504280390227-1bf1c6f93dcd?w=200&h=120&fit=crop' }
];
const radioItems = [
  { title: '城市漫游', sub: 'City Walk', img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop' },
  { title: '治愈时光', sub: 'Healing Time', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop' },
  { title: '深夜星空', sub: 'Night Sky', img: 'https://images.unsplash.com/photo-1436891620584-47fd0e565afb?w=300&h=200&fit=crop' },
  { title: '民谣故事', sub: 'Folk Stories', img: 'https://images.unsplash.com/photo-1460036521480-c4c50815e182?w=300&h=200&fit=crop' },
  { title: '经典怀旧', sub: 'Classic Hits', img: 'https://images.unsplash.com/photo-1606132439328-9717520e79cb?w=300&h=200&fit=crop' }
];

function FeedPanel({ icon: Icon, title, items, video }) {
  return <Panel className="flex flex-1 flex-col rounded-3xl p-6"><div className="mb-4 flex items-center justify-between font-medium"><span className="flex items-center"><Icon size={18} className="mr-2 text-[#D9B87F]" />{title}</span><ChevronRight size={18} className="text-[#8B94A5]" /></div><div className="flex flex-1 flex-col justify-between overflow-hidden">{items.map((item) => <div key={item.title} className="group flex h-1/3 cursor-pointer items-center gap-4 border-b border-[#222B3B]/50 py-2 last:border-0"><div className={`${video ? 'w-28' : 'w-20'} relative h-14 shrink-0 overflow-hidden rounded-lg bg-cover bg-center`} style={{ backgroundImage: `url(${item.img})` }}>{video && <div className="absolute inset-0 flex items-center justify-center bg-black/30"><Play size={20} fill="currentColor" /></div>}</div><div className="flex-1"><p className="line-clamp-2 text-sm leading-snug transition-colors group-hover:text-[#D9B87F]">{item.title}</p><p className="mt-1 flex items-center text-[11px] text-[#8B94A5]">{item.sub}{item.hot && <span className="ml-2 flex items-center text-red-500"><Flame className="mr-0.5 h-3 w-3" />热</span>}</p></div></div>)}</div></Panel>;
}

function JokePanel() {
  return <Panel className="flex flex-1 flex-col rounded-3xl p-6"><div className="mb-4 flex items-center justify-between font-medium"><span className="flex items-center"><MessageSquare size={18} className="mr-2 text-[#D9B87F]" />搞笑段子</span><ChevronRight size={18} className="text-[#8B94A5]" /></div><div className="flex flex-1 flex-col justify-between">{['导航说前方拥堵，我说那我走路吧。它说：已为您规划步行路线...', '为什么电动车不怕堵车？因为它有“电”就行，别的车可没这待遇！', '朋友问我为什么总喜欢自驾游？因为方向盘在手，烦恼都往后走'].map((text, i) => <div key={text} className="flex h-[30%] flex-col justify-between rounded-xl bg-[#1A2232] p-3"><p className="line-clamp-2 text-sm text-[#E0E5F0]">{text}</p><p className="flex items-center justify-end text-xs text-[#8B94A5]"><ThumbsUp className="mr-1 h-3 w-3" />{['1.2万', '9823', '7564'][i]}</p></div>)}</div></Panel>;
}

function RadioCard({ title, sub, img }) {
  return <div className="group relative flex-1 cursor-pointer overflow-hidden rounded-2xl border border-[#222B3B] transition-colors hover:border-[#D9B87F]/50"><div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${img})` }} /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" /><div className="absolute inset-0 flex flex-col justify-between p-4"><div><h4 className="text-lg font-medium">{title}</h4><p className="text-xs text-[#8B94A5]">{sub}</p></div><div className="flex justify-end"><span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur-sm"><Play size={14} fill="currentColor" /></span></div></div></div>;
}

function WifiScreen({ time }) {
  const [showPwd, setShowPwd] = useState(false);
  return (
    <div className="flex h-full flex-col animate-fade-in">
      <TopBar title="Wi-Fi" subtitle="高速网络，畅快连接" time={time} />
      <section className="relative mb-6 flex h-[200px] items-center overflow-hidden rounded-3xl border border-[#222B3B] bg-[#0A0E17] px-12 shadow-xl">
        <div className="absolute inset-0 flex items-center justify-center opacity-30"><div className="absolute top-[50%] h-[300px] w-[800px] rounded-[100%] border-t border-[#D9B87F] opacity-10" /><div className="absolute top-[55%] h-[200px] w-[600px] rounded-[100%] border-t border-[#D9B87F] opacity-30" /><div className="absolute top-[60%] h-[100px] w-[400px] rounded-[100%] border-t border-[#D9B87F] opacity-60" /><div className="absolute top-[65%] h-10 w-10 rounded-full bg-gradient-to-b from-white to-[#D9B87F] shadow-[0_0_40px_#D9B87F]" /></div>
        <div className="relative z-10 flex w-full items-start justify-between"><div><Wifi size={32} className="mb-4 text-[#D9B87F]" /><h2 className="mb-3 text-4xl font-medium">RideLux_8888</h2><span className="inline-flex items-center rounded-full border border-[#2A3448] bg-[#1A2232]/80 px-4 py-1.5"><span className="mr-2 h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />已连接</span></div><div className="self-end rounded-full border border-[#D9B87F]/30 bg-[#D9B87F]/10 px-4 py-2 text-[#D9B87F]"><ShieldCheck size={18} className="mr-2 inline" />安全保护中</div></div>
      </section>
      <div className="mb-6 flex h-[220px] gap-6">
        <Panel className="flex flex-1 flex-col justify-between rounded-3xl p-6"><div className="flex items-center"><Lock size={18} className="mr-2 text-[#8B94A5]" />网络密码</div><div className="flex items-center justify-between rounded-2xl border border-[#2A3448] bg-[#1A2232] p-4"><span className="font-mono text-2xl tracking-widest">{showPwd ? 'A88888888' : '••••••••'}</span><button onClick={() => setShowPwd(!showPwd)} className="p-2 text-[#8B94A5]">{showPwd ? <EyeOff size={20} /> : <Eye size={20} />}</button></div><div className="flex gap-4"><WifiButton icon={Copy}>复制密码</WifiButton><WifiButton icon={RefreshCw}>重新显示</WifiButton></div></Panel>
        <Panel className="flex w-[30%] flex-col items-center justify-center rounded-3xl p-6"><div className="relative mb-4 flex w-full items-center justify-center"><Maximize size={18} className="absolute left-0 text-[#8B94A5]" />扫码连接</div><div className="mb-3 h-32 w-32 rounded-xl bg-white p-2"><img className="h-full w-full object-cover opacity-90" src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="Wi-Fi QR code" /></div><p className="text-[11px] text-[#8B94A5]">使用手机扫码快速连接</p></Panel>
        <Panel className="flex flex-1 flex-col rounded-3xl p-6"><div className="mb-6 flex items-center"><Signal className="mr-2 h-5 w-5 text-[#8B94A5]" />连接状态</div>{[['当前状态', '已连接'], ['网络强度', '强'], ['安全性', 'WPA2'], ['已连接设备', '3 台']].map(([k, v], i) => <div key={k} className={`flex items-center justify-between py-3 text-sm ${i < 3 ? 'border-b border-[#2A3448]' : ''}`}><span className="text-[#8B94A5]">{k}</span><span>{v}</span></div>)}</Panel>
      </div>
      <Panel className="mb-6 flex items-center justify-between rounded-3xl p-6 shadow-lg">{['打开手机 Wi-Fi', '选择 RideLux_8888', '输入密码或扫码连接'].map((title, i) => <div key={title} className="relative flex flex-1 items-center justify-center"><span className="z-10 mr-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9B87F] text-xs font-bold text-black">{i + 1}</span><span className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2A3448] bg-[#1A2232]">{i === 0 ? <SmartphoneCharging size={20} /> : i === 1 ? <ListVideo size={20} /> : <QrCode size={20} />}</span><span><p className="text-sm">{title}</p><p className="text-[10px] text-[#8B94A5]">轻松连接车内高速网络</p></span></div>)}</Panel>
      <Panel className="flex flex-1 flex-col justify-center rounded-3xl p-6"><div className="mb-6 flex items-center justify-between px-2"><span className="text-[#8B94A5]">系统与舒适控制</span><ChevronRight size={18} className="text-[#8B94A5]" /></div><div className="flex items-center justify-around">{[['空调温度', '24.0°C', Thermometer], ['座椅调节', '通风·加热', Car], ['氛围灯', '柔和模式', Sun], ['窗帘控制', '全关', Grid3X3], ['隐私模式', '关闭', Lock]].map(([title, desc, Icon], i) => <React.Fragment key={title}><ToolButton icon={Icon} title={title} desc={desc} />{i < 4 && <Divider />}</React.Fragment>)}</div></Panel>
    </div>
  );
}

function WifiButton({ icon: Icon, children }) {
  return <button className="flex flex-1 items-center justify-center rounded-xl border border-[#2A3448] py-3 text-sm text-[#8B94A5] transition-colors hover:border-[#D9B87F]/50 hover:text-[#D9B87F]"><Icon className="mr-2 h-4 w-4" />{children}</button>;
}

function SettingsScreen({ time }) {
  return (
    <div className="flex h-full flex-col animate-fade-in">
      <TopBar title="设置" subtitle="调整车内体验、隐私与偏好" time={time} />
      <div className="grid flex-1 grid-cols-3 gap-6">
        {[
          { icon: SlidersHorizontal, title: '舒适偏好', desc: '空调、座椅、香氛模式' },
          { icon: ShieldCheck, title: '隐私安全', desc: '隐私模式与服务记录' },
          { icon: Languages, title: '语言设置', desc: '中文 / English / 日本語' },
          { icon: VolumeX, title: '静音策略', desc: '来电、提示音与媒体音量' },
          { icon: Lightbulb, title: '氛围灯', desc: '柔和金色，亮度 65%' },
          { icon: RefreshCw, title: '同步状态', desc: '车机数据实时同步中' }
        ].map((item) => (
          <Panel key={item.title} className="group flex flex-col justify-between rounded-3xl p-8 transition-colors hover:border-[#D9B87F]/40">
            <item.icon size={36} className="text-[#D9B87F]" />
            <div><h3 className="mb-2 text-2xl font-medium">{item.title}</h3><p className="text-sm text-[#8B94A5]">{item.desc}</p></div>
            <ChevronRight size={22} className="self-end text-[#8B94A5] transition-colors group-hover:text-[#D9B87F]" />
          </Panel>
        ))}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
