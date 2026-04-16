import { useEffect } from 'react';
import type { TelegramLoginData } from '../api';

const BOT_ID = '8339060489';

interface Props {
  onAuth: (user: TelegramLoginData) => void;
}

/**
 * Parse Telegram auth data from URL query params after redirect.
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

  // Clean URL
  window.history.replaceState(null, '', window.location.pathname);

  return data;
}

const TelegramLoginButton = ({ onAuth }: Props) => {
  // Check for redirect auth data on mount
  useEffect(() => {
    const data = parseTelegramAuthFromUrl();
    if (data) {
      console.log('Telegram auth from redirect:', data);
      onAuth(data);
    }
  }, []);

  const handleLogin = () => {
    const returnUrl = window.location.origin + '/';
    // Direct redirect — no popup, no embed
    window.location.href = `https://oauth.telegram.org/auth?bot_id=${BOT_ID}&origin=${encodeURIComponent(returnUrl)}&request_access=write&return_to=${encodeURIComponent(returnUrl)}`;
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 28px',
        background: '#54a9eb',
        color: '#fff',
        border: 'none',
        borderRadius: 10,
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 3.98-1.73 6.64-2.87 7.97-3.44 3.79-1.58 4.58-1.86 5.1-1.87.11 0 .37.03.53.17.14.12.18.28.2.47-.01.06.01.24 0 .38z"/>
      </svg>
      Log in with Telegram
    </button>
  );
};

export default TelegramLoginButton;
