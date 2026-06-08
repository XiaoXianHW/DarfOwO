import { useState, useEffect } from 'react';

export const useHeartRate = (isActive: boolean) => {
  const [heartRate, setHeartRate] = useState(72);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setHeartRate(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        const newRate = prev + change;
        return Math.min(Math.max(newRate, 60), 100);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isActive]);

  return heartRate;
};
