import { HomeIcon, BellIcon, InfoIcon, MapPinIcon } from '../components/Icons';

const WalletIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
    <circle cx="17" cy="15" r="1.2" />
  </svg>
);

const CoinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M15 8.5H10.5a2.5 2.5 0 000 5H13a2.5 2.5 0 010 5H8" />
    <path d="M12 6.5v11" />
  </svg>
);

export const MENU_ITEMS = [
  { icon: <HomeIcon />, labelKey: "home" },
  { icon: <BellIcon />, labelKey: "orders" },
  { icon: <WalletIcon />, labelKey: "balanceHistory" },
  { icon: <CoinIcon />, labelKey: "cashbackProgram" },
  { icon: <InfoIcon />, labelKey: "aboutUs" },
  { icon: <MapPinIcon />, labelKey: "branches" },
];
