import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "אתר רנדומלי - גלה אתרים חדשים" },
      { name: "description", content: "לחץ על הכפתור וקבל אתר רנדומלי ובטוח לגלישה" },
    ],
  }),
  component: Index,
});

const SAFE_SITES = [
  "https://www.wikipedia.org",
  "https://www.nationalgeographic.com",
  "https://www.nasa.gov",
  "https://www.bbc.com",
  "https://www.khanacademy.org",
  "https://www.ted.com",
  "https://www.coursera.org",
  "https://www.edx.org",
  "https://www.duolingo.com",
  "https://www.archive.org",
  "https://www.gutenberg.org",
  "https://www.smithsonianmag.com",
  "https://www.metmuseum.org",
  "https://www.britannica.com",
  "https://www.howstuffworks.com",
  "https://www.sciencedaily.com",
  "https://www.nature.com",
  "https://www.scientificamerican.com",
  "https://www.mentalfloss.com",
  "https://www.atlasobscura.com",
  "https://www.openculture.com",
  "https://www.mit.edu",
  "https://ocw.mit.edu",
  "https://www.stackoverflow.com",
  "https://github.com",
  "https://www.codecademy.com",
  "https://www.freecodecamp.org",
  "https://www.unsplash.com",
  "https://www.pexels.com",
  "https://www.behance.net",
  "https://www.dribbble.com",
  "https://www.goodreads.com",
  "https://www.imdb.com",
  "https://www.allrecipes.com",
  "https://www.weather.com",
  "https://www.timeanddate.com",
  "https://www.geoguessr.com",
  "https://www.google.com/arts",
  "https://earth.google.com",
  "https://www.windy.com",
  "https://radio.garden",
  "https://www.pudding.cool",
  "https://neal.fun",
  "https://www.boredpanda.com",
  "https://xkcd.com",
  "https://www.reddit.com/r/todayilearned",
  "https://quickdraw.withgoogle.com",
  "https://experiments.withgoogle.com",
  "https://www.mozilla.org",
  "https://developer.mozilla.org",
];

function Index() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    const url = SAFE_SITES[Math.floor(Math.random() * SAFE_SITES.length)];
    setCount((c) => c + 1);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 text-white p-6" dir="rtl">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          🎲 אתר רנדומלי
        </h1>
        <p className="text-lg md:text-xl text-white/80">
          לחץ על הכפתור וגלה אתר חדש ומעניין. כל האתרים נבחרו בקפידה - בטוחים, ידידותיים ונקיים מתוכן לא הולם.
        </p>

        <button
          onClick={handleClick}
          className="group relative px-12 py-6 text-2xl font-bold rounded-full bg-white text-purple-900 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 hover:shadow-pink-500/50"
        >
          🚀 שגר אותי לאתר רנדומלי!
        </button>

        {count > 0 && (
          <p className="text-white/60 text-sm">
            שיגרת את עצמך {count} פעמים 🎉
          </p>
        )}

        <div className="pt-8 text-sm text-white/50">
          {SAFE_SITES.length} אתרים בטוחים במאגר
        </div>
      </div>
    </div>
  );
}
