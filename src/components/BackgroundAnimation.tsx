import { useEffect, useState } from "react";

// Background animation — rapidly cycling images via picsum.photos.
// Acts as a "portal jump" visual between sites.
export function BackgroundAnimation({ speed = 800 }: { speed?: number }) {
  const [seed, setSeed] = useState(1);

  useEffect(() => {
    const id = setInterval(() => setSeed((s) => s + 1), speed);
    return () => clearInterval(id);
  }, [speed]);

  // Show two stacked images crossfading.
  const urlA = `https://picsum.photos/seed/r${seed}/800/600`;
  const urlB = `https://picsum.photos/seed/r${seed + 1}/800/600`;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <img
        key={urlA}
        src={urlA}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30 blur-sm animate-[fade-in_0.6s_ease-out]"
      />
      <img
        key={urlB}
        src={urlB}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen animate-[scale-in_0.6s_ease-out]"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-purple-950/70 to-pink-950/80" />
    </div>
  );
}
