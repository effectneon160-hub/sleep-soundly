import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DecibelIndicatorProps {
  decibel: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function DecibelIndicator({ decibel, size = 'md', showLabel = true }: DecibelIndicatorProps) {
  const getNoiseColor = () => {
    if (decibel > 50) return 'noise-noisy';
    if (decibel > 30) return 'noise-moderate';
    return 'noise-quiet';
  };

  const getBgColor = () => {
    if (decibel > 50) return 'bg-noise-noisy';
    if (decibel > 30) return 'bg-noise-moderate';
    return 'bg-noise-quiet';
  };

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48'
  };

  const textSizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl'
  };

  const ringScale = Math.min(1.5, 1 + (decibel / 100) * 0.5);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
        {/* Outer glow ring */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full opacity-20",
            getBgColor()
          )}
          animate={{
            scale: [1, ringScale, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Middle ring */}
        <motion.div
          className={cn(
            "absolute inset-4 rounded-full opacity-30",
            getBgColor()
          )}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        />

        {/* Center circle */}
        <div className={cn(
          "relative z-10 flex items-center justify-center rounded-full border-2 border-current",
          sizeClasses[size],
          getNoiseColor()
        )}
        style={{
          background: `radial-gradient(circle at center, hsl(var(--${decibel > 50 ? 'noise-noisy' : decibel > 30 ? 'noise-moderate' : 'noise-quiet'}) / 0.15) 0%, transparent 70%)`
        }}
        >
          <span className={cn("font-bold tabular-nums", textSizes[size], getNoiseColor())}>
            {decibel}
          </span>
        </div>
      </div>
      
      {showLabel && (
        <div className="text-center">
          <p className={cn("text-lg font-medium", getNoiseColor())}>
            {decibel > 50 ? 'Noisy' : decibel > 30 ? 'Moderate' : 'Quiet'}
          </p>
          <p className="text-sm text-muted-foreground">decibels</p>
        </div>
      )}
    </div>
  );
}
