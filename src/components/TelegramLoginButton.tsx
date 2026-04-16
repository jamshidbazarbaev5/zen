import { useEffect } from 'react';
import type { TelegramLoginData } from '../api';

const BOT_DOMAIN = 'https://zen-coffee.uz';

interface Props {
  onAuth: (user: TelegramLoginData) => void;
}

const TelegramLoginButton = ({ onAuth }: Props) => {
  // Listen for postMessage from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'telegram-login' && event.data.payload) {
        console.log('Telegram auth received:', event.data.payload);
        onAuth(event.data.payload);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAuth]);

  // Encode the HTML as a data URI served under the bot domain won't work,
  // so we create a blob and use it. The widget checks document.location,
  // so we need the page hosted on zen-coffee.uz.
  // Serve this HTML at: https://zen-coffee.uz/telegram-login.html
  const iframeSrc = BOT_DOMAIN + '/telegram-login.html';

  return (
    <iframe
      src={iframeSrc}
      style={{
        border: 'none',
        width: 300,
        height: 60,
        overflow: 'hidden',
      }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    />
  );
};

export default TelegramLoginButton;

/**
 * HOST THIS FILE AT: https://zen-coffee.uz/telegram-login.html
 *
 * Content (copy the WIDGET_HTML above):
 *
 * <!DOCTYPE html>
 * <html>
 * <head>
 *   <meta name="viewport" content="width=device-width, initial-scale=1.0">
 *   <style>
 *     body { display:flex; justify-content:center; align-items:center; height:100vh; margin:0; background:transparent; }
 *   </style>
 * </head>
 * <body>
 *   <script async src="https://telegram.org/js/telegram-widget.js?22"
 *     data-telegram-login="zencoffee_bot"
 *     data-size="large"
 *     data-onauth="onTelegramAuth(user)"
 *     data-request-access="write"></script>
 *   <script>
 *     function onTelegramAuth(user) {
 *       window.parent.postMessage({ type: 'telegram-login', payload: user }, '*');
 *     }
 *   </script>
 * </body>
 * </html>
 */
