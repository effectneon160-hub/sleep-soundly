import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Volume2, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SleepSession } from '@/types/sleep';
import { NoiseChart } from './NoiseChart';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DetailScreenProps {
  session: SleepSession;
  onBack: () => void;
}

export function DetailScreen({ session, onBack }: DetailScreenProps) {
  const formatDuration = (start: number, end: number | null) => {
    if (!end) return '--';
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getNoiseColor = (quality: 'quiet' | 'moderate' | 'noisy') => {
    switch (quality) {
      case 'quiet': return 'noise-quiet';
      case 'moderate': return 'noise-moderate';
      case 'noisy': return 'noise-noisy';
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Sleep Analysis</h1>
          <p className="text-xs text-muted-foreground">
            {format(new Date(session.startTime), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      </motion.header>

      {/* Session Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Session Time</p>
            <p className="text-lg font-semibold text-foreground">
              {format(new Date(session.startTime), 'h:mm a')} - {session.endTime ? format(new Date(session.endTime), 'h:mm a') : '--'}
            </p>
          </div>
          <div className={cn(
            "px-4 py-2 rounded-full font-semibold capitalize",
            getNoiseColor(session.noiseQuality),
            session.noiseQuality === 'quiet' && 'bg-noise-quiet/20',
            session.noiseQuality === 'moderate' && 'bg-noise-moderate/20',
            session.noiseQuality === 'noisy' && 'bg-noise-noisy/20'
          )}>
            {session.noiseQuality}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <div className="glass-card p-4">
          <Clock className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {formatDuration(session.startTime, session.endTime)}
          </p>
          <p className="text-xs text-muted-foreground">Total Duration</p>
        </div>
        
        <div className="glass-card p-4">
          <Volume2 className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {session.averageDecibel} dB
          </p>
          <p className="text-xs text-muted-foreground">Average Noise</p>
        </div>
        
        <div className="glass-card p-4">
          <TrendingUp className="w-5 h-5 text-destructive mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {session.peakDecibel} dB
          </p>
          <p className="text-xs text-muted-foreground">Peak Level</p>
        </div>
        
        <div className="glass-card p-4">
          <AlertTriangle className="w-5 h-5 text-noise-moderate mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {session.spikeCount}
          </p>
          <p className="text-xs text-muted-foreground">Noise Spikes</p>
        </div>
      </motion.div>

      {/* Full Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4 flex-1"
      >
        <h2 className="font-semibold text-foreground mb-4">Noise Over Time</h2>
        <NoiseChart readings={session.readings} height={300} />
        
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-noise-quiet" />
            <span className="text-xs text-muted-foreground">Quiet (&lt;30 dB)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-noise-moderate" />
            <span className="text-xs text-muted-foreground">Moderate (30-50 dB)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-noise-noisy" />
            <span className="text-xs text-muted-foreground">Noisy (&gt;50 dB)</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
