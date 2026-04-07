declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
          };
        };
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

export function isTelegram(): boolean {
  return !!window.Telegram?.WebApp?.initData;
}

export function getInitData(): string {
  return window.Telegram?.WebApp?.initData ?? "";
}

export function getPhotoUrl(): string | null {
  return window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url ?? null;
}
