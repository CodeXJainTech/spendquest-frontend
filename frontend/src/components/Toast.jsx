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
    cls: "bg-emerald-50 border-emerald-200 text-emerald-800",
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
    cls: "bg-red-50 border-red-200 text-red-800",
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
    cls: "bg-indigo-50 border-indigo-200 text-indigo-800",
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
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px] font-medium max-w-[340px] cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.10)] ${c.cls}`}
      style={{
        transform: vis ? "translateX(0)" : "translateX(110%)",
        opacity: vis ? 1 : 0,
        transition:
          "transform 0.26s cubic-bezier(.22,1,.36,1), opacity 0.26s ease",
      }}
    >
      <span className="shrink-0">{c.icon}</span>
      <span className="flex-1">{m}</span>
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
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[9999] pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Item {...t} onRemove={remove} />
        </div>
      ))}
    </div>
  );
}
