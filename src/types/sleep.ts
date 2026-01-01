export interface DecibelReading {
  timestamp: number;
  decibel: number;
}

export interface SleepSession {
  id: string;
  startTime: number;
  endTime: number | null;
  readings: DecibelReading[];
  averageDecibel: number;
  peakDecibel: number;
  spikeCount: number;
  noiseQuality: 'quiet' | 'moderate' | 'noisy';
}

export interface SleepStats {
  duration: number;
  averageDecibel: number;
  peakDecibel: number;
  spikeCount: number;
  noiseQuality: 'quiet' | 'moderate' | 'noisy';
}

export type AppState = 'onboarding' | 'idle' | 'tracking' | 'summary';
