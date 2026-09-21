import { useState } from "react";
import { ArrowRight, Volume2, X } from "lucide-react";
import { levels, type Lesson, type Sound } from "./data";
function explain(feature: string) {
  return feature.split(" · ").map((part) => {
    const notes: Record<string, string> = {
      "voice on":
        "Rest a finger gently on your throat. You should feel a buzz.",
      "voice off": "Let the air move without buzzing your voice.",
      pop: "Stop the air briefly, then let it go in a little burst.",
      hiss: "Keep a narrow gap so the air makes a steady friction sound.",
      "nose hum": "Let your voice resonate through your nose, like a hum.",
      "Both lips": "Bring your top and bottom lips together.",
      "Teeth on lip": "Rest your top teeth gently against your bottom lip.",
      "Tongue behind teeth":
        "Put the tip of your tongue at the ridge just behind your upper teeth.",
      "Back of mouth":
        "Lift the back of your tongue toward the soft roof of your mouth.",
      "Round lips": "Bring your lips forward into a small rounded shape.",
    };
    return {
      part,
      note:
        notes[part] ||
        `Try this position: ${part.toLowerCase()}. Listen again and copy the recording slowly.`,
    };
  });
}
export function LearningModule({
  lesson,
  play,
  playing,
  audioError,
  close,
  complete,
}: {
  lesson: Lesson;
  play: (sound: Sound) => void;
  playing: string | null;
  audioError: string;
  close: () => void;
  complete: () => void;
}) {
  const [step, setStep] = useState(-1);
  const level = levels[lesson.level - 1],
    sound = lesson.sounds[step];
  return (
    <div
      className="lesson-screen"
      role="dialog"
      aria-modal="true"
      aria-label="Guided learning module"
    >
      <div className="lesson-header">
        <button
          className="icon-btn"
          aria-label="Close learning module"
          onClick={close}
        >
          <X />
        </button>
        <div className="lesson-track">
          <span
            style={{
              width: `${((step + 1) / (lesson.sounds.length + 1)) * 100}%`,
            }}
          />
        </div>
        <span>LEARN</span>
      </div>
      <div className="lesson-body study-body" key={step}>
        <span className="eyebrow">
          {level.name} · LESSON {lesson.index + 1}
        </span>
        {step === -1 ? (
          <>
            <h1>{level.idea}</h1>
            <p>{level.description}</p>
            <div className="study-symbols">
              {lesson.sounds.map((s) => (
                <span key={s.id}>{s.symbol}</span>
              ))}
            </div>
            <p>
              Meet {lesson.sounds.length} sounds, listen and try them out. Then
              take a six-question check to finish your lesson and earn today’s
              crown.
            </p>
            <button className="primary" onClick={() => setStep(0)}>
              Meet the sounds <ArrowRight size={18} />
            </button>
          </>
        ) : (
          <>
            <div className="study-count">
              Sound {step + 1} of {lesson.sounds.length}
            </div>
            <h1 className="study-symbol">/{sound.symbol}/</h1>
            <h2>{sound.name}</h2>
            <button className="primary" onClick={() => play(sound)}>
              <Volume2 size={20} />
              {playing === sound.id ? "Playing…" : "Listen and try"}
            </button>
            <p className="study-example">
              Example: <strong>{sound.example}</strong>. Examples can vary by
              accent; follow the recording.
            </p>
            <div className="study-notes">
              {explain(sound.feature).map(({ part, note }) => (
                <div key={part}>
                  <strong>{part}</strong>
                  <p>{note}</p>
                </div>
              ))}
            </div>
            <div className="study-actions">
              <button className="text-btn" onClick={() => setStep(step - 1)}>
                Back
              </button>
              <button
                className="primary"
                onClick={() =>
                  step === lesson.sounds.length - 1
                    ? complete()
                    : setStep(step + 1)
                }
              >
                {step === lesson.sounds.length - 1
                  ? "Check what I learned"
                  : "Next sound"}
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
        {audioError && <p role="alert">{audioError}</p>}
      </div>
    </div>
  );
}
