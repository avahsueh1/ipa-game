import { useRef, useState } from "react";
import { Volume2, ArrowRight } from "lucide-react";
import { type Sound } from "./data";
import { TutorialVisual } from "./TutorialVisual";
import { EnglishHint } from "./EnglishHint";
const places = [
  "Both lips",
  "Teeth + lip",
  "At teeth",
  "Tooth ridge",
  "Behind ridge",
  "Hard roof",
  "Soft roof",
  "Uvula",
  "Throat",
];
const placeFeatures = [
  "Both lips",
  "Teeth on lip",
  "Tongue at teeth",
  "Tongue behind teeth",
  "Tongue just behind tooth ridge",
  "Tongue at hard roof",
  "Back of mouth",
  "Very back of mouth",
  "Throat",
];
const airflow: Record<string, string> = {
  Stop: "pop",
  Nasal: "nose hum",
  Fricative: "hiss",
  Approximant: "gentle flow",
  Lateral: "air around sides",
};
const simpleNames: Record<string, string> = {
  Stop: "Puff",
  Nasal: "Hum",
  Fricative: "Hiss",
  Approximant: "Smooth flow",
  Lateral: "Side flow",
};
const openings: Record<string, string> = {
  Close: "Mouth almost closed",
  "Near-close": "Mouth slightly open",
  "Close-mid": "Mouth a little open",
  Mid: "Mouth half open",
  "Open-mid": "Mouth fairly open",
  "Near-open": "Mouth nearly wide open",
  Open: "Mouth wide open",
};
const rows = [
  {
    label: "Stop",
    help: "Stop, then release air",
    cells: ["p b", "", "", "t d", "", "", "k ɡ", "", ""],
  },
  {
    label: "Nasal",
    help: "Air through the nose",
    cells: ["m", "", "", "n", "", "ɲ", "ŋ", "", ""],
  },
  {
    label: "Fricative",
    help: "Air through a narrow gap",
    cells: ["ɸ β", "f v", "θ ð", "s z", "ʃ ʒ", "ç", "x", "ʁ", "h"],
  },
  {
    label: "Approximant",
    help: "Air flows smoothly",
    cells: ["", "", "", "ɹ", "", "j", "", "", ""],
  },
  {
    label: "Lateral",
    help: "Air around tongue sides",
    cells: ["", "", "", "l", "", "ʎ", "", "", ""],
  },
];
const vowelRows = [
  { label: "Close", cells: ["i y", "", "u"] },
  { label: "Near-close", cells: ["ɪ", "", "ʊ"] },
  { label: "Close-mid", cells: ["e ø", "", "o"] },
  { label: "Mid", cells: ["", "ə", ""] },
  { label: "Open-mid", cells: ["ɛ", "", "ʌ ɔ"] },
  { label: "Near-open", cells: ["æ", "", ""] },
  { label: "Open", cells: ["", "", "ɑ"] },
];
export function IPAChart({
  pool,
  play,
  learn,
  ready,
  playing,
}: {
  pool: Sound[];
  play: (s: Sound) => void;
  learn: (s: Sound) => void;
  ready: boolean;
  playing: string | null;
}) {
  const guide = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const active = pool.find((s) => s.id === selected) || pool[0];
  const symbols = new Map(pool.map((s) => [s.symbol, s]));
  const has = (cell: string) => cell.split(" ").some((s) => symbols.has(s));
  function tile(symbol: string) {
    const s = symbols.get(symbol);
    return s ? (
      <button
        type="button"
        key={s.id}
        className={`chart-sound ${active?.id === s.id ? "selected" : ""}`}
        aria-label={`Hear ${s.symbol}${s.example ? ` as in ${s.example}` : ""}`}
        aria-pressed={active?.id === s.id}
        onClick={() => {
          setSelected(s.id);
          play(s);
          requestAnimationFrame(() => {
            guide.current?.focus({ preventScroll: true });
            guide.current?.scrollIntoView({
              block: "nearest",
              behavior: "auto",
            });
          });
        }}
      >
        <span>{s.symbol}</span>
        <small>{s.example || "Listen"}</small>
      </button>
    ) : null;
  }
  const columns = places
    .map((p, i) => ({ p, i }))
    .filter(({ i }) => rows.some((r) => has(r.cells[i])));
  const consonants = rows.filter((r) => r.cells.some(has));
  const vowels = vowelRows.filter((r) => r.cells.some(has));
  return (
    <div className="ipa-chart">
      <p className="chart-instruction">
        IPA symbols show speech sounds. Tap one to hear it.
      </p>
      {active && (
        <section
          className="chart-detail"
          ref={guide}
          tabIndex={-1}
          aria-live="polite"
          aria-label="How to make the selected sound"
        >
          <div>
            <span className="chart-selected-symbol">/{active.symbol}/</span>
            <EnglishHint symbol={active.symbol} />
          </div>
          <div className="chart-visual-steps">
            {active.feature.split(" · ").map((feature, i) => (
              <figure key={feature}>
                <TutorialVisual feature={feature} sound={active} />
                <figcaption>
                  <span>{i + 1}</span>
                  {feature === "voice off"
                    ? "No throat buzz"
                    : feature === "voice on"
                      ? "Feel a throat buzz"
                      : feature === "pop"
                        ? "Release a puff"
                        : feature === "nose hum"
                          ? "Hum through your nose"
                          : feature === "hiss"
                            ? "Keep air flowing"
                            : feature}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="chart-actions">
            <button className="text-btn" onClick={() => play(active)}>
              <Volume2 size={18} />
              {playing === active.id ? "Playing…" : "Hear again"}
            </button>
            <button
              className="primary"
              disabled={!ready}
              onClick={() => learn(active)}
            >
              Learn this sound
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      )}
      {consonants.length > 0 && (
        <section>
          <h3>Consonants</h3>
          <p className="chart-note">
            In a pair, left = voice off; right = voice on. Blank cells are
            positions not covered here.
          </p>
          <div
            className="chart-scroll"
            tabIndex={0}
            role="region"
            aria-label="Consonant chart, scroll horizontally for more mouth positions"
          >
            <table>
              <caption>
                Rows: how air moves. Columns: where the sound is made.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Airflow ↓ · Position →</th>
                  {columns.map(({ p, i }) => (
                    <th scope="col" key={p}>
                      <TutorialVisual feature={placeFeatures[i]} />
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {consonants.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">
                      <div className="chart-row-label">
                        <TutorialVisual feature={airflow[r.label]} />
                        <span>
                          {simpleNames[r.label]}
                          <small>{r.label}</small>
                        </span>
                      </div>
                    </th>
                    {columns.map(({ i }) => (
                      <td key={i}>
                        <div className="chart-pair">
                          {r.cells[i].split(" ").map(tile)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {symbols.has("w") && (
        <div className="chart-other">
          {tile("w")}
          <span>
            <strong>Two positions together</strong>
            <small>Round lips + back of tongue</small>
            <div className="chart-w-visuals">
              <TutorialVisual feature="Round lips" />
              <TutorialVisual
                feature="Back of mouth"
                sound={symbols.get("w")}
              />
            </div>
          </span>
        </div>
      )}
      {vowels.length > 0 && (
        <section>
          <h3>Vowels</h3>
          <div
            className="chart-scroll"
            tabIndex={0}
            role="region"
            aria-label="Vowel chart"
          >
            <table>
              <caption>Tongue height ↓ · Tongue position →</caption>
              <thead>
                <tr>
                  <th scope="col">Height</th>
                  {["Front", "Central", "Back"].map((p) => (
                    <th scope="col" key={p}>
                      <TutorialVisual
                        feature={
                          p === "Front"
                            ? "tongue forward"
                            : p === "Back"
                              ? "tongue back"
                              : "tongue in middle"
                        }
                      />
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vowels.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">
                      <div className="chart-row-label">
                        <TutorialVisual feature={openings[r.label]} />
                        <span>{r.label}</span>
                      </div>
                    </th>
                    {r.cells.map((c, i) => (
                      <td key={i}>
                        <div className="chart-pair">
                          {c.split(" ").map(tile)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="chart-note">
            Close = tongue high; open = tongue low. /ɪ/ and /ʊ/ sit slightly
            toward the center. English examples vary by accent.
          </p>
        </section>
      )}
    </div>
  );
}
