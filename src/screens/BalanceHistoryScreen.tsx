import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { ArrowLeftIcon } from "../components/Icons";
import { getBalanceHistory } from "../api";
import { formatPrice } from "../utils/formatPrice";
import type { BalanceHistory, BalanceTransaction } from "../types";

interface Props {
  onBack: () => void;
  onTopUp: () => void;
}

const txColor = (tx: BalanceTransaction): string => {
  if (tx.tx_type === "spend") return "#e53935";
  if (tx.tx_type === "deposit") return "var(--accent)";
  return "#2e7d32"; // cashback
};

const formatDate = (iso: string, locale: string): string => {
  try {
    const d = new Date(iso);
    return d.toLocaleString(locale || undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const BalanceHistoryScreen = ({ onBack, onTopUp }: Props) => {
  const { t, i18n } = useTranslation();
  const [history, setHistory] = useState<BalanceHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBalanceHistory()
      .then(setHistory)
      .catch((err) => setError(err?.message || String(err)))
      .finally(() => setLoading(false));
  }, []);

  const txLabel = (tx: BalanceTransaction): string => {
    switch (tx.tx_type) {
      case "deposit":
        return t("txDeposit");
      case "cashback":
        return t("txCashback");
      case "spend":
        return t("txSpend");
      default:
        return tx.tx_type;
    }
  };

  return (
    <div style={{ padding: "0 16px", minHeight: "80vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0 20px" }}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeftIcon />
        </button>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            margin: 0,
            color: "var(--text-primary)",
            letterSpacing: -0.5,
          }}
        >
          {t("balanceHistory")}
        </h2>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-secondary)",
                borderRadius: 14,
                height: i === 1 ? 110 : 62,
                animation: "pulse 1.5s ease-in-out infinite",
                opacity: 1 - i * 0.15,
              }}
            />
          ))}
        </div>
      ) : error ? (
        <div
          style={{
            padding: 16,
            background: "var(--bg-secondary)",
            borderRadius: 12,
            color: "var(--text-secondary)",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      ) : history ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 100 }}>
          {/* Balance card */}
          <div
            style={{
              background: "var(--accent)",
              borderRadius: 20,
              padding: "22px 20px",
              color: "#fff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
              }}
            />
            <div style={{ fontSize: 13, opacity: 0.8, fontWeight: 500, marginBottom: 6 }}>
              {t("currentBalance")}
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: -1,
                marginBottom: 14,
              }}
            >
              {formatPrice(Number(history.balance))} {t("som")}
            </div>
            <button
              onClick={onTopUp}
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                borderRadius: 10,
                padding: "10px 18px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + {t("topUp")}
            </button>
          </div>

          {/* Transactions */}
          {history.transactions.length === 0 ? (
            <div
              style={{
                padding: "40px 16px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 14,
                background: "var(--bg-secondary)",
                borderRadius: 14,
              }}
            >
              {t("noTransactions")}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {history.transactions.map((tx) => {
                const amount = Number(tx.amount);
                const isNegative = amount < 0 || tx.tx_type === "spend";
                const sign = isNegative ? "" : "+";
                return (
                  <div
                    key={tx.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 16px",
                      borderRadius: 12,
                      background: "var(--card-bg, var(--bg-primary))",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          marginBottom: 2,
                        }}
                      >
                        {txLabel(tx)}
                        {tx.order_number ? (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 12,
                              fontWeight: 500,
                              color: "var(--text-muted)",
                            }}
                          >
                            #{tx.order_number}
                          </span>
                        ) : null}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tx.note}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                        {formatDate(tx.created_at, i18n.language)}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: txColor(tx),
                        whiteSpace: "nowrap",
                        marginLeft: 10,
                      }}
                    >
                      {sign}
                      {formatPrice(Math.abs(amount))} {t("som")}
                    </div>
                  </div>
                );
              })}
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

export default BalanceHistoryScreen;
