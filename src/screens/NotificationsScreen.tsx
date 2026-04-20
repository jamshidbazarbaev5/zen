import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { styles } from '../styles';
import { ArrowLeftIcon } from '../components/Icons';
import { getMyOrders } from '../api';
import { formatPrice } from '../utils/formatPrice';
import type { OrderListItem } from '../types';
// import { ChevronDown } from "lucide-react";

interface Props {
  onBack: () => void;
}

const ChevronDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const TruckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const StoreIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const ExpandableSection = ({ expanded, children }: { expanded: boolean; children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight);
    }
  }, [expanded, children]);

  return (
    <div style={{
      maxHeight: expanded ? height : 0,
      opacity: expanded ? 1 : 0,
      overflow: "hidden",
      transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease",
    }}>
      <div ref={ref}>{children}</div>
    </div>
  );
};

const NotificationsScreen = ({ onBack }: Props) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const isDark = typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark";

  const statusConfig: Record<string, { label: string; bg: string; color: string; darkBg: string; darkColor: string }> = {
    pending:    { label: t('pending'),    bg: "#fff3e0", color: "#e65100", darkBg: "#3d2e1a", darkColor: "#ffb74d" },
    paid:       { label: t('paid'),       bg: "#e1f5fe", color: "#0277bd", darkBg: "#1a2a35", darkColor: "#4fc3f7" },
    confirmed:  { label: t('confirmed'),  bg: "#e8f5e9", color: "#2e7d32", darkBg: "#1a3025", darkColor: "#66bb6a" },
    preparing:  { label: t('preparing'),  bg: "#e3f2fd", color: "#1565c0", darkBg: "#1a2535", darkColor: "#64b5f6" },
    ready:      { label: t('ready'),      bg: "#e8f5e9", color: "#2e7d32", darkBg: "#1a3025", darkColor: "#66bb6a" },
    completed:  { label: t('completed'),  bg: "#f1f8e9", color: "#558b2f", darkBg: "#1f2e1a", darkColor: "#aed581" },
    cancelled:  { label: t('cancelled'),  bg: "#fce4ec", color: "#c62828", darkBg: "#351a1f", darkColor: "#ef9a9a" },
  };

  return (
    <div style={{ padding: "0 16px", minHeight: "80vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0 20px" }}>
        <button style={styles.backBtn} onClick={onBack}><ArrowLeftIcon /></button>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "var(--text-primary)", letterSpacing: -0.5 }}>
          {t('orders')}
        </h2>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              background: "var(--bg-secondary)", borderRadius: 16, height: 88,
              animation: "pulse 1.5s ease-in-out infinite",
              opacity: 1 - i * 0.2,
            }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 20px",
          color: "var(--text-muted)",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: "0 auto 16px",
            background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="2" />
            </svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px", color: "var(--text-secondary)" }}>{t('noOrdersYet')}</p>
          <p style={{ fontSize: 14, margin: 0 }}>{t('placeFirstOrder')}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 100 }}>
          {orders.map((order, index) => {
            const expanded = expandedId === order.id;
            const status = statusConfig[order.status] || statusConfig.pending;

            return (
              <div
                key={order.id}
                style={{
                  background: "var(--card-bg, var(--bg-primary))",
                  borderRadius: 16,
                  border: expanded ? "1.5px solid var(--accent)" : "1px solid var(--border-color)",
                  cursor: "pointer",
                  transition: "all 0.25s ease, border-color 0.3s ease",
                  boxShadow: expanded
                    ? (isDark ? "0 4px 24px rgba(74, 158, 107, 0.1)" : "0 4px 24px rgba(45, 90, 61, 0.08)")
                    : "0 1px 3px rgba(0,0,0,0.04)",
                  animation: `slideInUp 0.3s ease ${index * 0.05}s both`,
                }}
                onClick={() => setExpandedId(expanded ? null : order.id)}
              >
                {/* Card header */}
                <div style={{ padding: "14px 16px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        fontWeight: 700, fontSize: 15, color: "var(--text-primary)",
                        fontFamily: "'SF Mono', 'Fira Code', monospace",
                        letterSpacing: 0.5,
                      }}>
                        {order.number}
                      </span>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        fontSize: 11, padding: "3px 8px", borderRadius: 6, fontWeight: 600,
                        background: isDark ? status.darkBg : status.bg,
                        color: isDark ? status.darkColor : status.color,
                        letterSpacing: 0.3,
                        textTransform: "uppercase",
                      }}>
                        {status.label}
                      </span>
                    </div>
                    <div style={{
                      color: "var(--text-muted)",
                      transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}>
                      <ChevronDown />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)" }}>
                      <ClockIcon />
                      <span>{new Date(order.created_at).toLocaleDateString("uz-UZ", { day: "numeric", month: "short" })}</span>
                      <span style={{ opacity: 0.4 }}>|</span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {new Date(order.created_at).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>
                      {formatPrice(Number(order.total_amount))} <span style={{ fontWeight: 400, fontSize: 12, color: "var(--text-muted)" }}>{t('som')}</span>
                    </span>
                  </div>
                </div>

                {/* Expanded content */}
                <ExpandableSection expanded={expanded}>
                  <div style={{
                    padding: "0 16px 16px",
                    borderTop: "1px solid var(--border-color)",
                    marginTop: 0,
                  }}>
                    {/* Order type badge */}
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      marginTop: 14, padding: "6px 12px", borderRadius: 8,
                      background: "var(--bg-secondary)", fontSize: 13, fontWeight: 500,
                      color: "var(--text-secondary)",
                    }}>
                      {order.order_type === "delivery" ? <TruckIcon /> : <StoreIcon />}
                      {order.order_type === "delivery" ? t('delivery') : t('pickup')}
                    </div>

                    {/* Details grid */}
                    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 0 }}>
                      <DetailRow label={t('time')} value={new Date(order.pickup_time).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })} />

                      {order.order_type === "delivery" && (
                        <>
                          {order.delivery_address && <DetailRow label={t('address')} value={order.delivery_address} />}
                          {(order.delivery_flat || order.delivery_entrance || order.delivery_floor) && (
                            <DetailRow
                              label={t('details')}
                              value={[
                                order.delivery_flat && `${order.delivery_flat}-${t('flat')}`,
                                order.delivery_entrance && `${order.delivery_entrance}-${t('entrance')}`,
                                order.delivery_floor && `${order.delivery_floor}-${t('floor')}`,
                              ].filter(Boolean).join(", ")}
                            />
                          )}
                          {order.delivery_comment && <DetailRow label={t('comment')} value={order.delivery_comment} />}
                        </>
                      )}

                      {order.order_type === "pickup" && order.pickup_location_name && (
                        <DetailRow label={t('branch')} value={order.pickup_location_name} />
                      )}
                    </div>

                    {/* Items */}
                    <div style={{
                      marginTop: 14, background: "var(--bg-secondary)", borderRadius: 12, padding: 12,
                    }}>
                      <div style={{
                        fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
                        textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8,
                      }}>
                        {t('products')}
                      </div>
                      {order.items.map((item, i) => (
                        <div key={item.id} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "6px 0",
                          borderTop: i > 0 ? "1px solid var(--border-color)" : "none",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              width: 22, height: 22, borderRadius: 6,
                              background: "var(--accent)", color: "#fff",
                              fontSize: 11, fontWeight: 700,
                            }}>
                              {item.quantity}
                            </span>
                            <span style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 500 }}>
                              {item.product_name}
                            </span>
                          </div>
                          <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                            {formatPrice(item.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Payment summary */}
                    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
                      {Number(order.balance_used) > 0 && (
                        <DetailRow label={t('paidFromBalance')} value={`${formatPrice(Number(order.balance_used))} ${t('som')}`} />
                      )}
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "8px 0",
                      }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{t('totalPayment')}</span>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)" }}>
                          {formatPrice(Number(order.online_paid))} {t('som')}
                        </span>
                      </div>
                    </div>

                    {/* Payment button */}
                    {order.payment_url && order.status === "pending" && (
                      <a
                        href={order.payment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                          marginTop: 12, padding: "13px 0", borderRadius: 12,
                          background: "var(--accent)", color: "#fff", textAlign: "center",
                          fontSize: 15, fontWeight: 600, textDecoration: "none",
                          transition: "opacity 0.2s ease",
                        }}
                      >
                        {t('makePayment')}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </a>
                    )}
                  </div>
                </ExpandableSection>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "7px 0", fontSize: 13,
  }}>
    <span style={{ color: "var(--text-muted)", fontWeight: 500, minWidth: 80 }}>{label}</span>
    <span style={{
      color: "var(--text-primary)", fontWeight: 500,
      textAlign: "right", maxWidth: "65%", lineHeight: 1.4,
    }}>
      {value}
    </span>
  </div>
);

export default NotificationsScreen;
