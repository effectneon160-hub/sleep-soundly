import { useState, useRef, useCallback, useEffect } from 'react';
import { DecibelReading } from '@/types/sleep';

const SPIKE_THRESHOLD = 50; // dB threshold for spike detection
const SAMPLE_INTERVAL = 2000; // Sample every 2 seconds

export function useDecibelMeter() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentDecibel, setCurrentDecibel] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const readingsRef = useRef<DecibelReading[]>([]);

  const calculateDecibel = useCallback(() => {
    if (!analyserRef.current) return 0;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate RMS (Root Mean Square) for more accurate dB
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / dataArray.length);
    
    // Convert to decibels (approximate scale for ambient noise)
    // Normalize to 0-100 dB range typical for ambient environments
    const db = Math.round((rms / 255) * 100);
    
    return Math.min(100, Math.max(0, db));
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setError(null);
      return true;
    } catch (err) {
      setHasPermission(false);
      setError('Microphone permission denied');
      return false;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      streamRef.current = stream;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      readingsRef.current = [];

      // Sample decibel levels at regular intervals
      intervalRef.current = window.setInterval(() => {
        const db = calculateDecibel();
        setCurrentDecibel(db);
        
        readingsRef.current.push({
          timestamp: Date.now(),
          decibel: db
        });
      }, SAMPLE_INTERVAL);

      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Failed to start recording');
      console.error('Recording error:', err);
    }
  }, [calculateDecibel]);

  const stopRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setIsRecording(false);
    setCurrentDecibel(0);

    return readingsRef.current;
  }, []);

  const getReadings = useCallback(() => {
    return readingsRef.current;
  }, []);

  const calculateStats = useCallback((readings: DecibelReading[]) => {
    if (readings.length === 0) {
      return {
        averageDecibel: 0,
        peakDecibel: 0,
        spikeCount: 0,
        noiseQuality: 'quiet' as const
      };
    }

    const sum = readings.reduce((acc, r) => acc + r.decibel, 0);
    const average = Math.round(sum / readings.length);
    const peak = Math.max(...readings.map(r => r.decibel));
    const spikes = readings.filter(r => r.decibel > SPIKE_THRESHOLD).length;

    let quality: 'quiet' | 'moderate' | 'noisy' = 'quiet';
    if (average > 50) quality = 'noisy';
    else if (average > 30) quality = 'moderate';

    return {
      averageDecibel: average,
      peakDecibel: peak,
      spikeCount: spikes,
      noiseQuality: quality
    };
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isRecording,
    currentDecibel,
    hasPermission,
    error,
    requestPermission,
    startRecording,
    stopRecording,
    getReadings,
    calculateStats
  };
}
