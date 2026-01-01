import { useState, useCallback, useEffect } from 'react';
import { SleepSession, DecibelReading } from '@/types/sleep';

const STORAGE_KEY = 'decibel_sleep_sessions';

export function useSleepSessions() {
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [currentSession, setCurrentSession] = useState<SleepSession | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
      } catch (e) {
        console.error('Failed to parse stored sessions:', e);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  const saveSessions = useCallback((newSessions: SleepSession[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
    setSessions(newSessions);
  }, []);

  const startSession = useCallback(() => {
    const session: SleepSession = {
      id: Date.now().toString(),
      startTime: Date.now(),
      endTime: null,
      readings: [],
      averageDecibel: 0,
      peakDecibel: 0,
      spikeCount: 0,
      noiseQuality: 'quiet'
    };
    setCurrentSession(session);
    return session;
  }, []);

  const endSession = useCallback((
    readings: DecibelReading[],
    stats: {
      averageDecibel: number;
      peakDecibel: number;
      spikeCount: number;
      noiseQuality: 'quiet' | 'moderate' | 'noisy';
    }
  ) => {
    if (!currentSession) return null;

    const completedSession: SleepSession = {
      ...currentSession,
      endTime: Date.now(),
      readings,
      ...stats
    };

    const newSessions = [completedSession, ...sessions];
    saveSessions(newSessions);
    setCurrentSession(null);

    return completedSession;
  }, [currentSession, sessions, saveSessions]);

  const getSession = useCallback((id: string) => {
    return sessions.find(s => s.id === id) || null;
  }, [sessions]);

  const deleteSession = useCallback((id: string) => {
    const newSessions = sessions.filter(s => s.id !== id);
    saveSessions(newSessions);
  }, [sessions, saveSessions]);

  const getLastSession = useCallback(() => {
    return sessions.length > 0 ? sessions[0] : null;
  }, [sessions]);

  return {
    sessions,
    currentSession,
    startSession,
    endSession,
    getSession,
    deleteSession,
    getLastSession
  };
}
