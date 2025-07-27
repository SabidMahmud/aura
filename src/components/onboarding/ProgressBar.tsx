'use client';

import { useSearchParams } from 'next/navigation';

export default function ProgressBar() {
  const searchParams = useSearchParams();
  const step = searchParams.get('step') || '1';

  const progress = step === '1' ? '50%' : '100%';

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: progress }}
      ></div>
    </div>
  );
}
