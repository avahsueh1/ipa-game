import { useState } from "react";
import { ArrowRight, Volume2, X } from "lucide-react";
import { EnglishHint } from "./EnglishHint";
import { TutorialVisual } from "./TutorialVisual";
import { levels, sounds, type Lesson, type Sound } from "./data";
function explain(feature: string, sound: Sound) {
  return feature.split(" · ").map((part) => {
    const notes: Record<string, string> = {
      "voice on":
        "Rest a finger gently on your throat. You should feel a buzz.",
      "voice off":
        "Rest two fingers lightly on your throat. Say the sound without a buzz.",
      pop: "Stop the air briefly, then let it go in a little burst.",
      hiss: "Keep a narrow gap so the air makes a steady friction sound.",
      "nose hum": "Let your voice resonate through your nose, like a hum.",
      "Both lips": "Bring your top and bottom lips together.",
      "Teeth on lip": "Rest your top teeth gently against your bottom lip.",
      "Tongue behind teeth":
        "Put the tip of your tongue at the ridge just behind your upper teeth.",
      "Back of mouth":
        "Lift the back of your tongue toward the soft roof of your mouth.",
      "Tongue at teeth":
        "Put the tongue tip lightly against your upper teeth. Let air pass.",
      "Tongue just behind tooth ridge":
        "Move your tongue a little farther back than for s. Leave a small air gap.",
      "Tongue near tooth ridge":
        "Lift your tongue toward the tooth ridge without touching it.",
      "Tongue near hard roof":
        "Raise the middle of your tongue toward the hard roof. Leave space for air.",
      "Tongue at hard roof":
        "Touch the middle of your tongue to the hard roof of your mouth.",
      "Very back of mouth":
        "Raise the back of your tongue toward the uvula, beyond the soft roof.",
      Throat: "Keep your mouth relaxed and breathe out gently, like h in hat.",
      "gentle breath": "Breathe out softly through your open mouth.",
      "gentle flow": "Let air flow smoothly without a pop or hiss.",
      "air around sides": "Let air pass around the sides of your tongue.",
      "relaxed lips": "Keep your lips unrounded. Do not push them forward.",
      "round lips": "Round your lips as if blowing gently through a straw.",
      "tongue forward":
        "Keep the highest part of your tongue toward the front. The dot shows its position.",
      "tongue toward front":
        "Keep your tongue near the front, slightly more central than for i.",
      "tongue back":
        "Keep the highest part of your tongue toward the back. The dot shows its position.",
      "tongue toward back":
        "Keep your tongue near the back, slightly more central than for u.",
      "tongue in middle":
        "Keep your tongue relaxed in the middle of your mouth.",
      "Round lips": "Bring your lips forward into a small rounded shape.",
    };
    if (part === "Both lips" && sound.name.toLowerCase().includes("fricative"))
      notes[part] = "Bring your lips close, leaving a narrow gap for air.";
    if (
      part === "Tongue behind teeth" &&
      sound.name.toLowerCase().includes("fricative")
    )
      notes[part] =
        "Bring your tongue close to the tooth ridge, leaving a narrow gap.";
    const titles: Record<string, string> = {
      "Both lips": sound.name.toLowerCase().includes("fricative")
        ? "Leave a lip gap"
        : "Close your lips",
      pop: "Release a puff",
      hiss: "Keep air flowing",
      "nose hum": "Hum through your nose",
      "voice on": "Feel a buzz",
      "voice off": "No throat buzz",
      "Teeth on lip": "Teeth touch lower lip",
    };
    return {
      part,
      title: titles[part] || part,
      note:
        notes[part] ||
        (part.startsWith("Mouth")
          ? "Use the opening in the picture as a guide. Listen, then match the vowel."
          : part),
    };
  });
}
export function LearningModule({
  lesson,
  initialStep = -1,
  play,
  playing,
  audioError,
  close,
  complete,
}: {
  lesson: Lesson;
  initialStep?: number;
  play: (sound: Sound) => void;
  playing: string | null;
  audioError: string;
  close: () => void;
  complete: () => void;
}) {
  const [step, setStep] = useState(initialStep);
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
            <div className="intro-visuals">
              {(lesson.level === 1
                ? ["voice on", "voice off"]
                : lesson.level === 2
                  ? ["Both lips", "Tongue behind teeth", "Back of mouth"]
                  : lesson.level === 3
                    ? ["pop", "hiss", "nose hum"]
                    : lesson.level === 4
                      ? ["Mouth wide open", "tongue forward", "round lips"]
                      : [
                          "Tongue at hard roof",
                          "Very back of mouth",
                          "round lips",
                        ]
              ).map((feature) => (
                <div key={feature}>
                  <TutorialVisual feature={feature} />
                  <strong>
                    {feature === "voice on"
                      ? "Feel a buzz"
                      : feature === "voice off"
                        ? "No buzz"
                        : feature}
                  </strong>
                  {lesson.level === 1 && (
                    <button
                      className="text-btn"
                      onClick={() =>
                        play(sounds[feature === "voice on" ? 2 : 3])
                      }
                    >
                      <Volume2 size={16} />
                      {feature === "voice on" ? "Try mmm" : "Try fff"}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p>{level.description}</p>
            <div className="study-symbols">
              {lesson.sounds.map((s) => (
                <span key={s.id}>{s.symbol}</span>
              ))}
            </div>
            <p>{lesson.sounds.length} sounds · 6 practice questions</p>
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
            <EnglishHint symbol={sound.symbol} />
            <details className="sound-term">
              <summary>Sound name</summary>
              {sound.name}
            </details>
            <button className="primary" onClick={() => play(sound)}>
              <Volume2 size={20} />
              {playing === sound.id ? "Playing…" : "Hear the sound"}
            </button>
            <div className="study-notes">
              {explain(sound.feature, sound).map(({ part, title, note }, i) => (
                <div key={part}>
                  <TutorialVisual feature={part} sound={sound} />
                  <strong>
                    <span className="instruction-number">{i + 1}</span>
                    {title}
                  </strong>
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
