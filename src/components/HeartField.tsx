"use client";

const HEARTS = [
  { left: "8%", delay: "0s", size: 12 },
  { left: "22%", delay: "1.4s", size: 16 },
  { left: "41%", delay: "0.7s", size: 11 },
  { left: "58%", delay: "2.1s", size: 14 },
  { left: "73%", delay: "0.3s", size: 13 },
  { left: "88%", delay: "1.8s", size: 15 },
];

export function HeartField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {HEARTS.map((h, i) => (
        <span
          key={i}
          className="heart-float"
          style={{
            left: h.left,
            bottom: "12%",
            animationDelay: h.delay,
            width: h.size,
            height: h.size,
            fontSize: h.size,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
