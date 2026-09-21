import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    // Current time or classic iOS 9:41
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-11 px-7 flex items-center justify-between text-white text-[14px] font-semibold tracking-tight select-none z-40 relative">
      {/* Time */}
      <span className="w-12 text-left font-medium">{timeStr}</span>

      {/* Dynamic Island Pill with Camera & Sensor */}
      <div className="relative w-[114px] h-[28px] bg-black rounded-full flex items-center justify-end pr-2.5 shadow-sm border border-neutral-900/60">
        {/* Subtle camera lens reflection */}
        <div className="w-2.5 h-2.5 rounded-full bg-[#0a0f1d] border border-neutral-800/80 mr-1 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-blue-950/80" />
        </div>
        {/* Sensor dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-900/90" />
      </div>

      {/* Status Icons: Cellular, Wifi, Battery */}
      <div className="w-16 flex items-center justify-end gap-1.5">
        {/* Signal Bars */}
        <div className="flex items-end gap-[1.5px] h-3">
          <span className="w-[3px] h-1.5 bg-white rounded-xs" />
          <span className="w-[3px] h-2 bg-white rounded-xs" />
          <span className="w-[3px] h-2.5 bg-white rounded-xs" />
          <span className="w-[3px] h-3 bg-white rounded-xs" />
        </div>

        {/* Wifi */}
        <Wifi className="w-3.5 h-3.5 text-white stroke-[2.5]" />

        {/* Battery with level */}
        <div className="relative w-[21px] h-[10.5px] rounded-[3.5px] border border-white/80 p-[1.5px] flex items-center">
          <div className="h-full w-full bg-white rounded-[1.5px]" />
          <div className="absolute -right-[3px] top-[2.5px] w-[1.5px] h-[4.5px] bg-white/80 rounded-r-xs" />
        </div>
      </div>
    </div>
  );
};
