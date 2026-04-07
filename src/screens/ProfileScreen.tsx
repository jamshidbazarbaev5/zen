import { useState, useEffect } from "react";
import { styles } from '../styles';
import { ArrowLeftIcon } from '../components/Icons';
import { getMyProfile } from '../api';
import { formatPrice } from '../utils/formatPrice';
import type { CustomerProfile } from '../types';

interface Props {
  onBack: () => void;
  photoUrl: string | null;
}

const ProfileScreen = ({ onBack, photoUrl }: Props) => {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch((err) => setError(err?.response?.data ? JSON.stringify(err.response.data) : err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0" }}>
        <button style={styles.backBtn} onClick={onBack}><ArrowLeftIcon /></button>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "var(--text-primary, #222)" }}>Profil</h2>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted, #999)" }}>
          <p>Yuklanmoqda...</p>
        </div>
      ) : error ? (
        <div style={{ padding: 16, background: "#fee", borderRadius: 12, color: "#c62828", fontSize: 13 }}>
          {error}
        </div>
      ) : profile ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 20 }}>
          <div style={{
            width: 90, height: 90, borderRadius: "50%", overflow: "hidden",
            background: "var(--border-color, #eee)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {photoUrl ? (
              <img src={photoUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 36, color: "var(--text-muted, #999)" }}>👤</span>
            )}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary, #222)" }}>{profile.name}</div>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
            <InfoRow label="Telefon" value={profile.phone || "Ko'rsatilmagan"} />
            <InfoRow label="Balans" value={`${formatPrice(Number(profile.balance))} so'm`} />
            <InfoRow label="Umumiy xarid" value={`${formatPrice(Number(profile.total_spent))} so'm`} />
            <InfoRow label="Til" value={profile.lang === "uz" ? "O'zbek" : profile.lang === "ru" ? "Русский" : profile.lang === "en" ? "English" : profile.lang} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 16px", background: "var(--card-bg, #fff)", borderRadius: 12,
    border: "1px solid var(--border-color, #eee)",
  }}>
    <span style={{ fontSize: 15, color: "var(--text-secondary, #666)" }}>{label}</span>
    <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary, #222)" }}>{value}</span>
  </div>
);

export default ProfileScreen;
