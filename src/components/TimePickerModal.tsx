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
    useCashback: boolean,
    useDeposit: boolean,
    delivery?: DeliveryDetails,
  ) => void;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
  isDelivery?: boolean;
  cashbackBalance?: string | null;
  depositBalance?: string | null;
}

const inputStyle: React.CSSProperties = {
  fontSize: 15,
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid var(--border-color)",
  background: "var(--bg-primary)",
  color: "var(--text-primary)",
  width: "100%",
  boxSizing: "border-box",
  colorScheme: "light dark",
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
  cashbackBalance,
  depositBalance,
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
  const [useCashback, setUseCashback] = useState(false);
  const [useDeposit, setUseDeposit] = useState(false);
  const [flat, setFlat] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [comment, setComment] = useState("");

  const handleConfirm = () => {
    onConfirm(
      date,
      time,
      useCashback,
      useDeposit,
      isDelivery ? { flat, entrance, floor, comment } : undefined,
    );
  };

  const cashbackNum = cashbackBalance != null ? Number(cashbackBalance) : 0;
  const depositNum = depositBalance != null ? Number(depositBalance) : 0;
  const hasCashback = cashbackNum > 0;
  const hasDeposit = depositNum > 0;

  const dateBtnStyle = (selected: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "11px 0",
    borderRadius: 10,
    border: selected ? "1.5px solid var(--accent)" : "1px solid var(--border-color)",
    background: selected ? "var(--accent-light)" : "var(--bg-primary)",
    color: selected ? "var(--accent)" : "var(--text-primary)",
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
        className="time-picker-modal"
        style={{
          background: "var(--card-bg, var(--bg-primary))",
          borderRadius: 16,
          padding: 24,
          width: "90%",
          maxWidth: 360,
          maxHeight: "90vh",
          overflowY: "auto",
          border: "1px solid var(--border-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            margin: "0 0 16px",
            fontSize: 18,
            color: "var(--text-primary)",
            textAlign: "center",
          }}
        >
          {isDelivery ? t("deliveryTime") : t("pickupTimeLabel")}
        </h3>

        {/* Date */}
        <label
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
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
            color: "var(--text-secondary)",
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

        {/* Use cashback */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 12,
            border: useCashback
              ? "1.5px solid var(--accent)"
              : "1px solid var(--border-color)",
            background: useCashback
              ? "var(--accent-light)"
              : "var(--bg-secondary)",
            cursor: hasCashback ? "pointer" : "not-allowed",
            marginBottom: 10,
            userSelect: "none",
            opacity: hasCashback ? 1 : 0.6,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {t("payWithCashback")}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginTop: 2,
              }}
            >
              {formatPrice(cashbackNum)} {t("som")}
            </div>
          </div>
          <input
            type="checkbox"
            checked={useCashback}
            disabled={!hasCashback}
            onChange={(e) => setUseCashback(e.target.checked)}
            style={{
              width: 20,
              height: 20,
              cursor: hasCashback ? "pointer" : "not-allowed",
              accentColor: "var(--accent)",
            }}
          />
        </label>

        {/* Use deposit */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 12,
            border: useDeposit
              ? "1.5px solid var(--accent)"
              : "1px solid var(--border-color)",
            background: useDeposit
              ? "var(--accent-light)"
              : "var(--bg-secondary)",
            cursor: hasDeposit ? "pointer" : "not-allowed",
            marginBottom: 16,
            userSelect: "none",
            opacity: hasDeposit ? 1 : 0.6,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {t("payWithDeposit")}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginTop: 2,
              }}
            >
              {formatPrice(depositNum)} {t("som")}
            </div>
          </div>
          <input
            type="checkbox"
            checked={useDeposit}
            disabled={!hasDeposit}
            onChange={(e) => setUseDeposit(e.target.checked)}
            style={{
              width: 20,
              height: 20,
              cursor: hasDeposit ? "pointer" : "not-allowed",
              accentColor: "var(--accent)",
            }}
          />
        </label>

        {isDelivery && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
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
                    color: "var(--text-secondary)",
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
                    color: "var(--text-secondary)",
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
                color: "var(--text-secondary)",
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
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "opacity 0.2s",
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
              background: "var(--bg-secondary)",
              color: "#e57373",
              border: "1px solid var(--border-color)",
              fontSize: 12,
              textAlign: "left",
              wordBreak: "break-all",
            }}
          >
            {error}
          </div>
        )}
        <style>{`
          .time-picker-modal input[type="date"],
          .time-picker-modal input[type="time"] {
            color-scheme: light dark;
          }
          [data-theme="dark"] .time-picker-modal input[type="date"]::-webkit-calendar-picker-indicator,
          [data-theme="dark"] .time-picker-modal input[type="time"]::-webkit-calendar-picker-indicator {
            filter: invert(1) opacity(0.8);
          }
          .time-picker-modal input::placeholder,
          .time-picker-modal textarea::placeholder {
            color: var(--text-muted);
            opacity: 0.8;
          }
        `}</style>
      </div>
    </div>
  );
};

export default TimePickerModal;
