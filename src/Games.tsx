import { useState } from "react";
import { AudioLines, Ear, Smile, ArrowRight } from "lucide-react";
import { levels } from "./data";
export function Games({
  start,
  ready,
}: {
  start: (kind: number, level: number) => void;
  ready: boolean;
}) {
  const [level, setLevel] = useState(1);
  return (
    <section className="games-page">
      <div className="page-heading">
        <h1>Games</h1>
      </div>
      <div className="games-controls">
        <label htmlFor="game-level">Sounds to practice</label>
        <select
          id="game-level"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
        >
          {levels.map((l, i) => (
            <option key={l.name} value={i + 1}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
      <div className="game-grid">
        {[
          {
            Icon: Ear,
            title: "Sound detective",
            text: "Listen and choose a symbol.",
            color: "#d9eee5",
          },
          {
            Icon: AudioLines,
            title: "Perfect match",
            text: "Match a symbol to its sound.",
            color: "#e3e9fa",
          },
          {
            Icon: Smile,
            title: "Mouth moves",
            text: "Choose how a sound is made.",
            color: "#f8e7cd",
          },
        ].map(({ Icon, title, text, color }, kind) => (
          <article className="game-card" key={title}>
            <div className="game-art" style={{ background: color }}>
              <Icon size={54} strokeWidth={1.5} />
            </div>
            <h2>{title}</h2>
            <p>{text}</p>
            <button
              className="primary"
              disabled={!ready}
              onClick={() => start(kind, level)}
              aria-label={`Play ${title.toLowerCase()}`}
            >
              Play
              <ArrowRight size={17} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
