import { useState, useEffect, useCallback } from 'react';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { DashboardScreen } from '@/components/DashboardScreen';
import { TrackingScreen } from '@/components/TrackingScreen';
import { SummaryScreen } from '@/components/SummaryScreen';
import { HistoryScreen } from '@/components/HistoryScreen';
import { DetailScreen } from '@/components/DetailScreen';
import { useDecibelMeter } from '@/hooks/useDecibelMeter';
import { useSleepSessions } from '@/hooks/useSleepSessions';
import { SleepSession, AppState } from '@/types/sleep';
import { toast } from 'sonner';

type Screen = 'onboarding' | 'dashboard' | 'tracking' | 'summary' | 'history' | 'detail';

const PERMISSION_KEY = 'decibel_mic_permission';

export default function Index() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [completedSession, setCompletedSession] = useState<SleepSession | null>(null);
  const [selectedSession, setSelectedSession] = useState<SleepSession | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const {
    isRecording,
    currentDecibel,
    hasPermission,
    error,
    requestPermission,
    startRecording,
    stopRecording,
    calculateStats
  } = useDecibelMeter();

  const {
    sessions,
    currentSession,
    startSession,
    endSession,
    getLastSession,
    deleteSession
  } = useSleepSessions();

  // Check if we've already granted permission
  useEffect(() => {
    const storedPermission = localStorage.getItem(PERMISSION_KEY);
    if (storedPermission === 'granted') {
      setScreen('dashboard');
    }
  }, []);

  const handleRequestPermission = useCallback(async () => {
    setIsRequestingPermission(true);
    const granted = await requestPermission();
    setIsRequestingPermission(false);
    
    if (granted) {
      localStorage.setItem(PERMISSION_KEY, 'granted');
      setScreen('dashboard');
      toast.success('Microphone access granted!');
    } else {
      toast.error('Microphone access is required to track sleep noise');
    }
  }, [requestPermission]);

  const handleStartTracking = useCallback(async () => {
    startSession();
    await startRecording();
    setScreen('tracking');
    toast.success('Sleep tracking started');
  }, [startSession, startRecording]);

  const handleStopTracking = useCallback(() => {
    const readings = stopRecording();
    const stats = calculateStats(readings);
    const session = endSession(readings, stats);
    
    if (session) {
      setCompletedSession(session);
      setScreen('summary');
      toast.success('Sleep tracking completed!');
    }
  }, [stopRecording, calculateStats, endSession]);

  const handleViewHistory = useCallback(() => {
    setScreen('history');
  }, []);

  const handleSelectSession = useCallback((session: SleepSession) => {
    setSelectedSession(session);
    setScreen('detail');
  }, []);

  const handleDeleteSession = useCallback((id: string) => {
    deleteSession(id);
    toast.success('Session deleted');
  }, [deleteSession]);

  const handleBackToDashboard = useCallback(() => {
    setScreen('dashboard');
    setCompletedSession(null);
    setSelectedSession(null);
  }, []);

  const handleViewDetails = useCallback(() => {
    if (completedSession) {
      setSelectedSession(completedSession);
      setScreen('detail');
    }
  }, [completedSession]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-background">
      {screen === 'onboarding' && (
        <OnboardingScreen
          onRequestPermission={handleRequestPermission}
          isLoading={isRequestingPermission}
        />
      )}
      
      {screen === 'dashboard' && (
        <DashboardScreen
          lastSession={getLastSession()}
          onStartTracking={handleStartTracking}
          onViewHistory={handleViewHistory}
        />
      )}
      
      {screen === 'tracking' && currentSession && (
        <TrackingScreen
          startTime={currentSession.startTime}
          currentDecibel={currentDecibel}
          onStopTracking={handleStopTracking}
        />
      )}
      
      {screen === 'summary' && completedSession && (
        <SummaryScreen
          session={completedSession}
          onGoHome={handleBackToDashboard}
          onViewDetails={handleViewDetails}
        />
      )}
      
      {screen === 'history' && (
        <HistoryScreen
          sessions={sessions}
          onBack={handleBackToDashboard}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
        />
      )}
      
      {screen === 'detail' && selectedSession && (
        <DetailScreen
          session={selectedSession}
          onBack={() => {
            if (completedSession) {
              setScreen('summary');
            } else {
              setScreen('history');
            }
          }}
        />
      )}
    </main>
  );
}
