import { styles } from '../styles';
import { CloseIcon, GlobeIcon, PaletteIcon, PhoneIcon } from './Icons';
import { MENU_ITEMS } from '../data/menuItems';
import { LANGUAGES } from '../data/constants';

interface Props {
  selectedLanguage: string;
  theme: "light" | "dark";
  onClose: () => void;
  onBranchOpen: () => void;
  onLanguageOpen: () => void;
  onToggleTheme: () => void;
  onNotifications: () => void;
}

const MenuSidebar = ({ selectedLanguage, theme, onClose, onBranchOpen, onLanguageOpen, onToggleTheme, onNotifications }: Props) => (
  <div style={styles.menuOverlay} onClick={onClose}>
    <div style={styles.menuPanel} className="menu-panel" onClick={(e) => e.stopPropagation()}>
      <div style={styles.menuHeader}>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "var(--text-primary, #222)" }}>Menyu</h2>
        <button style={styles.menuCloseBtn} onClick={onClose}><CloseIcon /></button>
      </div>
      <div style={styles.menuList}>
        {MENU_ITEMS.map((item, i) => (
          <div key={i}>
            <button
              style={styles.menuItem}
              onClick={() => {
                if (item.label === "Filiallar") {
                  onBranchOpen();
                } else if (item.label === "Xabarnoma") {
                  onNotifications();
                  return;
                }
                onClose();
              }}
            >
              <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              <span style={{ fontSize: 17, color: "var(--text-primary, #222)" }}>{item.label}</span>
            </button>
            {i < MENU_ITEMS.length - 1 && <div style={styles.menuDivider} />}
          </div>
        ))}
        <div style={styles.menuDivider} />
        <div style={styles.menuItemRow} onClick={() => { onLanguageOpen(); onClose(); }}>
          <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}><GlobeIcon /></span>
          <span style={{ fontSize: 17, color: "var(--text-primary, #222)", flex: 1 }}>Til</span>
          <span style={{ fontSize: 15, color: "var(--text-muted, #999)" }}>
            {LANGUAGES.find(l => l.code === selectedLanguage)?.name}
          </span>
        </div>
        <div style={styles.menuDivider} />
        <div style={{ ...styles.menuItemRow, cursor: "pointer" }} onClick={onToggleTheme}>
          <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}><PaletteIcon /></span>
          <span style={{ fontSize: 17, color: "var(--text-primary, #222)", flex: 1 }}>Mavzu</span>
          <span style={{ fontSize: 15, color: "var(--text-muted, #999)" }}>{theme === "light" ? "Kunduzgi" : "Tungi"}</span>
        </div>
        <div style={styles.menuDivider} />
        <div style={styles.menuItemRow}>
          <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}><PhoneIcon /></span>
          <span style={{ fontSize: 17, color: "var(--text-primary, #222)" }}>+998 71 200 22 11</span>
        </div>
      </div>
    </div>
  </div>
);

export default MenuSidebar;
