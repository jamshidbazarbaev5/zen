import { useTranslation } from 'react-i18next';
import { styles } from '../styles';
import { CloseIcon, GlobeIcon, PaletteIcon } from './Icons';
import { MENU_ITEMS } from '../data/menuItems';
import { LANGUAGES } from '../data/constants';
import QrCodeCard from './QrCodeCard';

interface Props {
  selectedLanguage: string;
  theme: "light" | "dark";
  qrPayload?: string | null;
  userName?: string | null;
  onClose: () => void;
  onBranchOpen: () => void;
  onLanguageOpen: () => void;
  onToggleTheme: () => void;
  onNotifications: () => void;
  onContact: () => void;
  onAbout: () => void;
  onBalanceHistory: () => void;
  onCashback: () => void;
}

const MenuSidebar = ({ selectedLanguage, theme, qrPayload, userName, onClose, onBranchOpen, onLanguageOpen, onToggleTheme, onNotifications, onContact, onAbout, onBalanceHistory, onCashback }: Props) => {
  const { t } = useTranslation();
  
  return (
  <div style={styles.menuOverlay} onClick={onClose}>
    <div style={styles.menuPanel} className="menu-panel" onClick={(e) => e.stopPropagation()}>
      <div style={styles.menuHeader}>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "var(--text-primary, #222)" }}>{t('menu')}</h2>
        <button style={styles.menuCloseBtn} onClick={onClose}><CloseIcon /></button>
      </div>

      {qrPayload && (
        <div style={{ padding: "0 12px" }}>
          <QrCodeCard payload={qrPayload} userName={userName} />
        </div>
      )}

      <div style={styles.menuList}>
        {MENU_ITEMS.map((item, i) => (
          <div key={i}>
            <button
              style={styles.menuItem}
              onClick={() => {
                if (item.labelKey === "branches") {
                  onBranchOpen();
                } else if (item.labelKey === "orders") {
                  onNotifications();
                  return;
                } else if (item.labelKey === "contactUs") {
                  onContact();
                  return;
                } else if (item.labelKey === "aboutUs") {
                  onAbout();
                  return;
                } else if (item.labelKey === "balanceHistory") {
                  onBalanceHistory();
                  return;
                } else if (item.labelKey === "cashbackProgram") {
                  onCashback();
                  return;
                }
                onClose();
              }}
            >
              <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              <span style={{ fontSize: 17, color: "var(--text-primary, #222)" }}>{t(item.labelKey)}</span>
            </button>
            {i < MENU_ITEMS.length - 1 && <div style={styles.menuDivider} />}
          </div>
        ))}
        <div style={styles.menuDivider} />
        <div style={styles.menuItemRow} onClick={() => { onLanguageOpen(); onClose(); }}>
          <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}><GlobeIcon /></span>
          <span style={{ fontSize: 17, color: "var(--text-primary, #222)", flex: 1 }}>{t('language')}</span>
          <span style={{ fontSize: 15, color: "var(--text-muted, #999)" }}>
            {LANGUAGES.find(l => l.code === selectedLanguage)?.name}
          </span>
        </div>
        <div style={styles.menuDivider} />
        <div style={{ ...styles.menuItemRow, cursor: "pointer" }} onClick={onToggleTheme}>
          <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}><PaletteIcon /></span>
          <span style={{ fontSize: 17, color: "var(--text-primary, #222)", flex: 1 }}>{t('theme')}</span>
          <span style={{ fontSize: 15, color: "var(--text-muted, #999)" }}>{theme === "light" ? t('light') : t('dark')}</span>
        </div>
      </div>
      
      {/* Contact Button at Bottom */}
      <div style={{ marginTop: 'auto', padding: '16px' }}>
        <button
          onClick={() => { onContact(); onClose(); }}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: 12,
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          {t('contactUs')}
        </button>
      </div>
    </div>
  </div>
);
};

export default MenuSidebar;
