// /app/components/GetStartedButton.tsx
"use client"; 
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FC, ReactNode } from 'react';

interface ButtonProps {
  className?: string;
  children: ReactNode;
}

const GetStartedButton: FC<ButtonProps> = ({ className = "", children }) => {
  const router = useRouter();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    
    // Reset the click animation after a short delay
    setTimeout(() => {
      setIsClicked(false);
    }, 150);
    
    // Navigate to the signup page
    router.push('/signup');
  };

  return (
    <button 
      className={`
        ${className}
        transform transition-all duration-150 ease-in-out
        hover:scale-105 hover:shadow-lg
        active:scale-95 active:shadow-sm
        focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
        ${isClicked ? 'scale-95' : ''}
      `}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default GetStartedButton;