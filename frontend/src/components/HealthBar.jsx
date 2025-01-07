import React, {useEffect} from "react";
import {refreshAnimation} from "../utils/AnimationUtils.jsx";

export const HealthBar = ({ health, maxHealth, healthChange, tickRate }) => {

  const el = document.getElementById("health-change");

  useEffect(() => {
    if (el) {
      if (!el.classList.contains("health-change-show")) {
        el.classList.add('health-change-show');
      }
      el.style.setProperty('--move-amount', `${0.5 + 0.2 * Math.abs(healthChange).toFixed(3)}rem`);
      el.style.setProperty('--scale-amount', `${0.9 + Math.abs(healthChange) / 5}`);
      el.style.setProperty('--repeat-speed', `${Math.round(0.9 * tickRate)}ms`);
      refreshAnimation("health-change");
    }
  }, [healthChange]);

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="relative w-60 h-2.5 bg-red-600">
        <div
          className="h-full bg-green-600 transition-[width] 1s ease-in-out"
          style={{ width: `${100 * (health / maxHealth)}%` }}
        />
      </div>
      <div className="relative flex text-center">
        {health.toFixed(1)}
        <div
          className="absolute font-bold opacity-0 inset-y-0 left-[110%]"
          style={{
            color: healthChange < 0 ? "#dc2626" : "#16a34a",
          }}
          id="health-change"
        >
          {((healthChange > 0) ? '+' : '') + healthChange.toFixed(1)}
        </div>
      </div>
    </div>
  );
};