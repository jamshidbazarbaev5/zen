import { useState, useEffect } from "react";
import { styles } from '../styles';
import { ArrowLeftIcon } from '../components/Icons';
import { getMyOrders } from '../api';
import { formatPrice } from '../utils/formatPrice';
import type { OrderListItem } from '../types';

interface Props {
  onBack: () => void;
}

const statusLabels: Record<string, string> = {
  pending: "Kutilmoqda",
  confirmed: "Tasdiqlandi",
  preparing: "Tayyorlanmoqda",
  ready: "Tayyor",
  delivered: "Yetkazildi",
  cancelled: "Bekor qilindi",
};

const NotificationsScreen = ({ onBack }: Props) => {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0" }}>
        <button style={styles.backBtn} onClick={onBack}><ArrowLeftIcon /></button>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "var(--text-primary, #222)" }}>Buyurtmalar</h2>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted, #999)" }}>
          <p>Yuklanmoqda...</p>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted, #999)" }}>
          <p style={{ fontSize: 40 }}>📋</p>
          <p style={{ marginTop: 12, fontSize: 15 }}>Buyurtmalar yo'q</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 100 }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "var(--card-bg, #fff)", borderRadius: 14, padding: 16,
                border: "1px solid var(--border-color, #eee)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary, #222)" }}>
                  #{order.order_number}
                </span>
                <span style={{
                  fontSize: 12, padding: "4px 10px", borderRadius: 20, fontWeight: 600,
                  background: order.status === "cancelled" ? "#fee" : "#e8f5e9",
                  color: order.status === "cancelled" ? "#c62828" : "#2e7d32",
                }}>
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary, #666)", marginBottom: 8 }}>
                {new Date(order.created_at).toLocaleString("uz-UZ")}
              </div>
              <div style={{ fontSize: 14, color: "var(--text-secondary, #555)", marginBottom: 8 }}>
                {order.items.map((item, i) => (
                  <div key={i}>{item.quantity}x {item.product_name}</div>
                ))}
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary, #222)" }}>
                {formatPrice(Number(order.total))} so'm
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsScreen;
