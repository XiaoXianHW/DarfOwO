export const PCIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
    <rect x="25" y="10" width="50" height="80" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="2"/>
    {/* Glass panel */}
    <rect x="30" y="15" width="40" height="70" rx="2" fill="#0a0a0a"/>
    {/* Motherboard area */}
    <rect x="35" y="20" width="30" height="40" rx="1" fill="#111" stroke="#222" strokeWidth="1"/>
    {/* CPU Cooler */}
    <circle cx="50" cy="35" r="8" fill="none" stroke="#3b82f6" strokeWidth="2" className="animate-pulse"/>
    {/* RAM */}
    <rect x="62" y="25" width="2" height="15" fill="#8b5cf6" className="animate-pulse" style={{animationDelay: '0.2s'}}/>
    <rect x="66" y="25" width="2" height="15" fill="#8b5cf6" className="animate-pulse" style={{animationDelay: '0.4s'}}/>
    {/* GPU - RTX 2070 Super */}
    <rect x="32" y="65" width="36" height="12" rx="1" fill="#111" stroke="#10b981" strokeWidth="1.5"/>
    <circle cx="42" cy="71" r="3" fill="#10b981" className="animate-spin-slow"/>
    <circle cx="58" cy="71" r="3" fill="#10b981" className="animate-spin-slow"/>
  </svg>
);

export const MacMiniIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
    <rect x="20" y="40" width="60" height="20" rx="4" fill="#222" stroke="#444" strokeWidth="2"/>
    <path d="M25 40 L75 40" stroke="#555" strokeWidth="1"/>
    <circle cx="50" cy="50" r="4" fill="#111"/>
    <circle cx="70" cy="50" r="1.5" fill="#fff" className="animate-pulse"/>
  </svg>
);

export const PhonesIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
    {/* iPhone 14 Pro */}
    <rect x="15" y="25" width="35" height="65" rx="6" fill="#111" stroke="#555" strokeWidth="2"/>
    <rect x="25" y="28" width="15" height="4" rx="2" fill="#000"/> {/* Dynamic Island */}
    {/* Xiaomi 14 Pro */}
    <rect x="50" y="15" width="35" height="65" rx="4" fill="#0a0a0a" stroke="#3b82f6" strokeWidth="2"/>
    {/* Square Camera Module Top Left */}
    <rect x="54" y="20" width="14" height="14" rx="2" fill="#111" stroke="#222" strokeWidth="1.5"/>
    <circle cx="58" cy="24" r="2" fill="#333"/>
    <circle cx="64" cy="24" r="2" fill="#333"/>
    <circle cx="58" cy="30" r="2" fill="#333"/>
    <circle cx="64" cy="30" r="2" fill="#333"/>
  </svg>
);

export const LaptopIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
    <path d="M15 70 L85 70 L90 75 L10 75 Z" fill="#222" stroke="#444" strokeWidth="2"/>
    <rect x="20" y="30" width="60" height="40" rx="2" fill="#111" stroke="#444" strokeWidth="2"/>
    <rect x="23" y="33" width="54" height="34" fill="#000"/>
    <rect x="40" y="50" width="20" height="2" fill="#333"/>
  </svg>
);

export const PadIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
    <rect x="15" y="25" width="60" height="50" rx="4" fill="#111" stroke="#6366f1" strokeWidth="2"/>
    <rect x="18" y="28" width="54" height="44" rx="2" fill="#000"/>
    {/* Smart Pen */}
    <path d="M85 30 L85 70" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    <path d="M85 30 L85 35" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const NASIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
    <rect x="25" y="25" width="50" height="50" rx="4" fill="#111" stroke="#10b981" strokeWidth="2"/>
    <rect x="30" y="30" width="8" height="40" rx="1" fill="#222"/>
    <rect x="41" y="30" width="8" height="40" rx="1" fill="#222"/>
    <rect x="52" y="30" width="8" height="40" rx="1" fill="#222"/>
    <rect x="63" y="30" width="8" height="40" rx="1" fill="#222"/>
    <circle cx="34" cy="35" r="1.5" fill="#10b981" className="animate-pulse"/>
    <circle cx="45" cy="35" r="1.5" fill="#10b981" className="animate-pulse" style={{animationDelay: '0.2s'}}/>
    <circle cx="56" cy="35" r="1.5" fill="#10b981" className="animate-pulse" style={{animationDelay: '0.4s'}}/>
    <circle cx="67" cy="35" r="1.5" fill="#10b981" className="animate-pulse" style={{animationDelay: '0.6s'}}/>
  </svg>
);

export const PeripheralsIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
    {/* Keyboard */}
    <rect x="15" y="20" width="70" height="25" rx="2" fill="#111" stroke="#555" strokeWidth="2"/>
    <rect x="20" y="25" width="5" height="5" fill="#333"/>
    <rect x="28" y="25" width="5" height="5" fill="#333"/>
    <rect x="36" y="25" width="30" height="5" fill="#333"/>
    <rect x="20" y="33" width="15" height="5" fill="#333"/>
    <rect x="38" y="33" width="40" height="5" fill="#333"/>
    {/* Mouse */}
    <rect x="40" y="55" width="20" height="30" rx="10" fill="#111" stroke="#3b82f6" strokeWidth="2"/>
    <line x1="50" y1="55" x2="50" y2="65" stroke="#3b82f6" strokeWidth="2"/>
    <circle cx="50" cy="70" r="2" fill="#3b82f6" className="animate-pulse"/>
  </svg>
);

export const VRIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
    <path d="M20 40 C20 30, 80 30, 80 40 L85 60 C85 70, 70 75, 50 65 C30 75, 15 70, 15 60 Z" fill="#111" stroke="#fff" strokeWidth="2"/>
    <circle cx="35" cy="50" r="6" fill="#222"/>
    <circle cx="65" cy="50" r="6" fill="#222"/>
    <circle cx="50" cy="55" r="4" fill="#111"/>
  </svg>
);

export const AudioIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
    <rect x="30" y="35" width="40" height="30" rx="10" fill="#111" stroke="#ddd" strokeWidth="2"/>
    <path d="M30 45 C30 25, 70 25, 70 45" fill="none" stroke="#ddd" strokeWidth="2"/>
    <circle cx="50" cy="50" r="2" fill="#10b981" className="animate-pulse"/>
  </svg>
);

export const BandIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
    <path d="M40 10 L60 10 L55 30 L45 30 Z" fill="#222"/>
    <path d="M45 70 L55 70 L60 90 L40 90 Z" fill="#222"/>
    <rect x="40" y="30" width="20" height="40" rx="10" fill="#000" stroke="#f97316" strokeWidth="2"/>
    <text x="50" y="53" fill="#f97316" fontSize="12" textAnchor="middle" fontFamily="monospace">10</text>
  </svg>
);
