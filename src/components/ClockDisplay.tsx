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
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Check if it's Sabbath (Saturday only - the 7th day)
  const isSabbath = () => {
    const day = time.getDay();
    // Saturday is day 6 (0=Sunday, 6=Saturday)
    return day === 6;
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