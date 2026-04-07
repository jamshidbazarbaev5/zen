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
  const [expandedId, setExpandedId] = useState<number | null>(null);

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
          {orders.map((order) => {
            const expanded = expandedId === order.id;
            return (
              <div
                key={order.id}
                style={{
                  background: "var(--card-bg, #fff)", borderRadius: 14, padding: 16,
                  border: "1px solid var(--border-color, #eee)", cursor: "pointer",
                }}
                onClick={() => setExpandedId(expanded ? null : order.id)}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary, #222)" }}>
                    #{order.number}
                  </span>
                  <span style={{
                    fontSize: 12, padding: "4px 10px", borderRadius: 20, fontWeight: 600,
                    background: order.status === "cancelled" ? "#fee" : "#e8f5e9",
                    color: order.status === "cancelled" ? "#c62828" : "#2e7d32",
                  }}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>

                {/* Summary row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary, #666)" }}>
                    {new Date(order.created_at).toLocaleString("uz-UZ")}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary, #222)" }}>
                    {formatPrice(Number(order.total_amount))} so'm
                  </span>
                </div>

                {/* Expanded details */}
                {expanded && (
                  <div style={{ marginTop: 14, borderTop: "1px solid var(--border-color, #eee)", paddingTop: 14 }}>
                    {/* Order type */}
                    <DetailRow label="Turi" value={order.order_type === "delivery" ? "🚚 Yetkazib berish" : "🏪 Olib ketish"} />

                    {/* Pickup time */}
                    <DetailRow label="Vaqt" value={new Date(order.pickup_time).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })} />

                    {/* Delivery address details */}
                    {order.order_type === "delivery" && (
                      <>
                        {order.delivery_address && <DetailRow label="Manzil" value={order.delivery_address} />}
                        {order.delivery_flat && <DetailRow label="Xonadon" value={order.delivery_flat} />}
                        {order.delivery_entrance && <DetailRow label="Kirish" value={order.delivery_entrance} />}
                        {order.delivery_floor && <DetailRow label="Qavat" value={order.delivery_floor} />}
                        {order.delivery_comment && <DetailRow label="Izoh" value={order.delivery_comment} />}
                      </>
                    )}

                    {/* Pickup location */}
                    {order.order_type === "pickup" && order.pickup_location_name && (
                      <DetailRow label="Filial" value={order.pickup_location_name} />
                    )}

                    {/* Payment info */}
                    {Number(order.balance_used) > 0 && (
                      <DetailRow label="Balansdan" value={`${formatPrice(Number(order.balance_used))} so'm`} />
                    )}
                    <DetailRow label="To'lov" value={`${formatPrice(Number(order.online_paid))} so'm`} />

                    {/* Items */}
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary, #666)", marginBottom: 8 }}>Mahsulotlar</div>
                      {order.items.map((item) => (
                        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 14, color: "var(--text-primary, #222)" }}>
                          <span>{item.quantity}x {item.product_name}</span>
                          <span style={{ color: "var(--text-secondary, #666)" }}>{formatPrice(item.subtotal)} so'm</span>
                        </div>
                      ))}
                    </div>

                    {/* Payment link */}
                    {order.payment_url && order.status === "pending" && (
                      <a
                        href={order.payment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: "block", marginTop: 14, padding: "12px 0", borderRadius: 10,
                          background: "#E86A33", color: "#fff", textAlign: "center",
                          fontSize: 15, fontWeight: 600, textDecoration: "none",
                        }}
                      >
                        To'lov qilish
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 14 }}>
    <span style={{ color: "var(--text-secondary, #666)" }}>{label}</span>
    <span style={{ color: "var(--text-primary, #222)", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value}</span>
  </div>
);

export default NotificationsScreen;
