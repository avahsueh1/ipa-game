export function Frog({
  className = "",
  variant = 0,
  crowned = false,
}: {
  className?: string;
  variant?: number;
  crowned?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 280"
      fill="none"
      role="img"
      aria-label={`Riff, Ribbit’s smiling turquoise frog${crowned ? ", wearing today’s streak crown" : ""}`}
    >
      <ellipse
        cx="160"
        cy="258"
        rx="112"
        ry="10"
        fill="#244E43"
        opacity=".08"
      />
      <ellipse
        cx="83"
        cy="218"
        rx="40"
        ry="30"
        transform="rotate(-24 83 218)"
        fill="#42AA99"
      />
      <ellipse
        cx="237"
        cy="218"
        rx="40"
        ry="30"
        transform="rotate(24 237 218)"
        fill="#42AA99"
      />
      <ellipse cx="160" cy="203" rx="65" ry="53" fill="#55C6B5" />
      <ellipse cx="160" cy="207" rx="40" ry="35" fill="#C9EAA9" />
      <path
        d="M112 191Q104 218 105 246M208 191Q216 218 215 246"
        stroke="#42AA99"
        strokeWidth="17"
        strokeLinecap="round"
      />
      <path
        d="M102 244L86 250M103 244L101 255M106 244L119 251M218 244L234 250M217 244L219 255M214 244L201 251"
        stroke="#42AA99"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <g transform="translate(16 9) scale(3)">
        <path
          d="M21 44C13 19 36 10 48 26C60 10 83 19 75 44C89 80 7 80 21 44Z"
          fill="#55C6B5"
        />
        <circle cx="32" cy="34" r="10" fill="#FFFCED" />
        <circle cx="64" cy="34" r="10" fill="#FFFCED" />
        <circle cx="34" cy="35" r="4.5" fill="#244E43" />
        <circle cx="62" cy="35" r="4.5" fill="#244E43" />
        <path
          d={variant === 1 ? "M38 55Q48 67 58 55" : "M38 55Q48 63 58 55"}
          stroke="#244E43"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="25" cy="54" r="4" fill="#F3B699" />
        <circle cx="71" cy="54" r="4" fill="#F3B699" />
      </g>
      {crowned && (
        <g aria-hidden="true">
          <path
            d="M132 56L125 27L147 38L160 14L173 38L195 27L188 56Z"
            fill="#EBC35D"
          />
          <rect x="132" y="53" width="56" height="9" rx="4.5" fill="#D9A940" />
          <circle cx="160" cy="44" r="4" fill="#FFFCED" />
        </g>
      )}
    </svg>
  );
}
