import { useEffect, useState } from "react";
import { SITES } from "@/lib/sites";

// Cool animation: many "browser windows" pop open at once across the screen,
// each showing a random site URL — gives the feeling of dozens of tabs
// erupting like a portal.

interface Tile {
  id: number;
  url: string;
  name: string;
  top: number;
  left: number;
  width: number;
  height: number;
  rotate: number;
  delay: number;
  hue: number;
  img: string;
}

function makeTiles(count: number): Tile[] {
  const out: Tile[] = [];
  for (let i = 0; i < count; i++) {
    const s = SITES[Math.floor(Math.random() * SITES.length)];
    out.push({
      id: Math.random(),
      url: s.url,
      name: s.name,
      top: Math.random() * 100,
      left: Math.random() * 100,
      width: 140 + Math.random() * 160,
      height: 90 + Math.random() * 110,
      rotate: (Math.random() - 0.5) * 30,
      delay: Math.random() * 1.2,
      hue: Math.floor(Math.random() * 360),
      img: `https://picsum.photos/seed/${Math.floor(Math.random() * 100000)}/320/200`,
    });
  }
  return out;
}

export function PortalAnimation() {
  const [tiles, setTiles] = useState<Tile[]>(() => makeTiles(28));

  useEffect(() => {
    const t = setInterval(() => setTiles(makeTiles(28)), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* deep gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a0b2e_0%,#0a0014_70%,#000_100%)]" />

      {/* swirling glow */}
      <div className="absolute inset-0 opacity-60 mix-blend-screen">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-[conic-gradient(from_0deg,#ec4899,#8b5cf6,#3b82f6,#ec4899)] blur-3xl animate-[spin_18s_linear_infinite]" />
      </div>

      {/* exploding tiles */}
      {tiles.map((t) => (
        <div
          key={t.id}
          className="absolute rounded-lg overflow-hidden shadow-2xl border border-white/10 animate-[portal-pop_2.6s_ease-out_forwards]"
          style={{
            top: `${t.top}%`,
            left: `${t.left}%`,
            width: t.width,
            height: t.height,
            transform: `translate(-50%,-50%) rotate(${t.rotate}deg)`,
            animationDelay: `${t.delay}s`,
            filter: `hue-rotate(${t.hue}deg)`,
          }}
        >
          <img
            src={t.img}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-0 left-0 right-0 h-5 bg-black/70 flex items-center px-2 gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[8px] text-white/70 truncate ml-1">{t.url}</span>
          </div>
        </div>
      ))}

      {/* dark vignette so foreground stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />

      <style>{`
        @keyframes portal-pop {
          0%   { opacity: 0; transform: translate(-50%,-50%) rotate(0deg) scale(0.2); }
          25%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%,-50%) rotate(var(--r,0deg)) scale(1.15); }
        }
      `}</style>
    </div>
  );
}
