import React from "react";

const S = ({ w, h, r = 8, style = {} }) => (
  <div
    style={{
      width: w || "100%",
      height: h,
      borderRadius: r,
      background:
        "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
      backgroundSize: "400px 100%",
      animation: "skShimmer 1.5s ease-in-out infinite",
      flexShrink: 0,
      ...style,
    }}
  />
);

if (typeof document !== "undefined" && !document.getElementById("sk-kf")) {
  const el = document.createElement("style");
  el.id = "sk-kf";
  el.textContent = `@keyframes skShimmer { 0%{background-position:400px 0} 100%{background-position:-400px 0} }`;
  document.head.appendChild(el);
}

const Card = ({ children, p = 24 }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 20,
      border: "1px solid #E5E7EB",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      padding: p,
    }}
  >
    {children}
  </div>
);
const Row = ({ gap = 12, mb = 0, children }) => (
  <div style={{ display: "flex", gap, marginBottom: mb, alignItems: "center" }}>
    {children}
  </div>
);

export function DashboardSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <S h={160} r={20} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 14,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} p={20}>
            <S h={12} w={80} style={{ marginBottom: 14 }} />
            <S h={28} w={100} />
          </Card>
        ))}
      </div>
      <Card>
        <S h={18} w={140} style={{ marginBottom: 20 }} />
        <S h={200} />
      </Card>
      <Card p={0}>
        <div
          style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB" }}
        >
          <S h={18} w={180} />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #F3F4F6",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <S h={32} w={32} r={8} style={{ flexShrink: 0 }} />
            <S h={13} style={{ flex: 1 }} />
            <S h={13} w={80} />
          </div>
        ))}
      </Card>
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Row gap={12}>
        <S h={28} w={160} />
        <div style={{ flex: 1 }} />
        <S h={38} w={140} />
        <S h={38} w={90} />
      </Row>
      <Row gap={10}>
        <S h={38} style={{ flex: 1 }} />
        <S h={38} w={150} />
      </Row>
      <Card p={0}>
        <S h={44} r={0} style={{ borderRadius: "20px 20px 0 0" }} />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #F3F4F6",
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            <S h={36} w={36} r={10} style={{ flexShrink: 0 }} />
            <S h={13} style={{ flex: 1 }} />
            <S h={13} w={80} />
            <S h={22} w={55} r={99} />
          </div>
        ))}
      </Card>
    </div>
  );
}

export function CardGridSkeleton({ count = 4 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Row gap={12}>
        <S h={28} w={120} />
        <div style={{ flex: 1 }} />
        <S h={38} w={130} />
      </Row>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 16,
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} p={22}>
            <Row gap={12} mb={18}>
              <S h={44} w={44} r={12} />
              <div style={{ flex: 1 }}>
                <S h={14} w={100} style={{ marginBottom: 6 }} />
                <S h={11} w={70} />
              </div>
            </Row>
            <S h={8} r={99} style={{ marginBottom: 12 }} />
            <Row gap={0}>
              <S h={12} w={90} />
              <div style={{ flex: 1 }} />
              <S h={22} w={70} r={99} />
            </Row>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div
      style={{
        maxWidth: 520,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <S h={28} w={140} />
      <Card>
        <S h={52} w={52} r={14} style={{ marginBottom: 24 }} />
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <S h={11} w={80} style={{ marginBottom: 8 }} />
            <S h={42} r={10} />
          </div>
        ))}
        <S h={44} r={10} />
      </Card>
    </div>
  );
}
