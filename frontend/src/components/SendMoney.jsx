import React, { useState, useEffect } from "react";
import { toast } from "./Toast";

export default function SendMoney({
  prefillPayee,
  refreshDashboard,
  authAxios,
}) {
  const [form, setForm] = useState({ toUsername: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(null);

  useEffect(() => {
    if (prefillPayee) setForm((p) => ({ ...p, toUsername: prefillPayee }));
  }, [prefillPayee]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.toUsername || Number(form.amount) <= 0) {
      toast.error("Enter a valid recipient and amount");
      return;
    }
    setLoading(true);
    try {
      await authAxios.post("/account/transfer", {
        amount: Number(form.amount),
        toUsername: form.toUsername,
      });
      setSent({ to: form.toUsername, amount: form.amount });
      setForm({ toUsername: "", amount: "" });
      toast.success(`₹${form.amount} sent to ${form.toUsername}`);
      refreshDashboard();
    } catch (e) {
      toast.error(e.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 520,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
      className="animate-fade-up"
    >
      <div>
        <div className="page-title">Send Money</div>
        <div style={{ fontSize: "0.8rem", color: "var(--t4)", marginTop: 3 }}>
          Transfer funds to another SpendQuest user
        </div>
      </div>

      {sent && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 20px",
            borderRadius: "var(--r-lg)",
            background: "var(--green-bg)",
            border: "1px solid #A7F3D0",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: "var(--green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                color: "var(--green-text)",
                fontFamily: "var(--font-display)",
              }}
            >
              Transfer complete
            </div>
            <div style={{ fontSize: "0.8rem", color: "#065F46", marginTop: 2 }}>
              ₹{sent.amount} sent to {sent.to}
            </div>
          </div>
          <button
            onClick={() => setSent(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--green)",
              padding: 4,
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      <div className="card card-p">
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "14px",
            background: "var(--brand-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="var(--brand)"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>

        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <div>
            <label className="label">Recipient Username / Email</label>
            <input
              name="toUsername"
              className="input"
              placeholder="Enter username or email"
              value={form.toUsername}
              onChange={(e) =>
                setForm((p) => ({ ...p, toUsername: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="label">Amount (₹)</label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--t3)",
                }}
              >
                ₹
              </span>
              <input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                className="input"
                style={{
                  paddingLeft: 30,
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  letterSpacing: "-0.02em",
                }}
                placeholder="0.00"
                value={form.amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderRadius: "var(--r-md)",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              fontSize: "0.8rem",
              color: "var(--t3)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Transfers are instant and cannot be reversed. Double-check the
            username before sending.
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px", fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="spin"
                >
                  <circle cx="12" cy="12" r="9" strokeDasharray="28 56" />
                </svg>{" "}
                Processing…
              </>
            ) : (
              <>Send ₹{form.amount || "0.00"} →</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
