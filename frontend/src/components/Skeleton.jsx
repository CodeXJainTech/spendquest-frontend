import React from "react";

const S = ({ w, h, r = 8, className = "" }) => (
  <div
    className={`shrink-0 ${className}`}
    style={{
      width: w || "100%",
      height: h,
      borderRadius: r,
      background:
        "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
      backgroundSize: "400px 100%",
      animation: "skShimmer 1.5s ease-in-out infinite",
    }}
  />
);

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 ${className}`}
  >
    {children}
  </div>
);
const Row = ({ children, className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>{children}</div>
);

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <S h={160} r={20} />
      <div
        className="grid gap-3.5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="!p-5">
            <S h={12} w={80} className="mb-3.5" />
            <S h={28} w={100} />
          </Card>
        ))}
      </div>
      <Card>
        <S h={18} w={140} className="mb-5" />
        <S h={200} />
      </Card>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <S h={18} w={180} />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50"
          >
            <S h={32} w={32} r={8} />
            <S h={13} className="flex-1" />
            <S h={13} w={80} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Row className="gap-3">
        <S h={28} w={160} />
        <div className="flex-1" />
        <S h={38} w={140} />
        <S h={38} w={90} />
      </Row>
      <Row>
        <S h={38} className="flex-1" />
        <S h={38} w={150} />
      </Row>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <S h={44} r={0} style={{ borderRadius: "16px 16px 0 0" }} />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50"
          >
            <S h={36} w={36} r={10} />
            <S h={13} className="flex-1" />
            <S h={13} w={80} />
            <S h={22} w={55} r={99} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 4 }) {
  return (
    <div className="flex flex-col gap-5">
      <Row>
        <S h={28} w={120} />
        <div className="flex-1" />
        <S h={38} w={130} />
      </Row>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="!p-[22px]">
            <Row className="gap-3 mb-4">
              <S h={44} w={44} r={12} />
              <div className="flex-1">
                <S h={14} w={100} className="mb-1.5" />
                <S h={11} w={70} />
              </div>
            </Row>
            <S h={8} r={99} className="mb-3" />
            <Row>
              <S h={12} w={90} />
              <div className="flex-1" />
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
    <div className="max-w-[520px] flex flex-col gap-5">
      <S h={28} w={140} />
      <Card>
        <S h={52} w={52} r={14} className="mb-6" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-[18px]">
            <S h={11} w={80} className="mb-2" />
            <S h={42} r={10} />
          </div>
        ))}
        <S h={44} r={10} />
      </Card>
    </div>
  );
}
