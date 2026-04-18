interface Props {
  size?: number;
  label?: string;
  fullscreen?: boolean;
}

/**
 * Animated coffee-cup loader: beans drop from above into the cup,
 * the liquid level rises, and steam drifts up. Pure CSS/SVG — no libs.
 */
const CoffeeLoader = ({ size = 96, label, fullscreen = false }: Props) => {
  const wrap: React.CSSProperties = fullscreen
    ? {
        position: "fixed",
        inset: 0,
        background: "var(--bg-primary, #fff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        zIndex: 9999,
      }
    : {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
        padding: 24,
      };

  return (
    <div style={wrap} role="status" aria-live="polite" aria-label={label || "Loading"}>
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
        }}
      >
        {/* Steam */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: size * 0.5,
            height: size * 0.28,
            pointerEvents: "none",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                bottom: 0,
                left: `${15 + i * 30}%`,
                width: 4,
                height: size * 0.22,
                borderRadius: 4,
                background:
                  "linear-gradient(to top, rgba(180,140,110,0.55), rgba(180,140,110,0))",
                animation: `coffee-steam 2.2s ease-in-out ${i * 0.35}s infinite`,
                transformOrigin: "bottom center",
                opacity: 0,
              }}
            />
          ))}
        </div>

        {/* Falling beans */}
        <div
          style={{
            position: "absolute",
            top: size * 0.22,
            left: "50%",
            transform: "translateX(-50%)",
            width: size * 0.5,
            height: size * 0.22,
            pointerEvents: "none",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                top: 0,
                left: `${20 + i * 28}%`,
                width: 8,
                height: 10,
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                background: "#5B3A29",
                boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.3)",
                animation: `coffee-bean-fall 1.4s ease-in ${i * 0.25}s infinite`,
                opacity: 0,
              }}
            />
          ))}
        </div>

        {/* Cup */}
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <clipPath id="cup-clip">
              {/* Inner cavity (matches inner cup shape) */}
              <path d="M26 46 Q26 80 50 82 Q74 80 74 46 Z" />
            </clipPath>
          </defs>

          {/* Handle */}
          <path
            d="M76 54 Q92 54 92 66 Q92 78 76 78"
            fill="none"
            stroke="var(--accent, #E86A33)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Cup body */}
          <path
            d="M24 44 H76 V72 Q76 86 50 86 Q24 86 24 72 Z"
            fill="var(--card-bg, #fff)"
            stroke="var(--accent, #E86A33)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Liquid (rises via animation) */}
          <g clipPath="url(#cup-clip)">
            <rect x="24" y="46" width="52" height="40">
              <animate
                attributeName="y"
                values="86;50;86"
                keyTimes="0;0.7;1"
                dur="2.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fill"
                values="#7b4a2e;#7b4a2e;#7b4a2e"
                dur="2.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="height"
                values="0;36;0"
                keyTimes="0;0.7;1"
                dur="2.8s"
                repeatCount="indefinite"
              />
            </rect>
          </g>

          {/* Saucer */}
          <ellipse
            cx="50"
            cy="90"
            rx="30"
            ry="5"
            fill="var(--accent, #E86A33)"
            opacity="0.9"
          />
        </svg>
      </div>

      {label && (
        <span
          style={{
            fontSize: 13,
            color: "var(--text-muted, #888)",
            fontWeight: 500,
            letterSpacing: 0.3,
          }}
        >
          {label}
        </span>
      )}

      <style>{`
        @keyframes coffee-bean-fall {
          0% { transform: translateY(-140%) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          70% { transform: translateY(120%) rotate(220deg); opacity: 1; }
          71%, 100% { opacity: 0; }
        }
        @keyframes coffee-steam {
          0% { transform: translateY(0) scaleY(0.6); opacity: 0; }
          30% { opacity: 0.7; }
          100% { transform: translateY(-${Math.round(size * 0.3)}px) scaleY(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CoffeeLoader;
