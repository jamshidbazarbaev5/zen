import { styles } from '../styles';
import { CloseIcon, GlobeIcon, PaletteIcon, PhoneIcon } from './Icons';
import { MENU_ITEMS } from '../data/menuItems';
import { LANGUAGES } from '../data/constants';

interface Props {
  selectedLanguage: string;
  onClose: () => void;
  onBranchOpen: () => void;
  onLanguageOpen: () => void;
}

const MenuSidebar = ({ selectedLanguage, onClose, onBranchOpen, onLanguageOpen }: Props) => (
  <div style={styles.menuOverlay} onClick={onClose}>
    <div style={styles.menuPanel} onClick={(e) => e.stopPropagation()}>
      <div style={styles.menuHeader}>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "#222" }}>Menyu</h2>
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
                }
                onClose();
              }}
            >
              <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              <span style={{ fontSize: 17, color: "#222" }}>{item.label}</span>
            </button>
            {i < MENU_ITEMS.length - 1 && <div style={styles.menuDivider} />}
          </div>
        ))}
        <div style={styles.menuDivider} />
        <div style={styles.menuItemRow} onClick={() => { onLanguageOpen(); onClose(); }}>
          <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}><GlobeIcon /></span>
          <span style={{ fontSize: 17, color: "#222", flex: 1 }}>Til</span>
          <span style={{ fontSize: 15, color: "#999" }}>
            {LANGUAGES.find(l => l.code === selectedLanguage)?.name}
          </span>
        </div>
        <div style={styles.menuDivider} />
        <div style={styles.menuItemRow}>
          <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}><PaletteIcon /></span>
          <span style={{ fontSize: 17, color: "#222", flex: 1 }}>Mavzu</span>
          <span style={{ fontSize: 15, color: "#999" }}>Kunduzgi</span>
        </div>
        <div style={styles.menuDivider} />
        <div style={styles.menuItemRow}>
          <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}><PhoneIcon /></span>
          <span style={{ fontSize: 17, color: "#222" }}>+998 71 200 22 11</span>
        </div>
      </div>
    </div>
  </div>
);

export default MenuSidebar;
