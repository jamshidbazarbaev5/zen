import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { styles } from '../styles';
import { ArrowLeftIcon } from '../components/Icons';
import api from '../api';

interface Props {
  onBack: () => void;
  businessInfo: { phone: string; instagram_url: string } | null;
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill={filled ? "var(--accent)" : "none"} stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const ContactScreen = ({ onBack, businessInfo }: Props) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError(t('pleaseSelectRating'));
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await api.post('/orders/review/', {
        rating,
        comment: comment.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data ? JSON.stringify(err.response.data) : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "0 16px", minHeight: "80vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0 20px" }}>
        <button style={styles.backBtn} onClick={onBack}><ArrowLeftIcon /></button>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "var(--text-primary)", letterSpacing: -0.5 }}>{t('contactUs')}</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 100 }}>
        {/* Contact Info */}
        {businessInfo && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {businessInfo.phone && (
              <a
                href={`tel:${businessInfo.phone}`}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "18px 20px", background: "var(--card-bg, var(--bg-primary))", borderRadius: 14,
                  border: "1px solid var(--border-color)", textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                className="contact-link"
              >
                <div style={{ color: "var(--accent)", display: "flex", alignItems: "center" }}>
                  <PhoneIcon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>{t('phone')}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>{businessInfo.phone}</div>
                </div>
              </a>
            )}
            {businessInfo.instagram_url && (
              <a
                href={businessInfo.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "18px 20px", background: "var(--card-bg, var(--bg-primary))", borderRadius: 14,
                  border: "1px solid var(--border-color)", textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                className="contact-link"
              >
                <div style={{ color: "var(--accent)", display: "flex", alignItems: "center" }}>
                  <InstagramIcon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>{t('instagram')}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>{businessInfo.instagram_url.split('/').filter(Boolean).pop()}</div>
                </div>
              </a>
            )}
          </div>
        )}

        {/* Rating Section */}
        <div style={{
          padding: "24px 20px", background: "var(--card-bg, var(--bg-primary))",
          borderRadius: 14, border: "1px solid var(--border-color)",
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px", color: "var(--text-primary)" }}>
            {t('rateOurService')}
          </h3>

          {success ? (
            <div style={{
              padding: "20px", background: "var(--accent)", borderRadius: 12,
              color: "#fff", textAlign: "center", fontSize: 15, fontWeight: 600,
            }}>
              {t('thankYouForRating')}
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      padding: 4, transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <StarIcon filled={star <= rating} />
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('addComment')}
                style={{
                  width: "100%", minHeight: 100, padding: "12px 14px",
                  borderRadius: 10, border: "1.5px solid var(--border-color)",
                  background: "var(--bg-secondary)", color: "var(--text-primary)",
                  fontSize: 14, fontFamily: "inherit", resize: "vertical",
                  outline: "none", boxSizing: "border-box",
                }}
              />

              <button
                onClick={handleSubmit}
                disabled={submitting || rating === 0}
                style={{
                  width: "100%", padding: "14px", marginTop: 16,
                  borderRadius: 12, border: "none",
                  background: rating === 0 ? "var(--bg-secondary)" : "var(--accent)",
                  color: rating === 0 ? "var(--text-muted)" : "#fff",
                  fontSize: 16, fontWeight: 600,
                  cursor: rating === 0 || submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? t('sending') : t('submitRating')}
              </button>

              {error && (
                <div style={{
                  marginTop: 12, padding: 12, background: "var(--bg-secondary)",
                  borderRadius: 10, color: "var(--text-secondary)", fontSize: 13,
                }}>
                  {error}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .contact-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ContactScreen;
