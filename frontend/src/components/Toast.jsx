import React, { useState, useEffect, useCallback } from "react";

const listeners = new Set();
let id = 0;
export const toast = {
  success: (m, d = 3500) => fire({ type: "success", m, d }),
  error: (m, d = 4500) => fire({ type: "error", m, d }),
  info: (m, d = 3500) => fire({ type: "info", m, d }),
};
const fire = (t) => {
  const tid = ++id;
  listeners.forEach((fn) => fn({ ...t, id: tid }));
};

const CFG = {
  success: {
    bg: "#ECFDF5",
    color: "#065F46",
    border: "#A7F3D0",
    icon: (
      <svg
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  error: {
    bg: "#FEF2F2",
    color: "#991B1B",
    border: "#FECACA",
    icon: (
      <svg
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  info: {
    bg: "#EEF2FF",
    color: "#3730A3",
    border: "#C7D2FE",
    icon: (
      <svg
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
};

function Item({ id, type, m, d, onRemove }) {
  const [vis, setVis] = useState(false);
  const c = CFG[type];
  useEffect(() => {
    requestAnimationFrame(() => setVis(true));
    const t = setTimeout(() => {
      setVis(false);
      setTimeout(() => onRemove(id), 280);
    }, d);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      onClick={() => {
        setVis(false);
        setTimeout(() => onRemove(id), 280);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 12,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        fontSize: 13,
        fontWeight: 500,
        maxWidth: 340,
        cursor: "pointer",
        transform: vis ? "translateX(0)" : "translateX(110%)",
        opacity: vis ? 1 : 0,
        transition:
          "transform 0.26s cubic-bezier(.22,1,.36,1), opacity 0.26s ease",
      }}
    >
      <span style={{ flexShrink: 0 }}>{c.icon}</span>
      <span style={{ flex: 1 }}>{m}</span>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback(
    (tid) => setToasts((p) => p.filter((t) => t.id !== tid)),
    [],
  );
  useEffect(() => {
    const h = (t) => setToasts((p) => [...p, t]);
    listeners.add(h);
    return () => listeners.delete(h);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "auto" }}>
          <Item {...t} onRemove={remove} />
        </div>
      ))}
    </div>
  );
}
