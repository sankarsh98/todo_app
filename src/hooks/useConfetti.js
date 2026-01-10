// useConfetti Hook - Manages confetti celebrations
import { useState, useCallback } from 'react';

export const useConfetti = () => {
    const [trigger, setTrigger] = useState(0);
    const [intensity, setIntensity] = useState('medium');
    const [origin, setOrigin] = useState({ x: null, y: null });

    const fireConfetti = useCallback((options = {}) => {
        const {
            intensity: newIntensity = 'medium',
            x = null,
            y = null
        } = options;

        setIntensity(newIntensity);
        setOrigin({ x, y });
        setTrigger(prev => prev + 1);
    }, []);

    const fireSmall = useCallback((x, y) => {
        fireConfetti({ intensity: 'small', x, y });
    }, [fireConfetti]);

    const fireMedium = useCallback((x, y) => {
        fireConfetti({ intensity: 'medium', x, y });
    }, [fireConfetti]);

    const fireLarge = useCallback((x, y) => {
        fireConfetti({ intensity: 'large', x, y });
    }, [fireConfetti]);

    const fireEpic = useCallback(() => {
        fireConfetti({ intensity: 'epic' });
    }, [fireConfetti]);

    return {
        trigger,
        intensity,
        origin,
        fireConfetti,
        fireSmall,
        fireMedium,
        fireLarge,
        fireEpic
    };
};

export default useConfetti;
