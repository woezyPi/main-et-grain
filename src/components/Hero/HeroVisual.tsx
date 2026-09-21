import { heroFigure } from '../../data/hero';

/**
 * Stand-in for the Hero photograph.
 *
 * The Hero is meant to carry a full-bleed photograph of a pour in progress —
 * pass one to `<Hero image>` and this is replaced. Until that asset exists,
 * the object is drawn instead, in the brand's own line-work language but
 * reversed out of the night surface rather than inked on paper.
 *
 * The dimension chain the paper version carries is dropped here: annotated
 * drawings belong in Brew Lab, not under a headline.
 *
 * Geometry is real: a 60° V60-02, 116 mm across the rim, standing on the rim
 * of a 600 ml server, poured from a gooseneck.
 */
export function HeroVisual() {
  return (
    <svg
      className="figure"
      viewBox="20 24 550 608"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={heroFigure.alt}
    >
      <g className="figure__construction">
        <path d="M280 96V596" strokeDasharray="20 6 2 6" />
        <path d="M96 588H470" />
      </g>

      <g className="figure__object">
        {/* gooseneck kettle */}
        <path d="M62 86C56 116 52 142 48 162" />
        <path d="M158 86c6 30 10 56 14 76" />
        <path d="M48 162a62 12 0 0 0 124 0" />
        <ellipse cx="110" cy="86" rx="48" ry="10" />
        <path d="M66 79a44 9 0 0 1 88 0" />
        <path d="M100 76c0-9 20-9 20 0" />
        <path d="M68 76C74 28 146 28 152 78" />
        <path d="M164 96c40-22 80-18 100 10 8 12 8 30 8 52" />
        <path d="M168 116c36-18 68-14 82 8 4 7 4 17 4 34" />
        <path d="M272 158h-18" />

        {/* pour — a gooseneck pours straight down */}
        <g className="figure__pour">
          <path d="M259 162v82" />
          <path d="M267 162v82" />
        </g>

        {/* cone, standing on its base ring */}
        <path d="M138 210 256 414h48L422 210" />
        <ellipse cx="280" cy="210" rx="142" ry="25" />
        <path d="M256 414v4M304 414v4" />
        <ellipse cx="280" cy="422" rx="28" ry="6" />
        <g className="figure__ribs">
          <path d="M180 228q36 82 74 164" />
          <path d="M230 233q18 79 37 159" />
          <path d="M280 235v157" />
          <path d="M330 233q-18 79-37 159" />
          <path d="M380 228q-36 82-74 164" />
        </g>

        {/* coffee bed, blooming */}
        <path className="figure__bed" d="M162 252a118 20 0 0 0 236 0" />
        <path className="figure__hidden" d="M162 252a118 20 0 0 1 236 0" />
        <g className="figure__node">
          <circle cx="232" cy="246" r="2.4" />
          <circle cx="258" cy="251" r="1.8" />
          <circle cx="300" cy="248" r="2.1" />
          <circle cx="322" cy="243" r="1.6" />
        </g>

        {/* server */}
        <ellipse cx="280" cy="442" rx="98" ry="17" />
        <path d="M182 442c-14 54-12 100 8 124 28 26 152 26 180 0 20-24 22-70 8-124" />
        <path d="M390 472c50 6 52 58-18 66" />
        <path d="M182 442 158 434l22 22" />
        <path className="figure__bed" d="M180 538a100 15 0 0 0 200 0" />
        <path className="figure__hidden" d="M180 538a100 15 0 0 1 200 0" />
        <g className="figure__brew" clipPath="url(#mg-server)">
          <path d="M110 602 172 540M134 602 196 540M158 602 220 540M182 602 244 540M206 602 268 540M230 602 292 540M254 602 316 540M278 602 340 540M302 602 364 540M326 602 388 540M350 602 412 540M374 602 436 540" />
        </g>
      </g>

      <defs>
        <clipPath id="mg-server">
          <path d="M182 442c-14 54-12 100 8 124 28 26 152 26 180 0 20-24 22-70 8-124Z" />
        </clipPath>
        <filter
          id="mg-rough"
          x="-4%"
          y="-4%"
          width="108%"
          height="108%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.019"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
