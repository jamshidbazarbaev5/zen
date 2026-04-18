import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { styles } from '../styles';
import { ArrowLeftIcon } from '../components/Icons';
import { getCashbackInfo } from '../api';
import { formatPrice } from '../utils/formatPrice';
import CoffeeLoader from '../components/CoffeeLoader';
import type { CashbackInfo } from '../types';

interface Props {
  onBack: () => void;
}

const CashbackScreen = ({ onBack }: Props) => {
  const { t } = useTranslation();
  const [info, setInfo] = useState<CashbackInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCashbackInfo()
      .then(setInfo)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getProgress = () => {
    if (!info || !info.next_tier) return 100;
    const spent = Number(info.total_spent);
    const currentMin = Number(info.current_tier.min_spent);
    const nextMin = Number(info.next_tier.min_spent);
    if (nextMin <= currentMin) return 100;
    return Math.min(100, ((spent - currentMin) / (nextMin - currentMin)) * 100);
  };

  return (
    <div style={{ padding: "0 16px", minHeight: "80vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0 20px" }}>
        <button style={styles.backBtn} onClick={onBack}><ArrowLeftIcon /></button>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "var(--text-primary)", letterSpacing: -0.5 }}>
          {t('cashback')}
        </h2>
      </div>

      {loading ? (
        <CoffeeLoader size={110} label={t('loadingText')} />
      ) : info ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 100 }}>
          {/* Current tier card */}
          <div style={{
            background: "var(--accent)", borderRadius: 20, padding: "24px 20px",
            color: "#fff", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -30, right: -30, width: 120, height: 120,
              borderRadius: "50%", background: "rgba(255,255,255,0.08)",
            }} />
            <div style={{
              position: "absolute", bottom: -20, left: -20, width: 80, height: 80,
              borderRadius: "50%", background: "rgba(255,255,255,0.05)",
            }} />

            <div style={{ fontSize: 13, opacity: 0.8, fontWeight: 500, marginBottom: 4 }}>
              {t('currentTier')}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, letterSpacing: -0.5 }}>
              {info.current_tier.name}
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, letterSpacing: -1 }}>
              {info.current_tier.percent}%
            </div>

            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 6 }}>
              {t('totalSpent')}: {formatPrice(Number(info.total_spent))} {t('som')}
            </div>

            {info.next_tier && (
              <>
                <div style={{
                  height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3,
                  overflow: "hidden", marginBottom: 8,
                }}>
                  <div style={{
                    height: "100%", background: "#fff", borderRadius: 3,
                    width: `${getProgress()}%`,
                    transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  }} />
                </div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {info.next_tier.name} {t('remaining')} {formatPrice(Number(info.next_tier.remaining))} {t('som')}
                </div>
              </>
            )}
          </div>

          {/* Next tier preview */}
          {info.next_tier && (
            <div style={{
              background: "var(--card-bg, var(--bg-primary))", borderRadius: 16,
              border: "1.5px dashed var(--accent)", padding: "16px 18px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>
                  {t('nextTier')}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
                  {info.next_tier.name}
                </div>
              </div>
              <div style={{
                fontSize: 24, fontWeight: 800, color: "var(--accent)",
              }}>
                {info.next_tier.percent}%
              </div>
            </div>
          )}

          {/* All tiers */}
          <div style={{ marginTop: 6 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
              textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12, paddingLeft: 2,
            }}>
              {t('allTiers')}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {info.tiers.map((tier, i) => {
                const isCurrent = tier.name === info.current_tier.name;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "14px 16px", borderRadius: 14,
                      background: isCurrent ? "var(--accent)" : "var(--card-bg, var(--bg-primary))",
                      border: isCurrent ? "none" : "1px solid var(--border-color)",
                      color: isCurrent ? "#fff" : "var(--text-primary)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: isCurrent ? "rgba(255,255,255,0.15)" : "var(--bg-secondary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700,
                        color: isCurrent ? "#fff" : "var(--accent)",
                      }}>
                        {tier.percent}%
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>{tier.name}</div>
                        <div style={{
                          fontSize: 12,
                          color: isCurrent ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
                        }}>
                          {Number(tier.min_spent) === 0 ? t('initial') : `${formatPrice(Number(tier.min_spent))} ${t('som')} ${t('from')}`}
                        </div>
                      </div>
                    </div>
                    {isCurrent && (
                      <div style={{
                        fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
                        background: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: 0.5,
                      }}>
                        {t('current')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
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

export default CashbackScreen;
