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
      aria-label="Pip, Ribbit’s smiling turquoise frog"
    >
      <g transform="translate(-32 -42) scale(4)">
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
    </svg>
  );
}
