import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Volume2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SleepSession } from '@/types/sleep';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface HistoryScreenProps {
  sessions: SleepSession[];
  onBack: () => void;
  onSelectSession: (session: SleepSession) => void;
  onDeleteSession: (id: string) => void;
}

export function HistoryScreen({ sessions, onBack, onSelectSession, onDeleteSession }: HistoryScreenProps) {
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
        <h1 className="text-xl font-bold text-foreground">Sleep History</h1>
      </motion.header>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">No Sessions Yet</h2>
          <p className="text-sm text-muted-foreground">
            Start your first sleep tracking session to see your history here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-4"
            >
              <button
                onClick={() => onSelectSession(session)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">
                      {format(new Date(session.startTime), 'EEEE, MMM d')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(session.startTime), 'h:mm a')} - {session.endTime ? format(new Date(session.endTime), 'h:mm a') : '--'}
                    </p>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold capitalize",
                    getNoiseColor(session.noiseQuality),
                    session.noiseQuality === 'quiet' && 'bg-noise-quiet/20',
                    session.noiseQuality === 'moderate' && 'bg-noise-moderate/20',
                    session.noiseQuality === 'noisy' && 'bg-noise-noisy/20'
                  )}>
                    {session.noiseQuality}
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(session.startTime, session.endTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Volume2 className="w-4 h-4" />
                    <span>{session.averageDecibel} dB avg</span>
                  </div>
                </div>
              </button>
              
              <div className="flex justify-end mt-3 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
