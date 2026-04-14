import { Check } from 'lucide-react';
import { styles } from '../styles';
import { CloseIcon, GlobeIcon } from './Icons';
import { LANGUAGES } from '../data/constants';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';

interface Props {
  selectedLanguage: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

const LanguageModal = ({ selectedLanguage, onSelect, onClose }: Props) => {
  const { t } = useTranslation();
  const { updateLanguage } = useUser();

  const handleSelect = async (code: string) => {
    try {
      await updateLanguage(code);
      onSelect(code);
    } catch (error) {
      console.error('Failed to update language:', error);
      // Still update locally even if API fails
      onSelect(code);
    }
  };

  return (
  <div style={styles.modalOverlay} className="modal-overlay" onClick={onClose}>
    <div style={styles.languageModal} className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div style={styles.languageHeader}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>{t('selectLanguage')}</h2>
        <button style={styles.modalCloseBtn} onClick={onClose}><CloseIcon /></button>
      </div>
      <div style={styles.languageList}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            style={selectedLanguage === lang.code ? styles.languageItemActive : styles.languageItem}
            onClick={() => handleSelect(lang.code)}
          >
            <div style={styles.languageIconCircle}>
              <GlobeIcon />
            </div>
            <span style={{ fontSize: 18, fontWeight: selectedLanguage === lang.code ? 600 : 400, flex: 1, textAlign: "left" }}>
              {lang.name}
            </span>
            {selectedLanguage === lang.code && (
              <Check size={24} color="var(--accent)" strokeWidth={2.5} className="check-icon" />
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
);
};

export default LanguageModal;
