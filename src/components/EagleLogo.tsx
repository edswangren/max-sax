interface Props {
  size?: number
  className?: string
  variant?: 'gold' | 'royal' | 'current'
}

// Canyon Ridge Eagles Band patch — royal-blue shield with a gold lyre
// (universal symbol of band programs) plus a small star above for honor-band cred.
// Reads as a school/marching-band uniform patch.
export default function EagleLogo({ size = 56, className = '', variant = 'gold' }: Props) {
  // `variant` controls the dominant color flip:
  //   gold  = gold shield, royal lyre (good on dark backgrounds)
  //   royal = royal shield, gold lyre (good on gold/brass backgrounds — default for the hero banner)
  const shieldFill = variant === 'royal' ? '#1d4ed8' : variant === 'current' ? 'currentColor' : '#f5b50f'
  const shieldStroke = variant === 'royal' ? '#1e3a8a' : variant === 'current' ? 'currentColor' : '#a06d05'
  const ornament = variant === 'royal' ? '#f5b50f' : variant === 'current' ? 'currentColor' : '#1d4ed8'
  const ornamentDark = variant === 'royal' ? '#c9930a' : '#1e3a8a'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      aria-label="Canyon Ridge Eagles Band"
      className={className}
    >
      {/* Shield */}
      <path
        d="M30 3 L54 10 L54 30 Q54 48 30 57 Q6 48 6 30 L6 10 Z"
        fill={shieldFill}
        stroke={shieldStroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Inner border for the patch look */}
      <path
        d="M30 7 L50 13 L50 30 Q50 45 30 53 Q10 45 10 30 L10 13 Z"
        fill="none"
        stroke={ornament}
        strokeWidth="0.8"
        opacity="0.6"
      />

      {/* Lyre — symmetric two arms + crossbar + strings */}
      <g stroke={ornament} fill={ornament}>
        {/* Strings */}
        <line x1="24" y1="22" x2="24" y2="42" strokeWidth="1" />
        <line x1="27" y1="22" x2="27" y2="42" strokeWidth="1" />
        <line x1="30" y1="22" x2="30" y2="42" strokeWidth="1" />
        <line x1="33" y1="22" x2="33" y2="42" strokeWidth="1" />
        <line x1="36" y1="22" x2="36" y2="42" strokeWidth="1" />

        {/* Left arm (S-curve from base up to crossbar) */}
        <path
          d="M22 42 Q16 32 20 22 Q18 18 22 17 L26 21"
          stroke={ornament}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right arm */}
        <path
          d="M38 42 Q44 32 40 22 Q42 18 38 17 L34 21"
          stroke={ornament}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Crossbar between the two arms */}
        <rect x="22" y="20" width="16" height="2.5" rx="1.2" fill={ornament} stroke="none" />

        {/* Base where strings attach */}
        <rect x="22" y="41" width="16" height="3" rx="1.5" fill={ornament} stroke="none" />

        {/* Small 5-point star above the lyre — honor-band flourish */}
        <path
          d="M30 7.5
             L31.4 11
             L35 11
             L32.1 13.2
             L33.3 16.7
             L30 14.6
             L26.7 16.7
             L27.9 13.2
             L25 11
             L28.6 11 Z"
          fill={ornament}
          stroke={ornamentDark}
          strokeWidth="0.4"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}
