import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../utils/formatPrice";

export interface DeliveryDetails {
  flat: string;
  entrance: string;
  floor: string;
  comment: string;
}

interface Props {
  onConfirm: (
    date: string,
    time: string,
    useBalance: boolean,
    delivery?: DeliveryDetails,
  ) => void;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
  isDelivery?: boolean;
  balance?: string | null;
}

const inputStyle: React.CSSProperties = {
  fontSize: 15,
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid var(--border-color, #ddd)",
  background: "var(--bg-primary, #fff)",
  color: "var(--text-primary, #222)",
  width: "100%",
  boxSizing: "border-box",
};

const toDateValue = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const TimePickerModal = ({
  onConfirm,
  onClose,
  loading,
  error,
  isDelivery,
  balance,
}: Props) => {
  const { t } = useTranslation();

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const todayStr = toDateValue(today);
  const tomorrowStr = toDateValue(tomorrow);

  const nowPlus30 = new Date();
  nowPlus30.setMinutes(nowPlus30.getMinutes() + 30);
  const defaultTime = `${String(nowPlus30.getHours()).padStart(2, "0")}:${String(
    nowPlus30.getMinutes(),
  ).padStart(2, "0")}`;

  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState(defaultTime);
  const [useBalance, setUseBalance] = useState(false);
  const [flat, setFlat] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [comment, setComment] = useState("");

  const handleConfirm = () => {
    onConfirm(
      date,
      time,
      useBalance,
      isDelivery ? { flat, entrance, floor, comment } : undefined,
    );
  };

  const hasBalance = balance != null && Number(balance) > 0;

  const dateBtnStyle = (selected: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "11px 0",
    borderRadius: 10,
    border: selected ? "1.5px solid var(--accent, #E86A33)" : "1px solid var(--border-color, #ddd)",
    background: selected ? "var(--accent-light, rgba(232,106,51,0.12))" : "var(--bg-primary, #fff)",
    color: selected ? "var(--accent, #E86A33)" : "var(--text-primary, #222)",
    fontSize: 13,
    fontWeight: selected ? 700 : 500,
    cursor: "pointer",
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--card-bg, #fff)",
          borderRadius: 16,
          padding: 24,
          width: "90%",
          maxWidth: 360,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            margin: "0 0 16px",
            fontSize: 18,
            color: "var(--text-primary, #222)",
            textAlign: "center",
          }}
        >
          {isDelivery ? t("deliveryTime") : t("pickupTimeLabel")}
        </h3>

        {/* Date */}
        <label
          style={{
            fontSize: 13,
            color: "var(--text-secondary, #666)",
            marginBottom: 6,
            display: "block",
          }}
        >
          {isDelivery ? t("deliveryDate") : t("pickupDate")}
        </label>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <button
            type="button"
            onClick={() => setDate(todayStr)}
            style={dateBtnStyle(date === todayStr)}
          >
            {t("today")}
          </button>
          <button
            type="button"
            onClick={() => setDate(tomorrowStr)}
            style={dateBtnStyle(date === tomorrowStr)}
          >
            {t("tomorrow")}
          </button>
        </div>
        <input
          type="date"
          value={date}
          min={todayStr}
          onChange={(e) => setDate(e.target.value)}
          style={{ ...inputStyle, marginBottom: 16 }}
        />

        {/* Time */}
        <label
          style={{
            fontSize: 13,
            color: "var(--text-secondary, #666)",
            marginBottom: 4,
            display: "block",
          }}
        >
          {t("time")}
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ ...inputStyle, fontSize: 20, textAlign: "center", marginBottom: 16 }}
        />

        {/* Use balance */}
        {hasBalance && (
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "12px 14px",
              borderRadius: 12,
              border: useBalance
                ? "1.5px solid var(--accent, #E86A33)"
                : "1px solid var(--border-color, #ddd)",
              background: useBalance
                ? "var(--accent-light, rgba(232,106,51,0.08))"
                : "var(--bg-secondary, #f5f5f5)",
              cursor: "pointer",
              marginBottom: 16,
              userSelect: "none",
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-primary, #222)",
                }}
              >
                {t("payWithBalance")}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-muted, #888)",
                  marginTop: 2,
                }}
              >
                {t("yourBalance")}: {formatPrice(Number(balance))} {t("som")}
              </div>
            </div>
            <input
              type="checkbox"
              checked={useBalance}
              onChange={(e) => setUseBalance(e.target.checked)}
              style={{ width: 20, height: 20, cursor: "pointer", accentColor: "var(--accent, #E86A33)" }}
            />
          </label>
        )}

        {isDelivery && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary, #666)",
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  {t("flat")}
                </label>
                <input
                  placeholder="42"
                  value={flat}
                  onChange={(e) => setFlat(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary, #666)",
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  {t("entrance")}
                </label>
                <input
                  placeholder="2"
                  value={entrance}
                  onChange={(e) => setEntrance(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary, #666)",
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  {t("floor")}
                </label>
                <input
                  placeholder="3"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <label
              style={{
                fontSize: 13,
                color: "var(--text-secondary, #666)",
                marginBottom: 4,
                display: "block",
              }}
            >
              {t("comment")}
            </label>
            <textarea
              placeholder={`${t("intercomCode")}: 1234`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              style={{ ...inputStyle, resize: "none", marginBottom: 8 }}
            />
          </>
        )}

        <button
          disabled={loading}
          onClick={handleConfirm}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "14px 0",
            borderRadius: 12,
            background: loading ? "#999" : "#E86A33",
            color: "#fff",
            border: "none",
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? t("sending") : t("confirm")}
        </button>
        {error && (
          <div
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 8,
              background: "#fee",
              color: "#c62828",
              fontSize: 12,
              textAlign: "left",
              wordBreak: "break-all",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimePickerModal;
