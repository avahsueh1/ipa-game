export type Sound = {
  id: string;
  symbol: string;
  name: string;
  level: number;
  feature: string;
  example: string;
  file: string;
};
const groups: [string, string, string, string][] = [
  ["p", "Voiceless bilabial plosive", "Both lips · pop · voice off", "pig"],
  ["b", "Voiced bilabial plosive", "Both lips · pop · voice on", "bat"],
  ["m", "Voiced bilabial nasal", "Both lips · nose hum · voice on", "moon"],
  [
    "f",
    "Voiceless labiodental fricative",
    "Teeth on lip · hiss · voice off",
    "fish",
  ],
  [
    "v",
    "Voiced labiodental fricative",
    "Teeth on lip · hiss · voice on",
    "van",
  ],
  [
    "w",
    "Voiced labio-velar approximant",
    "Round lips · gentle flow · voice on",
    "water",
  ],
  [
    "t",
    "Voiceless alveolar plosive",
    "Tongue behind teeth · pop · voice off",
    "top",
  ],
  [
    "d",
    "Voiced alveolar plosive",
    "Tongue behind teeth · pop · voice on",
    "dog",
  ],
  [
    "n",
    "Voiced alveolar nasal",
    "Tongue behind teeth · nose hum · voice on",
    "nose",
  ],
  [
    "s",
    "Voiceless alveolar fricative",
    "Tongue behind teeth · hiss · voice off",
    "sun",
  ],
  [
    "z",
    "Voiced alveolar fricative",
    "Tongue behind teeth · hiss · voice on",
    "zoo",
  ],
  [
    "l",
    "Alveolar lateral approximant",
    "Tongue behind teeth · air around sides · voice on",
    "leaf",
  ],
  ["k", "Voiceless velar plosive", "Back of mouth · pop · voice off", "kite"],
  ["ɡ", "Voiced velar plosive", "Back of mouth · pop · voice on", "go"],
  [
    "h",
    "Voiceless glottal fricative",
    "Throat · gentle breath · voice off",
    "hat",
  ],
  [
    "θ",
    "Voiceless dental fricative",
    "Tongue at teeth · hiss · voice off",
    "think",
  ],
  ["ð", "Voiced dental fricative", "Tongue at teeth · hiss · voice on", "this"],
  [
    "ʃ",
    "Voiceless postalveolar fricative",
    "Tongue just behind tooth ridge · hiss · voice off",
    "ship",
  ],
  [
    "ʒ",
    "Voiced postalveolar fricative",
    "Tongue just behind tooth ridge · hiss · voice on",
    "vision",
  ],
  ["ŋ", "Velar nasal", "Back of mouth · nose hum · voice on", "sing"],
  [
    "ɹ",
    "Alveolar approximant",
    "Tongue near tooth ridge · gentle flow · voice on",
    "red",
  ],
  [
    "j",
    "Palatal approximant",
    "Tongue near hard roof · gentle flow · voice on",
    "yes",
  ],
  [
    "i",
    "Close front unrounded vowel",
    "Mouth almost closed · tongue forward · relaxed lips",
    "fleece",
  ],
  [
    "ɪ",
    "Near-close near-front unrounded vowel",
    "Mouth slightly open · tongue toward front · relaxed lips",
    "kit",
  ],
  [
    "e",
    "Close-mid front unrounded vowel",
    "Mouth a little open · tongue forward · relaxed lips",
    "",
  ],
  [
    "ɛ",
    "Open-mid front unrounded vowel",
    "Mouth fairly open · tongue forward · relaxed lips",
    "dress",
  ],
  [
    "æ",
    "Near-open front unrounded vowel",
    "Mouth nearly wide open · tongue forward · relaxed lips",
    "trap",
  ],
  [
    "ɑ",
    "Open back unrounded vowel",
    "Mouth wide open · tongue back · relaxed lips",
    "father",
  ],
  [
    "ɔ",
    "Open-mid back rounded vowel",
    "Mouth fairly open · tongue back · round lips",
    "thought",
  ],
  [
    "o",
    "Close-mid back rounded vowel",
    "Mouth a little open · tongue back · round lips",
    "",
  ],
  [
    "ʊ",
    "Near-close near-back rounded vowel",
    "Mouth slightly open · tongue toward back · round lips",
    "foot",
  ],
  [
    "u",
    "Close back rounded vowel",
    "Mouth almost closed · tongue back · round lips",
    "goose",
  ],
  [
    "ʌ",
    "Open-mid back unrounded vowel",
    "Mouth fairly open · tongue back · relaxed lips",
    "strut",
  ],
  [
    "ə",
    "Mid-central vowel",
    "Mouth half open · tongue in middle · relaxed lips",
    "about",
  ],
  [
    "y",
    "Close front rounded vowel",
    "Mouth almost closed · tongue forward · round lips",
    "",
  ],
  [
    "ø",
    "Close-mid front rounded vowel",
    "Mouth a little open · tongue forward · round lips",
    "",
  ],
  ["x", "Voiceless velar fricative", "Back of mouth · hiss · voice off", ""],
  ["ʁ", "Voiced uvular fricative", "Very back of mouth · hiss · voice on", ""],
  ["ɲ", "Palatal nasal", "Tongue at hard roof · nose hum · voice on", ""],
  [
    "ʎ",
    "Palatal lateral approximant",
    "Tongue at hard roof · air around sides · voice on",
    "",
  ],
  ["ɸ", "Voiceless bilabial fricative", "Both lips · hiss · voice off", ""],
  ["β", "Voiced bilabial fricative", "Both lips · hiss · voice on", ""],
  [
    "ç",
    "Voiceless palatal fricative",
    "Tongue near hard roof · hiss · voice off",
    "",
  ],
];
export const sounds: Sound[] = groups.map(
  ([symbol, name, feature, example], i) => ({
    id: `sound-${i}`,
    symbol,
    name,
    feature,
    example,
    level: i < 6 ? 1 : i < 15 ? 2 : i < 22 ? 3 : i < 34 ? 4 : 5,
    file: `${name}.ogg`,
  }),
);
export const levels = [
  {
    name: "First hops",
    subtitle: "Sounds you already know",
    idea: "Voice on, voice off",
    description:
      "Touch your throat and say “mmm”. Feel that little buzz? That’s your voice working. Try “fff” — no buzz!",
    color: "#d9eee5",
  },
  {
    name: "Find your footing",
    subtitle: "Explore your mouth",
    idea: "Where sounds happen",
    description:
      "Your lips, tongue, and the back of your mouth all help make sounds. Let’s find out where each one lives.",
    color: "#e3e9fa",
  },
  {
    name: "Into the wild",
    subtitle: "A few delightful twists",
    idea: "Follow the airflow",
    description:
      "A pop stops the air, a hiss squeezes it, and a nose hum lets it flow through your nose.",
    color: "#f8e7cd",
  },
  {
    name: "Sing it out",
    subtitle: "Meet the vowels",
    idea: "Make room for vowels",
    description:
      "Move your tongue, open your mouth, and round your lips. Small changes make a whole new vowel. English examples vary by accent; e and o are steady vowels here.",
    color: "#f0dfee",
  },
  {
    name: "World of sounds",
    subtitle: "Go somewhere new",
    idea: "A bigger sound adventure",
    description:
      "Discover sounds beyond English. You’ll also meet the real linguistic names for how we make them.",
    color: "#e3ebcc",
  },
];
export const lessons = levels.flatMap((_, i) => {
  const pool = sounds.filter((s) => s.level === i + 1);
  return Array.from({ length: Math.ceil(pool.length / 3) }, (_, j) => ({
    id: `${i + 1}-${j}`,
    level: i + 1,
    index: j,
    sounds: pool.slice(j * 3, j * 3 + 3),
  }));
});
export type Lesson = (typeof lessons)[number];
