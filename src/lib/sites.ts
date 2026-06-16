// Massive curated list of safe websites with rarity tiers.
// Rarity is computed from weight: rarer = lower weight = higher "1 in X".

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

export interface Site {
  url: string;
  name: string;
  weight: number;
}

const RARITY_BUCKETS: { tier: Rarity; min: number; color: string; emoji: string }[] = [
  { tier: "mythic", min: 0, color: "from-fuchsia-500 to-rose-500", emoji: "🌌" },
  { tier: "legendary", min: 0.2, color: "from-amber-400 to-orange-500", emoji: "👑" },
  { tier: "epic", min: 1, color: "from-purple-500 to-indigo-500", emoji: "💎" },
  { tier: "rare", min: 4, color: "from-blue-500 to-cyan-500", emoji: "🔷" },
  { tier: "uncommon", min: 15, color: "from-emerald-500 to-green-500", emoji: "🟢" },
  { tier: "common", min: 50, color: "from-slate-400 to-slate-500", emoji: "⚪" },
];

// ---------- CURATED TOP-TIER (very rare, hand picked gems) ----------
const MYTHIC: [string, string][] = [
  ["https://www.musicforprogramming.net", "Music For Programming"],
  ["https://radio.garden", "Radio Garden"],
  ["https://neal.fun/space-elevator", "Space Elevator"],
  ["https://neal.fun/deep-sea", "The Deep Sea"],
  ["https://neal.fun/size-of-space", "Size of Space"],
  ["https://www.windy.com", "Windy.com"],
  ["https://earth.nullschool.net", "Earth Wind Map"],
  ["https://stars.chromeexperiments.com", "100,000 Stars"],
  ["https://patatap.com", "Patatap"],
  ["https://www.pointerpointer.com", "Pointer Pointer"],
  ["https://thisrentaldoesnotexist.com", "This Rental Does Not Exist"],
  ["https://staggeringbeauty.com", "Staggering Beauty"],
  ["https://www.chromeexperiments.com", "Chrome Experiments"],
  ["https://www.geoguessr.com", "GeoGuessr"],
  ["https://quickdraw.withgoogle.com", "Quick Draw"],
];

const LEGENDARY: [string, string][] = [
  ["https://www.atlasobscura.com", "Atlas Obscura"],
  ["https://www.openculture.com", "Open Culture"],
  ["https://www.pudding.cool", "The Pudding"],
  ["https://longreads.com", "Longreads"],
  ["https://aeon.co", "Aeon"],
  ["https://www.smithsonianmag.com", "Smithsonian Magazine"],
  ["https://www.metmuseum.org", "The Met Museum"],
  ["https://artsandculture.google.com", "Google Arts & Culture"],
  ["https://earth.google.com/web", "Google Earth"],
  ["https://www.nationalgeographic.com", "National Geographic"],
  ["https://www.britannica.com", "Britannica"],
  ["https://www.gutenberg.org", "Project Gutenberg"],
  ["https://archive.org", "Internet Archive"],
  ["https://en.wikipedia.org/wiki/Special:Random", "Wikipedia Random"],
  ["https://www.ted.com", "TED Talks"],
  ["https://ocw.mit.edu", "MIT OpenCourseWare"],
  ["https://www.khanacademy.org", "Khan Academy"],
  ["https://www.coursera.org", "Coursera"],
  ["https://www.edx.org", "edX"],
  ["https://www.duolingo.com", "Duolingo"],
  ["https://experiments.withgoogle.com", "Google Experiments"],
  ["https://xkcd.com", "xkcd"],
  ["https://what-if.xkcd.com", "What If? xkcd"],
  ["https://www.scotthyoung.com", "Scott H Young"],
  ["https://waitbutwhy.com", "Wait But Why"],
  ["https://www.lesswrong.com", "LessWrong"],
  ["https://news.ycombinator.com", "Hacker News"],
  ["https://www.brainpickings.org", "The Marginalian"],
  ["https://kottke.org", "Kottke"],
  ["https://www.boredpanda.com", "Bored Panda"],
];

const EPIC: [string, string][] = [
  ["https://www.bbc.com", "BBC"],
  ["https://www.reuters.com", "Reuters"],
  ["https://www.npr.org", "NPR"],
  ["https://www.nasa.gov", "NASA"],
  ["https://apod.nasa.gov", "Astronomy Picture of the Day"],
  ["https://www.esa.int", "European Space Agency"],
  ["https://www.nature.com", "Nature"],
  ["https://www.scientificamerican.com", "Scientific American"],
  ["https://www.sciencedaily.com", "Science Daily"],
  ["https://www.newscientist.com", "New Scientist"],
  ["https://www.howstuffworks.com", "How Stuff Works"],
  ["https://www.mentalfloss.com", "Mental Floss"],
  ["https://www.theatlantic.com", "The Atlantic"],
  ["https://www.economist.com", "The Economist"],
  ["https://www.newyorker.com", "The New Yorker"],
  ["https://www.wired.com", "Wired"],
  ["https://www.theverge.com", "The Verge"],
  ["https://arstechnica.com", "Ars Technica"],
  ["https://techcrunch.com", "TechCrunch"],
  ["https://www.engadget.com", "Engadget"],
  ["https://www.imdb.com", "IMDb"],
  ["https://www.rottentomatoes.com", "Rotten Tomatoes"],
  ["https://letterboxd.com", "Letterboxd"],
  ["https://www.goodreads.com", "Goodreads"],
  ["https://www.allrecipes.com", "Allrecipes"],
  ["https://www.bonappetit.com", "Bon Appétit"],
  ["https://www.seriouseats.com", "Serious Eats"],
  ["https://www.unsplash.com", "Unsplash"],
  ["https://www.pexels.com", "Pexels"],
  ["https://www.pixabay.com", "Pixabay"],
  ["https://www.behance.net", "Behance"],
  ["https://dribbble.com", "Dribbble"],
  ["https://www.artstation.com", "ArtStation"],
  ["https://codepen.io", "CodePen"],
  ["https://github.com/trending", "GitHub Trending"],
  ["https://stackoverflow.com", "Stack Overflow"],
  ["https://developer.mozilla.org", "MDN Web Docs"],
  ["https://www.freecodecamp.org", "freeCodeCamp"],
  ["https://www.codecademy.com", "Codecademy"],
  ["https://www.mit.edu", "MIT"],
  ["https://www.harvard.edu", "Harvard"],
  ["https://www.stanford.edu", "Stanford"],
  ["https://www.weather.com", "Weather.com"],
  ["https://www.timeanddate.com", "Time and Date"],
  ["https://www.wolframalpha.com", "Wolfram Alpha"],
  ["https://translate.google.com", "Google Translate"],
  ["https://maps.google.com", "Google Maps"],
  ["https://scholar.google.com", "Google Scholar"],
  ["https://books.google.com", "Google Books"],
  ["https://www.youtube.com/feed/trending", "YouTube Trending"],
  ["https://music.youtube.com", "YouTube Music"],
];

// Big procedural list — Wikipedia article topics (kept SFW)
const WIKI_TOPICS = [
  "Photosynthesis","Black_hole","Quantum_mechanics","Renaissance","Industrial_Revolution",
  "Albert_Einstein","Isaac_Newton","Marie_Curie","Leonardo_da_Vinci","Nikola_Tesla",
  "World_War_I","World_War_II","Cold_War","Roman_Empire","Byzantine_Empire",
  "Ancient_Egypt","Ancient_Greece","Ancient_Rome","Mesopotamia","Aztec_Empire",
  "Inca_Empire","Maya_civilization","Vikings","Samurai","Knights_Templar",
  "Eiffel_Tower","Great_Wall_of_China","Pyramids_of_Giza","Stonehenge","Machu_Picchu",
  "Taj_Mahal","Colosseum","Statue_of_Liberty","Mount_Everest","Amazon_rainforest",
  "Sahara","Antarctica","Pacific_Ocean","Mariana_Trench","Grand_Canyon",
  "Niagara_Falls","Great_Barrier_Reef","Galapagos_Islands","Yellowstone_National_Park","Mount_Fuji",
  "Solar_System","Milky_Way","Andromeda_Galaxy","Mars","Jupiter",
  "Saturn","Venus","Mercury_(planet)","Pluto","Moon",
  "Sun","Hubble_Space_Telescope","James_Webb_Space_Telescope","International_Space_Station","Apollo_11",
  "DNA","Evolution","Charles_Darwin","Periodic_table","Atom",
  "Big_Bang","String_theory","Theory_of_relativity","Schrödinger's_cat","Higgs_boson",
  "Internet","World_Wide_Web","Computer","Smartphone","Artificial_intelligence",
  "Machine_learning","Cryptography","Blockchain","Linux","Open_source",
  "Mozart","Beethoven","Bach","Chopin","Tchaikovsky",
  "The_Beatles","Pink_Floyd","Queen_(band)","Bob_Dylan","Michael_Jackson",
  "Shakespeare","Homer","Dante_Alighieri","Mark_Twain","Jane_Austen",
  "Tolkien","C._S._Lewis","Agatha_Christie","Stephen_King","Haruki_Murakami",
  "Van_Gogh","Picasso","Monet","Michelangelo","Frida_Kahlo",
  "Football","Basketball","Tennis","Chess","Olympic_Games",
  "FIFA_World_Cup","Formula_One","Marathon","Yoga","Martial_arts",
  "Coffee","Tea","Chocolate","Wine","Sushi",
  "Pizza","Pasta","Bread","Cheese","Honey",
  "Dog","Cat","Lion","Tiger","Elephant",
  "Whale","Dolphin","Octopus","Eagle","Hummingbird",
  "Bee","Ant","Butterfly","Tardigrade","Axolotl",
  "Oak","Bamboo","Rose","Sunflower","Cactus",
  "Philosophy","Stoicism","Buddhism","Christianity","Islam",
  "Judaism","Hinduism","Taoism","Existentialism","Mythology",
  "Greek_mythology","Norse_mythology","Egyptian_mythology","Hindu_mythology","Japanese_mythology",
  "Economics","Capitalism","Game_theory","Behavioral_economics","Stock_market",
  "Bitcoin","Ethereum","Federal_Reserve","World_Bank","Inflation",
  "Psychology","Sigmund_Freud","Carl_Jung","Cognitive_bias","Meditation",
  "Sleep","Dream","Memory","Consciousness","Emotion",
  "Tokyo","New_York_City","London","Paris","Rome",
  "Berlin","Moscow","Beijing","Mumbai","Cairo",
  "Sydney","Rio_de_Janeiro","Istanbul","Dubai","Singapore",
  "Iceland","Japan","Norway","Switzerland","New_Zealand",
  "Canada","Brazil","India","Australia","South_Africa",
  "Renewable_energy","Solar_power","Wind_power","Nuclear_power","Climate_change",
  "Recycling","Biodiversity","Ecosystem","Coral_reef","Deforestation",
  "Volcano","Earthquake","Tsunami","Hurricane","Tornado",
  "Aurora_(astronomy)","Rainbow","Lightning","Fog","Snowflake",
  "Bicycle","Train","Airplane","Submarine","Rocket",
  "Tesla,_Inc.","SpaceX","Apple_Inc.","Google","Microsoft",
  "Wikipedia","YouTube","Reddit","Linux_kernel","Python_(programming_language)",
];

const SUBREDDITS = [
  "todayilearned","explainlikeimfive","askscience","space","earthporn",
  "art","food","books","movies","music","history","futurology","science",
  "documentaries","getmotivated","mildlyinteresting","interestingasfuck",
  "damnthatsinteresting","oddlysatisfying","oddlyspecific","upliftingnews",
  "humansbeingbros","madeleamazing","nottheonion","outoftheloop","bestof",
  "philosophy","stoicism","mathematics","physics","chemistry","biology",
  "programming","learnprogramming","webdev","python","rust","golang",
  "linux","apple","android","gadgets","technology","hardware",
  "buildapc","minimalism","unixporn","linuxporn","battlestations",
  "drawing","painting","sketches","illustration","graphicdesign",
  "photography","photocritique","analog","streetphotography",
  "writing","writingprompts","books","fantasy","scifi","worldbuilding",
  "cooking","food","recipes","foodporn","mealprepsunday","baking",
  "coffee","tea","wine","beer","whiskey",
  "fitness","running","bodyweightfitness","climbing","cycling","hiking",
  "camping","nationalparks","backpacking","earthporn","skyporn","villageporn",
  "languagelearning","duolingo","etymology","linguistics",
  "askreddit","casualconversation","showerthoughts","tipofmytongue",
  "lifeprotips","yousuckatcooking","frugal","personalfinance",
  "boardgames","tabletopgames","chess","gogame","puzzles",
  "askhistorians","badhistory","ancientcoins","archaeology",
  "space","astronomy","spaceporn","nasa","cosmology",
  "nature","birding","whatsthisbird","whatsthisplant","whatsthisbug",
  "aww","eyebleach","rarepuppers","dogpictures","catpictures","catloaf",
  "natureismetal","hardcorenature","unexpected","blackmagicfuckery",
  "papertowns","cityporn","mapporn","designporn","architecture",
  "internetisbeautiful","webgames","incremental_games",
];

const GH_TOPICS = [
  "javascript","typescript","python","rust","go","ruby","java","kotlin","swift",
  "react","vue","svelte","angular","nextjs","nuxt","astro","tailwindcss",
  "nodejs","deno","bun","express","fastapi","django","flask","rails",
  "machine-learning","deep-learning","artificial-intelligence","computer-vision",
  "natural-language-processing","data-science","data-visualization",
  "android","ios","flutter","react-native","game-development","unity","godot",
  "blockchain","cryptocurrency","web3","ethereum","solidity",
  "devops","docker","kubernetes","terraform","ansible","aws","azure","gcp",
  "linux","macos","windows","cli","tui","gui","desktop","electron",
  "security","cryptography","privacy","networking","ssh","vpn",
  "database","postgresql","mysql","sqlite","mongodb","redis","graphql",
  "design","ui","ux","css","animation","webgl","threejs",
  "education","tutorial","awesome","awesome-list","resources","cheatsheet",
  "open-source","hacktoberfest","good-first-issue","beginner","learning",
  "productivity","note-taking","markdown","static-site-generator",
  "music","audio","video","image-processing","pdf","markdown-editor",
  "robotics","embedded","iot","arduino","raspberry-pi","esp32",
];

const COMMON_BIG = [
  ["https://www.google.com", "Google"],
  ["https://www.wikipedia.org", "Wikipedia"],
  ["https://www.youtube.com", "YouTube"],
  ["https://www.reddit.com", "Reddit"],
  ["https://github.com", "GitHub"],
  ["https://www.stackoverflow.com", "Stack Overflow"],
  ["https://www.amazon.com", "Amazon"],
  ["https://www.spotify.com", "Spotify"],
  ["https://www.netflix.com", "Netflix"],
  ["https://www.instagram.com", "Instagram"],
] as const;

function build(): Site[] {
  const out: Site[] = [];

  for (const [url, name] of MYTHIC) out.push({ url, name, weight: 0.05 });
  for (const [url, name] of LEGENDARY) out.push({ url, name, weight: 0.4 });
  for (const [url, name] of EPIC) out.push({ url, name, weight: 2 });

  for (const t of WIKI_TOPICS) {
    out.push({
      url: `https://en.wikipedia.org/wiki/${t}`,
      name: `Wikipedia: ${t.replace(/_/g, " ")}`,
      weight: 25,
    });
  }
  for (const s of SUBREDDITS) {
    out.push({
      url: `https://www.reddit.com/r/${s}`,
      name: `r/${s}`,
      weight: 20,
    });
  }
  for (const t of GH_TOPICS) {
    out.push({
      url: `https://github.com/topics/${t}`,
      name: `GitHub: ${t}`,
      weight: 15,
    });
  }
  for (const [url, name] of COMMON_BIG) out.push({ url, name, weight: 120 });

  // Pad to thousands by adding more Wikipedia random-category and subreddit variants
  const EXTRA_WIKI = [
    "Cooking","Gardening","Origami","Calligraphy","Pottery","Knitting","Woodworking",
    "Astrophotography","Birdwatching","Stargazing","Cartography","Numismatics","Philately",
    "Esperanto","Latin","Sanskrit","Hieroglyphs","Cuneiform","Phoenician_alphabet",
    "Library_of_Alexandria","Silk_Road","Spice_trade","Renaissance_humanism","Enlightenment",
    "Scientific_method","Peer_review","Nobel_Prize","Turing_Award","Fields_Medal",
    "Fibonacci_sequence","Golden_ratio","Pi","Euler's_identity","Prime_number",
    "Fractal","Mandelbrot_set","Topology","Knot_theory","Graph_theory",
    "Probability","Statistics","Linear_algebra","Calculus","Cryptanalysis",
    "Origami","Tessellation","M._C._Escher","Bauhaus","Art_Nouveau",
    "Cinema_of_Japan","Studio_Ghibli","Pixar","Disney","Anime",
    "Jazz","Blues","Rock_music","Hip_hop","Electronic_music","Classical_music",
    "Folk_music","Reggae","Country_music","K-pop","J-pop",
    "Sake","Espresso","Matcha","Kombucha","Yogurt","Sourdough",
    "Permaculture","Hydroponics","Aquaponics","Composting","Vermiculture",
    "Migratory_bird","Whale_song","Bioluminescence","Symbiosis","Mutualism",
    "Mycelium","Lichen","Coral","Plankton","Krill",
    "Pangea","Plate_tectonics","Geyser","Glacier","Iceberg",
    "Northern_lights","Solar_flare","Meteor_shower","Comet","Asteroid_belt",
    "Voyager_1","Voyager_2","Curiosity_(rover)","Perseverance_(rover)","New_Horizons",
    "Olympic_torch","Marathon_(sport)","Tour_de_France","Wimbledon","Super_Bowl",
    "FIFA","UEFA","NBA","NFL","MLB",
    "Origami","Tea_ceremony","Ikebana","Bonsai","Zen_garden",
    "Calligraphy","Shodō","Karate","Aikido","Judo",
    "Diplomacy","United_Nations","European_Union","NATO","World_Health_Organization",
    "Magna_Carta","Declaration_of_Independence","French_Revolution","American_Civil_War","Bastille",
  ];
  for (const t of EXTRA_WIKI) {
    out.push({
      url: `https://en.wikipedia.org/wiki/${t}`,
      name: `Wikipedia: ${t.replace(/_/g, " ")}`,
      weight: 28,
    });
  }

  const EXTRA_SUBS = [
    "wholesome","mademesmile","contagiouslaughter","funny","jokes","cleanjokes",
    "tifu","prorevenge","maliciouscompliance","talesfromtechsupport",
    "askculinary","seriouseats","onepotmeals","veganfood","vegetarian",
    "houseplants","gardening","permaculture","whatsthisplant","botany",
    "knots","leathercraft","metalworking","blacksmith","glassblowing","ceramics",
    "diy","somethingimade","craftit","modelmakers","minipainting",
    "boardgames","ttrpg","dnd","magictcg","pokemontcg",
    "speedrun","esports","retrogaming","emulation","handhelds",
    "vinyl","headphones","audiophile","synthesizers","wearehiphop","listentothis",
    "indieheads","letstalkmusic","musictheory","piano","guitar","drums","violin",
    "rpg","worldbuilding","writing","screenwriting","poetry","shortstories",
    "ebooks","suggestmeabook","fantasy","printsf","horrorlit","truecrimediscussion",
    "documentaries","filmmakers","cinematography","editors","colorists",
    "longreads","truefilm","truegaming","trueoffmychest","truebooks",
    "futurology","collapse","environment","climate","sustainability",
    "ecointeriordesign","tinyhouses","vandwellers","prefab","architectureporn",
    "abandonedporn","architecture","urbanplanning","fuckcars","bicycling",
    "publicfreakoutdebate","amitheasshole","relationship_advice","decidingtobebetter",
    "askphilosophy","askscience","asksocialscience","askanthropology","askhistorians",
  ];
  for (const s of EXTRA_SUBS) {
    out.push({
      url: `https://www.reddit.com/r/${s}`,
      name: `r/${s}`,
      weight: 22,
    });
  }

  const EXTRA_GH = [
    "framework","game","compiler","interpreter","parser","lexer","virtual-machine",
    "operating-system","kernel","driver","filesystem","shell","terminal","editor",
    "ide","vim","emacs","vscode","jetbrains","sublime-text","atom",
    "react-hooks","state-management","redux","zustand","jotai","recoil","mobx",
    "monorepo","microservices","serverless","jamstack","pwa","webassembly",
    "rest-api","graphql-api","websocket","grpc","webrtc","webgpu",
    "ai-art","stable-diffusion","llm","transformers","embeddings","vector-database",
    "agent","rag","chatbot","speech-to-text","text-to-speech","ocr",
    "computer-graphics","raytracing","shaders","game-engine","physics-engine",
    "music-player","video-player","streaming","torrent","downloader",
    "scraper","crawler","automation","testing","fuzzing","benchmark",
    "monitoring","observability","logging","metrics","tracing","prometheus",
    "self-hosted","homelab","selfhosting","privacy-tools","security-tools",
  ];
  for (const t of EXTRA_GH) {
    out.push({
      url: `https://github.com/topics/${t}`,
      name: `GitHub: ${t}`,
      weight: 14,
    });
  }

  return out;
}

export const SITES: Site[] = build();
export const TOTAL_WEIGHT: number = SITES.reduce((s, x) => s + x.weight, 0);

export function pickRandom(): { site: Site; index: number; rarityValue: number; rarity: Rarity; color: string; emoji: string } {
  const r = Math.random() * TOTAL_WEIGHT;
  let acc = 0;
  let idx = 0;
  for (let i = 0; i < SITES.length; i++) {
    acc += SITES[i].weight;
    if (r <= acc) { idx = i; break; }
  }
  const site = SITES[idx];
  const rarityValue = Math.max(1, Math.round(TOTAL_WEIGHT / site.weight));
  const meta = getRarityMeta(site.weight);
  return { site, index: idx, rarityValue, rarity: meta.tier, color: meta.color, emoji: meta.emoji };
}

export function getRarityMeta(weight: number) {
  // Lower weight = rarer. Iterate buckets, find first whose min <= weight.
  let chosen = RARITY_BUCKETS[RARITY_BUCKETS.length - 1];
  for (const b of RARITY_BUCKETS) {
    if (weight >= b.min) chosen = b;
  }
  return chosen;
}

export function searchSites(q: string, limit = 100): Site[] {
  const s = q.toLowerCase().trim();
  if (!s) return SITES.slice(0, limit);
  const out: Site[] = [];
  for (const site of SITES) {
    if (site.name.toLowerCase().includes(s) || site.url.toLowerCase().includes(s)) {
      out.push(site);
      if (out.length >= limit) break;
    }
  }
  return out;
}
