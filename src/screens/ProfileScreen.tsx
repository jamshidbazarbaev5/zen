import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { styles } from '../styles';
import { ArrowLeftIcon, UserIcon } from '../components/Icons';
import { getMyProfile, updateMyProfile } from '../api';
import { formatPrice } from '../utils/formatPrice';
import type { CustomerProfile, BusinessInfo } from '../types';

interface Props {
  onBack: () => void;
  photoUrl: string | null;
  onCashback: () => void;
  onBalanceHistory?: () => void;
  businessInfo: BusinessInfo | null;
}

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ProfileScreen = ({ onBack, photoUrl, onCashback, onBalanceHistory }: Props) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((p) => { setProfile(p); setEditName(p.name); })
      .catch((err) => setError(err?.response?.data ? JSON.stringify(err.response.data) : err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!editName.trim() || !profile) return;
    setSaving(true);
    try {
      const updated = await updateMyProfile({ name: editName.trim() });
      setProfile(updated);
      setEditing(false);
    } catch (err: any) {
      setError(err?.response?.data ? JSON.stringify(err.response.data) : err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "0 16px", minHeight: "80vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0 20px" }}>
        <button style={styles.backBtn} onClick={onBack}><ArrowLeftIcon /></button>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "var(--text-primary)", letterSpacing: -0.5 }}>{t('profile')}</h2>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 30 }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: "var(--bg-secondary)", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ width: 140, height: 20, borderRadius: 8, background: "var(--bg-secondary)", animation: "pulse 1.5s ease-in-out infinite" }} />
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ width: "100%", height: 52, borderRadius: 12, background: "var(--bg-secondary)", animation: "pulse 1.5s ease-in-out infinite", opacity: 1 - i * 0.15 }} />
          ))}
        </div>
      ) : error && !profile ? (
        <div style={{ padding: 16, background: "var(--bg-secondary)", borderRadius: 12, color: "var(--text-secondary)", fontSize: 13 }}>
          {error}
        </div>
      ) : profile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 100 }}>
          {/* Avatar + Name */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, paddingTop: 10, paddingBottom: 6 }}>
            <div style={{
              width: 88, height: 88, borderRadius: "50%", overflow: "hidden",
              background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center",
              border: "3px solid var(--accent)",
            }}>
              {photoUrl ? (
                <img src={photoUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ color: "var(--text-muted)" }}><UserIcon /></div>
              )}
            </div>

            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 10, width: "100%", maxWidth: 320 }}>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  style={{
                    width: "100%", boxSizing: "border-box",
                    fontSize: 18, fontWeight: 600, textAlign: "center",
                    padding: "10px 14px", borderRadius: 10,
                    border: "1.5px solid var(--accent)", background: "var(--bg-secondary)",
                    color: "var(--text-primary)", outline: "none",
                  }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => { setEditing(false); setEditName(profile.name); }}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 10,
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)", color: "var(--text-secondary)",
                      fontSize: 14, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    disabled={saving}
                    onClick={handleSave}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
                      background: "var(--accent)", color: "#fff", fontSize: 14, fontWeight: 600,
                      cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1,
                    }}
                  >
                    {saving ? "..." : t('save')}
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
                onClick={() => setEditing(true)}
              >
                <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>{profile.name}</span>
                <span style={{ color: "var(--text-muted)" }}><EditIcon /></span>
              </div>
            )}
          </div>

          {/* Info rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <InfoRow label={t('phone')} value={profile.phone || t('notSpecified')} />
            <InfoRow
              label={t('balance')}
              value={`${formatPrice(Number(profile.balance))} ${t('som')}`}
              accent
              onClick={onBalanceHistory}
            />
            <InfoRow label={t('totalSpent')} value={`${formatPrice(Number(profile.total_spent))} ${t('som')}`} />
            <InfoRow
              label={t('language')}
              value={profile.lang === "uz" ? "O'zbek" : profile.lang === "ru" ? "Русский" : profile.lang === "en" ? "English" : profile.lang}
            />
          </div>

          {/* Balance history link */}
          {onBalanceHistory && (
            <button
              onClick={onBalanceHistory}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "16px 18px", borderRadius: 14,
                background: "var(--card-bg, var(--bg-primary))",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                color: "var(--text-primary)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{t('balanceHistory')}</span>
              </div>
              <ChevronRight />
            </button>
          )}

          {/* Cashback link */}
          <button
            onClick={onCashback}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "16px 18px", borderRadius: 14,
              background: "var(--accent)", border: "none", cursor: "pointer",
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{t('cashbackProgram')}</span>
            </div>
            <ChevronRight />
          </button>

          {error && (
            <div style={{ padding: 12, background: "var(--bg-secondary)", borderRadius: 10, color: "var(--text-secondary)", fontSize: 12 }}>
              {error}
            </div>
          )}
        </div>
      ) : null}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
  accent,
  onClick,
}: {
  label: string;
  value: string;
  accent?: boolean;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 16px", background: "var(--card-bg, var(--bg-primary))", borderRadius: 12,
      border: "1px solid var(--border-color)",
      cursor: onClick ? "pointer" : "default",
    }}
  >
    <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
    <span style={{ fontSize: 15, fontWeight: 600, color: accent ? "var(--accent)" : "var(--text-primary)" }}>{value}</span>
  </div>
);

export default ProfileScreen;
