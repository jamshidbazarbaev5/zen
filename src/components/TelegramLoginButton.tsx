import { useEffect, useRef } from 'react';
import type { TelegramLoginData } from '../api';

const BOT_USERNAME = 'zen-lake.vercel.app';

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

  useEffect(() => {
    window.onTelegramLoginAuth = onAuth;

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

  return <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }} />;
};

export default TelegramLoginButton;
