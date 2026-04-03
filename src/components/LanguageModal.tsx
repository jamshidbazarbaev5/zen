import { Check } from 'lucide-react';
import { styles } from '../styles';
import { CloseIcon, GlobeIcon } from './Icons';
import { LANGUAGES } from '../data/constants';

interface Props {
  selectedLanguage: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

const LanguageModal = ({ selectedLanguage, onSelect, onClose }: Props) => (
  <div style={styles.modalOverlay} onClick={onClose}>
    <div style={styles.languageModal} onClick={(e) => e.stopPropagation()}>
      <div style={styles.languageHeader}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#222" }}>Tilni tanlang</h2>
        <button style={styles.modalCloseBtn} onClick={onClose}><CloseIcon /></button>
      </div>
      <div style={styles.languageList}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            style={selectedLanguage === lang.code ? styles.languageItemActive : styles.languageItem}
            onClick={() => onSelect(lang.code)}
          >
            <div style={styles.languageIconCircle}>
              <GlobeIcon />
            </div>
            <span style={{ fontSize: 18, fontWeight: selectedLanguage === lang.code ? 600 : 400, flex: 1, textAlign: "left" }}>
              {lang.name}
            </span>
            {selectedLanguage === lang.code && (
              <Check size={24} color="#e74c3c" strokeWidth={2.5} className="check-icon" />
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default LanguageModal;
