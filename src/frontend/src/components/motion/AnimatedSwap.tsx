import { ReactNode, useEffect, useState } from 'react';

interface AnimatedSwapProps {
  children: ReactNode;
  swapKey: string | number;
  className?: string;
}

export default function AnimatedSwap({ children, swapKey, className = '' }: AnimatedSwapProps) {
  const [displayContent, setDisplayContent] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setDisplayContent(children);
      setIsAnimating(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [swapKey, children]);

  return (
    <div
      className={`transition-opacity duration-150 ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      } ${className}`}
    >
      {displayContent}
    </div>
  );
}
