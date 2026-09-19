/* eslint-disable react/prop-types */
import {useEffect, useRef, useState} from 'react';

export const Achievements = ({achievements, showAchievements}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeout = useRef(null);
  const unlockedCount = achievements.filter(({unlocked}) => unlocked).length;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(closeTimeout.current);
    };
  }, []);

  const closeAchievements = () => {
    if (isClosing) {
      return;
    }

    setIsClosing(true);
    setIsVisible(false);
    closeTimeout.current = setTimeout(() => showAchievements(false), 250);
  };

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-end justify-center bg-black bg-opacity-50 transition-[opacity] duration-[250ms] ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={closeAchievements}
    >
      <div
        className={`achievement-panel relative max-h-[80vh] w-full max-w-[64rem] overflow-y-auto border-l border-r border-t p-5 text-center transition-[transform] duration-[250ms] ease-in-out ${isVisible && !isClosing ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 border-0 bg-transparent p-1 text-gray-600 hover:border-transparent"
          onClick={closeAchievements}
          aria-label="Close achievements"
        >
          ✕
        </button>

        <h2 className="text-[2rem] font-semibold">ACHIEVEMENTS</h2>
        <p className="mt-1 text-gray-400">{unlockedCount} of {achievements.length} unlocked</p>

        <div className="mt-5 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
          {achievements.map(({id, title, description, unlocked}) => (
            <div
              key={id}
              className={`achievement-row border p-3 ${unlocked ? 'achievement-unlocked' : 'achievement-locked'}`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-semibold">{title}</h3>
                <span className="text-sm" aria-label={unlocked ? 'Unlocked' : 'Locked'}>
                  {unlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
