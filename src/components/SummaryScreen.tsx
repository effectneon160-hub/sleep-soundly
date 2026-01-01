import { motion } from 'framer-motion';
import { Clock, Volume2, TrendingUp, AlertTriangle, ChevronRight, Home, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SleepSession } from '@/types/sleep';
import { NoiseChart } from './NoiseChart';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface SummaryScreenProps {
  session: SleepSession;
  onGoHome: () => void;
  onViewDetails: () => void;
}

export function SummaryScreen({ session, onGoHome, onViewDetails }: SummaryScreenProps) {
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

  const getBgColor = (quality: 'quiet' | 'moderate' | 'noisy') => {
    switch (quality) {
      case 'quiet': return 'bg-noise-quiet';
      case 'moderate': return 'bg-noise-moderate';
      case 'noisy': return 'bg-noise-noisy';
    }
  };

  const getQualityMessage = (quality: 'quiet' | 'moderate' | 'noisy') => {
    switch (quality) {
      case 'quiet': return 'Excellent sleep environment';
      case 'moderate': return 'Some noise disturbances detected';
      case 'noisy': return 'Significant noise during sleep';
    }
  };

  const stats = [
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Duration',
      value: formatDuration(session.startTime, session.endTime),
      color: 'text-primary'
    },
    {
      icon: <Volume2 className="w-5 h-5" />,
      label: 'Avg Noise',
      value: `${session.averageDecibel} dB`,
      color: 'text-foreground'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Peak',
      value: `${session.peakDecibel} dB`,
      color: 'text-foreground'
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      label: 'Spikes',
      value: session.spikeCount.toString(),
      color: session.spikeCount > 5 ? 'text-destructive' : 'text-foreground'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold text-foreground mb-1">Good Morning!</h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(session.startTime), 'EEEE, MMMM d')}
        </p>
      </motion.header>

      {/* Quality Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <div className={cn(
          "inline-flex items-center gap-2 px-6 py-3 rounded-full",
          getBgColor(session.noiseQuality),
          "text-primary-foreground"
        )}>
          <div className="w-3 h-3 rounded-full bg-current opacity-60" />
          <span className="font-semibold capitalize">{session.noiseQuality} Night</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {getQualityMessage(session.noiseQuality)}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="glass-card p-4"
          >
            <div className={cn("mb-2", stat.color)}>
              {stat.icon}
            </div>
            <p className={cn("text-2xl font-bold", stat.color)}>
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-4 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Noise Timeline</h2>
          <Button variant="ghost" size="sm" onClick={onViewDetails} className="text-primary">
            Details <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <NoiseChart readings={session.readings} height={150} />
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-auto space-y-3"
      >
        <Button variant="glow" size="lg" onClick={onGoHome} className="w-full">
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
        <Button variant="outline" size="lg" onClick={onViewDetails} className="w-full">
          <BarChart3 className="w-5 h-5 mr-2" />
          View Full Analysis
        </Button>
      </motion.div>
    </div>
  );
}
