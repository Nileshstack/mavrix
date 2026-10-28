import type { SVGProps } from "react";

type VisualProps = SVGProps<SVGSVGElement>;

const svgProps: VisualProps = {
  viewBox: "0 0 360 220",
  fill: "none",
  className: "service-visual-svg",
};

export function SeoVisual() {
  return (
    <svg {...svgProps}>
      <circle cx="275" cy="104" r="52" stroke="#DCE5F2" strokeWidth="9" />
      <circle
        className="visual-ring"
        cx="275"
        cy="104"
        r="52"
        stroke="#3DB5FF"
        strokeLinecap="round"
        strokeWidth="9"
        transform="rotate(-90 275 104)"
      />
      <circle cx="275" cy="104" r="13" stroke="#0A0F1F" strokeWidth="3" />
      <path d="m284 113 9 9" stroke="#0A0F1F" strokeWidth="3" strokeLinecap="round" />
      <path d="M37 181H181" stroke="#DCE5F2" strokeWidth="2" />
      <rect className="visual-bar visual-bar-1" x="48" y="139" width="22" height="42" rx="5" fill="#9DDCFF" />
      <rect className="visual-bar visual-bar-2" x="83" y="119" width="22" height="62" rx="5" fill="#72CBFF" />
      <rect className="visual-bar visual-bar-3" x="118" y="91" width="22" height="90" rx="5" fill="#3DB5FF" />
      <rect className="visual-bar visual-bar-4" x="153" y="63" width="22" height="118" rx="5" fill="#0A0F1F" />
      <path d="m43 128 43-23 36-30 47-27" stroke="#3DB5FF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function AutomationVisual() {
  return (
    <svg {...svgProps}>
      <path className="visual-dash" d="M84 110h78m38 0h78M181 76v-34m0 102v35" stroke="#3DB5FF" strokeWidth="2" />
      <circle className="visual-node" cx="64" cy="110" r="21" />
      <circle className="visual-node visual-node-main" cx="181" cy="110" r="26" />
      <circle className="visual-node" cx="296" cy="110" r="21" />
      <circle className="visual-node" cx="181" cy="25" r="17" />
      <circle className="visual-node" cx="181" cy="195" r="17" />
      <circle cx="64" cy="110" r="5" fill="#3DB5FF" />
      <path d="M173 110h16m-8-8v16" stroke="#0A0F1F" strokeWidth="3" strokeLinecap="round" />
      <circle cx="296" cy="110" r="5" fill="#3DB5FF" />
      <path d="M175 25h12m-6-6v12M175 195h12m-6-6v12" stroke="#3DB5FF" strokeWidth="2" strokeLinecap="round" />
      <circle className="visual-pulse visual-pulse-one" cx="84" cy="110" r="4" fill="#3DB5FF" />
      <circle className="visual-pulse visual-pulse-two" cx="276" cy="110" r="4" fill="#3DB5FF" />
    </svg>
  );
}

export function ChatbotVisual() {
  return (
    <svg {...svgProps}>
      <rect x="49" y="38" width="190" height="64" rx="18" fill="#F3F7FF" />
      <path d="M74 102v15l19-15" fill="#F3F7FF" />
      <circle className="visual-typing-dot typing-dot-1" cx="91" cy="70" r="5" fill="#3DB5FF" />
      <circle className="visual-typing-dot typing-dot-2" cx="111" cy="70" r="5" fill="#3DB5FF" />
      <circle className="visual-typing-dot typing-dot-3" cx="131" cy="70" r="5" fill="#3DB5FF" />
      <rect className="visual-chat-reply" x="132" y="120" width="177" height="62" rx="18" fill="#0A0F1F" />
      <path d="M286 180v14l-19-13" fill="#0A0F1F" />
      <path d="M153 144h112M153 158h82" stroke="white" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function WebsiteVisual() {
  return (
    <svg {...svgProps}>
      <rect x="38" y="34" width="284" height="154" rx="13" fill="white" stroke="#DCE5F2" strokeWidth="2" />
      <path d="M38 61h284" stroke="#DCE5F2" strokeWidth="2" />
      <circle cx="55" cy="48" r="4" fill="#3DB5FF" />
      <circle cx="69" cy="48" r="4" fill="#DCE5F2" />
      <circle cx="83" cy="48" r="4" fill="#DCE5F2" />
      <rect className="visual-skeleton visual-skeleton-wide" x="57" y="82" width="127" height="11" rx="5.5" fill="#0A0F1F" />
      <rect className="visual-skeleton visual-skeleton-line" x="57" y="102" width="96" height="7" rx="3.5" fill="#DCE5F2" />
      <rect className="visual-skeleton visual-skeleton-line" x="57" y="115" width="111" height="7" rx="3.5" fill="#DCE5F2" />
      <rect className="visual-skeleton visual-skeleton-image" x="205" y="78" width="93" height="73" rx="9" fill="#DDF3FF" />
      <path d="m214 139 24-27 17 17 13-13 22 25" stroke="#3DB5FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect className="visual-skeleton visual-skeleton-button" x="57" y="141" width="78" height="22" rx="11" fill="#3DB5FF" />
    </svg>
  );
}

export function MobileVisual() {
  return (
    <svg {...svgProps}>
      <rect x="135" y="14" width="90" height="192" rx="20" fill="#0A0F1F" />
      <rect x="141" y="24" width="78" height="171" rx="14" fill="white" />
      <rect x="163" y="31" width="34" height="5" rx="2.5" fill="#DCE5F2" />
      <g className="visual-phone-screen visual-phone-screen-one">
        <rect x="151" y="52" width="58" height="47" rx="8" fill="#E8F6FF" />
        <circle cx="166" cy="68" r="7" fill="#3DB5FF" />
        <rect x="178" y="62" width="22" height="5" rx="2.5" fill="#0A0F1F" />
        <rect x="178" y="71" width="19" height="4" rx="2" fill="#B7C7DA" />
        <rect x="151" y="108" width="58" height="7" rx="3.5" fill="#DCE5F2" />
        <rect x="151" y="121" width="44" height="7" rx="3.5" fill="#DCE5F2" />
        <rect x="151" y="139" width="58" height="35" rx="8" fill="#F3F7FF" />
      </g>
      <g className="visual-phone-screen visual-phone-screen-two">
        <rect x="151" y="52" width="58" height="36" rx="8" fill="#0A0F1F" />
        <rect x="159" y="63" width="31" height="5" rx="2.5" fill="white" />
        <rect x="159" y="72" width="40" height="4" rx="2" fill="#91A0B4" />
        <rect x="151" y="97" width="58" height="28" rx="7" fill="#E8F6FF" />
        <rect x="159" y="107" width="39" height="6" rx="3" fill="#3DB5FF" />
        <rect x="151" y="134" width="58" height="40" rx="8" fill="#F3F7FF" />
      </g>
      <path d="M103 110h22m110 0h22" stroke="#3DB5FF" strokeWidth="2" strokeLinecap="round" />
      <path d="m119 104 6 6-6 6m122-12-6 6 6 6" stroke="#3DB5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SoftwareVisual() {
  return (
    <svg {...svgProps}>
      <rect className="visual-dashboard-back" x="78" y="47" width="191" height="121" rx="12" fill="#E9F6FF" stroke="#B7E5FF" strokeWidth="2" />
      <rect className="visual-dashboard-front" x="108" y="69" width="190" height="121" rx="12" fill="white" stroke="#DCE5F2" strokeWidth="2" />
      <path d="M108 94h190" stroke="#DCE5F2" strokeWidth="2" />
      <circle cx="124" cy="82" r="4" fill="#3DB5FF" />
      <rect x="126" y="109" width="61" height="7" rx="3.5" fill="#0A0F1F" />
      <rect x="126" y="124" width="104" height="6" rx="3" fill="#DCE5F2" />
      <rect x="126" y="140" width="77" height="6" rx="3" fill="#DCE5F2" />
      <rect x="126" y="157" width="79" height="19" rx="9.5" fill="#F3F7FF" />
      <rect x="247" y="109" width="35" height="35" rx="10" fill="#DDF3FF" />
      <path d="M256 125v-4a8 8 0 0 1 16 0v4m-18 0h20v16h-20v-16Z" stroke="#0A0F1F" strokeWidth="2.5" strokeLinejoin="round" />
      <circle className="visual-lock-dot" cx="264" cy="132" r="2" fill="#3DB5FF" />
    </svg>
  );
}

export function GraphicDesignVisual() {
  return (
    <svg {...svgProps}>
      <rect x="43" y="35" width="274" height="150" rx="18" fill="white" stroke="#DCE5F2" strokeWidth="2" />
      <path d="M62 57h18" stroke="#0A0F1F" strokeWidth="3" strokeLinecap="round" />
      <path d="M62 67h12" stroke="#B7C7DA" strokeWidth="2" strokeLinecap="round" />
      <g className="visual-shape visual-shape-one">
        <circle cx="134" cy="112" r="37" fill="#3DB5FF" />
      </g>
      <g className="visual-shape visual-shape-two">
        <path d="m210 75 38 68h-76l38-68Z" fill="#0A0F1F" />
      </g>
      <rect x="271" y="82" width="24" height="24" rx="7" fill="#BFE9FF" />
      <rect x="271" y="114" width="24" height="24" rx="7" fill="#78CEFF" />
      <rect x="271" y="146" width="24" height="24" rx="7" fill="#0A0F1F" />
      <path d="M62 163h112" stroke="#DCE5F2" strokeWidth="3" strokeLinecap="round" />
      <path d="M62 173h74" stroke="#DCE5F2" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
