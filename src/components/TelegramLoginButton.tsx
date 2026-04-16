import { useEffect, useRef } from 'react';
import type { TelegramLoginData } from '../api';

const BOT_USERNAME = 'zencoffee_bot';
const AUTH_REDIRECT_URL = window.location.origin + '/';

interface Props {
  onAuth: (user: TelegramLoginData) => void;
}

/**
 * Parse Telegram auth data from URL query params after redirect.
 * Telegram redirects to: AUTH_URL?id=...&first_name=...&hash=...
 */
export function parseTelegramAuthFromUrl(): TelegramLoginData | null {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const hash = params.get('hash');
  const auth_date = params.get('auth_date');

  if (!id || !hash || !auth_date) return null;

  const data: TelegramLoginData = {
    id: Number(id),
    first_name: params.get('first_name') || '',
    auth_date: Number(auth_date),
    hash,
  };

  if (params.get('last_name')) data.last_name = params.get('last_name')!;
  if (params.get('username')) data.username = params.get('username')!;
  if (params.get('photo_url')) data.photo_url = params.get('photo_url')!;

  // Clean URL
  window.history.replaceState(null, '', window.location.pathname);

  return data;
}

const TelegramLoginButton = ({ onAuth }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for redirect auth data on mount
  useEffect(() => {
    const data = parseTelegramAuthFromUrl();
    if (data) {
      console.log('Telegram auth from redirect:', data);
      onAuth(data);
    }
  }, []);

  // Render the official Telegram widget with redirect mode
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?23';
    script.async = true;
    script.setAttribute('data-telegram-login', BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', AUTH_REDIRECT_URL);
    script.setAttribute('data-request-access', 'write');

    containerRef.current.appendChild(script);
  }, []);

  return <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }} />;
};

export default TelegramLoginButton;
