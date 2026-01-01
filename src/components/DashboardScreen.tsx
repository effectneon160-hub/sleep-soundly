import { motion } from 'framer-motion';
import { Moon, Play, History, Volume2, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SleepSession } from '@/types/sleep';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DashboardScreenProps {
  lastSession: SleepSession | null;
  onStartTracking: () => void;
  onViewHistory: () => void;
}

export function DashboardScreen({ lastSession, onStartTracking, onViewHistory }: DashboardScreenProps) {
  const getNoiseColor = (quality: 'quiet' | 'moderate' | 'noisy') => {
    switch (quality) {
      case 'quiet': return 'noise-quiet';
      case 'moderate': return 'noise-moderate';
      case 'noisy': return 'noise-noisy';
    }
  };

  const formatDuration = (start: number, end: number | null) => {
    if (!end) return '--';
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen flex flex-col p-6 pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Moon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Decibel</h1>
            <p className="text-xs text-muted-foreground">Ready to track</p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" onClick={onViewHistory}>
          <History className="w-5 h-5" />
        </Button>
      </motion.header>

      {/* Main CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex flex-col items-center justify-center"
      >
        <motion.button
          onClick={onStartTracking}
          className="relative w-48 h-48 rounded-full gradient-primary shadow-glow flex items-center justify-center group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full gradient-primary opacity-20 pulse-ring" />
          <div className="absolute inset-[-12px] rounded-full gradient-primary opacity-10 pulse-ring" style={{ animationDelay: '0.5s' }} />
          <div className="absolute inset-[-24px] rounded-full gradient-primary opacity-5 pulse-ring" style={{ animationDelay: '1s' }} />
          
          <div className="text-center">
            <Play className="w-12 h-12 text-primary-foreground mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-primary-foreground font-semibold">Start Sleep</span>
          </div>
        </motion.button>
        
        <p className="text-muted-foreground mt-6 text-center">
          Tap to begin tracking your sleep environment
        </p>
      </motion.div>

      {/* Last Session Summary */}
      {lastSession && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Last Night</h2>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(lastSession.startTime), { addSuffix: true })}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-lg font-bold text-foreground">
                {formatDuration(lastSession.startTime, lastSession.endTime)}
              </p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-lg font-bold text-foreground">
                {lastSession.averageDecibel} dB
              </p>
              <p className="text-xs text-muted-foreground">Avg Noise</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className={cn("text-lg font-bold capitalize", getNoiseColor(lastSession.noiseQuality))}>
                {lastSession.noiseQuality}
              </p>
              <p className="text-xs text-muted-foreground">Quality</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
