import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  AudioLines,
  BookOpen,
  Check,
  ChevronRight,
  Compass,
  Flame,
  Headphones,
  Leaf,
  Lock,
  LogOut,
  Map,
  Gamepad2,
  Music2,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Volume2,
  X,
} from "lucide-react";
import { LearningModule } from "./LearningModule";
import { Games } from "./Games";
import { Frog } from "./Frog";
import { levels, lessons, sounds, type Lesson, type Sound } from "./data";
import { localDay, stats, type LessonEvent } from "./progress";
import { useProgress } from "./useProgress";
import { supabase } from "./backend";
import credits from "./audio-credits.json";
type Page = "games" | "learn" | "library" | "progress" | "credits";
type Question = { sound: Sound; kind: number; choices: Sound[] };
function shuffle<T>(list: T[]) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function questions(lesson: Lesson, gameKind?: number): Question[] {
  return Array.from({ length: 6 }, (_, i) => {
    const sound = lesson.sounds[i % lesson.sounds.length],
      kind = gameKind ?? (i + Math.floor(i / 3)) % 3;
    const alternatives = shuffle(
      sounds.filter(
        (s) =>
          s.level === lesson.level &&
          s.id !== sound.id &&
          (kind !== 2 || s.feature !== sound.feature),
      ),
    ).slice(0, lesson.level <= 2 ? 2 : 3);
    return { sound, kind, choices: shuffle([sound, ...alternatives]) };
  });
}
export default function App() {
  const { user, events, save, status, ready } = useProgress();
  const [now, setNow] = useState(() => new Date());
  const progress = stats(events, now);
  const [study, setStudy] = useState<Lesson | null>(null);
  const [gameKind, setGameKind] = useState<number | undefined>();
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = window.setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  const [page, setPage] = useState<Page>("learn"),
    [selectedLevel, setSelectedLevel] = useState<number | null>(null),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState(0);
  const [lesson, setLesson] = useState<Lesson | null>(null),
    [qs, setQs] = useState<Question[]>([]),
    [index, setIndex] = useState(0),
    [answer, setAnswer] = useState<string | null>(null),
    [event, setEvent] = useState<LessonEvent | null>(null),
    [finished, setFinished] = useState(false),
    [exit, setExit] = useState(false);
  const [account, setAccount] = useState(false),
    [email, setEmail] = useState(""),
    [authMessage, setAuthMessage] = useState(""),
    [sending, setSending] = useState(false),
    [audioError, setAudioError] = useState(""),
    [playing, setPlaying] = useState<string | null>(null);
  useEffect(() => {
    const callback = new URLSearchParams(window.location.hash.slice(1));
    if (callback.has("error")) {
      setAuthMessage(
        "That sign-in link has expired or could not be verified. Request a fresh link below.",
      );
      setAccount(true);
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, []);
  useEffect(() => {
    if (user) {
      setAccount(false);
      setAuthMessage("");
    }
  }, [user?.id]);
  const audio = useRef<HTMLAudioElement | null>(null);
  const finishGuard = useRef(false);
  const modalOpen =
    account || selectedLevel !== null || lesson !== null || study !== null;
  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.activeElement as HTMLElement;
    const dialog = document.querySelector<HTMLElement>('[aria-modal="true"]');
    const focusables = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          "button:not(:disabled),input,select,a[href]",
        ) || [],
      );
    focusables()[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = focusables(),
        first = nodes[0],
        last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [modalOpen, account, selectedLevel, !!lesson, !!study]);
  const unlocked = (level: number) =>
    level === 1 ||
    lessons
      .filter((l) => l.level === level - 1)
      .every((l) => progress.completed.has(l.id));
  const current =
    lessons.find((l) => !progress.completed.has(l.id)) || lessons[0];
  function stopAudio() {
    audio.current?.pause();
    setPlaying(null);
  }
  function play(sound: Sound) {
    stopAudio();
    setAudioError("");
    const recording = new Audio(`/audio/${sound.id}.ogg`);
    audio.current = recording;
    setPlaying(sound.id);
    recording.onended = () => setPlaying(null);
    void recording.play().catch(() => {
      setPlaying(null);
      setAudioError(
        "That recording could not play. Check your connection and try again.",
      );
    });
  }
  function start(next: Lesson) {
    if (!ready) return;
    stopAudio();
    setAudioError("");
    setSelectedLevel(null);
    setLesson(null);
    setStudy(next);
  }
  function startGame(kind: number, level: number) {
    beginQuiz(
      {
        id: `game-${kind}-${level}`,
        level,
        index: 0,
        sounds: shuffle(sounds.filter((s) => s.level === level)).slice(0, 3),
      },
      kind,
    );
  }
  function beginQuiz(next: Lesson, kind?: number) {
    if (!ready) return;
    stopAudio();
    setAudioError("");
    setSelectedLevel(null);
    setLesson(next);
    setStudy(null);
    setGameKind(kind);
    setQs(questions(next, kind));
    setIndex(0);
    setAnswer(null);
    setFinished(false);
    setExit(false);
    finishGuard.current = false;
    const e: LessonEvent = {
      id: crypto.randomUUID(),
      lessonId: next.id,
      startedAt: new Date().toISOString(),
      completedAt: null,
      day: null,
      attempts: [],
    };
    setEvent(e);
    save(e);
  }
  function choose(sound: Sound) {
    if (answer || !event) return;
    setAnswer(sound.id);
    setEvent({
      ...event,
      attempts: [
        ...event.attempts,
        {
          soundId: qs[index].sound.id,
          correct: sound.id === qs[index].sound.id,
        },
      ],
    });
  }
  function advance() {
    stopAudio();
    setAudioError("");
    if (index === qs.length - 1) {
      if (!event || finishGuard.current) return;
      finishGuard.current = true;
      const complete = {
        ...event,
        completedAt: new Date().toISOString(),
        day: localDay(),
      };
      setNow(new Date());
      save(complete);
      setEvent(complete);
      setFinished(true);
    } else {
      setIndex(index + 1);
      setAnswer(null);
    }
  }
  function navigate(next: Page) {
    stopAudio();
    setAudioError("");
    setPage(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  const q = qs[index];
  return (
    <div className="app">
      <aside className="sidebar" inert={modalOpen}>
        <button
          className="brand"
          onClick={() => navigate("learn")}
          aria-label="Ribbit home"
        >
          <img
            className="brand-wordmark"
            src="/logo.svg"
            alt="Ribbit, /ˈɹɪbɪt/"
          />
          <img className="brand-icon" src="/ribbit-icon.svg" alt="" />
        </button>
        <div className="brand-caption">RIBBIT · A WORLD OF SOUNDS</div>
        <nav aria-label="Main navigation">
          {(
            [
              [Map, "learn", "My learning"],
              [Gamepad2, "games", "Games"],
              [AudioLines, "library", "Sound library"],
              [Trophy, "progress", "My progress"],
            ] as const
          ).map(([Icon, id, label]) => (
            <button
              key={id}
              className={page === id ? "nav active" : "nav"}
              onClick={() => navigate(id)}
            >
              <Icon size={21} />
              {label}
              {page === id && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="little-note">
            <Leaf size={23} />
            <p>
              A little practice.
              <br />
              <strong>A world of possibilities.</strong>
            </p>
          </div>
          <button className="credits-link" onClick={() => navigate("credits")}>
            <Headphones size={17} /> Audio & credits
          </button>
          <div className="guest">
            <span className="avatar">{user ? "Y" : "G"}</span>
            <div>
              <strong>{user ? "Your account" : "Guest explorer"}</strong>
              <small>
                {user ? "Keep discovering" : "Make yourself at home"}
              </small>
            </div>
            {user ? (
              <button
                className="icon-btn"
                aria-label="Sign out"
                onClick={() => {
                  void supabase?.auth.signOut().then(({ error }) => {
                    if (error) {
                      setAuthMessage("Could not sign out. Please try again.");
                      setAccount(true);
                    }
                  });
                }}
              >
                <LogOut size={17} />
              </button>
            ) : (
              <button
                className="icon-btn"
                aria-label="Save your progress"
                onClick={() => setAccount(true)}
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>
      <main inert={modalOpen}>
        <header className="topbar">
          <div className="breadcrumb">
            Your sound adventure <ChevronRight size={14} />
            <span>
              {page === "learn"
                ? "My learning"
                : page === "games"
                  ? "Games"
                  : page === "library"
                    ? "Sound library"
                    : page === "progress"
                      ? "My progress"
                      : "Audio & credits"}
            </span>
          </div>
          <div className="top-stats">
            <span>
              <Flame size={18} className="orange" />
              {progress.streak}
              <span className="stat-word"> day streak</span>
            </span>
            <span>
              <Star size={18} className="gold" />
              {progress.xp} XP
            </span>
          </div>
        </header>
        <div className="content">
          {page === "games" && <Games start={startGame} ready={ready} />}
          {page === "learn" && (
            <>
              <div className="page-heading">
                <div className="eyebrow">
                  <span /> SMALL HOPS. BIG DISCOVERIES.
                </div>
                <h1>
                  A world of sounds awaits<span>.</span>
                </h1>
                <p>
                  Meet new sounds. Find your voice. One little hop at a time.
                </p>
              </div>
              <section className="hero">
                <div className="hero-copy">
                  <span className="pill">
                    <span /> YOUR NEXT ADVENTURE
                  </span>
                  <div className="level-eyebrow">
                    LEVEL {current.level} ·{" "}
                    {levels[current.level - 1].idea.toUpperCase()}
                  </div>
                  <h2>{levels[current.level - 1].name}</h2>
                  <p>
                    {levels[current.level - 1].subtitle}.<br />
                    Let’s turn them into your first IPA superpower.
                  </p>
                  <button
                    className="primary"
                    disabled={!ready}
                    onClick={() => start(current)}
                  >
                    {progress.completed.size
                      ? "Continue learning"
                      : "Start learning"}
                    <ArrowRight size={19} />
                  </button>
                  <span className="under-button">
                    <span>Learn + 6 questions</span>
                    <span>~4 minutes</span>
                    <span>No pressure</span>
                  </span>
                </div>
                <div className="hero-art">
                  <div className="orb" />
                  <span className="floating-symbol symbol-p">/p/</span>
                  <span className="floating-symbol symbol-m">/m/</span>
                  <span className="floating-symbol symbol-b">/b/</span>
                  <span className="spark spark-one">✳</span>
                  <span className="spark spark-two">✧</span>
                  <div className="frog-bubble">
                    {progress.practicedToday
                      ? "You earned my crown today!"
                      : "Hi, I’m Riff. Let’s hop to it!"}
                  </div>
                  <Frog crowned={progress.practicedToday} />
                  <span className="frog-caption">
                    TINY FROG. BIG CURIOSITY.
                  </span>
                </div>
              </section>
              <section className="journey">
                <div className="section-heading">
                  <div>
                    <h2>Your learning trail</h2>
                    <p>
                      Five little adventures. A whole new way to hear the world.
                    </p>
                  </div>
                  <span className="tag">
                    {progress.completed.size} / {lessons.length} lessons
                  </span>
                </div>
                <div className="level-grid">
                  {levels.map((level, i) => {
                    const levelLessons = lessons.filter(
                      (l) => l.level === i + 1,
                    );
                    const count = levelLessons.filter((l) =>
                      progress.completed.has(l.id),
                    ).length;
                    const open = unlocked(i + 1);
                    return (
                      <button
                        key={level.name}
                        className={`level-card ${open ? "available" : "locked"} ${current.level === i + 1 ? "current" : ""}`}
                        aria-label={`${level.name}${open ? "" : ", locked"}`}
                        disabled={!open}
                        onClick={() => setSelectedLevel(i + 1)}
                      >
                        <div className="level-top">
                          <span>LEVEL 0{i + 1}</span>
                          {count === levelLessons.length ? (
                            <Check size={16} />
                          ) : open ? (
                            <span className="tiny-dot" />
                          ) : (
                            <Lock size={14} />
                          )}
                        </div>
                        <div
                          className="level-illustration"
                          style={{ background: level.color }}
                        >
                          {i === 0 ? (
                            <Frog crowned={progress.practicedToday} />
                          ) : i === 1 ? (
                            <Leaf />
                          ) : i === 2 ? (
                            <Compass />
                          ) : i === 3 ? (
                            <Music2 />
                          ) : (
                            <Sparkles />
                          )}
                        </div>
                        <h3>{level.name}</h3>
                        <p>{level.subtitle}</p>
                        <div className="mini-track">
                          <span
                            style={{
                              width: `${(count / levelLessons.length) * 100}%`,
                            }}
                          />
                        </div>
                        <small>
                          {open
                            ? `${count} of ${levelLessons.length} lessons`
                            : "Keep hopping to unlock"}
                        </small>
                      </button>
                    );
                  })}
                </div>
              </section>
              <section className="bottom-grid">
                <div className="what-card">
                  <div className="round-icon">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <span className="eyebrow">A LITTLE INTRODUCTION</span>
                    <h3>New to IPA? You’re in the right place.</h3>
                    <p>
                      The International Phonetic Alphabet is a set of symbols
                      for speech sounds. One symbol, one sound. A secret code
                      for your ears.
                    </p>
                    <button
                      className="text-btn"
                      onClick={() => navigate("library")}
                    >
                      Meet the sounds <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="kind-card">
                  <span className="heart">♡</span>
                  <h3>Room to get it wrong.</h3>
                  <p>
                    No hearts to lose. No timers to beat.
                    <br />
                    Just you, your curiosity, and a little frog
                    <br className="desktop-break" /> cheering you on.
                  </p>
                  <span>YOU’RE DOING GREAT ALREADY.</span>
                </div>
              </section>
              <footer>
                <span>
                  <ShieldCheck size={15} /> Play freely. Grow at your own pace.
                </span>
                <span>{status}</span>
              </footer>
            </>
          )}
          {page === "library" && (
            <>
              <div className="page-heading">
                <div className="eyebrow">LISTEN. NOTICE. EXPLORE.</div>
                <h1>
                  A pocketful of sounds<span>.</span>
                </h1>
                <p>Tap a sound to hear it. Try it out. Make it your own.</p>
              </div>
              <div className="library-toolbar">
                <label className="search">
                  <Search size={18} />
                  <input
                    placeholder="Find a symbol, sound, or word"
                    aria-label="Search sounds"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <select
                  aria-label="Filter by level"
                  value={filter}
                  onChange={(e) => setFilter(Number(e.target.value))}
                >
                  <option value="0">All 43 sounds</option>
                  {levels.map((l, i) => (
                    <option key={l.name} value={i + 1}>
                      Level {i + 1} · {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="fine-print">
                Some recordings include an “ah” around a consonant; listen for
                the consonant itself. English examples depend on your accent;
                /e/ and /o/ here are steady vowels, not English diphthongs.
              </p>
              <div className="sound-grid">
                {sounds
                  .filter(
                    (s) =>
                      (!filter || s.level === filter) &&
                      `${s.symbol} ${s.name} ${s.example}`
                        .toLowerCase()
                        .includes(query.toLowerCase()),
                  )
                  .map((s) => (
                    <article className="sound-card" key={s.id}>
                      <div>
                        <span className="ipa">{s.symbol}</span>
                        <button
                          className="sound-play"
                          aria-label={`Play ${s.symbol}`}
                          onClick={() => play(s)}
                        >
                          <Volume2 size={20} />
                        </button>
                      </div>
                      <h3>{s.name}</h3>
                      <p>{s.feature}</p>
                      <small>
                        {s.example
                          ? `As in “${s.example}”`
                          : `Level ${s.level} · Explore a new sound`}
                      </small>
                      {playing === s.id && (
                        <span className="playing">Playing…</span>
                      )}
                    </article>
                  ))}
              </div>
              {!sounds.some(
                (s) =>
                  (!filter || s.level === filter) &&
                  `${s.symbol} ${s.name} ${s.example}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
              ) && (
                <div className="empty">
                  No sounds found. Try a symbol like “m” or a word like “lips”.
                </div>
              )}
            </>
          )}
          {page === "progress" && (
            <>
              <div className="page-heading">
                <div className="eyebrow">EVERY LITTLE HOP COUNTS</div>
                <h1>
                  Look how far you’ve come<span>.</span>
                </h1>
                <p>Your adventure, at your pace.</p>
              </div>
              <div className="progress-grid">
                {[
                  [Star, progress.xp, "Total XP"],
                  [Flame, progress.streak, "Day streak"],
                  [AudioLines, progress.learned, "Sounds answered correctly"],
                  [Check, progress.completed.size, "Lessons completed"],
                ].map(([Icon, value, label]) => {
                  const C = Icon as typeof Star;
                  return (
                    <div className="progress-card" key={String(label)}>
                      <C />
                      <strong>{String(value)}</strong>
                      <span>{String(label)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="progress-detail">
                <Frog crowned={progress.practicedToday} />
                <div>
                  <h2>
                    {progress.completed.size
                      ? "Keep that curiosity growing."
                      : "Your first hop is waiting."}
                  </h2>
                  <p>
                    Earn 10 XP for a correct answer and 20 XP for finishing a
                    lesson. Complete a lesson today to grow your streak.
                  </p>
                  <button
                    className="primary"
                    disabled={!ready}
                    onClick={() => start(current)}
                  >
                    Take a little hop <ArrowRight size={18} />
                  </button>
                </div>
              </div>
              <p className="fine-print">
                {status}.{" "}
                {user
                  ? "Your account keeps your adventure together."
                  : "Guest progress stays in this browser."}
              </p>
              {!user && (
                <button className="text-btn" onClick={() => setAccount(true)}>
                  Parent or teacher? Save progress to an account{" "}
                  <ArrowRight size={16} />
                </button>
              )}
            </>
          )}
          {page === "credits" && (
            <>
              <div className="page-heading">
                <div className="eyebrow">A LITTLE THANK YOU</div>
                <h1>
                  The voices behind the sounds<span>.</span>
                </h1>
                <p>
                  Real recordings, generously shared by the Wikimedia Commons
                  community.
                </p>
              </div>
              <p className="credits-intro">
                Audio is provided unmodified under the licenses below. Some
                consonants are recorded with an “ah” before or after them.
                Listen for the consonant in the middle. Speakers and accents
                vary. Original Ribbit logo and Riff illustration were created
                for this app. This first release covers 43 sounds; it is not the
                complete IPA chart.
              </p>
              <div className="credits-list">
                {credits.map((c: any) => (
                  <article key={c.id}>
                    <strong>{c.name}</strong>
                    <span>{c.author}</span>
                    <a href={c.source} target="_blank" rel="noreferrer">
                      Original recording ↗
                    </a>
                    <a
                      href={c.licenseUrl || c.source}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {c.license}
                    </a>
                  </article>
                ))}
              </div>
            </>
          )}
          <div className="mobile-tools">
            <button className="text-btn" onClick={() => navigate("credits")}>
              Audio & credits
            </button>
            {user ? (
              <button
                className="text-btn"
                onClick={() => {
                  void supabase?.auth.signOut();
                }}
              >
                Sign out
              </button>
            ) : (
              <button className="text-btn" onClick={() => setAccount(true)}>
                Save progress
              </button>
            )}
          </div>
          {audioError && (
            <div className="notice error" role="alert">
              {audioError}
            </div>
          )}
        </div>
      </main>
      {selectedLevel !== null && (
        <div className="overlay">
          <section
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Choose a lesson"
          >
            <button
              className="close icon-btn"
              aria-label="Close lessons"
              onClick={() => setSelectedLevel(null)}
            >
              <X />
            </button>
            <span className="eyebrow">LEVEL {selectedLevel}</span>
            <h2>{levels[selectedLevel - 1].name}</h2>
            <p>{levels[selectedLevel - 1].description}</p>
            <div className="lesson-list">
              {lessons
                .filter((l) => l.level === selectedLevel)
                .map((l) => (
                  <button key={l.id} disabled={!ready} onClick={() => start(l)}>
                    <span>
                      <strong>Lesson {l.index + 1}</strong>
                      <span className="lesson-symbols">
                        {l.sounds.map((s) => s.symbol).join(" · ")}
                      </span>
                    </span>
                    {progress.completed.has(l.id) ? (
                      <Check />
                    ) : (
                      <Play size={18} />
                    )}
                  </button>
                ))}
            </div>
          </section>
        </div>
      )}
      {study && (
        <LearningModule
          key={study.id}
          lesson={study}
          play={play}
          playing={playing}
          audioError={audioError}
          close={() => {
            stopAudio();
            setStudy(null);
          }}
          complete={() => beginQuiz(study)}
        />
      )}
      {lesson && (
        <div
          className="lesson-screen"
          role="dialog"
          aria-modal="true"
          aria-label={gameKind !== undefined ? "Sound game" : "Sound lesson"}
        >
          <div className="lesson-header">
            <button
              className="icon-btn"
              aria-label={gameKind !== undefined ? "Exit game" : "Exit lesson"}
              onClick={() => {
                stopAudio();
                if (finished) setLesson(null);
                else setExit(true);
              }}
            >
              <X />
            </button>
            <div className="lesson-track">
              <span
                style={{ width: `${((finished ? 6 : index) / 6) * 100}%` }}
              />
            </div>
            <span>{finished ? 6 : index + 1} / 6</span>
          </div>
          {exit ? (
            <div className="lesson-body">
              <h1>Take a little break?</h1>
              <p>
                Completed lessons are saved. This unfinished lesson won’t earn
                XP.
              </p>
              <button className="primary" onClick={() => setExit(false)}>
                Keep going
              </button>
              <button
                className="text-btn"
                onClick={() => {
                  setLesson(null);
                  setExit(false);
                }}
              >
                {gameKind !== undefined ? "Leave game" : "Leave lesson"}
              </button>
            </div>
          ) : finished ? (
            <div className="lesson-body celebration">
              <Frog variant={1} crowned={progress.practicedToday} />
              <span className="eyebrow">ONE HOP FURTHER</span>
              <h1>Look at you grow!</h1>
              <p>Daily practice, done. Riff’s crown is yours for today!</p>
              <div className="earned">
                <Star /> +
                {20 +
                  (event?.attempts.filter((a) => a.correct).length || 0) *
                    10}{" "}
                XP{" "}
                <span>
                  {event?.attempts.filter((a) => a.correct).length} / 6 correct
                </span>
              </div>
              <button
                className="primary"
                onClick={() =>
                  gameKind !== undefined
                    ? startGame(gameKind, lesson.level)
                    : start(
                        lessons.find((l) => !progress.completed.has(l.id)) ||
                          lesson,
                      )
                }
              >
                {gameKind !== undefined ? "Play again" : "Keep exploring"}{" "}
                <ArrowRight size={18} />
              </button>
              <button className="text-btn" onClick={() => setLesson(null)}>
                {gameKind !== undefined ? "Back to games" : "Back to my trail"}
              </button>
            </div>
          ) : (
            <div className="lesson-body">
              <span className="eyebrow">
                {levels[lesson.level - 1].name} ·{" "}
                {
                  ["LISTEN CLOSELY", "FIND THE SOUND", "HOW DO WE MAKE IT?"][
                    q.kind
                  ]
                }
              </span>
              <h1>
                {
                  [
                    "Which symbol did you hear?",
                    "Which sound matches this symbol?",
                    "How do you make this sound?",
                  ][q.kind]
                }
              </h1>
              <p>
                {q.kind === 0
                  ? "Tap to listen, then choose a symbol."
                  : q.kind === 1
                    ? "Listen to each recording, then choose your match."
                    : "Think about your mouth and how the air moves."}
              </p>
              {q.kind === 0 ? (
                <button
                  className="big-play"
                  onClick={() => play(q.sound)}
                  aria-label="Play question sound"
                >
                  <Volume2 size={38} />
                  <span>
                    {playing === q.sound.id
                      ? "Playing…"
                      : "Listen to the sound"}
                  </span>
                </button>
              ) : (
                <div className="question-symbol">
                  <span>{q.sound.symbol}</span>
                  <button
                    className="icon-btn"
                    aria-label="Hear this symbol"
                    onClick={() => play(q.sound)}
                  >
                    <Volume2 />
                  </button>
                </div>
              )}
              <div className={`answers ${q.kind === 2 ? "features" : ""}`}>
                {q.choices.map((s, i) => (
                  <div
                    key={s.id}
                    className={`answer-wrap ${answer ? (s.id === q.sound.id ? "correct" : s.id === answer ? "incorrect" : "dim") : ""}`}
                  >
                    {q.kind === 1 && (
                      <button
                        className="option-audio"
                        aria-label={`Play option ${i + 1}`}
                        onClick={() => play(s)}
                      >
                        <Volume2 size={22} />
                      </button>
                    )}
                    <button
                      className="answer"
                      disabled={!!answer}
                      onClick={() => choose(s)}
                    >
                      <span className="answer-number">{i + 1}</span>
                      <span className={q.kind === 0 ? "ipa" : ""}>
                        {q.kind === 0
                          ? s.symbol
                          : q.kind === 1
                            ? `Sound ${i + 1}`
                            : lesson.level === 5
                              ? s.name
                              : s.feature}
                      </span>
                      {answer && s.id === q.sound.id && <Check size={20} />}
                    </button>
                  </div>
                ))}
              </div>
              {audioError && (
                <p className="error" role="alert">
                  {audioError}
                </p>
              )}
              {answer && (
                <div
                  className={`feedback ${answer === q.sound.id ? "yes" : ""}`}
                  role="status"
                >
                  <div>
                    <strong>
                      {answer === q.sound.id
                        ? "That’s the sound! +10 XP"
                        : "A little discovery!"}
                    </strong>
                    <p>
                      {answer === q.sound.id
                        ? "Nice listening."
                        : `The answer is /${q.sound.symbol}/. ${q.sound.feature}.`}
                    </p>
                    <button className="text-btn" onClick={() => play(q.sound)}>
                      <Volume2 size={16} /> Hear /{q.sound.symbol}/ again
                    </button>
                  </div>
                  <button className="primary" onClick={advance}>
                    {index === 5
                      ? gameKind !== undefined
                        ? "Finish game"
                        : "Finish lesson"
                      : "Continue"}
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
              <p className="gentle-note">
                Some recordings add “ah” around the consonant. Listen for the
                consonant itself.
                <br />
                No rush. Every guess is a chance to learn.
              </p>
            </div>
          )}
        </div>
      )}
      {account && (
        <div className="overlay">
          <form
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Save your progress"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!supabase) return;
              setSending(true);
              setAuthMessage("");
              try {
                const { error } = await supabase.auth.signInWithOtp({
                  email: email.trim(),
                  options: { emailRedirectTo: window.location.origin },
                });
                setAuthMessage(
                  error
                    ? error.code === "email_address_not_authorized"
                      ? "Email sign-in is currently limited to preview testers. You can keep learning as a guest."
                      : error.message
                    : "Check your email for a sign-in link. You can keep playing here.",
                );
              } catch {
                setAuthMessage("Could not send the link. Please try again.");
              } finally {
                setSending(false);
              }
            }}
          >
            <button
              type="button"
              className="close icon-btn"
              aria-label="Close account"
              onClick={() => setAccount(false)}
            >
              <X />
            </button>
            <span className="eyebrow">KEEP YOUR ADVENTURE</span>
            <h2>A home for your progress.</h2>
            <p>
              Parents, teachers, and adult learners can save progress with an
              email sign-in link. Kids can keep playing as guests without
              sharing personal information.
            </p>
            {supabase ? (
              <>
                <label className="email-label">
                  Adult’s email address
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </label>
                <p className="fine-print">
                  This browser’s guest progress will move to the account when
                  you sign in.
                </p>
                <button className="primary" disabled={sending}>
                  {sending ? "Sending…" : "Email a sign-in link"}
                  <ArrowRight size={18} />
                </button>
              </>
            ) : (
              <div className="notice">
                Account saving isn’t available in this preview yet. Your guest
                progress still saves in this browser.
              </div>
            )}
            {authMessage && <p role="status">{authMessage}</p>}
            <button
              className="text-btn"
              type="button"
              onClick={() => setAccount(false)}
            >
              Keep playing as a guest
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
