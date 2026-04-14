import { useState } from "react";
import { useTranslation } from 'react-i18next';

export interface DeliveryDetails {
  flat: string;
  entrance: string;
  floor: string;
  comment: string;
}

interface Props {
  onConfirm: (time: string, delivery?: DeliveryDetails) => void;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
  isDelivery?: boolean;
}

const inputStyle: React.CSSProperties = {
  fontSize: 15, padding: "12px 14px", borderRadius: 12,
  border: "1px solid var(--border-color, #ddd)", background: "var(--bg-primary, #fff)",
  color: "var(--text-primary, #222)", width: "100%", boxSizing: "border-box",
};

const TimePickerModal = ({ onConfirm, onClose, loading, error, isDelivery }: Props) => {
  const { t } = useTranslation();
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  const defaultTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const [time, setTime] = useState(defaultTime);
  const [flat, setFlat] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [comment, setComment] = useState("");

  const handleConfirm = () => {
    onConfirm(time, isDelivery ? { flat, entrance, floor, comment } : undefined);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--card-bg, #fff)", borderRadius: 16, padding: 24,
          width: "90%", maxWidth: 340, maxHeight: "85vh", overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: "0 0 16px", fontSize: 18, color: "var(--text-primary, #222)", textAlign: "center" }}>
          {isDelivery ? t('deliveryTime') : t('pickupTimeLabel')}
        </h3>

        <label style={{ fontSize: 13, color: "var(--text-secondary, #666)", marginBottom: 4, display: "block" }}>{t('time')}</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ ...inputStyle, fontSize: 20, textAlign: "center", marginBottom: 16 }}
        />

        {isDelivery && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: "var(--text-secondary, #666)", marginBottom: 4, display: "block" }}>{t('flat')}</label>
                <input placeholder="42" value={flat} onChange={(e) => setFlat(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: "var(--text-secondary, #666)", marginBottom: 4, display: "block" }}>{t('entrance')}</label>
                <input placeholder="2" value={entrance} onChange={(e) => setEntrance(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: "var(--text-secondary, #666)", marginBottom: 4, display: "block" }}>{t('floor')}</label>
                <input placeholder="3" value={floor} onChange={(e) => setFloor(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <label style={{ fontSize: 13, color: "var(--text-secondary, #666)", marginBottom: 4, display: "block" }}>{t('comment')}</label>
            <textarea
              placeholder={`${t('intercomCode')}: 1234`}
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
            marginTop: 12, width: "100%", padding: "14px 0", borderRadius: 12,
            background: loading ? "#999" : "#E86A33", color: "#fff", border: "none",
            fontSize: 16, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? t('sending') : t('confirm')}
        </button>
        {error && (
          <div style={{
            marginTop: 12, padding: 10, borderRadius: 8, background: "#fee",
            color: "#c62828", fontSize: 12, textAlign: "left", wordBreak: "break-all",
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimePickerModal;
