import { useEffect, useState } from "react";

const STATUS_STEPS = [
  "Checking your session",
  "Finding you on the map",
  "Matching nearby drivers",
  "Ready to roll",
];

export default function LiveSplashScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const [mode, setMode] = useState("car");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setStepIndex((i) => (i + 1) % STATUS_STEPS.length);
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="splash-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }

        .splash-root {
          --bg: #FFFFFF;
          --ink: #14151A;
          --yellow: #F5C518;
          --yellow-deep: #D9A800;
          --yellow-pale: #FFF3C4;
          --muted: #9297A2;

          position: relative;
          width: 100vw;
          height: 100vh;
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          padding: clamp(20px, 4vh, 40px) clamp(20px, 5vw, 56px);
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(22px, 2.6vw, 30px);
          color: var(--ink);
          margin: 0;
          letter-spacing: -0.01em;
        }

        .brand-accent { color: var(--yellow-deep); }

        .toggle {
          display: flex;
          background: #F2F2ED;
          border-radius: 999px;
          padding: 4px;
          gap: 2px;
        }

        .toggle-btn {
          border: none;
          background: transparent;
          padding: 8px 18px;
          border-radius: 999px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: clamp(12px, 1.2vw, 14px);
          color: var(--muted);
          cursor: pointer;
          transition: background 0.25s ease, color 0.25s ease;
        }

        .toggle-btn.active {
          background: var(--ink);
          color: var(--yellow);
        }

        .hero {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 0;
        }

        .glow {
          position: absolute;
          width: min(60vw, 60vh, 480px);
          height: min(60vw, 60vh, 480px);
          border-radius: 50%;
          background: radial-gradient(circle, var(--yellow-pale) 0%, transparent 70%);
          animation: pulse 3.6s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        .vehicle-wrap {
          position: relative;
          width: min(78vw, 62vh, 560px);
          opacity: 0;
          transform: translateY(24px) scale(0.94);
          animation: rise 3.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        @keyframes rise {
          0% { opacity: 0; transform: translateY(24px) scale(0.94); }
          14% { opacity: 1; transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1); }
          86% { transform: translateY(0) scale(1); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .content {
          text-align: left;
        }

        .headline {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(26px, 4vw, 42px);
          color: var(--ink);
          line-height: 1.15;
          margin: 0 0 12px;
          max-width: 12ch;
          opacity: 0;
          animation: fadeUp 0.6s ease forwards 0.15s;
        }

        .status {
          font-size: clamp(14px, 1.6vw, 17px);
          color: var(--muted);
          margin: 0 0 clamp(20px, 3vh, 32px);
          min-height: 22px;
          opacity: 0;
          animation: fadeUp 0.6s ease forwards 0.3s;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          opacity: 0;
          animation: fadeUp 0.6s ease forwards 0.45s;
        }

        .cta-pill {
          flex: 1;
          background: var(--ink);
          color: var(--yellow);
          border: none;
          border-radius: 999px;
          padding: 16px 24px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: clamp(14px, 1.6vw, 16px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        .cta-side {
          width: 52px;
          height: 52px;
          min-width: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cta-side.ring {
          border: 1.5px solid #E4E4DE;
          color: var(--ink);
        }

        .cta-side.filled {
          background: var(--yellow);
          color: var(--ink);
        }

        .dots {
          display: flex;
          gap: 8px;
          margin-top: 18px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #E4E4DE;
          transition: background 0.3s ease, width 0.3s ease;
        }

        .dot.active {
          background: var(--yellow-deep);
          width: 18px;
          border-radius: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
          .glow, .vehicle-wrap { animation: none !important; opacity: 1; transform: none; }
          .headline, .status, .cta-row { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>

      <div className="topbar">
        <p className="brand">
          Odoo <span className="brand-accent">Rides</span>
        </p>
        <div className="toggle">
          <button
            className={`toggle-btn${mode === "car" ? " active" : ""}`}
            onClick={() => setMode("car")}
          >
            Car
          </button>
          <button
            className={`toggle-btn${mode === "bike" ? " active" : ""}`}
            onClick={() => setMode("bike")}
          >
            Bike
          </button>
        </div>
      </div>

      <div className="hero">
        <div className="glow" aria-hidden="true" />
        <div className="vehicle-wrap" key={mode}>
          {mode === "car" ? <CarIllustration /> : <BikeIllustration />}
        </div>
      </div>

      <div className="content">
        <p className="headline">
          Find your ride, share the journey
        </p>
        <p className="status" aria-live="polite">
          {STATUS_STEPS[stepIndex]}
        </p>

        {/* <div className="cta-row">
          <div className="cta-side ring" aria-hidden="true">
            <ArrowIcon direction="left" />
          </div>
          <button className="cta-pill">Get started</button>
          <div className="cta-side filled" aria-hidden="true">
            <ArrowIcon direction="right" />
          </div>
        </div> */}

        <div className="dots" aria-hidden="true">
          {STATUS_STEPS.map((_, i) => (
            <div key={i} className={`dot${i === stepIndex ? " active" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowIcon({ direction }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d={direction === "right" ? "M5 12h14M13 6l6 6-6 6" : "M19 12H5M11 6l-6 6 6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CarIllustration() {
  return (
    <svg viewBox="0 0 400 220" role="img" aria-label="Illustration of a car" style={{ width: "100%", display: "block" }}>
      <ellipse cx="200" cy="196" rx="150" ry="12" fill="#00000012" />
      <path
        d="M50 150 L58 108 C64 92 82 80 100 78 L140 74 C150 62 168 50 190 48 L260 48 C284 48 306 60 318 80 L340 108 L358 116 C368 120 372 128 372 138 L372 150 Z"
        fill="#F5C518"
      />
      <path
        d="M150 76 L188 52 C196 47 206 47 214 52 L258 76 Z"
        fill="#14151A"
        opacity="0.85"
      />
      <path d="M156 78 L190 58 L206 58 L200 78 Z" fill="#FFF3C4" opacity="0.5" />
      <rect x="50" y="150" width="322" height="10" fill="#D9A800" />
      <circle cx="122" cy="160" r="30" fill="#14151A" />
      <circle cx="122" cy="160" r="13" fill="#F5C518" />
      <circle cx="300" cy="160" r="30" fill="#14151A" />
      <circle cx="300" cy="160" r="13" fill="#F5C518" />
      <rect x="336" y="96" width="20" height="10" rx="3" fill="#FFF3C4" />
      <rect x="46" y="112" width="14" height="8" rx="3" fill="#14151A" opacity="0.5" />
    </svg>
  );
}

function BikeIllustration() {
  return (
    <svg viewBox="0 0 400 220" role="img" aria-label="Illustration of a bicycle" style={{ width: "100%", display: "block" }}>
      <ellipse cx="200" cy="196" rx="140" ry="12" fill="#00000012" />
      <circle cx="110" cy="150" r="52" fill="none" stroke="#14151A" strokeWidth="10" />
      <circle cx="290" cy="150" r="52" fill="none" stroke="#14151A" strokeWidth="10" />
      <circle cx="110" cy="150" r="8" fill="#F5C518" />
      <circle cx="290" cy="150" r="8" fill="#F5C518" />
      <path
        d="M110 150 L200 150 L290 150 M200 150 L228 84 M200 150 L150 84 M150 84 L228 84 M228 84 L260 60 M150 84 L96 70"
        stroke="#F5C518"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M74 66 L100 70" stroke="#14151A" strokeWidth="10" strokeLinecap="round" />
      <path d="M250 52 L272 60" stroke="#14151A" strokeWidth="10" strokeLinecap="round" />
      <rect x="192" y="60" width="16" height="26" rx="4" fill="#14151A" />
    </svg>
  );
}