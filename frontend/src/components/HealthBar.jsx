import {useEffect, useRef} from "react";
import {refreshAnimation} from "../utils/AnimationUtils.jsx";

const animateHealthChange = (elementId, amount, tickRate) => {
  if (amount <= 0) {
    return;
  }

  const element = document.getElementById(elementId);
  if (!element) {
    return;
  }

  element.classList.add('health-change-show');
  element.style.setProperty('--move-amount', `${0.5 + 0.2 * amount.toFixed(3)}rem`);
  element.style.setProperty('--scale-amount', `${0.9 + amount / 5}`);
  element.style.setProperty('--repeat-speed', `${Math.round(0.9 * tickRate)}ms`);
  refreshAnimation(elementId);
};

export const HealthBar = ({ health, maxHealth, healthIncrease, healthDecrease, shuffleHealthDecrease, decrement, tickRate }) => {
  const previousDecrement = useRef(decrement);

  useEffect(() => {
    animateHealthChange('health-increase', healthIncrease, tickRate);
  }, [healthIncrease, tickRate]);

  useEffect(() => {
    animateHealthChange('health-decrease', healthDecrease, tickRate);
  }, [healthDecrease, tickRate]);

  useEffect(() => {
    animateHealthChange('shuffle-health-decrease', shuffleHealthDecrease, tickRate);
  }, [shuffleHealthDecrease, tickRate]);

  useEffect(() => {
    const el = document.getElementById("decrement-display");
    const hasDecreased = decrement < previousDecrement.current;

    if (el && hasDecreased) {
      el.style.setProperty('--flash-start', "#16a34a");
      el.style.setProperty('--flash-end', "#dc2626");
      el.classList.add('flash-text');
      refreshAnimation('decrement-display');
    }

    previousDecrement.current = decrement;
  }, [decrement]);
    

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="relative w-60 h-2.5 bg-red-600">
        <span 
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-sm"
          style={{color: "#dc2626"}}
          id="decrement-display"
        >
          -{decrement.toFixed(2)}/s
        </span>
        <div
          className="h-full bg-green-600 transition-[width] 1s ease-in-out"
          style={{ width: `${100 * (health / maxHealth)}%` }}
        />
      </div>
      <div className="relative flex text-center">
        {health.toFixed(1)}
        <div
          className="absolute font-bold opacity-0 inset-y-0 left-[110%]"
          style={{color: "#16a34a"}}
          id="health-increase"
        >
          +{healthIncrease.toFixed(1)}
        </div>
        <div
          className="absolute font-bold opacity-0 inset-y-0 left-[110%]"
          style={{color: "#dc2626"}}
          id="health-decrease"
        >
          -{healthDecrease.toFixed(1)}
        </div>
        <div
          className="absolute font-bold opacity-0 inset-y-0 left-[110%]"
          style={{color: "#dc2626"}}
          id="shuffle-health-decrease"
        >
          -{shuffleHealthDecrease.toFixed(1)}
        </div>
      </div>
      
    </div>
  );
};