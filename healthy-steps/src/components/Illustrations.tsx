/**
 * Original illustrations drawn for this site (no stock photography), so
 * nothing here can be mistaken for a photo of a real event or volunteer.
 * Colors follow the brand palette, with a few neutral skin and hair tones.
 */

interface PersonProps {
  x: number;
  /** Ground level (where the feet touch). */
  y: number;
  /** 1 = adult height. */
  scale?: number;
  shirt: string;
  pants: string;
  skin: string;
  hair: string;
  /** Mirrors the figure so it faces left. */
  flip?: boolean;
  /** Raises the front arm in a wave. */
  wave?: boolean;
}

/** A simple walking figure, about 96 units tall at scale 1. */
function Person({ x, y, scale = 1, shirt, pants, skin, hair, flip, wave }: PersonProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {/* legs */}
      <path d="M-3 -44 L-12 -4" stroke={pants} strokeWidth="9" strokeLinecap="round" />
      <path d="M3 -44 L13 -5" stroke={pants} strokeWidth="9" strokeLinecap="round" />
      {/* shoes */}
      <path d="M-16 -2 h10" stroke="#17352F" strokeWidth="5" strokeLinecap="round" />
      <path d="M10 -3 h10" stroke="#17352F" strokeWidth="5" strokeLinecap="round" />
      {/* back arm */}
      <path d="M-6 -70 L-15 -48" stroke={skin} strokeWidth="6" strokeLinecap="round" />
      {/* body */}
      <rect x="-12" y="-78" width="24" height="40" rx="11" fill={shirt} />
      {/* front arm */}
      {wave ? (
        <path d="M8 -70 L20 -88" stroke={skin} strokeWidth="6" strokeLinecap="round" />
      ) : (
        <path d="M7 -70 L16 -50" stroke={skin} strokeWidth="6" strokeLinecap="round" />
      )}
      {/* head */}
      <circle cx="1" cy="-88" r="9" fill={skin} />
      <path d="M-8 -90 a9 9 0 0 1 17 -3 q-8 -3 -17 3z" fill={hair} />
    </g>
  );
}

function RoundTree({ x, y, scale = 1, tone = '#2F7F78' }: { x: number; y: number; scale?: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-4" y="-46" width="8" height="46" rx="3" fill="#7A5A3C" />
      <circle cx="0" cy="-62" r="26" fill={tone} />
      <circle cx="-16" cy="-48" r="16" fill={tone} />
      <circle cx="17" cy="-50" r="15" fill={tone} />
      <circle cx="-8" cy="-70" r="9" fill="#ffffff" opacity="0.12" />
    </g>
  );
}

function Palm({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 0 C-3 -40 3 -80 -2 -118" stroke="#7A5A3C" strokeWidth="7" fill="none" strokeLinecap="round" />
      <g fill="none" stroke="#2F7F78" strokeWidth="7" strokeLinecap="round">
        <path d="M-2 -118 C-22 -132 -40 -124 -50 -108" />
        <path d="M-2 -118 C-18 -144 -38 -146 -52 -138" />
        <path d="M-2 -118 C0 -146 16 -154 32 -150" />
        <path d="M-2 -118 C20 -136 40 -130 50 -114" />
        <path d="M-2 -118 C16 -122 30 -112 36 -96" />
        <path d="M-2 -118 C-14 -118 -26 -106 -30 -92" />
      </g>
    </g>
  );
}

export function HeroIllustration({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 560 460"
      width="560"
      height="460"
      role="img"
      aria-label={label}
      className="h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id="hero-frame">
          <rect x="0" y="0" width="560" height="460" rx="44" />
        </clipPath>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9F2EA" />
          <stop offset="1" stopColor="#F8FAF7" />
        </linearGradient>
      </defs>
      <g clipPath="url(#hero-frame)">
        <rect width="560" height="460" fill="url(#hero-sky)" />

        {/* sun */}
        <circle cx="436" cy="96" r="64" fill="#E4AD43" opacity="0.18" />
        <circle cx="436" cy="96" r="40" fill="#E4AD43" />

        {/* clouds */}
        <g fill="#ffffff">
          <path d="M70 92 a18 18 0 0 1 34 -8 a22 22 0 0 1 42 6 a14 14 0 0 1 4 28 H74 a13 13 0 0 1 -4 -26z" opacity="0.9" />
          <path d="M300 54 a12 12 0 0 1 23 -5 a15 15 0 0 1 28 4 a9 9 0 0 1 3 18 h-52 a9 9 0 0 1 -2 -17z" opacity="0.8" />
        </g>

        {/* foothills */}
        <path d="M-10 250 L70 168 L128 214 L206 132 L290 222 L352 176 L430 236 L500 186 L580 250 V470 H-10z" fill="#BFD8CC" />
        <path d="M206 132 L232 160 L212 158 L196 172 L186 154z" fill="#F8FAF7" opacity="0.7" />
        <path d="M-10 284 L60 226 L150 276 L250 208 L340 272 L420 232 L580 300 V470 H-10z" fill="#8DBBAE" />

        {/* rolling park */}
        <path d="M-10 318 C90 276 200 296 300 310 C400 324 480 300 580 286 V470 H-10z" fill="#3E8C80" />
        <path d="M-10 356 C120 316 260 352 360 356 C450 360 520 344 580 336 V470 H-10z" fill="#115E59" />

        {/* path */}
        <path
          d="M118 470 C170 420 268 398 346 384 C410 372 446 352 452 334 L476 336 C474 366 430 392 372 406 C310 420 280 440 262 470z"
          fill="#F3E7C9"
        />

        <RoundTree x={78} y={338} scale={1.15} />
        <RoundTree x={156} y={316} scale={0.8} tone="#3E8C80" />
        <Palm x={500} y={346} scale={0.95} />
        <RoundTree x={522} y={392} scale={0.9} tone="#2F7F78" />

        {/* bench */}
        <g transform="translate(86 398)">
          <rect x="0" y="-18" width="62" height="6" rx="3" fill="#7A5A3C" />
          <rect x="0" y="-32" width="62" height="6" rx="3" fill="#7A5A3C" />
          <path d="M8 -14 v14 M54 -14 v14" stroke="#17352F" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* neighbors walking together */}
        <Person x={236} y={432} scale={1.12} shirt="#E4AD43" pants="#17352F" skin="#8D5B3F" hair="#2B1B12" />
        <Person x={292} y={428} scale={0.72} shirt="#F8FAF7" pants="#B5533C" skin="#C68A5E" hair="#3A2618" wave />
        <Person x={344} y={420} scale={1.08} shirt="#F8FAF7" pants="#274C77" skin="#E7B58D" hair="#D9D9D9" />
        <Person x={404} y={408} scale={1} shirt="#B5533C" pants="#17352F" skin="#6B4226" hair="#1C120C" />

        {/* small dog */}
        <g transform="translate(184 434)">
          <rect x="-16" y="-20" width="30" height="13" rx="6" fill="#C9A27A" />
          <circle cx="16" cy="-22" r="8" fill="#C9A27A" />
          <path d="M20 -29 l4 -7 l2 9z" fill="#7A5A3C" />
          <path d="M-10 -8 v8 M8 -8 v8" stroke="#C9A27A" strokeWidth="5" strokeLinecap="round" />
          <path d="M-16 -17 q-8 -6 -6 -12" stroke="#C9A27A" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M22 -18 Q40 -40 50 -52" stroke="#17352F" strokeWidth="1.5" fill="none" />
        </g>
      </g>
    </svg>
  );
}

export function VolunteerIllustration({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 480 360"
      width="480"
      height="360"
      role="img"
      aria-label={label}
      className="h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id="volunteer-frame">
          <rect width="480" height="360" rx="36" />
        </clipPath>
      </defs>
      <g clipPath="url(#volunteer-frame)">
        <rect width="480" height="360" fill="#EAF3EB" />
        <circle cx="408" cy="70" r="30" fill="#E4AD43" />
        <path d="M-10 262 C100 232 220 250 330 244 C400 240 450 232 490 226 V370 H-10z" fill="#3E8C80" />
        <path d="M-10 300 C120 276 300 296 490 276 V370 H-10z" fill="#115E59" />
        <RoundTree x={52} y={266} scale={1.05} />
        <RoundTree x={438} y={250} scale={0.75} tone="#3E8C80" />

        {/* canopy */}
        <path d="M112 300 V130 M328 300 V130" stroke="#17352F" strokeWidth="6" strokeLinecap="round" />
        <path d="M92 132 L220 64 L348 132z" fill="#115E59" />
        <path d="M156 98 L220 64 L284 98 L262 132 H178z" fill="#F8FAF7" opacity="0.92" />
        <path d="M92 132 h256 v14 q-16 12 -32 0 q-16 12 -32 0 q-16 12 -32 0 q-16 12 -32 0 q-16 12 -32 0 q-16 12 -32 0 q-16 12 -32 0 q-16 12 -32 0z" fill="#E4AD43" />

        {/* volunteers behind the table */}
        <Person x={176} y={278} scale={1.05} shirt="#F8FAF7" pants="#17352F" skin="#8D5B3F" hair="#1C120C" wave />
        <Person x={262} y={276} scale={1} shirt="#E4AD43" pants="#17352F" skin="#E7B58D" hair="#5A3A22" flip />

        {/* table */}
        <rect x="128" y="236" width="184" height="12" rx="6" fill="#F8FAF7" />
        <path d="M134 248 h172 v48 h-172z" fill="#DCEADD" />
        <path d="M134 248 h172 v10 h-172z" fill="#C3D9C6" />
        <rect x="186" y="262" width="68" height="22" rx="6" fill="#115E59" />
        <path d="M198 273 h44" stroke="#F8FAF7" strokeWidth="4" strokeLinecap="round" />
        {/* leaflets and water */}
        <rect x="150" y="224" width="30" height="12" rx="2" fill="#E4AD43" />
        <rect x="154" y="220" width="30" height="12" rx="2" fill="#F8FAF7" stroke="#C3D9C6" />
        <rect x="270" y="214" width="10" height="22" rx="3" fill="#8DBBAE" />
        <rect x="284" y="214" width="10" height="22" rx="3" fill="#8DBBAE" />

        {/* neighbor arriving */}
        <Person x={382} y={322} scale={1.12} shirt="#B5533C" pants="#274C77" skin="#C68A5E" hair="#D9D9D9" flip wave />
      </g>
    </svg>
  );
}
