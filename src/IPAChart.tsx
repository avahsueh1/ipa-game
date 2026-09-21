import { useState } from "react";
import { Volume2, ArrowRight } from "lucide-react";
import { type Sound } from "./data";
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
  const [selected, setSelected] = useState<string | null>(null);
  const active = pool.find((s) => s.id === selected);
  const symbols = new Map(pool.map((s) => [s.symbol, s]));
  const has = (cell: string) => cell.split(" ").some((s) => symbols.has(s));
  function tile(symbol: string) {
    const s = symbols.get(symbol);
    return s ? (
      <button
        type="button"
        key={s.id}
        className={`chart-sound ${selected === s.id ? "selected" : ""}`}
        aria-label={`Hear ${s.symbol}${s.example ? ` as in ${s.example}` : ""}`}
        aria-pressed={selected === s.id}
        onClick={() => {
          setSelected(s.id);
          play(s);
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
      {consonants.length > 0 && (
        <section>
          <h3>Consonants</h3>
          <p className="chart-note">
            In a pair, left = voice off; right = voice on. Blank cells are
            sounds outside this course.
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
                  {columns.map(({ p }) => (
                    <th scope="col" key={p}>
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {consonants.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">
                      {r.label}
                      <small>{r.help}</small>
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
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vowels.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
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
      {active && (
        <section className="chart-detail" aria-live="polite">
          <div>
            <span className="chart-selected-symbol">/{active.symbol}/</span>
            <EnglishHint symbol={active.symbol} />
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
    </div>
  );
}
