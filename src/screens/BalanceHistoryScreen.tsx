import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { ArrowLeftIcon } from "../components/Icons";
import { getBalanceHistory } from "../api";
import { formatPrice } from "../utils/formatPrice";
import CoffeeLoader from "../components/CoffeeLoader";
import type { BalanceHistory, BalanceTransaction } from "../types";

interface Props {
  onBack: () => void;
  onTopUp: () => void;
}

const txIsNegative = (tx: BalanceTransaction): boolean => {
  if (Number(tx.amount) < 0) return true;
  return tx.tx_type === "spend" || tx.tx_type === "deposit_spend" || tx.tx_type === "cashback_spend";
};

const txColor = (tx: BalanceTransaction): string => {
  if (txIsNegative(tx)) return "#e53935";
  if (tx.tx_type === "deposit" || tx.tx_type === "deposit_topup") return "var(--accent)";
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
    if (tx.tx_type_display) return tx.tx_type_display;
    switch (tx.tx_type) {
      case "deposit":
      case "deposit_topup":
        return t("txDeposit");
      case "cashback":
        return t("txCashback");
      case "spend":
      case "deposit_spend":
      case "cashback_spend":
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
        <CoffeeLoader size={110} label={t("loadingText")} />
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
          {/* Balance cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {/* Cashback card */}
            <div
              style={{
                background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
                borderRadius: 18,
                padding: "16px 14px",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                minHeight: 118,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -24,
                  right: -24,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.85,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                {t("cashback")}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  lineHeight: 1.1,
                }}
              >
                {formatPrice(Number(history.balance))}{" "}
                <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.85 }}>{t("som")}</span>
              </div>
            </div>

            {/* Deposit card */}
            <div
              style={{
                background: "var(--accent)",
                borderRadius: 18,
                padding: "16px 14px",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                minHeight: 118,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -24,
                  right: -24,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.85,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                {t("depositBalance")}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  lineHeight: 1.1,
                }}
              >
                {formatPrice(Number(history.deposit_balance))}{" "}
                <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.85 }}>{t("som")}</span>
              </div>
              <button
                onClick={onTopUp}
                style={{
                  alignSelf: "flex-start",
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: 4,
                }}
              >
                + {t("topUp")}
              </button>
            </div>
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
                const isNegative = txIsNegative(tx);
                const sign = isNegative ? "-" : "+";
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
