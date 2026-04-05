import { styles } from '../styles';
import { ArrowLeftIcon, BellIcon } from '../components/Icons';

interface Props {
  onBack: () => void;
}

const NOTIFICATIONS = [
  { icon: "📦", title: "Buyurtma tayyor", message: "Sizning #1234 raqamli buyurtmangiz tayyor.", time: "5 daqiqa oldin" },
  { icon: "🎉", title: "Maxsus aksiya!", message: "Bugun barcha kofe turlariga 20% chegirma!", time: "1 soat oldin" },
  { icon: "🚚", title: "Yetkazib berish", message: "Kuryer yo'lda. Taxminiy vaqt: 15 daqiqa.", time: "2 soat oldin" },
  { icon: "⭐", title: "Yangi mahsulot", message: "Yangi Matcha Latte menyu'ga qo'shildi!", time: "Kecha" },
];

const NotificationsScreen = ({ onBack }: Props) => (
  <div style={{ padding: "0 16px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0" }}>
      <button style={styles.backBtn} onClick={onBack}><ArrowLeftIcon /></button>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "var(--text-primary, #222)" }}>Bildirishnomalar</h2>
    </div>
    {NOTIFICATIONS.length === 0 ? (
      <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted, #999)" }}>
        <BellIcon />
        <p style={{ marginTop: 12, fontSize: 15 }}>Bildirishnomalar yo'q</p>
      </div>
    ) : (
      <div>
        {NOTIFICATIONS.map((n, i) => (
          <div key={i} style={{
            display: "flex", gap: 14, padding: "16px 0",
            borderBottom: i < NOTIFICATIONS.length - 1 ? "1px solid var(--border-color, #eee)" : "none"
          }}>
            <div style={{ fontSize: 28, lineHeight: 1 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary, #222)", marginBottom: 4 }}>{n.title}</div>
              <div style={{ fontSize: 14, color: "var(--text-secondary, #666)", lineHeight: 1.4 }}>{n.message}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted, #999)", marginTop: 6 }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default NotificationsScreen;
