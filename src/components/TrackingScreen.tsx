import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Square, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DecibelIndicator } from './DecibelIndicator';
import { format } from 'date-fns';

interface TrackingScreenProps {
  startTime: number;
  currentDecibel: number;
  onStopTracking: () => void;
}

export function TrackingScreen({ startTime, currentDecibel, onStopTracking }: TrackingScreenProps) {
  const [elapsed, setElapsed] = useState('00:00:00');

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Date.now() - startTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setElapsed(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">Recording</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Started at {format(new Date(startTime), 'h:mm a')}
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <DecibelIndicator decibel={currentDecibel} size="lg" />
        
        <div className="mt-8 text-center">
          <p className="text-4xl font-light text-foreground tabular-nums tracking-wider">
            {elapsed}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Sleep Duration</p>
        </div>
      </motion.div>

      {/* Stop Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-xs"
      >
        <Button
          variant="outline"
          size="xl"
          onClick={onStopTracking}
          className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Square className="w-5 h-5 mr-2" />
          Stop Tracking
        </Button>
        
        <p className="text-xs text-center text-muted-foreground mt-4">
          You can lock your phone — tracking continues in background
        </p>
      </motion.div>
    </div>
  );
}
