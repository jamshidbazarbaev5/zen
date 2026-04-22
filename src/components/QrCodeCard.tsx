import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";

interface Props {
  payload: string;
}

// Module-level cache so the QR data URL is generated only once per payload
// for the lifetime of the app (prevents any re-generation on re-render).
const qrCache = new Map<string, string>();

const QrCodeCard = ({ payload }: Props) => {
  const { t } = useTranslation();
  const [dataUrl, setDataUrl] = useState<string | null>(
    () => qrCache.get(payload) ?? null,
  );
  const [expanded, setExpanded] = useState(false);
  const generatedRef = useRef(false);

  useEffect(() => {
    if (generatedRef.current) return;
    if (qrCache.has(payload)) {
      setDataUrl(qrCache.get(payload)!);
      generatedRef.current = true;
      return;
    }
    QRCode.toDataURL(payload, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 512,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then((url) => {
        qrCache.set(payload, url);
        setDataUrl(url);
        generatedRef.current = true;
      })
      .catch((err) => {
        console.error("QR generation failed:", err);
      });
  }, [payload]);

  if (!dataUrl) return null;

  return (
    <div
      onClick={() => setExpanded(true)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: 12,
        margin: "0 0 14px",
        background: "var(--card-bg, var(--bg-primary))",
        border: "1px solid var(--border-color)",
        borderRadius: 16,
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <img
        src={dataUrl}
        alt="QR"
        style={{
          width: 72,
          height: 72,
          borderRadius: 10,
          background: "#fff",
          padding: 4,
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 2,
          }}
        >
          {t("myQrCode")}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            lineHeight: 1.4,
          }}
        >
          {t("showAtCheckout")}
        </div>
      </div>

      {expanded && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              maxWidth: 360,
              width: "100%",
            }}
          >
            <img
              src={dataUrl}
              alt="QR"
              style={{ width: "100%", maxWidth: 320, aspectRatio: "1 / 1" }}
            />
            <div
              style={{
                fontSize: 14,
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                color: "#333",
                letterSpacing: 1,
              }}
            >
              {payload}
            </div>
            <button
              onClick={() => setExpanded(false)}
              style={{
                marginTop: 4,
                padding: "10px 28px",
                borderRadius: 10,
                border: "none",
                background: "var(--accent)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrCodeCard;
