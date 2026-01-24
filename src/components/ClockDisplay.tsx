import { useState, useEffect } from 'react';

interface ClockDisplayProps {
  showDate?: boolean;
  showSabbath?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ClockDisplay = ({ 
  showDate = true, 
  showSabbath = true,
  size = 'medium' 
}: ClockDisplayProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if it's Sabbath (Friday sunset to Saturday sunset - simplified: Friday 6pm to Saturday 6pm)
  const isSabbath = () => {
    const day = time.getDay();
    const hour = time.getHours();
    
    // Friday after 6pm
    if (day === 5 && hour >= 18) return true;
    // Saturday before 6pm
    if (day === 6 && hour < 18) return true;
    
    return false;
  };

  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  const dateSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className="text-right">
      <div className={`font-bold gold-text drop-shadow-text ${sizeClasses[size]}`}>
        {formatTime(time)}
      </div>
      {showDate && (
        <div className={`text-primary-foreground/90 drop-shadow-text ${dateSizeClasses[size]}`}>
          {formatDate(time)}
        </div>
      )}
      {showSabbath && isSabbath() && (
        <div className={`text-accent font-semibold mt-1 drop-shadow-text ${dateSizeClasses[size]}`}>
          Sabbath Day
        </div>
      )}
    </div>
  );
};