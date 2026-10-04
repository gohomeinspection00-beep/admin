import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Warna brand GoXpert
const INK = "#1d1a33";
const PAPER = "#f6f2e7";
const ACCENT = "#f6c33b";

export const HelloGoXpert: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12 } });
  const barWidth = interpolate(frame, [15, 45], [0, 100], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: INK, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `scale(${scale})`,
          color: PAPER,
          fontFamily: "sans-serif",
          fontWeight: 800,
          fontSize: 120,
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        GoXpert
        <div style={{ height: 16, width: `${barWidth}%`, background: ACCENT, margin: "24px auto 0" }} />
      </div>
    </AbsoluteFill>
  );
};
