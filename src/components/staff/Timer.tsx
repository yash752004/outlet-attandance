import React, { useState, useEffect } from 'react';
import { formatDuration, calculateWorkingDuration } from '../../utils/dateUtils';

interface TimerProps {
  punchInDate: string;
  punchInTime: string;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ punchInDate, punchInTime, isActive }) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setDuration(0);
      return;
    }

    // Initial calculation
    setDuration(calculateWorkingDuration(punchInDate, punchInTime));

    // Update every minute
    const interval = setInterval(() => {
      setDuration(calculateWorkingDuration(punchInDate, punchInTime));
    }, 60000);

    return () => clearInterval(interval);
  }, [punchInDate, punchInTime, isActive]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Working Duration</h3>
      <div className="text-4xl font-bold text-blue-600">
        {formatDuration(duration)}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Started at {punchInTime}
      </p>
    </div>
  );
};

export default Timer;
