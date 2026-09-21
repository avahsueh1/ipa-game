export function Frog({
  className = "",
  variant = 0,
}: {
  className?: string;
  variant?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 280"
      fill="none"
      role="img"
      aria-label="Pip, a turquoise poison dart frog"
    >
      <ellipse
        cx="163"
        cy="252"
        rx="107"
        ry="13"
        fill="#153F34"
        opacity=".08"
      />
      <path
        d="M87 177C30 175 25 226 55 240L104 232M230 177C280 171 298 222 269 239L220 233"
        fill="#19968F"
        stroke="#153F34"
        strokeWidth="4"
      />
      <path
        d="M91 143C85 191 92 242 159 246C225 246 236 204 225 145"
        fill="#31B8A8"
        stroke="#153F34"
        strokeWidth="4"
      />
      <ellipse cx="160" cy="198" rx="44" ry="40" fill="#B4E4AD" />
      <path
        d="M100 174L76 235L47 242M220 172L245 234L276 241"
        stroke="#153F34"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M49 233L46 243L33 243M60 247L46 243L43 253M272 234L278 244L290 244M265 250L278 244L281 253"
        stroke="#153F34"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M70 123C47 98 53 47 86 40C108 34 129 52 132 71C147 67 173 67 188 71C192 49 210 34 233 40C266 48 271 97 250 123C259 146 236 175 161 176C87 176 62 149 70 123Z"
        fill="#3EC5B8"
        stroke="#153F34"
        strokeWidth="4"
      />
      <ellipse cx="95" cy="79" rx="23" ry="29" fill="#FBF9E9" />
      <ellipse cx="225" cy="79" rx="23" ry="29" fill="#FBF9E9" />
      <ellipse cx="100" cy="84" rx="10" ry="15" fill="#153F34" />
      <ellipse cx="220" cy="84" rx="10" ry="15" fill="#153F34" />
      <circle cx="103" cy="78" r="3.5" fill="white" />
      <circle cx="223" cy="78" r="3.5" fill="white" />
      <path
        d={
          variant === 1
            ? "M130 136Q160 163 191 136"
            : "M135 140Q160 153 185 140"
        }
        stroke="#153F34"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse cx="101" cy="135" rx="13" ry="7" fill="#EFAC7C" />
      <ellipse cx="222" cy="135" rx="13" ry="7" fill="#EFAC7C" />
      {[
        [142, 96, 7],
        [177, 89, 5],
        [163, 111, 4],
        [79, 111, 5],
        [244, 109, 5],
        [113, 190, 7],
        [210, 200, 6],
        [118, 219, 4],
        [79, 207, 6],
        [247, 214, 5],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#165348" />
      ))}
      <path
        d="M132 51C126 23 150 18 160 40C172 11 196 28 183 49"
        fill="#C9D999"
        stroke="#153F34"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
