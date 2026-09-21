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
        <div className="eyebrow">A LITTLE PLAY. A LITTLE PRACTICE.</div>
        <h1>
          The sound playground<span>.</span>
        </h1>
        <p>Pick a game. Take six little hops. Make a sound your own.</p>
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
            text: "Listen closely and find the matching IPA symbol.",
            color: "#d9eee5",
          },
          {
            Icon: AudioLines,
            title: "Perfect match",
            text: "See a symbol, compare recordings, and find its sound.",
            color: "#e3e9fa",
          },
          {
            Icon: Smile,
            title: "Mouth moves",
            text: "Match each sound to the way your mouth makes it.",
            color: "#f8e7cd",
          },
        ].map(({ Icon, title, text, color }, kind) => (
          <article className="game-card" key={title}>
            <div className="game-art" style={{ background: color }}>
              <Icon size={54} strokeWidth={1.5} />
            </div>
            <span className="eyebrow">6 QUESTIONS · PLAY ANYTIME</span>
            <h2>{title}</h2>
            <p>{text}</p>
            <button
              className="primary"
              disabled={!ready}
              onClick={() => start(kind, level)}
            >
              Play {title.toLowerCase()}
              <ArrowRight size={17} />
            </button>
          </article>
        ))}
      </div>
      <p className="games-note">
        Games earn XP and count toward your daily streak. Finish guided lessons
        in My learning to move along your learning trail.
      </p>
    </section>
  );
}
