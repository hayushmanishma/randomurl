// Huge categorized site database. Safe-by-construction:
// every entry comes from curated category seeds (Wikipedia topics,
// GitHub topics, subreddit slugs, well-known domains). No user input
// flows into URLs. NSFW/extremist keywords are stripped at build.

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
export type Category =
  | "knowledge" | "gaming" | "dev" | "art" | "music" | "science"
  | "tools" | "fun" | "video" | "news" | "sports" | "food";

export interface Site {
  url: string;
  name: string;
  weight: number;
  category: Category;
}

export const CATEGORIES: { id: Category; label: string; emoji: string; accent: string; bg: string }[] = [
  { id: "knowledge", label: "ידע",      emoji: "📚", accent: "from-sky-400 to-indigo-500",     bg: "from-sky-500/10 to-indigo-500/10" },
  { id: "gaming",    label: "גיימינג",  emoji: "🎮", accent: "from-fuchsia-500 to-rose-500",   bg: "from-fuchsia-500/10 to-rose-500/10" },
  { id: "dev",       label: "פיתוח",    emoji: "💻", accent: "from-emerald-400 to-teal-500",   bg: "from-emerald-500/10 to-teal-500/10" },
  { id: "art",       label: "אומנות",   emoji: "🎨", accent: "from-pink-400 to-orange-400",    bg: "from-pink-500/10 to-orange-500/10" },
  { id: "music",     label: "מוזיקה",   emoji: "🎵", accent: "from-violet-500 to-purple-600",  bg: "from-violet-500/10 to-purple-500/10" },
  { id: "science",   label: "מדע",      emoji: "🔬", accent: "from-cyan-400 to-blue-500",      bg: "from-cyan-500/10 to-blue-500/10" },
  { id: "tools",     label: "כלים",     emoji: "🛠️", accent: "from-slate-300 to-zinc-400",     bg: "from-slate-500/10 to-zinc-500/10" },
  { id: "fun",       label: "כיף",      emoji: "🎲", accent: "from-yellow-300 to-amber-500",   bg: "from-yellow-500/10 to-amber-500/10" },
  { id: "video",     label: "וידאו",    emoji: "🎬", accent: "from-red-500 to-rose-600",       bg: "from-red-500/10 to-rose-500/10" },
  { id: "news",      label: "חדשות",    emoji: "📰", accent: "from-stone-300 to-neutral-500",  bg: "from-stone-500/10 to-neutral-500/10" },
  { id: "sports",    label: "ספורט",    emoji: "🏆", accent: "from-lime-400 to-green-500",     bg: "from-lime-500/10 to-green-500/10" },
  { id: "food",      label: "אוכל",     emoji: "🍜", accent: "from-orange-400 to-red-500",     bg: "from-orange-500/10 to-red-500/10" },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map(c => [c.id, c])) as Record<Category, typeof CATEGORIES[number]>;

const RARITY_BUCKETS: { tier: Rarity; min: number; color: string; emoji: string }[] = [
  { tier: "mythic",    min: 0,   color: "from-fuchsia-500 to-rose-500",  emoji: "🌌" },
  { tier: "legendary", min: 0.2, color: "from-amber-400 to-orange-500",  emoji: "👑" },
  { tier: "epic",      min: 1,   color: "from-purple-500 to-indigo-500", emoji: "💎" },
  { tier: "rare",      min: 4,   color: "from-blue-500 to-cyan-500",     emoji: "🔷" },
  { tier: "uncommon",  min: 15,  color: "from-emerald-500 to-green-500", emoji: "🟢" },
  { tier: "common",    min: 50,  color: "from-slate-400 to-slate-500",   emoji: "⚪" },
];

// --- safety filter -----------------------------------------------
const BLOCKED = /\b(porn|xxx|sex|nsfw|nude|naked|adult|escort|onlyfans|cam(?:girl|boy)?|fetish|hentai|erotic|gore|isis|nazi|terror|kill|suicide|drug|cocaine|heroin|weed|marijuana|gun|weapon|gambling|casino|bet|poker)\b/i;
const safe = (s: string) => !BLOCKED.test(s);

// ============================================================
// CURATED HAND-PICKED — top tier (rarest)
// ============================================================
type Seed = [url: string, name: string];

const MYTHIC: Record<Category, Seed[]> = {
  fun: [
    ["https://www.musicforprogramming.net", "Music For Programming"],
    ["https://neal.fun/space-elevator", "Space Elevator"],
    ["https://neal.fun/deep-sea", "The Deep Sea"],
    ["https://neal.fun/size-of-space", "Size of Space"],
    ["https://patatap.com", "Patatap"],
    ["https://www.pointerpointer.com", "Pointer Pointer"],
    ["https://staggeringbeauty.com", "Staggering Beauty"],
    ["https://thisrentaldoesnotexist.com", "This Rental Does Not Exist"],
    ["https://www.windows93.net", "Windows 93"],
    ["https://hackertyper.net", "Hacker Typer"],
    ["https://findtheinvisiblecow.com", "Find The Invisible Cow"],
    ["https://www.zombo.com", "Zombo.com"],
    ["https://heeeeeeeey.com", "Heeeeeeey"],
    ["https://eelslap.com", "Eel Slap"],
    ["https://www.purrli.com", "Purrli"],
    ["https://rainymood.com", "Rainy Mood"],
    ["https://asoftmurmur.com", "A Soft Murmur"],
  ],
  knowledge: [
    ["https://www.atlasobscura.com", "Atlas Obscura"],
    ["https://longreads.com", "Longreads"],
    ["https://aeon.co", "Aeon"],
    ["https://www.openculture.com", "Open Culture"],
    ["https://publicdomainreview.org", "Public Domain Review"],
    ["https://en.wikipedia.org/wiki/Special:Random", "Wikipedia Random"],
  ],
  art: [
    ["https://www.chromeexperiments.com", "Chrome Experiments"],
    ["https://www.are.na", "Are.na"],
    ["https://www.behance.net", "Behance"],
    ["https://www.dribbble.com", "Dribbble"],
    ["https://artsexperiments.withgoogle.com", "Google Arts Experiments"],
    ["https://artsandculture.google.com", "Google Arts & Culture"],
  ],
  music: [
    ["https://radio.garden", "Radio Garden"],
    ["https://noises.online", "Noises Online"],
    ["https://www.everynoise.com", "Every Noise at Once"],
    ["https://onemotion.com/chord-player", "Chord Player"],
    ["https://www.shadertoy.com", "Shadertoy"],
  ],
  science: [
    ["https://earth.nullschool.net", "Earth Wind Map"],
    ["https://stars.chromeexperiments.com", "100,000 Stars"],
    ["https://www.windy.com", "Windy.com"],
    ["https://flightradar24.com", "Flight Radar 24"],
    ["https://www.marinetraffic.com", "Marine Traffic"],
  ],
  gaming: [
    ["https://www.geoguessr.com", "GeoGuessr"],
    ["https://quickdraw.withgoogle.com", "Quick Draw"],
    ["https://slither.io", "Slither.io"],
    ["https://agar.io", "Agar.io"],
    ["https://townscapertest.com", "Townscaper Web"],
  ],
  tools: [
    ["https://excalidraw.com", "Excalidraw"],
    ["https://tldraw.com", "tldraw"],
    ["https://photopea.com", "Photopea"],
    ["https://regex101.com", "Regex 101"],
    ["https://carbon.now.sh", "Carbon"],
  ],
  dev: [
    ["https://github.com/trending", "GitHub Trending"],
    ["https://hn.algolia.com", "HN Search"],
    ["https://devdocs.io", "DevDocs"],
  ],
  video: [
    ["https://archive.org/details/movies", "Archive.org Movies"],
    ["https://www.justwatch.com", "JustWatch"],
  ],
  news: [
    ["https://news.ycombinator.com", "Hacker News"],
    ["https://lobste.rs", "Lobsters"],
  ],
  sports: [
    ["https://www.olympedia.org", "Olympedia"],
  ],
  food: [
    ["https://www.seriouseats.com", "Serious Eats"],
    ["https://www.bonappetit.com", "Bon Appétit"],
  ],
};

// ============================================================
// SEEDS PER CATEGORY — used to programmatically expand
// Wikipedia / GitHub / subreddit URLs are deterministic and safe.
// ============================================================

const WIKI = {
  knowledge: [
    "History_of_science","World_history","Ancient_Rome","Ancient_Greece","Renaissance","Industrial_Revolution","Cold_War","World_War_I","World_War_II","Philosophy","Epistemology","Stoicism","Existentialism","Logic","Linguistics","Etymology","Mythology","Greek_mythology","Norse_mythology","Egyptian_mythology","Architecture","Modernism","Postmodernism","Cartography","Library_science","Encyclopedia","Anthropology","Sociology","Economics","Game_theory","Psychology","Cognitive_science","Neuroscience","Memory","Dreams","Consciousness","Universal_history","Calendar","Timeline_of_the_far_future","Future_of_Earth","Outline_of_knowledge",
    "Geography","Continent","Ocean","Island","Mountain","River","Desert","Forest","Volcano","Earthquake","Climate","Biome","Tundra","Savanna","Coral_reef","Glacier","Cave","Waterfall","Lake","Megacity","Capital_city","Country","Flag","Coat_of_arms","UNESCO","World_Heritage_Site","Seven_Wonders_of_the_Ancient_World","Lost_city","Ancient_civilization","Mesopotamia","Inca_Empire","Aztec_Empire","Maya_civilization","Phoenicia","Vikings","Samurai","Knight","Crusades","Silk_Road","Spice_trade","Age_of_Discovery","Renaissance_art","Baroque","Romanticism",
  ],
  science: [
    "Physics","Quantum_mechanics","General_relativity","Black_hole","Big_Bang","Dark_matter","Dark_energy","String_theory","Particle_physics","Standard_Model","Higgs_boson","Cosmology","Galaxy","Milky_Way","Solar_System","Mars","Jupiter","Saturn","Exoplanet","Astrobiology","SETI","Telescope","James_Webb_Space_Telescope","Hubble_Space_Telescope","Interstellar_travel","Time","Spacetime","Entropy","Thermodynamics","Chaos_theory","Fractal","Mandelbrot_set","Topology","Calculus","Number_theory","Prime_number","Cryptography","Information_theory","Algorithm","Turing_machine","Halting_problem","P_versus_NP_problem",
    "Biology","Evolution","Natural_selection","DNA","RNA","Genome","CRISPR","Cell_(biology)","Mitochondrion","Photosynthesis","Ecosystem","Coral","Fungus","Bacteria","Virus","Pandemic","Vaccine","Immune_system","Brain","Neuron","Synapse","Sleep","Stem_cell","Cancer","Antibiotic","Microbiome","Octopus","Cephalopod","Whale","Shark","Dinosaur","Pterosaur","Mammoth","Trilobite","Cambrian_explosion","Mass_extinction","Tardigrade","Slime_mold",
    "Chemistry","Periodic_table","Element","Hydrogen","Oxygen","Carbon","Polymer","Catalyst","Reaction_rate","pH","Crystal","Battery","Superconductivity","Nanotechnology","Materials_science","Graphene","Aerogel","Diamond","Glass","Alloy","Steel","Concrete","Plastic","Recycling",
  ],
  art: [
    "Painting","Sculpture","Photography","Cinematography","Film","Animation","Pixel_art","Graphic_design","Typography","Calligraphy","Origami","Pottery","Ceramics","Mosaic","Stained_glass","Tapestry","Embroidery","Quilting","Weaving","Printmaking","Lithography","Etching","Woodblock_printing","Manga","Anime","Comics","Webcomic","Street_art","Graffiti","Performance_art","Installation_art","Conceptual_art","Surrealism","Cubism","Impressionism","Expressionism","Bauhaus","Art_deco","Art_nouveau","Pop_art","Op_art","Minimalism","Brutalism","Vaporwave","Ukiyo-e","Mughal_painting","Persian_miniature","Tibetan_thangka","Aboriginal_art",
  ],
  music: [
    "Music_theory","Musical_notation","Scale_(music)","Chord_(music)","Harmony","Counterpoint","Polyphony","Symphony","Sonata","Opera","Jazz","Blues","Rock_music","Punk_rock","Heavy_metal","Hip_hop","Electronic_music","Techno","House_music","Trance_music","Drum_and_bass","Dubstep","Ambient_music","Classical_music","Baroque_music","Romantic_music","Folk_music","Bluegrass","Country_music","Reggae","Ska","Funk","Soul_music","Disco","K-pop","J-pop","Bossa_nova","Flamenco","Sitar","Synthesizer","Theremin","Pipe_organ","Gamelan","Throat_singing","Beatboxing",
  ],
  gaming: [
    "Video_game","History_of_video_games","Arcade_game","Atari_2600","Nintendo_Entertainment_System","Super_Nintendo_Entertainment_System","Sega_Genesis","Nintendo_64","PlayStation","PlayStation_2","Xbox","Game_Boy","Tetris","Pac-Man","Super_Mario_Bros.","The_Legend_of_Zelda","Pokémon","Sonic_the_Hedgehog","Doom_(1993_video_game)","Quake","Half-Life_(video_game)","Counter-Strike","Minecraft","Roblox","Fortnite","Among_Us","Stardew_Valley","Undertale","Celeste_(video_game)","Hollow_Knight","Hades_(video_game)","Dark_Souls","Elden_Ring","The_Witcher_3","Red_Dead_Redemption_2","Grand_Theft_Auto_V","Cyberpunk_2077","Speedrun","Esports","MMORPG","Roguelike","Metroidvania","Souls-like",
  ],
  tools: [
    "Pomodoro_Technique","Mind_map","Kanban","GTD","Markdown","JSON","YAML","Regular_expression","Unicode","ASCII","Color_picker","Lorem_ipsum","Base64","UUID","Cron",
  ],
  fun: [
    "List_of_unusual_deaths","List_of_common_misconceptions","List_of_cryptids","List_of_paradoxes","Wikipedia:Unusual_articles","List_of_people_who_disappeared_mysteriously","List_of_hoaxes_on_Wikipedia","Streisand_effect","Wikipedia:Five-pillars","Dancing_mania","Dyatlov_Pass_incident","Tunguska_event","Voynich_manuscript","Antikythera_mechanism","Bermuda_Triangle","Bigfoot","Loch_Ness_Monster","Mothman","Crop_circle","Mary_Celeste",
  ],
  video: [
    "YouTube","TikTok","Vimeo","Twitch_(service)","List_of_films_considered_the_best","List_of_films_considered_the_worst","Studio_Ghibli","Pixar","Cinema_of_Japan","French_New_Wave","Film_noir","Mockumentary",
  ],
  news: [
    "Newspaper","Journalism","Citizen_journalism","Public_broadcasting","Investigative_journalism",
  ],
  sports: [
    "Association_football","Basketball","American_football","Baseball","Cricket","Tennis","Golf","Rugby_union","Ice_hockey","Volleyball","Boxing","Mixed_martial_arts","Cycling","Marathon","Triathlon","Surfing","Skateboarding","Snowboarding","Climbing","Bouldering","Parkour","Sumo","Capoeira","Judo","Karate","Taekwondo","Fencing","Archery","Equestrianism","Olympic_Games","Paralympic_Games","World_Cup","Super_Bowl","Tour_de_France","Wimbledon","UEFA_Champions_League","NBA","NFL","NHL","MLB","Formula_One","MotoGP","Rally_(sport)","Esports",
  ],
  food: [
    "Cuisine","Italian_cuisine","French_cuisine","Japanese_cuisine","Chinese_cuisine","Indian_cuisine","Mexican_cuisine","Thai_cuisine","Vietnamese_cuisine","Korean_cuisine","Spanish_cuisine","Greek_cuisine","Lebanese_cuisine","Turkish_cuisine","Moroccan_cuisine","Ethiopian_cuisine","Peruvian_cuisine","Brazilian_cuisine","Argentine_cuisine","Sushi","Ramen","Pizza","Pasta","Bread","Cheese","Wine","Coffee","Tea","Chocolate","Ice_cream","Hamburger","Taco","Sandwich","Soup","Salad","Curry","Barbecue","Fermentation_in_food_processing","Sourdough","Kimchi","Miso","Tofu","Tempeh","Hummus","Falafel","Paella","Risotto","Gelato","Macaron","Croissant","Mochi","Dumpling","Dim_sum",
  ],
  dev: [
    "Software_engineering","Operating_system","Linux","Unix","Compiler","Interpreter_(computing)","Programming_language","Functional_programming","Object-oriented_programming","Design_pattern","Algorithm","Data_structure","Database","SQL","NoSQL","Distributed_computing","Cloud_computing","Kubernetes","Docker_(software)","Git","Open-source_software","Cryptography","Hash_function","Public-key_cryptography","Machine_learning","Deep_learning","Neural_network","Transformer_(machine_learning_model)","Reinforcement_learning","Computer_vision","Natural_language_processing","Quantum_computing","WebAssembly","Browser_engine",
  ],
} as const;

const SUBS: Record<Category, string[]> = {
  knowledge: ["AskHistorians","AskScience","explainlikeimfive","todayilearned","YouShouldKnow","DepthHub","TrueAskReddit","AskPhilosophy","AskAnthropology","AskSocialScience","HistoryPorn","ColorizedHistory","MapPorn","ArtefactPorn","ArchaeologyPorn","Cartography","etymology","linguistics","philosophy","books","suggestmeabook","literature","writing","wikipedia"],
  science: ["science","Physics","Astronomy","space","SpaceXLounge","biology","chemistry","math","mathematics","Geology","earthscience","climate","evolution","Paleontology","Mycology","microbiology","Anatomy","Neuroscience","cogsci","datascience","statistics","quantum","cosmology","futurology","singularity"],
  gaming: ["Games","gaming","pcgaming","truegaming","patientgamers","tipofmyjoystick","gamedev","Unity3D","unrealengine","godot","speedrun","emulation","retrogaming","handhelds","Roms","indiegames","IndieGaming","roguelikes","Metroidvania","soulslikes","NintendoSwitch","PS5","XboxSeriesX","SteamDeck","Steam","linux_gaming","boardgames","tabletopgamedesign","DnD","rpg","mtg","pokemontcg","chess","baduk"],
  dev: ["programming","webdev","learnprogramming","csMajors","computerscience","ExperiencedDevs","cscareerquestions","SoftwareEngineering","devops","sysadmin","selfhosted","homelab","linux","linuxquestions","unixporn","commandline","vim","emacs","neovim","rust","golang","python","javascript","typescript","reactjs","node","nextjs","sveltejs","django","flask","laravel","kubernetes","docker","aws","azure","gcp","github","gitlab","opensource","machinelearning","MLQuestions","deeplearning","LocalLLaMA","ChatGPT","artificial","singularity","webassembly","tailwindcss","css","html5","javahelp","cpp_questions","learnpython","learnrust","learnjavascript"],
  art: ["Art","ImaginaryLandscapes","ImaginaryCityscapes","ImaginaryCharacters","ImaginaryWorlds","DigitalArt","conceptart","CharacterDesign","drawing","sketches","watercolor","oilpainting","comicbooks","webcomics","manga","anime","pixelart","glitch_art","vaporwaveart","graphic_design","typography","Calligraphy","graffiti","streetart","photography","earthporn","cityporn","architectureporn","RoomPorn","DesignPorn","crochet","knitting","embroidery","Leathercraft","woodworking","blacksmithing","metalworking","glassblowing","ceramics","pottery","sculpture","origami","papercraft","modelmakers","Gunpla","minipainting","Warhammer"],
  music: ["Music","listentothis","ifyoulikeblank","WeAreTheMusicMakers","edmproduction","piano","Guitar","drums","Violin","bass","trumpet","musictheory","makinghiphop","hiphopheads","Metal","progmetal","jazz","classicalmusic","Vinyl","headphones","audiophile","synthesizers","modular","Trance","techno","house","DnB","dubstep","ambientmusic","futurefunk","vaporwave","KPop","indieheads","letstalkmusic","ToolBand"],
  tools: ["Notion","obsidianmd","logseq","emacs","vim","Productivity","gtd","selfimprovement","decidingtobebetter","minimalism","getdisciplined","Stoicism","Mindfulness","Journaling","getstudying","studytips","Anki","languagelearning","duolingo","spanish","French","German","japanese","korean","Chinese","Hebrew","learn_arabic"],
  fun: ["WTF","mildlyinteresting","Damnthatsinteresting","interestingasfuck","BeAmazed","oddlysatisfying","oddlyspecific","HumansBeingBros","MadeMeSmile","Wholesome","UpliftingNews","gifs","funny","Showerthoughts","tipofmytongue","RandomActsOfKindness","HumansAreSpaceOrcs","TIHI","ATBGE","CrappyDesign","DesignDesign","DiWHY","redneckengineering","instant_regret","TheoryOfReddit","OutOfTheLoop"],
  video: ["Documentaries","television","movies","TrueFilm","criterion","Letterboxd","TVTooHigh","NetflixBestOf","ifyoulikeblank_movies","horror","truecrime","scifi","Fantasy","StarWars","StarTrek","marvelstudios","DC_Cinematic","StudioGhibli","anime","Animation","cinematography","editors","colorists","filmmakers","VideoEditing","youtubers","NewTubers"],
  news: ["worldnews","news","UpliftingNews","TrueReddit","NeutralPolitics","geopolitics","Economics","business","Futurology","tech","technology","gadgets","Android","apple","hardware"],
  sports: ["sports","nba","nfl","soccer","baseball","hockey","tennis","golf","Cricket","Rugby","formula1","MotoGP","cycling","running","triathlon","swimming","Climbing","bouldering","surfing","skateboarding","Snowboarding","skiing","BJJ","MMA","Boxing","martialarts","Chess","baduk","SubredditDrama"],
  food: ["food","FoodPorn","Cooking","AskCulinary","seriouseats","budgetfood","EatCheapAndHealthy","MealPrepSunday","slowcooking","Sourdough","Breadit","castiron","Pizza","ramen","sushi","Coffee","tea","wine","Cocktails","cookingforbeginners","vegetarian","vegan","Veganrecipes","keto","Paleo","ZeroWaste","FoodNYC","FoodLA","JapaneseFood","KoreanFood","ThaiFood","IndianFood","ItalianFood","MexicanFood","Baking"],
};

const GH_TOPICS: Record<Category, string[]> = {
  dev: [
    "react","vue","svelte","angular","solidjs","nextjs","nuxt","astro","remix","sveltekit","tanstack","trpc","graphql","grpc","webrtc","websocket","webgpu","webassembly","wasm","rust","golang","python","typescript","javascript","kotlin","swift","dart","flutter","reactnative","tailwindcss","shadcn","radix-ui","vite","esbuild","rollup","turbopack","bun","deno","node","nestjs","fastapi","django","flask","rails","laravel","spring-boot","ktor","actix","axum","tokio","async","concurrency","compiler","interpreter","parser","lexer","virtual-machine","operating-system","kernel","driver","filesystem","shell","terminal","editor","ide","neovim","emacs","vscode","obsidian","logseq","monorepo","microservices","serverless","jamstack","pwa","rest-api","sdk","cli","tui","game","game-engine","raytracing","shaders","computer-graphics","music-player","video-player","streaming","torrent","downloader","scraper","crawler","automation","testing","fuzzing","benchmark","monitoring","observability","logging","metrics","tracing","prometheus","grafana","self-hosted","homelab","selfhosting","privacy-tools","security-tools","cryptography","blockchain","ethereum","bitcoin","zk","ai","ml","llm","stable-diffusion","transformers","embeddings","vector-database","rag","agent","chatbot","speech-to-text","text-to-speech","ocr","computer-vision","reinforcement-learning"
  ],
  gaming: ["game","game-engine","godot","unity","unreal-engine","love2d","pico-8","bevy","roguelike","metroidvania","platformer","arcade","emulator","rom","speedrunning","gamedev","gamejam"],
  art: ["generative-art","creative-coding","p5js","threejs","webgl","webgpu","shader","glsl","pixel-art","ascii-art","glitch-art","data-visualization","d3","svg","fractal","procedural-generation"],
  tools: ["productivity","note-taking","cli","tui","markdown","static-site-generator","theme","color-scheme","wallpaper","icons","fonts","emoji","keyboard","window-manager","screenshot","screen-recorder","clipboard"],
  knowledge: ["awesome","awesome-list","tutorial","handbook","cheatsheet","book","course","learning","computer-science-curriculum","interview-questions","coding-interview","system-design"],
  science: ["scientific-computing","numerical-methods","simulation","physics","astronomy","biology","chemistry","data-science","statistics","quantum-computing","bioinformatics","computational-biology"],
  music: ["music","audio","dsp","synthesizer","midi","music-player","music-visualization","sound","audio-engineering"],
  video: ["video","ffmpeg","video-player","streaming","video-editor","subtitles"],
  fun: ["fun","easter-egg","puzzle","trivia","retro","8-bit","nostalgia"],
  news: ["news","rss","feed-reader","newsletter","aggregator"],
  sports: ["sports","fitness","running","cycling","football-data"],
  food: ["recipes","cooking","food","meal-planner","nutrition"],
};

// neal.fun style fun pages — curated
const NEAL_FUN = [
  "stimulation-clicker","life-stats","internet-roadtrip","infinite-craft","ambient-chaos","mountain","absurd-trolley-problems","password-game","stable-diffusion","baby-game","second","spend","draw-logo","speedtest-revisited","color-wheel","line","2023","graph","print-the-internet","alpha","kingdom","plead","scale-of-the-universe-2","ten-bullets","wire","sandspiel","scroll-of-the-year",
];

const RAW_DOMAINS: Record<Category, Seed[]> = {
  knowledge: [
    ["wikipedia.org","Wikipedia"],["britannica.com","Britannica"],["ted.com","TED"],["ted.com/talks","TED Talks"],
    ["bbc.com/future","BBC Future"],["jstor.org","JSTOR"],["scholar.google.com","Google Scholar"],
    ["arxiv.org","arXiv"],["coursera.org","Coursera"],["edx.org","edX"],["khanacademy.org","Khan Academy"],
    ["mitopencourseware.org","MIT OCW"],["ocw.mit.edu","MIT OpenCourseWare"],["futurelearn.com","FutureLearn"],
    ["open.edu","OpenLearn"],["duolingo.com","Duolingo"],["memrise.com","Memrise"],["quizlet.com","Quizlet"],
    ["anki.com","Anki"],["wolframalpha.com","Wolfram Alpha"],["plato.stanford.edu","Stanford Encyclopedia of Philosophy"],
    ["gutenberg.org","Project Gutenberg"],["archive.org","Internet Archive"],["loc.gov","Library of Congress"],
    ["smithsonianmag.com","Smithsonian Magazine"],["nationalgeographic.com","National Geographic"],
    ["history.com","History.com"],["worldhistory.org","World History Encyclopedia"],["bigthink.com","Big Think"],
    ["brainpickings.org","The Marginalian"],["themarginalian.org","The Marginalian"],["fs.blog","Farnam Street"],
    ["lesswrong.com","LessWrong"],["slatestarcodex.com","Slate Star Codex"],["astralcodexten.com","Astral Codex Ten"],
    ["wait-but-why.com","Wait But Why"],["waitbutwhy.com","Wait But Why"],["1843magazine.com","1843 Magazine"],
    ["lithub.com","Literary Hub"],["newyorker.com","The New Yorker"],["theatlantic.com","The Atlantic"],
    ["nautil.us","Nautilus"],["quantamagazine.org","Quanta Magazine"],
  ],
  science: [
    ["nature.com","Nature"],["science.org","Science"],["sciencemag.org","Science Magazine"],
    ["sciencedaily.com","Science Daily"],["livescience.com","Live Science"],["sciencealert.com","ScienceAlert"],
    ["newscientist.com","New Scientist"],["nasa.gov","NASA"],["esa.int","ESA"],["jpl.nasa.gov","NASA JPL"],
    ["spacex.com","SpaceX"],["space.com","Space.com"],["skyandtelescope.org","Sky & Telescope"],
    ["cern.ch","CERN"],["fnal.gov","Fermilab"],["noaa.gov","NOAA"],["usgs.gov","USGS"],
    ["nih.gov","NIH"],["who.int","WHO"],["nationalacademies.org","National Academies"],
    ["plos.org","PLOS"],["biorxiv.org","bioRxiv"],["semanticscholar.org","Semantic Scholar"],
    ["scientificamerican.com","Scientific American"],["popsci.com","Popular Science"],
    ["aps.org","APS"],["acs.org","ACS"],["asm.org","ASM"],["agu.org","AGU"],
    ["ligo.org","LIGO"],["eso.org","ESO"],["jaxa.jp","JAXA"],["isro.gov.in","ISRO"],
  ],
  gaming: [
    ["steam.com","Steam"],["store.steampowered.com","Steam Store"],["steamdb.info","SteamDB"],
    ["epicgames.com","Epic Games"],["gog.com","GOG"],["itch.io","itch.io"],["humblebundle.com","Humble Bundle"],
    ["nintendo.com","Nintendo"],["playstation.com","PlayStation"],["xbox.com","Xbox"],
    ["ign.com","IGN"],["gamespot.com","GameSpot"],["rockpapershotgun.com","Rock Paper Shotgun"],
    ["polygon.com","Polygon"],["kotaku.com","Kotaku"],["pcgamer.com","PC Gamer"],
    ["destructoid.com","Destructoid"],["gameinformer.com","Game Informer"],["eurogamer.net","Eurogamer"],
    ["howlongtobeat.com","How Long To Beat"],["opencritic.com","OpenCritic"],["metacritic.com/game","Metacritic Games"],
    ["protondb.com","ProtonDB"],["pcgamingwiki.com","PCGamingWiki"],["speedrun.com","Speedrun.com"],
    ["chess.com","Chess.com"],["lichess.org","Lichess"],["online-go.com","Online Go Server"],
    ["aoe2.net","AoE2.net"],["op.gg","OP.GG"],["dotabuff.com","Dotabuff"],["tracker.gg","Tracker.gg"],
    ["liquipedia.net","Liquipedia"],["nexusmods.com","Nexus Mods"],["modrinth.com","Modrinth"],
    ["curseforge.com","CurseForge"],["github.com/topics/game","GitHub: Game"],
    ["agar.io","Agar.io"],["slither.io","Slither.io"],["krunker.io","Krunker"],["diep.io","Diep.io"],
    ["kahoot.it","Kahoot"],["jackbox.tv","Jackbox"],["typeracer.com","TypeRacer"],["10fastfingers.com","10FastFingers"],
    ["monkeytype.com","Monkeytype"],["keybr.com","keybr"],["cool-games.com","Cool Games"],
    ["crazygames.com","CrazyGames"],["miniclip.com","Miniclip"],["poki.com","Poki"],["addictinggames.com","Addicting Games"],
    ["kongregate.com","Kongregate"],["newgrounds.com","Newgrounds"],
  ],
  dev: [
    ["github.com","GitHub"],["gitlab.com","GitLab"],["bitbucket.org","Bitbucket"],["sourcehut.org","SourceHut"],
    ["stackoverflow.com","Stack Overflow"],["stackexchange.com","Stack Exchange"],
    ["dev.to","DEV Community"],["hashnode.com","Hashnode"],["medium.com","Medium"],
    ["css-tricks.com","CSS-Tricks"],["smashingmagazine.com","Smashing Magazine"],["a11yproject.com","A11Y Project"],
    ["webaim.org","WebAIM"],["caniuse.com","Can I Use"],["developer.mozilla.org","MDN"],["w3.org","W3C"],
    ["whatwg.org","WHATWG"],["nodejs.org","Node.js"],["bun.sh","Bun"],["deno.com","Deno"],
    ["typescriptlang.org","TypeScript"],["react.dev","React"],["vuejs.org","Vue"],["svelte.dev","Svelte"],
    ["solidjs.com","SolidJS"],["angular.dev","Angular"],["nextjs.org","Next.js"],["nuxt.com","Nuxt"],
    ["astro.build","Astro"],["remix.run","Remix"],["tanstack.com","TanStack"],["vitejs.dev","Vite"],
    ["webpack.js.org","Webpack"],["esbuild.github.io","esbuild"],["rollupjs.org","Rollup"],
    ["tailwindcss.com","Tailwind"],["ui.shadcn.com","shadcn/ui"],["radix-ui.com","Radix UI"],
    ["chakra-ui.com","Chakra UI"],["mui.com","MUI"],["mantine.dev","Mantine"],
    ["rust-lang.org","Rust"],["go.dev","Go"],["python.org","Python"],["ruby-lang.org","Ruby"],
    ["kotlinlang.org","Kotlin"],["swift.org","Swift"],["dart.dev","Dart"],["flutter.dev","Flutter"],
    ["djangoproject.com","Django"],["fastapi.tiangolo.com","FastAPI"],["flask.palletsprojects.com","Flask"],
    ["rubyonrails.org","Rails"],["laravel.com","Laravel"],["spring.io","Spring"],
    ["postgresql.org","PostgreSQL"],["mysql.com","MySQL"],["sqlite.org","SQLite"],["redis.io","Redis"],
    ["mongodb.com","MongoDB"],["supabase.com","Supabase"],["firebase.google.com","Firebase"],
    ["vercel.com","Vercel"],["netlify.com","Netlify"],["cloudflare.com","Cloudflare"],
    ["aws.amazon.com","AWS"],["cloud.google.com","Google Cloud"],["azure.microsoft.com","Azure"],
    ["digitalocean.com","DigitalOcean"],["linode.com","Linode"],["fly.io","Fly.io"],["render.com","Render"],
    ["heroku.com","Heroku"],["railway.app","Railway"],["replit.com","Replit"],["stackblitz.com","StackBlitz"],
    ["codesandbox.io","CodeSandbox"],["codepen.io","CodePen"],["jsfiddle.net","JSFiddle"],
    ["news.ycombinator.com","Hacker News"],["lobste.rs","Lobsters"],["lwn.net","LWN"],
    ["phoronix.com","Phoronix"],["arstechnica.com","Ars Technica"],["theverge.com","The Verge"],
    ["techcrunch.com","TechCrunch"],["wired.com","Wired"],["ieee.org","IEEE"],["acm.org","ACM"],
    ["distill.pub","Distill"],["paperswithcode.com","Papers With Code"],["huggingface.co","Hugging Face"],
    ["kaggle.com","Kaggle"],["openai.com","OpenAI"],["anthropic.com","Anthropic"],["deepmind.google","DeepMind"],
  ],
  art: [
    ["behance.net","Behance"],["dribbble.com","Dribbble"],["artstation.com","ArtStation"],
    ["deviantart.com","DeviantArt"],["pixiv.net","Pixiv"],["are.na","Are.na"],
    ["pinterest.com","Pinterest"],["unsplash.com","Unsplash"],["pexels.com","Pexels"],["pixabay.com","Pixabay"],
    ["thispersondoesnotexist.com","This Person Does Not Exist"],["thiscatdoesnotexist.com","This Cat Does Not Exist"],
    ["thiswaifudoesnotexist.net","This Waifu Does Not Exist"],["artbreeder.com","Artbreeder"],
    ["midjourney.com","Midjourney"],["leonardo.ai","Leonardo AI"],["openart.ai","OpenArt"],
    ["procreate.com","Procreate"],["adobe.com/products/photoshop","Photoshop"],["krita.org","Krita"],
    ["gimp.org","GIMP"],["inkscape.org","Inkscape"],["blender.org","Blender"],
    ["sketchfab.com","Sketchfab"],["polyhaven.com","Poly Haven"],["opengameart.org","OpenGameArt"],
    ["coolors.co","Coolors"],["color.adobe.com","Adobe Color"],["lospec.com","Lospec"],
    ["fontshare.com","Fontshare"],["fonts.google.com","Google Fonts"],["fontspark.app","FontSpark"],
    ["googlearts.withgoogle.com","Google Arts"],["metmuseum.org","The Met"],["moma.org","MoMA"],
    ["louvre.fr","Louvre"],["britishmuseum.org","British Museum"],["nga.gov","National Gallery of Art"],
    ["tate.org.uk","Tate"],["guggenheim.org","Guggenheim"],
  ],
  music: [
    ["spotify.com","Spotify"],["music.apple.com","Apple Music"],["music.youtube.com","YouTube Music"],
    ["soundcloud.com","SoundCloud"],["bandcamp.com","Bandcamp"],["last.fm","Last.fm"],
    ["genius.com","Genius"],["allmusic.com","AllMusic"],["discogs.com","Discogs"],["pitchfork.com","Pitchfork"],
    ["rateyourmusic.com","Rate Your Music"],["musicbrainz.org","MusicBrainz"],["nts.live","NTS Radio"],
    ["somafm.com","SomaFM"],["di.fm","Digitally Imported"],["radio.net","Radio.net"],
    ["mixcloud.com","Mixcloud"],["beatport.com","Beatport"],["splice.com","Splice"],
    ["bbc.co.uk/sounds","BBC Sounds"],["npr.org/music","NPR Music"],["kexp.org","KEXP"],
    ["audiotool.com","Audiotool"],["bandlab.com","BandLab"],["musictheory.net","musictheory.net"],
    ["teoria.com","Teoria"],["hooktheory.com","Hooktheory"],["musescore.com","MuseScore"],
  ],
  tools: [
    ["notion.so","Notion"],["obsidian.md","Obsidian"],["logseq.com","Logseq"],["roamresearch.com","Roam"],
    ["todoist.com","Todoist"],["trello.com","Trello"],["asana.com","Asana"],["clickup.com","ClickUp"],
    ["linear.app","Linear"],["height.app","Height"],["slack.com","Slack"],["discord.com","Discord"],
    ["miro.com","Miro"],["figma.com","Figma"],["framer.com","Framer"],["webflow.com","Webflow"],
    ["canva.com","Canva"],["zapier.com","Zapier"],["ifttt.com","IFTTT"],["n8n.io","n8n"],
    ["airtable.com","Airtable"],["typeform.com","Typeform"],["calendly.com","Calendly"],
    ["raindrop.io","Raindrop.io"],["pocket.com","Pocket"],["readwise.io","Readwise"],
    ["1password.com","1Password"],["bitwarden.com","Bitwarden"],["protonmail.com","ProtonMail"],
    ["proton.me","Proton"],["duckduckgo.com","DuckDuckGo"],["kagi.com","Kagi"],["startpage.com","Startpage"],
    ["wayback-api.archive.org","Wayback Machine API"],["web.archive.org","Wayback Machine"],
    ["transfer.sh","transfer.sh"],["wormhole.app","Wormhole"],["cryptpad.fr","CryptPad"],
    ["jsonformatter.org","JSON Formatter"],["regex101.com","Regex101"],["explainshell.com","explainshell"],
    ["transform.tools","transform.tools"],["squoosh.app","Squoosh"],["tinypng.com","TinyPNG"],
    ["remove.bg","Remove.bg"],["cleanup.pictures","Cleanup.pictures"],["ilovepdf.com","iLovePDF"],
    ["smallpdf.com","Smallpdf"],["pdf24.org","PDF24"],
  ],
  fun: [
    ["neal.fun","neal.fun"],["thispersondoesnotexist.com","This Person Does Not Exist"],
    ["theuselessweb.com","The Useless Web"],["boredbutton.com","Bored Button"],["procatinator.com","Procatinator"],
    ["nooooooooooooooo.com","Nooooo"],["yes.com","Yes"],["bouncingdvdlogo.com","Bouncing DVD Logo"],
    ["paperplanes.world","Paper Planes"],["thedoesntexist.club","Does Not Exist Club"],
    ["fakeupdate.net","Fake Update"],["geekprank.com/hacker","Geek Prank Hacker"],
    ["thiscolordoesnotexist.com","This Color Does Not Exist"],["mapcrunch.com","MapCrunch"],
    ["geohints.com","GeoHints"],["randomstreetview.com","Random Street View"],
    ["sometimesredsometimesblue.com","Sometimes Red Sometimes Blue"],["sandspiel.club","Sandspiel"],
    ["powderpaint.io","PowderPaint"],["puginarug.com","Pug In A Rug"],["weavesilk.com","Weave Silk"],
    ["bongo.cat","Bongo Cat"],["chickensonadrum.com","Chickens On A Drum"],["onemillionchessboards.com","One Million Chessboards"],
    ["thecrappiestwebsite.com","The Crappiest Website"],["incredibox.com","Incredibox"],
    ["typatone.com","Typatone"],["thisissand.com","This Is Sand"],["agar.io","Agar.io"],
    ["littlealchemy.com","Little Alchemy"],["littlealchemy2.com","Little Alchemy 2"],
    ["infinitecraft.com","Infinite Craft"],["wikitrivia.tomjwatson.com","WikiTrivia"],
    ["geotastic.de","Geotastic"],["worldle.teuteuf.fr","Worldle"],["plays.org","Plays.org"],
    ["pokemonshowdown.com","Pokemon Showdown"],["jklm.fun","JKLM.fun"],["gartic.io","Gartic.io"],
    ["skribbl.io","Skribbl.io"],["paper.io","Paper.io"],["wings.io","Wings.io"],
    ["coding-with-pinky.com","Coding With Pinky"],["typing.io","Typing.io"],
  ],
  video: [
    ["youtube.com","YouTube"],["vimeo.com","Vimeo"],["twitch.tv","Twitch"],["dailymotion.com","Dailymotion"],
    ["nebula.tv","Nebula"],["curiositystream.com","CuriosityStream"],["kanopy.com","Kanopy"],
    ["tubi.tv","Tubi"],["pluto.tv","Pluto TV"],["crackle.com","Crackle"],
    ["archive.org/details/movies","Archive Movies"],["openculture.com/freemoviesonline","Free Movies Online"],
    ["justwatch.com","JustWatch"],["letterboxd.com","Letterboxd"],["imdb.com","IMDb"],
    ["rottentomatoes.com","Rotten Tomatoes"],["criterion.com","Criterion"],["mubi.com","MUBI"],
    ["bbc.co.uk/iplayer","BBC iPlayer"],["nfb.ca","National Film Board"],
    ["ted.com/playlists","TED Playlists"],["nautilus.live","Nautilus Live"],
    ["zooniverse.org","Zooniverse"],["nasa.gov/nasalive","NASA Live"],
  ],
  news: [
    ["bbc.com/news","BBC News"],["theguardian.com","The Guardian"],["nytimes.com","NY Times"],
    ["reuters.com","Reuters"],["apnews.com","AP News"],["aljazeera.com","Al Jazeera"],
    ["dw.com","DW"],["france24.com","France 24"],["npr.org","NPR"],["pbs.org","PBS"],
    ["economist.com","The Economist"],["ft.com","Financial Times"],["bloomberg.com","Bloomberg"],
    ["cnbc.com","CNBC"],["wsj.com","WSJ"],["axios.com","Axios"],["politico.com","Politico"],
    ["theintercept.com","The Intercept"],["propublica.org","ProPublica"],["jacobin.com","Jacobin"],
    ["spectator.co.uk","The Spectator"],["foreignpolicy.com","Foreign Policy"],
    ["technologyreview.com","MIT Tech Review"],["nature.com/news","Nature News"],
    ["space.com/news","Space News"],["spacenews.com","SpaceNews"],
  ],
  sports: [
    ["espn.com","ESPN"],["bbc.com/sport","BBC Sport"],["skysports.com","Sky Sports"],
    ["nba.com","NBA"],["nfl.com","NFL"],["mlb.com","MLB"],["nhl.com","NHL"],["fifa.com","FIFA"],
    ["uefa.com","UEFA"],["premierleague.com","Premier League"],["laliga.com","LaLiga"],
    ["seriea.com","Serie A"],["bundesliga.com","Bundesliga"],["ligue1.com","Ligue 1"],
    ["mlssoccer.com","MLS"],["formula1.com","Formula 1"],["motogp.com","MotoGP"],
    ["wta.com","WTA"],["atptour.com","ATP Tour"],["wimbledon.com","Wimbledon"],
    ["pgatour.com","PGA Tour"],["olympics.com","Olympics"],["paralympic.org","Paralympics"],
    ["fide.com","FIDE"],["chess.com","Chess.com"],["lichess.org","Lichess"],
    ["strava.com","Strava"],["mapmyrun.com","MapMyRun"],["runnersworld.com","Runner's World"],
    ["worldathletics.org","World Athletics"],["uci.org","UCI"],["surfline.com","Surfline"],
  ],
  food: [
    ["seriouseats.com","Serious Eats"],["bonappetit.com","Bon Appétit"],["nytimes.com/recipes","NYT Cooking"],
    ["epicurious.com","Epicurious"],["foodnetwork.com","Food Network"],["allrecipes.com","Allrecipes"],
    ["bbcgoodfood.com","BBC Good Food"],["food52.com","Food52"],["thekitchn.com","The Kitchn"],
    ["smittenkitchen.com","Smitten Kitchen"],["budgetbytes.com","Budget Bytes"],
    ["minimalistbaker.com","Minimalist Baker"],["chefsteps.com","ChefSteps"],
    ["americastestkitchen.com","America's Test Kitchen"],["foodandwine.com","Food & Wine"],
    ["saveur.com","Saveur"],["eater.com","Eater"],["taste.com.au","Taste"],
    ["maangchi.com","Maangchi"],["justonecookbook.com","Just One Cookbook"],
    ["hot-thai-kitchen.com","Hot Thai Kitchen"],["indianhealthyrecipes.com","Indian Healthy Recipes"],
    ["thewoksoflife.com","The Woks of Life"],["chinasichuanfood.com","China Sichuan Food"],
    ["seriouseats.com/the-food-lab","The Food Lab"],["kingarthurbaking.com","King Arthur Baking"],
    ["thespruceeats.com","The Spruce Eats"],["delish.com","Delish"],["taste.com","Taste"],
    ["coffeegeek.com","CoffeeGeek"],["sprudge.com","Sprudge"],["worldcoffeeresearch.org","World Coffee Research"],
  ],
};

// ============================================================
// BUILD
// ============================================================
function build(): Site[] {
  const out: Site[] = [];

  // Mythic tier (very low weight => very high rarity)
  for (const cat of Object.keys(MYTHIC) as Category[]) {
    for (const [url, name] of MYTHIC[cat]) {
      if (!safe(name) || !safe(url)) continue;
      out.push({ url, name, weight: 0.2, category: cat });
    }
  }

  // Curated domains (legendary -> uncommon based on count)
  for (const cat of Object.keys(RAW_DOMAINS) as Category[]) {
    for (const [d, name] of RAW_DOMAINS[cat]) {
      if (!safe(name) || !safe(d)) continue;
      const url = d.startsWith("http") ? d : `https://${d}`;
      out.push({ url, name, weight: 8, category: cat });
    }
  }

  // Wikipedia topics
  for (const cat of Object.keys(WIKI) as Category[]) {
    for (const t of (WIKI as any)[cat] as string[]) {
      if (!safe(t)) continue;
      out.push({
        url: `https://en.wikipedia.org/wiki/${t}`,
        name: `Wikipedia: ${t.replace(/_/g, " ")}`,
        weight: 25,
        category: cat,
      });
    }
  }

  // Subreddits
  for (const cat of Object.keys(SUBS) as Category[]) {
    for (const s of SUBS[cat]) {
      if (!safe(s)) continue;
      out.push({
        url: `https://www.reddit.com/r/${s}`,
        name: `r/${s}`,
        weight: 22,
        category: cat,
      });
    }
  }

  // GitHub topics
  for (const cat of Object.keys(GH_TOPICS) as Category[]) {
    for (const t of GH_TOPICS[cat]) {
      if (!safe(t)) continue;
      out.push({
        url: `https://github.com/topics/${t}`,
        name: `GitHub: ${t}`,
        weight: 18,
        category: cat,
      });
    }
  }

  // neal.fun curated
  for (const slug of NEAL_FUN) {
    out.push({ url: `https://neal.fun/${slug}`, name: `neal.fun/${slug}`, weight: 6, category: "fun" });
  }

  // Dedup by URL
  const seen = new Set<string>();
  return out.filter(s => { if (seen.has(s.url)) return false; seen.add(s.url); return true; });
}

export const SITES: Site[] = build();
export const TOTAL_WEIGHT: number = SITES.reduce((s, x) => s + x.weight, 0);

function totalForCategory(cat: Category | null): number {
  return cat ? SITES.filter(s => s.category === cat).reduce((s, x) => s + x.weight, 0) : TOTAL_WEIGHT;
}

export function sitesByCategory(cat: Category): Site[] {
  return SITES.filter(s => s.category === cat);
}

export function countByCategory(): Record<Category, number> {
  const out = {} as Record<Category, number>;
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const s of SITES) out[s.category]++;
  return out;
}

export function pickRandom(category?: Category | null): {
  site: Site; index: number; rarityValue: number; rarity: Rarity; color: string; emoji: string; category: Category;
} {
  const pool = category ? SITES.filter(s => s.category === category) : SITES;
  const total = totalForCategory(category ?? null);
  const r = Math.random() * total;
  let acc = 0;
  let chosen = pool[0];
  for (const s of pool) {
    acc += s.weight;
    if (r <= acc) { chosen = s; break; }
  }
  const rarityValue = Math.max(1, Math.round(total / chosen.weight));
  const meta = getRarityMeta(chosen.weight);
  return {
    site: chosen,
    index: SITES.indexOf(chosen),
    rarityValue,
    rarity: meta.tier,
    color: meta.color,
    emoji: meta.emoji,
    category: chosen.category,
  };
}

export function getRarityMeta(weight: number) {
  let chosen = RARITY_BUCKETS[RARITY_BUCKETS.length - 1];
  for (const b of RARITY_BUCKETS) if (weight >= b.min) chosen = b;
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
