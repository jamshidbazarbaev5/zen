import { useEffect, useRef } from 'react';
import type { TelegramLoginData } from '../api';

const BOT_USERNAME = 'zencoffee_bot';

declare global {
  interface Window {
    onTelegramLoginAuth?: (user: TelegramLoginData) => void;
  }
}

interface Props {
  onAuth: (user: TelegramLoginData) => void;
}

const TelegramLoginButton = ({ onAuth }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle callback from widget (popup stays open, posts back)
  useEffect(() => {
    window.onTelegramLoginAuth = (user) => {
      console.log('Telegram widget callback fired:', user);
      onAuth(user);
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramLoginAuth(user)');
    script.setAttribute('data-request-access', 'write');

    containerRef.current?.appendChild(script);

    return () => {
      delete window.onTelegramLoginAuth;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [onAuth]);

  // Handle redirect-based auth (tgAuthResult in URL hash after page reload)
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (!hash.includes('tgAuthResult=')) return;

      try {
        const match = hash.match(/tgAuthResult=([^&]+)/);
        if (match?.[1]) {
          const base64 = decodeURIComponent(match[1]);
          const json = atob(base64);
          const data: TelegramLoginData = JSON.parse(json);
          console.log('Telegram auth from URL hash:', data);
          if (data.id && data.hash) {
            onAuth(data);
          }
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch (e) {
        console.error('Failed to parse tgAuthResult:', e);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [onAuth]);

  return <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }} />;
};

export default TelegramLoginButton;
