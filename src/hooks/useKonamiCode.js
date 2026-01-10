import { useState, useEffect } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export const useKonamiCode = (callback) => {
  const [input, setInput] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const { key } = e;
      const newInput = [...input, key];

      // Keep only the last N keys where N is the length of the code
      if (newInput.length > KONAMI_CODE.length) {
        newInput.shift();
      }

      setInput(newInput);

      // Check if the input matches the code
      if (newInput.join(',') === KONAMI_CODE.join(',')) {
        callback();
        setInput([]); // Reset after success
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, callback]);
};
