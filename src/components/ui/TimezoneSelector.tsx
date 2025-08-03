'use client';

import React, { useState, useEffect } from 'react';

interface TimezoneSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  id: string;
  className?: string;
}

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({ value, onChange, ...props }) => {
  const [timezones, setTimezones] = useState<string[]>([]);

  useEffect(() => {
    // Use the Intl API to get a list of supported timezones
    const supportedTimezones = Intl.supportedValuesOf('timeZone');
    setTimezones(supportedTimezones);
  }, []);

  return (
    <select value={value} onChange={onChange} {...props}>
      <option value="" disabled>Select a timezone</option>
      {timezones.map(tz => (
        <option key={tz} value={tz}>
          {tz.replace(/_/g, ' ')}
        </option>
      ))}
    </select>
  );
};

export default TimezoneSelector;
