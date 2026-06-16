import { useEffect, useState } from "react";

/**
 * Aurora background — Apple-futuristic frosted glass meets Google's
 * colorful, dynamic blobs. Animated gradient orbs drift behind a
 * heavy blur + grain layer. Boost prop accelerates motion during rolls.
 */
export function AuroraBackground({ boost = false }: { boost?: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0f]">
      {/* Soft base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(40,40,60,0.6),transparent_60%)]" />

      {mounted && (
        <>
          {/* Google-colored orbs */}
          <div
            className="absolute rounded-full blur-3xl opacity-60 mix-blend-screen"
            style={{
              width: 520,
              height: 520,
              left: "5%",
              top: "10%",
              background: "radial-gradient(circle, #4285F4 0%, transparent 70%)",
              animation: `aurora-drift-1 ${boost ? 6 : 18}s ease-in-out infinite`,
            }}
          />
          <div
            className="absolute rounded-full blur-3xl opacity-60 mix-blend-screen"
            style={{
              width: 460,
              height: 460,
              right: "8%",
              top: "15%",
              background: "radial-gradient(circle, #EA4335 0%, transparent 70%)",
              animation: `aurora-drift-2 ${boost ? 7 : 22}s ease-in-out infinite`,
            }}
          />
          <div
            className="absolute rounded-full blur-3xl opacity-55 mix-blend-screen"
            style={{
              width: 540,
              height: 540,
              left: "20%",
              bottom: "5%",
              background: "radial-gradient(circle, #FBBC05 0%, transparent 70%)",
              animation: `aurora-drift-3 ${boost ? 8 : 24}s ease-in-out infinite`,
            }}
          />
          <div
            className="absolute rounded-full blur-3xl opacity-55 mix-blend-screen"
            style={{
              width: 480,
              height: 480,
              right: "15%",
              bottom: "10%",
              background: "radial-gradient(circle, #34A853 0%, transparent 70%)",
              animation: `aurora-drift-4 ${boost ? 6 : 20}s ease-in-out infinite`,
            }}
          />
        </>
      )}

      {/* Frosted glass / noise overlay (Apple) */}
      <div className="absolute inset-0 backdrop-blur-[80px]" />
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Dark vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.6)_100%)]" />

      <style>{`
        @keyframes aurora-drift-1 {
          0%   { transform: translate(0,0) scale(1); filter: hue-rotate(0deg); }
          25%  { transform: translate(180px,60px) scale(1.15); }
          50%  { transform: translate(120px,220px) scale(1.25); filter: hue-rotate(40deg); }
          75%  { transform: translate(-60px,140px) scale(1.1); }
          100% { transform: translate(0,0) scale(1); filter: hue-rotate(0deg); }
        }
        @keyframes aurora-drift-2 {
          0%   { transform: translate(0,0) scale(1); filter: hue-rotate(0deg); }
          25%  { transform: translate(-160px,90px) scale(1.2); }
          50%  { transform: translate(-220px,220px) scale(1.3); filter: hue-rotate(-30deg); }
          75%  { transform: translate(-80px,260px) scale(1.15); }
          100% { transform: translate(0,0) scale(1); filter: hue-rotate(0deg); }
        }
        @keyframes aurora-drift-3 {
          0%   { transform: translate(0,0) scale(1); filter: hue-rotate(0deg); }
          25%  { transform: translate(140px,-120px) scale(1.18); }
          50%  { transform: translate(240px,-60px) scale(1.28); filter: hue-rotate(50deg); }
          75%  { transform: translate(80px,-200px) scale(1.12); }
          100% { transform: translate(0,0) scale(1); filter: hue-rotate(0deg); }
        }
        @keyframes aurora-drift-4 {
          0%   { transform: translate(0,0) scale(1); filter: hue-rotate(0deg); }
          25%  { transform: translate(-180px,-100px) scale(1.22); }
          50%  { transform: translate(-100px,-240px) scale(1.3); filter: hue-rotate(-40deg); }
          75%  { transform: translate(60px,-160px) scale(1.15); }
          100% { transform: translate(0,0) scale(1); filter: hue-rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
