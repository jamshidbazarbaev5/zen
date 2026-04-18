import { useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { ArrowLeftIcon } from "../components/Icons";
import { createDeposit } from "../api";
import { isTelegram } from "../telegram";
import { formatPrice } from "../utils/formatPrice";

interface Props {
  onBack: () => void;
  balance?: string | null;
}

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000];

const DepositScreen = ({ onBack, balance }: Props) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericAmount = Number(amount);
  const isValid = amount !== "" && !Number.isNaN(numericAmount) && numericAmount > 0;

  const handleSubmit = async () => {
    if (!isValid) {
      setError(t("invalidAmount"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await createDeposit(numericAmount);
      if (res.payment_url) {
        // Prefer Telegram openLink inside the WebApp; fall back to same-tab
        // navigation for a reliable redirect in plain browsers.
        const tg = window.Telegram?.WebApp;
        if (isTelegram() && tg?.openLink) {
          tg.openLink(res.payment_url);
        } else {
          window.location.href = res.payment_url;
        }
      } else {
        setError(t("error"));
      }
    } catch (err: any) {
      const msg = err?.response?.data
        ? JSON.stringify(err.response.data)
        : err?.message || String(err);
      setError(msg);
    } finally {
      setLoading(false);
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
          {t("topUpBalance")}
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingBottom: 100 }}>
        {balance != null && (
          <div
            style={{
              padding: "16px 18px",
              borderRadius: 14,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>
              {t("currentBalance")}
            </span>
            <span
              style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)" }}
            >
              {formatPrice(Number(balance))} {t("som")}
            </span>
          </div>
        )}

        <div>
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-muted)",
              marginBottom: 8,
              display: "block",
            }}
          >
            {t("depositAmount")}
          </label>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={t("enterAmount")}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                fontSize: 22,
                fontWeight: 700,
                padding: "16px 60px 16px 18px",
                borderRadius: 14,
                border: "1.5px solid var(--border-color)",
                background: "var(--card-bg, var(--bg-primary))",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: 18,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            >
              {t("som")}
            </span>
          </div>
        </div>

        {/* Quick picks */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {QUICK_AMOUNTS.map((v) => (
            <button
              key={v}
              onClick={() => setAmount(String(v))}
              style={{
                padding: "12px 0",
                borderRadius: 12,
                border: "1px solid var(--border-color)",
                background:
                  amount === String(v) ? "var(--accent)" : "var(--bg-secondary)",
                color: amount === String(v) ? "#fff" : "var(--text-primary)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {formatPrice(v)} {t("som")}
            </button>
          ))}
        </div>

        {error && (
          <div
            style={{
              padding: 12,
              background: "#fee",
              borderRadius: 10,
              color: "#c62828",
              fontSize: 13,
              wordBreak: "break-all",
            }}
          >
            {error}
          </div>
        )}

        <button
          disabled={!isValid || loading}
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "16px 0",
            borderRadius: 14,
            background: "var(--accent)",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            border: "none",
            cursor: !isValid || loading ? "not-allowed" : "pointer",
            opacity: !isValid || loading ? 0.6 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {loading ? t("sending") : t("proceedToPayment")}
        </button>
      </div>
    </div>
  );
};

export default DepositScreen;
