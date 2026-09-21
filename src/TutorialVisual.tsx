import type { Sound } from "./data";
export type VisualKind =
  "voice" | "lips" | "place" | "air" | "opening" | "tongue";
export function visualKind(feature: string): VisualKind {
  const f = feature.toLowerCase();
  if (f.startsWith("voice")) return "voice";
  if (f.startsWith("mouth")) return "opening";
  if (
    f.startsWith("tongue forward") ||
    f.startsWith("tongue toward") ||
    f === "tongue back" ||
    f === "tongue in middle"
  )
    return "tongue";
  if (["both lips", "teeth on lip", "round lips", "relaxed lips"].includes(f))
    return "lips";
  if (
    [
      "pop",
      "hiss",
      "nose hum",
      "air around sides",
      "gentle flow",
      "gentle breath",
    ].includes(f)
  )
    return "air";
  return "place";
}
const green = "#285448",
  skin = "#EFC7A5",
  pink = "#DE8F91",
  teal = "#46AD9E";
export function TutorialVisual({
  feature,
  sound,
}: {
  feature: string;
  sound?: Sound;
}) {
  const kind = visualKind(feature),
    f = feature.toLowerCase();
  const voiced = f === "voice on";
  const round = f === "round lips";
  const fricative = sound?.name.toLowerCase().includes("fricative");
  const opening = f.includes("almost")
    ? 7
    : f.includes("slightly")
      ? 13
      : f.includes("little")
        ? 20
        : f.includes("half")
          ? 27
          : f.includes("fairly")
            ? 34
            : f.includes("nearly")
              ? 41
              : 48;
  const front = f.includes("forward") || f.includes("front"),
    back = f.includes("back");
  const placeX = f.includes("very back")
    ? 164
    : f.includes("back of")
      ? 148
      : f.includes("hard roof")
        ? 126
        : f.includes("just behind")
          ? 106
          : f.includes("ridge") || f.includes("behind teeth")
            ? 88
            : 68;
  const gap = sound?.name.toLowerCase().includes("approximant") || fricative;
  return (
    <svg
      className={`tutorial-visual tutorial-${kind}`}
      viewBox="0 0 240 180"
      role="img"
      aria-label={
        kind === "voice"
          ? `Fingertips resting on the throat: ${voiced ? "vibration when the voice is on" : "no vibration when the voice is off"}`
          : kind === "place"
            ? `Simplified side view highlighting ${feature.toLowerCase()}`
            : kind === "air"
              ? `Airflow cue: ${feature}`
              : kind === "tongue"
                ? `Tongue position: ${feature}`
                : `Mouth shape: ${feature}`
      }
    >
      <rect
        width="240"
        height="180"
        rx="24"
        fill={
          kind === "voice" ? "#EDF2DE" : kind === "air" ? "#E4EFF6" : "#F6EBDD"
        }
      />
      {kind === "voice" ? (
        <>
          <path
            d="M55 180Q54 144 99 140V111H141V140Q186 144 187 180"
            fill="#79BCAD"
          />
          <path d="M101 104H139V143Q120 157 101 143Z" fill={skin} />
          <ellipse cx="120" cy="66" rx="44" ry="53" fill={skin} />
          <path
            d="M77 59Q71 4 121 9Q169 10 164 61L145 37Q113 57 89 38Z"
            fill={green}
          />
          <circle cx="104" cy="68" r="3.5" fill={green} />
          <circle cx="136" cy="68" r="3.5" fill={green} />
          {voiced ? (
            <path
              d="M106 92Q120 97 134 92"
              stroke={green}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          ) : (
            <ellipse cx="120" cy="94" rx="12" ry="5" fill={green} />
          )}
          <path
            d="M168 180L158 153L146 143L132 130Q126 124 122 129Q120 132 125 138L134 148L115 136Q109 132 107 138Q106 141 112 145L127 155L114 150Q108 148 107 153Q107 157 116 161L137 173L145 180Z"
            fill={skin}
            stroke="#BD916E"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="119" cy="128" r="7" fill={teal} opacity=".35" />
          {voiced ? (
            <g
              className="voice-waves"
              stroke={teal}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            >
              <path d="M88 118Q78 128 88 138M78 111Q62 128 78 145M151 113Q159 121 156 129" />
            </g>
          ) : (
            <path
              d="M67 129H87"
              stroke={green}
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
        </>
      ) : kind === "lips" || kind === "opening" ? (
        <>
          <path
            d="M94 26Q100 45 90 53M146 26Q140 45 150 53"
            stroke="#CBAC90"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse
            cx="120"
            cy="106"
            rx={round ? 32 : 64}
            ry={
              kind === "opening"
                ? opening + 10
                : round
                  ? 43
                  : f === "teeth on lip"
                    ? 25
                    : 22
            }
            fill={pink}
          />
          <ellipse
            cx="120"
            cy="106"
            rx={round ? 20 : 52}
            ry={
              kind === "opening"
                ? opening
                : round
                  ? 29
                  : f === "both lips"
                    ? fricative
                      ? 4
                      : 1.5
                    : 9
            }
            fill={green}
          />
          {f === "teeth on lip" && (
            <>
              <path d="M75 90H165L157 111H83Z" fill="#FFFDF2" />
              <path d="M120 91V108" stroke="#DCDDD1" strokeWidth="2" />
              <path
                d="M81 116Q120 132 159 116"
                stroke={pink}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}
          {f === "both lips" && (
            <path
              d="M54 140L71 124M186 140L169 124"
              stroke={teal}
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}
        </>
      ) : kind === "tongue" ? (
        <>
          <text x="30" y="28" fill={green} fontSize="12">
            Front
          </text>
          <text x="177" y="28" fill={green} fontSize="12">
            Back
          </text>
          <path
            d="M42 48H194V146H98Z"
            fill="#FFFCF5"
            stroke="#C9CABB"
            strokeWidth="2"
          />
          <path
            d="M57 78H194M74 111H194"
            stroke="#DFDFD1"
            strokeDasharray="4 5"
          />
          <text x="11" y="54" fill={green} fontSize="10">
            High
          </text>
          <text x="53" y="151" fill={green} fontSize="10">
            Low
          </text>
          {(() => {
            const feature0 = sound?.feature.split(" · ")[0] || "";
            const y = feature0.includes("almost")
              ? 49
              : feature0.includes("slightly")
                ? 63
                : feature0.includes("little")
                  ? 79
                  : feature0.includes("fairly")
                    ? 111
                    : feature0.includes("nearly")
                      ? 130
                      : feature0.includes("wide")
                        ? 145
                        : 95;
            const x = front
              ? 43 + (y - 48) * 0.56 + (f.includes("toward") ? 18 : 0)
              : back
                ? f.includes("toward")
                  ? 165
                  : 185
                : 137;
            return (
              <>
                <circle cx={x} cy={y} r="15" fill={teal} />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="17"
                >
                  {sound?.symbol || "•"}
                </text>
              </>
            );
          })()}
        </>
      ) : kind === "place" ? (
        <>
          <text x="20" y="25" fill={green} fontSize="11">
            Front
          </text>
          <text x="173" y="25" fill={green} fontSize="11">
            Back
          </text>
          <path
            d="M46 87Q58 48 105 48H144Q186 51 189 94V155H165V118Q129 143 88 126L48 109"
            fill="#FFFCF5"
            stroke="#C6A88D"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M56 72L68 74L65 89L56 87"
            fill="white"
            stroke="#C6A88D"
            strokeWidth="2"
          />
          <path
            d={`M73 116Q105 118 ${placeX} ${f === "throat" ? 112 : gap ? 77 : 62}Q176 79 167 129Q118 146 73 116Z`}
            fill={pink}
          />
          <circle
            cx={f === "throat" ? 181 : placeX}
            cy={f === "throat" ? 142 : 58}
            r="9"
            fill={teal}
          />
          <path
            d={f === "throat" ? "M181 164V153" : `M${placeX} 34V44`}
            stroke={green}
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          <path
            d="M57 38Q77 38 82 61L95 78L82 84L88 100L78 107Q78 133 56 136V156H30V113Q14 78 29 49Q38 36 57 38"
            fill={skin}
          />
          <circle cx="65" cy="60" r="3" fill={green} />
          <path
            d="M77 98H86"
            stroke={green}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {f === "nose hum" ? (
            <g stroke={teal} strokeWidth="5" fill="none" strokeLinecap="round">
              <path d="M59 119V87Q57 75 77 78H176" />
              <path d="M164 68L178 78L164 88" />
            </g>
          ) : f === "air around sides" ? (
            <g stroke={teal} strokeWidth="4" fill="none" strokeLinecap="round">
              <ellipse
                cx="151"
                cy="98"
                rx="18"
                ry="33"
                fill={pink}
                stroke="none"
              />
              <path d="M108 107Q116 53 159 54H196M108 108Q123 147 161 142H196M188 46L198 54L188 62M188 134L198 142L188 150" />
            </g>
          ) : (
            <g stroke={teal} strokeWidth="5" fill="none" strokeLinecap="round">
              {f === "pop" ? (
                <>
                  <path d="M109 97H145M163 76L173 65M171 97H194M163 118L173 131" />
                  <path d="M133 87L146 97L133 107" />
                </>
              ) : f === "hiss" ? (
                <path d="M107 98Q117 80 127 98T147 98T167 98T187 98" />
              ) : (
                <>
                  <path d="M107 98H193M178 86L194 98L178 110" />
                </>
              )}
            </g>
          )}
        </>
      )}
    </svg>
  );
}
