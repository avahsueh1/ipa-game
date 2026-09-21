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
          {f === "teeth on lip" ? (
            <>
              {/* Upper lip lifts to expose the teeth; lower lip meets their edge. */}
              <path
                d="M49 96Q73 78 94 79Q109 80 120 85Q131 80 146 79Q167 78 191 96Q164 118 120 119Q76 118 49 96Z"
                fill="#A75F69"
              />
              <path
                d="M65 91Q120 81 175 91L165 108Q120 116 75 108Z"
                fill="#FFFDF5"
              />
              <path
                d="M96 88V108M120 87V110M144 88V108"
                stroke="#DED5C9"
                strokeWidth="1.5"
              />
              <path
                d="M49 96Q77 94 91 101Q120 111 149 101Q163 94 191 96Q173 132 120 133Q67 132 49 96Z"
                fill={pink}
              />
              <path
                d="M83 105Q120 116 157 105"
                stroke="#B46C76"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M49 96Q81 62 104 76L120 82L136 76Q159 62 191 96Q164 85 143 88Q120 94 97 88Q76 85 49 96Z"
                fill={pink}
              />
            </>
          ) : (
            <>
              {round || kind === "opening" ? (
                <ellipse
                  cx="120"
                  cy="100"
                  rx={round ? 32 : 60}
                  ry={kind === "opening" ? opening + 10 : 43}
                  fill={pink}
                />
              ) : (
                <path
                  d="M49 100Q79 72 103 81Q113 85 120 85Q127 85 137 81Q161 72 191 100Q165 128 120 127Q75 128 49 100Z"
                  fill={pink}
                />
              )}
              <ellipse
                cx="120"
                cy="100"
                rx={round ? 20 : 51}
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
              <path
                d={
                  round ? "M106 133Q120 140 134 133" : "M97 116Q120 121 143 116"
                }
                stroke="#EDB0AE"
                strokeWidth="3"
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
          {/* A side profile with a curved nose, distinct lips, jaw, ear and neck. */}
          <path
            d="M23 180V165Q25 151 44 146L48 127H70V147Q97 152 101 180Z"
            fill="#79BCAD"
          />
          <path d="M43 150L48 118L67 113L68 146Q58 157 43 150Z" fill={skin} />
          <path
            d="M28 79Q21 43 47 34Q72 26 82 47Q86 56 83 66L86 77Q89 82 96 85Q99 89 94 91L85 92L86 97Q92 98 89 101L85 104Q91 111 84 117Q77 125 65 126Q47 124 39 108Z"
            fill={skin}
          />
          <path
            d="M28 87Q13 64 26 43Q38 25 61 29Q80 30 85 48Q65 56 47 47Q43 68 34 77L35 91Z"
            fill={green}
          />
          <ellipse cx="39" cy="88" rx="9" ry="13" fill={skin} />
          <path
            d="M38 83Q45 80 44 89L40 94"
            fill="none"
            stroke="#C89978"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M72 69L78 70"
            stroke={green}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M83 101H90"
            stroke={green}
            strokeWidth="2"
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
