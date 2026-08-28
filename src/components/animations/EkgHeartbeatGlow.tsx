import React from 'react';

interface EkgHeartbeatGlowProps {
  runwayMonths: number;
  className?: string;
}

export const EkgHeartbeatGlow: React.FC<EkgHeartbeatGlowProps> = ({
  runwayMonths,
  className = ''
}) => {
  const isHealthy = runwayMonths >= 6;
  const strokeColor = isHealthy ? '#10b981' : '#f59e0b';
  const glowColor = isHealthy ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)';

  return (
    <div className={`relative w-full h-12 overflow-hidden pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
        className="w-full h-full filter drop-shadow-[0_0_8px_var(--glow)]"
        style={{ '--glow': glowColor } as React.CSSProperties}
      >
        <defs>
          <linearGradient id="ekgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.1" />
            <stop offset="50%" stopColor={strokeColor} stopOpacity="1" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Dynamic Heartbeat Wave Path */}
        <path
          d="M 0 30 
             L 80 30 
             L 95 30 
             L 105 10 
             L 115 50 
             L 125 5 
             L 135 40 
             L 145 30 
             L 240 30 
             L 255 30 
             L 265 10 
             L 275 50 
             L 285 5 
             L 295 40 
             L 305 30 
             L 400 30"
          fill="none"
          stroke="url(#ekgGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: '400',
            strokeDashoffset: '400',
            animation: `ekgPulse ${isHealthy ? '2.8s' : '1.8s'} linear infinite`
          }}
        />
      </svg>

      <style>{`
        @keyframes ekgPulse {
          0% { stroke-dashoffset: 400; opacity: 0.3; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -400; opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};
