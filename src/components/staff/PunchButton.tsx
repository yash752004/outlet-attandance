import React, { useState, useEffect } from 'react';
import { checkWiFiConnection } from '../../utils/wifiCheck';
import { getCurrentDate, getCurrentTime } from '../../utils/dateUtils';

interface PunchButtonProps {
  type: 'in' | 'out';
  staffName: string;
  onPunch: (type: 'in' | 'out', date: string, time: string) => Promise<void>;
  disabled?: boolean;
  isPunchedIn?: boolean;
}

const PunchButton: React.FC<PunchButtonProps> = ({
  type,
  onPunch,
  disabled = false,
  isPunchedIn = false,
}) => {
  const [isWiFiConnected, setIsWiFiConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkWiFi();
    const interval = setInterval(checkWiFi, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkWiFi = async () => {
    setIsChecking(true);
    const connected = await checkWiFiConnection();
    setIsWiFiConnected(connected);
    setIsChecking(false);
  };

  const handlePunch = async () => {
    if (!isWiFiConnected) {
      alert('Please connect to UltraDenim_Office Wi-Fi to punch ' + type);
      return;
    }

    setIsLoading(true);
    try {
      const date = getCurrentDate();
      const time = getCurrentTime();
      await onPunch(type, date, time);
    } catch (error) {
      console.error('Punch failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = disabled || isLoading || !isWiFiConnected || isChecking ||
    (type === 'in' && isPunchedIn) || (type === 'out' && !isPunchedIn);

  const buttonColor = type === 'in' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  const disabledColor = 'bg-gray-300 cursor-not-allowed';

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handlePunch}
        disabled={isDisabled}
        className={`${isDisabled ? disabledColor : buttonColor} text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 disabled:transform-none shadow-lg min-w-[200px]`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </span>
        ) : (
          <span className="text-xl">
            {type === 'in' ? '🚪 Punch In' : '🏠 Punch Out'}
          </span>
        )}
      </button>
      
      {!isChecking && (
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-3 h-3 rounded-full ${isWiFiConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={isWiFiConnected ? 'text-green-600' : 'text-red-600'}>
            {isWiFiConnected ? 'Wi-Fi Connected' : 'Wi-Fi Not Connected'}
          </span>
        </div>
      )}
      
      {isChecking && (
        <span className="text-sm text-gray-500">Checking network...</span>
      )}
    </div>
  );
};

export default PunchButton;
