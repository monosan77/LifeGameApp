import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const ConfettiComponent = () => {
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    const showConfettiTimer = setTimeout(() => {
      setIsConfettiVisible(true);
    }, 10000);

    const hideConfettiTimer = setTimeout(() => {
      setIsConfettiVisible(false);
    }, 50000);

    return () => {
      clearTimeout(showConfettiTimer);
      clearTimeout(hideConfettiTimer);
    };
  }, []);

  return (
    <div>
      {isConfettiVisible && (
        <Confetti width={dimensions.width} height={dimensions.height} />
      )}
    </div>
  );
};

export default ConfettiComponent;
