import type { CategoryId } from '../data/catalog'

interface Props {
  catId: CategoryId
  className?: string
}

// 24×24 simple SVG glyphs per category. Stroke uses currentColor so the
// icon's hue is set by the parent's text color.
export default function CategoryIcon({ catId, className = '' }: Props) {
  const common = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  }
  switch (catId) {
    case 'note-reading':
      // beamed eighth notes
      return (
        <svg {...common}>
          <path d="M7 17V6l10-2v11" />
          <ellipse cx="6" cy="17" rx="2.5" ry="1.8" fill="currentColor" />
          <ellipse cx="16" cy="15" rx="2.5" ry="1.8" fill="currentColor" />
        </svg>
      )
    case 'scales-keys':
      // big sharp symbol
      return (
        <svg {...common}>
          <path d="M9 4v16M15 4v16" />
          <path d="M5 9l14-2M5 16l14-2" strokeWidth="2.2" />
        </svg>
      )
    case 'rhythm':
      // metronome
      return (
        <svg {...common}>
          <path d="M7 4h10l-2 16H9z" />
          <path d="M12 18l3-10" />
          <circle cx="15" cy="8" r="1.2" fill="currentColor" />
        </svg>
      )
    case 'fingerings':
      // three-finger hand
      return (
        <svg {...common}>
          <path d="M7 14V6M11 14V4M15 14V6" />
          <path d="M5 14c0 4 2 6 7 6s7-2 7-6v-3a2 2 0 00-4 0" />
        </svg>
      )
    case 'theory-vocab':
      // open book
      return (
        <svg {...common}>
          <path d="M3 5l9 2 9-2v13l-9 2-9-2z" />
          <path d="M12 7v13" />
        </svg>
      )
    case 'ear-training':
      // headphones
      return (
        <svg {...common}>
          <path d="M4 14a8 8 0 1116 0" />
          <rect x="3" y="14" width="4" height="6" rx="1.5" fill="currentColor" />
          <rect x="17" y="14" width="4" height="6" rx="1.5" fill="currentColor" />
        </svg>
      )
  }
}
