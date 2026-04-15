import { useTranslation } from 'react-i18next';
import { styles } from '../styles';
import { ArrowLeftIcon } from '../components/Icons';

interface Props {
  onBack: () => void;
}

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const AboutScreen = ({ onBack }: Props) => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "0 16px", minHeight: "80vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0 20px" }}>
        <button style={styles.backBtn} onClick={onBack}><ArrowLeftIcon /></button>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "var(--text-primary)", letterSpacing: -0.5 }}>{t('aboutUs')}</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 100 }}>
        {/* Hero Section */}
        <div style={{
          padding: "28px 24px", background: "var(--accent)", borderRadius: 16,
          textAlign: "center", color: "#fff",
        }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 12px", letterSpacing: -1 }}>ZEN</h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
            {t('aboutTagline')}
          </p>
        </div>

        {/* Info Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Hours */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "18px 20px", background: "var(--card-bg, var(--bg-primary))", borderRadius: 14,
            border: "1px solid var(--border-color)",
          }}>
            <div style={{ color: "var(--accent)", display: "flex", alignItems: "center" }}>
              <ClockIcon />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>{t('workingHours')}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>{t('open247')}</div>
            </div>
          </div>

          {/* Address */}
          <a
            href="https://maps.google.com/?q=42.4667,59.6167"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "18px 20px", background: "var(--card-bg, var(--bg-primary))", borderRadius: 14,
              border: "1px solid var(--border-color)", textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            className="info-link"
          >
            <div style={{ color: "var(--accent)", display: "flex", alignItems: "center" }}>
              <LocationIcon />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>{t('address')}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
                {t('aboutAddress')}
              </div>
            </div>
          </a>

          {/* Phone */}
          <a
            href="tel:+998907011919"
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "18px 20px", background: "var(--card-bg, var(--bg-primary))", borderRadius: 14,
              border: "1px solid var(--border-color)", textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            className="info-link"
          >
            <div style={{ color: "var(--accent)", display: "flex", alignItems: "center" }}>
              <PhoneIcon />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>{t('phone')}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>+998 (90) 701-19-19</div>
            </div>
          </a>
        </div>
      </div>

      <style>{`
        .info-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default AboutScreen;
