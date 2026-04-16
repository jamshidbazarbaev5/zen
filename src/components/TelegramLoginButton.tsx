import { useEffect, useRef } from 'react';
import type { TelegramLoginData } from '../api';

const BOT_USERNAME = 'zencoffee_bot';

interface Props {
  onAuth: (user: TelegramLoginData) => void;
}

/**
 * Parse Telegram auth data from URL query params after redirect.
 * Telegram appends: ?id=...&first_name=...&auth_date=...&hash=...
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
  if (params.get('phone_number')) data.phone_number = params.get('phone_number')!;

  // Clean URL after reading params
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

  // Render widget with redirect mode
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', window.location.origin + '/');
    script.setAttribute('data-request-access', 'write');

    containerRef.current?.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }} />;
};

export default TelegramLoginButton;
