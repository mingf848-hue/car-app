const START = [114.411265, 38.067183];
const END = [114.471381, 38.042531];
const fallbackRoute = [
  [114.411265, 38.067183], [114.413521, 38.066422], [114.416817, 38.065164],
  [114.421241, 38.063579], [114.428968, 38.061344], [114.437702, 38.058843],
  [114.446991, 38.056120], [114.456201, 38.052945], [114.463372, 38.049188],
  [114.468120, 38.045812], [114.471381, 38.042531]
];

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
  route: makeRoute({
    coords: fallbackRoute,
    distance: estimateDistance(fallbackRoute),
    duration: estimateDistance(fallbackRoute) / 8.5,
    source: 'fallback',
    destination: { name: '新百广场', lng: END[0], lat: END[1] },
    instruction: '沿路线行驶'
  })
};

const memory = globalThis.__RIDELUX_MEMORY__ || { state: defaultState, clients: new Set() };
globalThis.__RIDELUX_MEMORY__ = memory;

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (req.method === 'GET' && pathname === '/api/events') return handleEvents(req, res);

    if (req.method === 'GET' && pathname === '/api/state') {
      return sendJson(res, 200, publicState());
    }

    if (req.method === 'POST' && pathname === '/api/service-request') {
      const body = await readBody(req);
      const item = {
        id: randomId(),
        label: body.label || '乘客请求',
        type: body.type || 'service',
        detail: body.detail || '',
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      memory.state.requests.unshift(item);
      memory.state.notifications.unshift(makeNotification(`新乘客请求：${item.label}`));
      broadcast('request', item);
      broadcast('state', publicState());
      return sendJson(res, 200, item);
    }

    const statusMatch = pathname.match(/^\/api\/service-request\/([^/]+)\/status$/);
    if (req.method === 'POST' && statusMatch) {
      const body = await readBody(req);
      const item = memory.state.requests.find((request) => request.id === statusMatch[1]);
      if (!item) return sendJson(res, 404, { error: 'request not found' });
      item.status = body.status || item.status;
      item.driverNote = body.driverNote || item.driverNote || '';
      item.updatedAt = Date.now();
      memory.state.notifications.unshift(makeNotification(`司机已更新请求「${item.label}」：${item.status}`));
      broadcast('request-status', item);
      broadcast('state', publicState());
      return sendJson(res, 200, item);
    }

    if (req.method === 'POST' && pathname === '/api/settings') {
      const body = await readBody(req);
      memory.state.settings = { ...memory.state.settings, ...body };
      broadcast('state', publicState());
      return sendJson(res, 200, memory.state.settings);
    }

    if (req.method === 'POST' && pathname === '/api/route/default') {
      const route = await calculateRoute(START, END, '新百广场');
      memory.state.route = route;
      memory.state.notifications.unshift(makeNotification(`司机已下发新路线：${route.destination.name}`));
      broadcast('route', route);
      broadcast('state', publicState());
      return sendJson(res, 200, route);
    }

    if (req.method === 'POST' && pathname === '/api/route') {
      const body = await readBody(req);
      const destination = body.destination;
      if (!destination?.lng || !destination?.lat) return sendJson(res, 400, { error: 'destination.lng and destination.lat are required' });
      const start = Array.isArray(body.start) ? body.start : START;
      const route = await calculateRoute(start, [Number(destination.lng), Number(destination.lat)], destination.name || '目的地');
      memory.state.route = route;
      memory.state.notifications.unshift(makeNotification(`司机已下发新路线：${route.destination.name}`));
      broadcast('route', route);
      broadcast('state', publicState());
      return sendJson(res, 200, route);
    }

    if (req.method === 'GET' && pathname === '/api/geocode') {
      const q = url.searchParams.get('q');
      if (!q) return sendJson(res, 400, { error: 'q is required' });
      const results = await geocode(q);
      return sendJson(res, 200, { results });
    }

    if (req.method === 'GET' && pathname === '/api/restaurants') {
      const lat = Number(url.searchParams.get('lat'));
      const lng = Number(url.searchParams.get('lng'));
      if (!lat || !lng) return sendJson(res, 400, { error: 'lat and lng are required' });
      return sendJson(res, 200, { restaurants: await restaurantsNear(lat, lng) });
    }

    if (req.method === 'GET' && pathname === '/api/weather') {
      const lat = Number(url.searchParams.get('lat'));
      const lng = Number(url.searchParams.get('lng'));
      if (!lat || !lng) return sendJson(res, 400, { error: 'lat and lng are required' });
      const weather = await fetchJson(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`);
      return sendJson(res, 200, weather);
    }

    if (req.method === 'GET' && pathname === '/api/music') {
      const term = encodeURIComponent(url.searchParams.get('term') || 'lofi jazz');
      const data = await fetchJson(`https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=18`);
      return sendJson(res, 200, { tracks: (data.results || []).filter((track) => track.previewUrl) });
    }

    if (req.method === 'GET' && pathname === '/api/news') {
      const query = encodeURIComponent(url.searchParams.get('q') || 'electric vehicle OR travel OR technology');
      const data = await fetchJson(`https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=ArtList&format=json&maxrecords=12&sort=HybridRel`);
      return sendJson(res, 200, { articles: data.articles || [] });
    }

    if (req.method === 'GET' && pathname === '/api/jokes') {
      const data = await fetchJson('https://official-joke-api.appspot.com/jokes/ten');
      return sendJson(res, 200, { jokes: Array.isArray(data) ? data : [] });
    }

    if (req.method === 'GET' && pathname === '/api/videos') {
      return sendJson(res, 200, {
        videos: [
          {
            title: 'Big Buck Bunny',
            description: 'Open movie sample video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop'
          },
          {
            title: 'Sintel',
            description: 'Open movie sample video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            poster: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=800&auto=format&fit=crop'
          },
          {
            title: 'Tears of Steel',
            description: 'Open movie sample video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop'
          }
        ]
      });
    }

    if (req.method === 'POST' && pathname === '/api/ai') {
      const body = await readBody(req);
      const answer = await askGemini(body.message, body.context);
      return sendJson(res, 200, { answer });
    }

    return sendJson(res, 404, { error: 'Not found' });
  } catch (error) {
    return sendJson(res, error.status || 500, { error: error.message || 'Internal server error' });
  }
}

function handleEvents(req, res) {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive'
  });
  const writeState = () => {
    res.write(`event: state\ndata: ${JSON.stringify(publicState())}\n\n`);
  };
  writeState();
  const timer = setInterval(writeState, 2500);
  memory.clients.add(res);
  req.on('close', () => {
    clearInterval(timer);
    memory.clients.delete(res);
  });
}

function publicState() {
  return {
    requests: memory.state.requests,
    notifications: memory.state.notifications.slice(0, 20),
    settings: memory.state.settings,
    route: memory.state.route
  };
}

function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of memory.clients) {
    try {
      client.write(payload);
    } catch {
      memory.clients.delete(client);
    }
  }
}

async function calculateRoute(start, end, destinationName) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson&steps=true`;
  try {
    const data = await fetchJson(url);
    const route = data.routes?.[0];
    if (!route?.geometry?.coordinates?.length) throw new Error('no route');
    return makeRoute({
      coords: route.geometry.coordinates,
      distance: route.distance,
      duration: route.duration,
      source: 'osrm',
      destination: { name: destinationName, lng: end[0], lat: end[1] },
      instruction: firstInstruction(route)
    });
  } catch {
    return makeRoute({
      coords: fallbackRoute,
      distance: estimateDistance(fallbackRoute),
      duration: estimateDistance(fallbackRoute) / 8.5,
      source: 'fallback',
      destination: { name: destinationName, lng: end[0], lat: end[1] },
      instruction: '沿路线行驶'
    });
  }
}

function makeRoute({ coords, distance, duration, source, destination, instruction }) {
  return {
    id: randomId(),
    start: { name: '良城逸园', lng: START[0], lat: START[1] },
    destination,
    coords,
    distance,
    duration,
    source,
    instruction: instruction || '沿路线行驶',
    updatedAt: Date.now()
  };
}

async function geocode(query) {
  const data = await fetchJson(`https://nominatim.openstreetmap.org/search?format=json&limit=8&q=${encodeURIComponent(query)}`, {
    headers: { 'User-Agent': 'RideLuxCarApp/1.0' }
  });
  return data.map((item) => ({
    name: item.display_name,
    lat: Number(item.lat),
    lng: Number(item.lon)
  }));
}

async function restaurantsNear(lat, lng) {
  const query = `
    [out:json][timeout:18];
    (
      node["amenity"~"restaurant|cafe|fast_food"](around:1800,${lat},${lng});
      way["amenity"~"restaurant|cafe|fast_food"](around:1800,${lat},${lng});
    );
    out center 24;
  `;
  const data = await fetchJson('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'User-Agent': 'RideLuxCarApp/1.0'
    },
    body: `data=${encodeURIComponent(query)}`
  });
  return (data.elements || []).map((item) => {
    const itemLat = item.lat ?? item.center?.lat;
    const itemLng = item.lon ?? item.center?.lon;
    return {
      id: item.id,
      name: item.tags?.name || item.tags?.['name:zh'] || '未命名餐厅',
      cuisine: item.tags?.cuisine || item.tags?.amenity || 'restaurant',
      address: [item.tags?.['addr:street'], item.tags?.['addr:housenumber']].filter(Boolean).join(' '),
      lat: itemLat,
      lng: itemLng,
      distance: itemLat && itemLng ? Math.round(haversine([lng, lat], [itemLng, itemLat])) : null
    };
  }).filter((item) => item.lat && item.lng).sort((a, b) => (a.distance || 99999) - (b.distance || 99999));
}

async function askGemini(message, context = '') {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) {
    const err = new Error('GEMINI_API_KEY is not set');
    err.status = 503;
    throw err;
  }
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const data = await fetchJson(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': key
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `你是豪华网约车 RideLux 的中文车载 AI 管家。回答要简洁、可执行、贴合乘客旅程。\n上下文：${context}\n用户：${message || ''}`
        }]
      }]
    })
  });
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n').trim() || 'Gemini 没有返回文本。';
}

function firstInstruction(route) {
  const step = route.legs?.[0]?.steps?.[0];
  if (!step) return '沿路线行驶';
  return `沿 ${step.name || '当前道路'} 行驶`;
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

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return req.body ? JSON.parse(req.body) : {};
  let body = '';
  for await (const chunk of req) body += chunk;
  return body ? JSON.parse(body) : {};
}

function sendJson(res, status, data) {
  setCors(res);
  res.status(status).json(data);
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function makeNotification(text) {
  return { id: randomId(), text, createdAt: Date.now(), read: false };
}

function randomId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
