// One whole, unbroken, tilted ellipse drawn as vector art, so it can never be
// cropped by an image edge and always shares its exact centre with the heart
// and the GWM wordmark. It is sized to enclose the whole heart, with electric
// current running around it and two sparks riding the band. Units are percent
// of the heart plate width (the viewBox is 200 wide, centred on the plate).
const RX = 84;
const RY = 54;
const TILT = -12;
const LOOP = `M ${-RX} 0 A ${RX} ${RY} 0 0 0 ${RX} 0 A ${RX} ${RY} 0 0 0 ${-RX} 0 Z`;

function Spark({ dur, begin }) {
  return (
    <g>
      <circle r="5" fill="rgba(242,208,179,0.6)" filter="url(#gw-ring-glow)">
        <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={LOOP} />
      </circle>
      <circle r="1.6" fill="#ffffff">
        <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={LOOP} />
      </circle>
    </g>
  );
}

export default function OrbitRing() {
  return (
    <svg
      viewBox="-100 -70 200 140"
      aria-hidden
      focusable="false"
      className="pointer-events-none absolute overflow-visible"
      style={{ left: '-50%', top: '-20%', width: '200%', height: '140%', maxWidth: 'none' }}
    >
      <defs>
        <linearGradient id="gw-ring-grad" gradientUnits="userSpaceOnUse" x1={-RX} y1="0" x2={RX} y2="0">
          <stop offset="0" stopColor="#E6C2BF" />
          <stop offset="0.5" stopColor="#F2D0B3" />
          <stop offset="1" stopColor="#FFF1D6" />
        </linearGradient>
        <filter id="gw-ring-blur" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="gw-ring-glow" x="-400%" y="-400%" width="900%" height="900%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
      </defs>
      <g transform={`rotate(${TILT})`}>
        <path d={LOOP} fill="none" stroke="rgba(242,208,179,0.45)" strokeWidth="5" filter="url(#gw-ring-blur)" />
        <path d={LOOP} fill="none" stroke="url(#gw-ring-grad)" strokeWidth="1.6" opacity="0.92" />
        <path d={LOOP} fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.55" />
        <path
          d={LOOP}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="8 92"
          filter="url(#gw-ring-glow)"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-100" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.35;1;0.7;1" dur="1.1s" repeatCount="indefinite" />
        </path>
        <Spark dur="8s" begin="0s" />
        <Spark dur="8s" begin="-4s" />
      </g>
    </svg>
  );
}