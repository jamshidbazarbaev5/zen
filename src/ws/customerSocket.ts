type EventType = 'connected' | 'order_updated' | 'balance_updated';
type Listener = (data: any) => void;

const listeners: Record<EventType, Set<Listener>> = {
  connected: new Set(),
  order_updated: new Set(),
  balance_updated: new Set(),
};

let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectDelay = 1000;
let desiredOpen = false;

const WS_URL = 'wss://zen-coffee.uz/ws/customer/';

function emit(type: EventType, data: any) {
  listeners[type].forEach((fn) => {
    try { fn(data); } catch (e) { console.error('ws listener error', e); }
  });
}

function scheduleReconnect() {
  if (reconnectTimer || !desiredOpen) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, reconnectDelay);
  reconnectDelay = Math.min(reconnectDelay * 2, 30000);
}

function connect() {
  const token = localStorage.getItem('access_token');
  if (!token) return;
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

  try {
    ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
  } catch (e) {
    console.error('ws connect failed', e);
    scheduleReconnect();
    return;
  }

  ws.onopen = () => {
    reconnectDelay = 1000;
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg && typeof msg.type === 'string' && msg.type in listeners) {
        emit(msg.type as EventType, msg.data);
      }
    } catch (e) {
      console.error('ws parse error', e);
    }
  };

  ws.onerror = (e) => {
    console.error('ws error', e);
  };

  ws.onclose = () => {
    ws = null;
    if (desiredOpen) scheduleReconnect();
  };
}

export function startCustomerSocket() {
  desiredOpen = true;
  connect();
}

export function stopCustomerSocket() {
  desiredOpen = false;
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  if (ws) { ws.close(); ws = null; }
}

export function subscribe(type: EventType, fn: Listener): () => void {
  listeners[type].add(fn);
  return () => { listeners[type].delete(fn); };
}
