// English spellings are memory aids; the recording is the pronunciation target.
export type PronunciationHint = {
  cue: string;
  word?: string;
  letters?: string;
  tip: string;
};
const hint = (
  cue: string,
  word: string,
  letters: string,
  tip = "Say just the highlighted sound, not the whole word.",
): PronunciationHint => ({ cue, word, letters, tip });
const unfamiliar = (tip: string): PronunciationHint => ({
  cue: "No exact English match",
  tip,
});
export const pronunciationHints: Record<string, PronunciationHint> = {
  p: hint("“p” as in", "pig", "p", "A short puff of air—not “pee” or “puh.”"),
  b: hint("“b” as in", "bat", "b", "A short voiced sound—not “bee” or “buh.”"),
  m: hint("“mmm” as in", "moon", "m", "Close your lips and hum “mmm.”"),
  f: hint("“fff” as in", "fish", "f", "Keep the air flowing: “fff.”"),
  v: hint("“vvv” as in", "van", "v", "Like “fff,” but with a throat buzz."),
  w: hint(
    "“w” as in",
    "water",
    "w",
    "Start with rounded lips. Say the sound, not “double-you.”",
  ),
  t: hint(
    "“t” as in",
    "top",
    "t",
    "A quick release of air—not “tee” or “tuh.”",
  ),
  d: hint(
    "“d” as in",
    "dog",
    "d",
    "A quick voiced release—not “dee” or “duh.”",
  ),
  n: hint(
    "“nnn” as in",
    "nose",
    "n",
    "Hold “nnn” with your tongue behind your upper teeth.",
  ),
  s: hint("“sss” as in", "sun", "s", "A steady hiss, like a snake."),
  z: hint("“zzz” as in", "zoo", "z", "Like “sss,” but with a throat buzz."),
  l: hint("“l” as in", "leaf", "l"),
  k: hint(
    "“k” as in",
    "kite",
    "k",
    "A quick release at the back of your mouth—not “kay.”",
  ),
  ɡ: hint(
    "Hard “g” as in",
    "go",
    "g",
    "The sound in “go,” not the sound in “gem.”",
  ),
  h: hint(
    "“h” as in",
    "hat",
    "h",
    "Breathe out softly—not the letter name “aitch.”",
  ),
  θ: hint(
    "Quiet “th” as in",
    "think",
    "th",
    "Air flows past your tongue, without a throat buzz.",
  ),
  ð: hint(
    "Buzzy “th” as in",
    "this",
    "th",
    "Like the “th” in “think,” but with a throat buzz.",
  ),
  ʃ: hint("“sh” as in", "ship", "sh", "Hold “shhh,” like asking for quiet."),
  ʒ: hint(
    "“zh” as in",
    "vision",
    "s",
    "The middle sound in “vision.” Like “sh,” with a buzz.",
  ),
  ŋ: hint(
    "“ng” as in",
    "sing",
    "ng",
    "Hold the final hum. Don’t add a separate “g.”",
  ),
  ɹ: hint(
    "“r” as in",
    "red",
    "r",
    "An English “r,” without rolling your tongue.",
  ),
  j: hint(
    "“y” as in",
    "yes",
    "y",
    "This IPA symbol means the “y” sound—not the “j” in “jam.”",
  ),
  i: hint(
    "“ee” as in",
    "fleece",
    "ee",
    "Hold “ee.” English vowel examples vary by accent.",
  ),
  ɪ: hint(
    "Short “i” as in",
    "kit",
    "i",
    "A relaxed short “i,” not “eye.” Vowels vary by accent.",
  ),
  e: unfamiliar(
    "Start near the vowel in “say,” then keep it steady—don’t glide toward “ee.”",
  ),
  ɛ: hint(
    "“eh” as in",
    "dress",
    "e",
    "A short “eh.” English vowel examples vary by accent.",
  ),
  æ: hint(
    "Short “a” as in",
    "trap",
    "a",
    "The vowel in “cat,” not the letter name “ay.” Vowels vary by accent.",
  ),
  ɑ: hint(
    "“ah” as in",
    "father",
    "a",
    "Open your mouth for “ah.” English vowel examples vary by accent.",
  ),
  ɔ: hint(
    "“aw” as in",
    "thought",
    "ough",
    "Accents differ: your “thought” vowel may differ from this recording.",
  ),
  o: unfamiliar(
    "Start near the vowel in “go,” then keep it steady—don’t glide toward “oo.”",
  ),
  ʊ: hint(
    "Short “oo” as in",
    "foot",
    "oo",
    "The vowel in “book,” not the longer “oo” in “food.” Accents vary.",
  ),
  u: hint(
    "“oo” as in",
    "goose",
    "oo",
    "Hold “oo” with rounded lips. English vowels vary by accent.",
  ),
  ʌ: hint(
    "“uh” as in",
    "strut",
    "u",
    "The stressed vowel in “cup.” English vowels vary by accent.",
  ),
  ə: hint(
    "Soft “uh” as in",
    "about",
    "a",
    "A short, relaxed, unstressed “uh.”",
  ),
  y: unfamiliar(
    "Say “ee,” then round your lips while keeping your tongue in place.",
  ),
  ø: unfamiliar(
    "Start with a steady /e/ sound, then round your lips without moving your tongue.",
  ),
  x: unfamiliar(
    "Start near “k,” but leave a gap at the back of your mouth for a steady hiss.",
  ),
  ʁ: unfamiliar(
    "Make a buzzy friction sound at the very back of your mouth. Copy the recording.",
  ),
  ɲ: unfamiliar(
    "A single nasal sound with the middle of your tongue against the hard roof—not separate “n” and “y” sounds.",
  ),
  ʎ: unfamiliar(
    "Like an “l” made with the middle of your tongue against the hard roof. Let air pass around the sides.",
  ),
  ɸ: unfamiliar(
    "Like “f,” but bring both lips close together instead of using your teeth.",
  ),
  β: unfamiliar(
    "Like “v,” but use a small gap between both lips instead of your teeth.",
  ),
  ç: unfamiliar(
    "Lift your tongue as for the “y” in “yes,” then blow gently without a throat buzz.",
  ),
};
export function EnglishHint({
  symbol,
  compact = false,
}: {
  symbol: string;
  compact?: boolean;
}) {
  const h = pronunciationHints[symbol];
  if (!h) return null;
  const at = h.word && h.letters ? h.word.indexOf(h.letters) : -1;
  return (
    <div className={compact ? "english-hint compact" : "english-hint"}>
      <p className="english-cue">
        {h.cue}
        {h.word && (
          <>
            {" "}
            <span className="example-word">
              {h.word.slice(0, at)}
              <strong>{h.letters}</strong>
              {h.word.slice(at + (h.letters?.length || 0))}
            </span>
          </>
        )}
      </p>
      {!compact && <p className="english-tip">{h.tip}</p>}
    </div>
  );
}
