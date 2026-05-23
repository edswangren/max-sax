import type { KeyState } from '../data/fingerings'

interface Props {
  state: KeyState
  width?: number
  height?: number
}

// Stylized front-view of an alto/tenor sax key layout.
// Pressed keys are filled brass; unpressed are outlined.
export default function SaxFingering({ state, width = 200, height = 340 }: Props) {
  const on = '#d4a017'
  const off = 'transparent'
  const stroke = '#a87f12'
  const dim = '#3a3329'

  const k = (pressed: boolean | undefined) => (pressed ? on : off)

  // Pearl positions for main 6 stack (centered column)
  const cx = width / 2
  const pearlR = 13

  // Y coordinates for left-hand stack
  const lhY = [70, 100, 130]
  // Y coordinates for right-hand stack
  const rhY = [180, 210, 240]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-label="Sax fingering">
      {/* Sax body silhouette */}
      <rect x={cx - 22} y={40} width={44} height={230} rx={6} fill="#1c1812" stroke={dim} />
      {/* Bell hint */}
      <path
        d={`M ${cx - 32} 268 L ${cx + 32} 268 L ${cx + 40} ${height - 4} L ${cx - 40} ${height - 4} Z`}
        fill="#1c1812"
        stroke={dim}
      />

      {/* Octave key (top-left, thumb) */}
      <g>
        <circle cx={cx - 50} cy={50} r={9} fill={k(state.octave)} stroke={stroke} />
        <text x={cx - 50} y={28} fontSize={10} textAnchor="middle" fill="#d9cfb8">OCT</text>
      </g>

      {/* Palm keys (left side cluster, top) */}
      <g>
        <rect x={cx - 60} y={75}  width={22} height={7} rx={2} fill={k(state.palmF)}  stroke={stroke} />
        <rect x={cx - 60} y={87}  width={22} height={7} rx={2} fill={k(state.palmEb)} stroke={stroke} />
        <rect x={cx - 60} y={99}  width={22} height={7} rx={2} fill={k(state.palmD)}  stroke={stroke} />
        <text x={cx - 49} y={71}  fontSize={8} textAnchor="middle" fill="#d9cfb8">palm</text>
      </g>

      {/* Side keys (right side cluster) */}
      <g>
        <rect x={cx + 38} y={150} width={22} height={7} rx={2} fill={k(state.sideHighE)} stroke={stroke} />
        <rect x={cx + 38} y={162} width={22} height={7} rx={2} fill={k(state.sideC)}     stroke={stroke} />
        <rect x={cx + 38} y={174} width={22} height={7} rx={2} fill={k(state.sideBb)}    stroke={stroke} />
        <rect x={cx + 38} y={186} width={22} height={7} rx={2} fill={k(state.highFSharp)} stroke={stroke} />
        <text x={cx + 49} y={146} fontSize={8} textAnchor="middle" fill="#d9cfb8">side</text>
      </g>

      {/* Left-hand main pearls (B, A, G) */}
      {lhY.map((y, i) => {
        const pressed = i === 0 ? state.leftIndex : i === 1 ? state.leftMiddle : state.leftRing
        return (
          <circle key={`l${i}`} cx={cx} cy={y} r={pearlR} fill={k(pressed)} stroke={stroke} strokeWidth={1.5} />
        )
      })}

      {/* Bis Bb (small key between leftIndex and leftMiddle) */}
      <circle cx={cx - 14} cy={(lhY[0] + lhY[1]) / 2 + 2} r={5} fill={k(state.bis)} stroke={stroke} />

      {/* Right-hand main pearls (F, E, D) */}
      {rhY.map((y, i) => {
        const pressed = i === 0 ? state.rightIndex : i === 1 ? state.rightMiddle : state.rightRing
        return (
          <circle key={`r${i}`} cx={cx} cy={y} r={pearlR} fill={k(pressed)} stroke={stroke} strokeWidth={1.5} />
        )
      })}

      {/* Left pinky cluster (lower-left of left stack) */}
      <g>
        <rect x={cx - 50} y={148} width={14} height={6} rx={2} fill={k(state.leftPinkyGSharp)} stroke={stroke} />
        <rect x={cx - 50} y={158} width={14} height={6} rx={2} fill={k(state.leftPinkyCSharp)} stroke={stroke} />
        <rect x={cx - 50} y={168} width={14} height={6} rx={2} fill={k(state.leftPinkyLowB)}   stroke={stroke} />
        <rect x={cx - 50} y={178} width={14} height={6} rx={2} fill={k(state.leftPinkyLowBb)}  stroke={stroke} />
        <text x={cx - 43} y={144} fontSize={8} textAnchor="middle" fill="#d9cfb8">L pinky</text>
      </g>

      {/* Right pinky cluster (lower-right of right stack) */}
      <g>
        <rect x={cx + 36} y={252} width={14} height={6} rx={2} fill={k(state.rightPinkyEb)}   stroke={stroke} />
        <rect x={cx + 36} y={262} width={14} height={6} rx={2} fill={k(state.rightPinkyLowC)} stroke={stroke} />
        <text x={cx + 43} y={248} fontSize={8} textAnchor="middle" fill="#d9cfb8">R pinky</text>
      </g>
    </svg>
  )
}
