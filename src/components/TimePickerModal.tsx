import { useState } from "react";

interface Props {
  onConfirm: (time: string) => void;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
}

const TimePickerModal = ({ onConfirm, onClose, loading, error }: Props) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  const defaultTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const [time, setTime] = useState(defaultTime);

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
          width: "90%", maxWidth: 340, textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: "0 0 16px", fontSize: 18, color: "var(--text-primary, #222)" }}>
          Olib ketish vaqti
        </h3>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{
            fontSize: 24, padding: "12px 20px", borderRadius: 12,
            border: "2px solid var(--border-color, #ddd)", background: "var(--bg-primary, #fff)",
            color: "var(--text-primary, #222)", width: "100%", boxSizing: "border-box",
            textAlign: "center",
          }}
        />
        <button
          disabled={loading}
          onClick={() => onConfirm(time)}
          style={{
            marginTop: 20, width: "100%", padding: "14px 0", borderRadius: 12,
            background: loading ? "#999" : "#E86A33", color: "#fff", border: "none",
            fontSize: 16, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Yuborilmoqda..." : "Tasdiqlash"}
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
