import { useEffect, useState } from "react";

const CountdownTimer = ({ targetDate }) => {
  const festivalDate = new Date(targetDate || "2026-03-15T00:00:00").getTime();

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = festivalDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center gap-4 md:gap-8 my-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="text-4xl md:text-6xl font-bold text-primary mb-2">
            {value}
          </div>
          <div className="text-sm md:text-base text-gray-600 uppercase">
            {unit}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
