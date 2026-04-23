import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";

interface Props {
  payload: string;
  userName?: string | null;
}

// Module-level cache so the QR data URL is generated only once per payload
// for the lifetime of the app (prevents any re-generation on re-render).
const qrCache = new Map<string, string>();

const QrCodeCard = ({ payload, userName }: Props) => {
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
      color: { dark: "#1a1a1a", light: "#ffffff" },
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
    <>
      <div
        onClick={() => setExpanded(true)}
        className="qr-card"
        style={{
          position: "relative",
          margin: "4px 4px 18px",
          padding: "18px 18px 16px",
          borderRadius: 22,
          background:
            "linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 70%, #000 30%) 100%)",
          cursor: "pointer",
          overflow: "hidden",
          boxShadow: "0 10px 30px -8px color-mix(in srgb, var(--accent) 60%, transparent)",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            position: "relative",
          }}
        >
          {/* QR tile */}
          <div
            style={{
              width: 86,
              height: 86,
              borderRadius: 16,
              background: "#fff",
              padding: 6,
              boxSizing: "border-box",
              flexShrink: 0,
              boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={dataUrl}
              alt="QR"
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>

          {/* Text */}
          <div style={{ minWidth: 0, flex: 1, color: "#fff" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                opacity: 0.75,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                marginBottom: 4,
              }}
            >
              {t("myQrCode")}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 4,
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userName || payload}
            </div>
            <div
              style={{
                fontSize: 12,
                opacity: 0.8,
                lineHeight: 1.35,
              }}
            >
              {t("showAtCheckout")}
            </div>
          </div>

          {/* Tap indicator */}
          <div
            style={{
              color: "#fff",
              opacity: 0.7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(255,255,255,0.15)",
              flexShrink: 0,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </div>
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
            background: "rgba(0,0,0,0.82)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000,
            padding: 20,
            animation: "qrFadeIn 0.2s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              maxWidth: 360,
              width: "100%",
              animation: "qrScaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: 1.5,
              }}
            >
              {t("myQrCode")}
            </div>
            <img
              src={dataUrl}
              alt="QR"
              style={{
                width: "100%",
                maxWidth: 300,
                aspectRatio: "1 / 1",
                borderRadius: 12,
              }}
            />
            <div
              style={{
                fontSize: 16,
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                color: "#222",
                letterSpacing: 1.5,
                fontWeight: 600,
              }}
            >
              {payload}
            </div>
            <button
              onClick={() => setExpanded(false)}
              style={{
                marginTop: 4,
                padding: "12px 36px",
                borderRadius: 12,
                border: "none",
                background: "var(--accent)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t("close")}
            </button>
          </div>
          <style>{`
            @keyframes qrFadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes qrScaleIn {
              from { opacity: 0; transform: scale(0.85); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default QrCodeCard;
