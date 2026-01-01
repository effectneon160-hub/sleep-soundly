import { motion } from 'framer-motion';
import { Mic, Shield, Moon, Battery } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingScreenProps {
  onRequestPermission: () => void;
  isLoading?: boolean;
}

export function OnboardingScreen({ onRequestPermission, isLoading }: OnboardingScreenProps) {
  const features = [
    {
      icon: <Mic className="w-5 h-5" />,
      title: 'Sound Monitoring',
      description: 'Measures ambient noise levels while you sleep'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Privacy First',
      description: 'No audio recordings saved - only decibel data'
    },
    {
      icon: <Moon className="w-5 h-5" />,
      title: 'Sleep-Friendly',
      description: 'Dark interface designed for nighttime use'
    },
    {
      icon: <Battery className="w-5 h-5" />,
      title: 'Battery Efficient',
      description: 'Optimized to run all night with minimal drain'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-6 rounded-3xl gradient-primary flex items-center justify-center shadow-glow"
          >
            <Moon className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Decibel
          </h1>
          <p className="text-lg text-muted-foreground">
            Sleep Logger
          </p>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4 mb-10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              className="glass-card p-4 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Permission Request */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-center"
        >
          <Button
            variant="glow"
            size="xl"
            onClick={onRequestPermission}
            disabled={isLoading}
            className="w-full mb-4"
          >
            {isLoading ? 'Requesting...' : 'Enable Microphone'}
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Microphone access is required to measure ambient noise.
            <br />
            Your privacy is protected - we never record or store audio.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
