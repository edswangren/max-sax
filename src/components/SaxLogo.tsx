interface Props {
  size?: number
  className?: string
}

// Small stylized saxophone — sits next to the MaxSAX wordmark.
export default function SaxLogo({ size = 32, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={className}
    >
      {/* mouthpiece */}
      <rect x="46" y="4" width="6" height="10" rx="1.5" fill="#1f150a" stroke="#110b04" strokeWidth="1.5" />
      {/* neck */}
      <path d="M49 14 Q49 24 38 28" stroke="#a51e26" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* body */}
      <rect x="22" y="26" width="14" height="22" rx="2.5" fill="#d12932" stroke="#a51e26" strokeWidth="1.5" />
      {/* keys (pearls) */}
      <circle cx="29" cy="32" r="1.6" fill="#0e0a04" />
      <circle cx="29" cy="38" r="1.6" fill="#0e0a04" />
      <circle cx="29" cy="44" r="1.6" fill="#0e0a04" />
      {/* bell */}
      <path d="M14 48 L36 48 L42 62 L8 62 Z" fill="#d12932" stroke="#a51e26" strokeWidth="1.5" strokeLinejoin="round" />
      {/* bell rim shine */}
      <path d="M10 60 L40 60" stroke="#f5b50f" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}
