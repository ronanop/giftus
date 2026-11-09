"use client";

const HEARTS = [
  { left: "7%", delay: "0s", size: 13, color: "var(--rose)" },
  { left: "18%", delay: "1.6s", size: 17, color: "var(--marigold)" },
  { left: "33%", delay: "0.8s", size: 12, color: "var(--rose)" },
  { left: "49%", delay: "2.3s", size: 15, color: "var(--blush)" },
  { left: "64%", delay: "0.4s", size: 14, color: "var(--rose)" },
  { left: "78%", delay: "1.9s", size: 16, color: "var(--marigold)" },
  { left: "90%", delay: "1.1s", size: 12, color: "var(--rose-deep)" },
];

const PETALS = [
  { left: "12%", delay: "0.2s", duration: "10s", rotate: -20 },
  { left: "28%", delay: "2.4s", duration: "12s", rotate: 35 },
  { left: "55%", delay: "1.1s", duration: "11s", rotate: -12 },
  { left: "72%", delay: "3.2s", duration: "13s", rotate: 28 },
  { left: "86%", delay: "0.7s", duration: "9.5s", rotate: -30 },
];

function HeartIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 21s-6.7-4.35-9.33-8.1C.7 9.9 1.5 6.4 4.4 5.1c1.9-.85 4.1-.2 5.3 1.45C10.9 4.9 13.1 4.25 15 5.1c2.9 1.3 3.7 4.8 1.73 7.8C18.7 16.65 12 21 12 21z" />
    </svg>
  );
}

function PetalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 3c2.8 3.2 4.8 6.2 4.8 9.2 0 2.9-2.1 5.3-4.8 5.3S7.2 15.1 7.2 12.2C7.2 9.2 9.2 6.2 12 3z"
        fill="var(--rose)"
        opacity="0.75"
      />
    </svg>
  );
}

export function HeartField({ dense = false }: { dense?: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {(dense ? HEARTS : HEARTS.slice(0, 5)).map((h, i) => (
        <span
          key={`h-${i}`}
          className="heart-float"
          style={{
            left: h.left,
            bottom: "10%",
            animationDelay: h.delay,
            color: h.color,
          }}
        >
          <HeartIcon size={h.size} />
        </span>
      ))}
      {PETALS.map((p, i) => (
        <span
          key={`p-${i}`}
          className="petal-float"
          style={{
            left: p.left,
            top: "-8%",
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          <PetalIcon />
        </span>
      ))}
    </div>
  );
}
