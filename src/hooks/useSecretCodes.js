// useSecretCodes Hook - Detects secret keyboard sequences
import { useState, useEffect, useCallback } from 'react';

const SECRET_CODES = {
    beethoven: ['b', 'e', 'e', 't', 'h', 'o', 'v', 'e', 'n'],
    ralphwiggum: ['r', 'a', 'l', 'p', 'h'],
    pikachu: ['p', 'i', 'k', 'a'],
    waka: ['w', 'a', 'k', 'a'],
    apollo: ['a', 'p', 'o', 'l', 'l', 'o'],
    disco: ['d', 'i', 's', 'c', 'o'],
    party: ['p', 'a', 'r', 't', 'y'],
};

export const useSecretCodes = () => {
    const [input, setInput] = useState([]);
    const [activeMode, setActiveMode] = useState(null);
    const [modeTimeout, setModeTimeout] = useState(null);

    const activateMode = useCallback((mode, duration = 30000) => {
        setActiveMode(mode);

        // Clear previous timeout
        if (modeTimeout) {
            clearTimeout(modeTimeout);
        }

        // Auto-deactivate after duration
        const timeout = setTimeout(() => {
            setActiveMode(null);
        }, duration);

        setModeTimeout(timeout);
    }, [modeTimeout]);

    const deactivateMode = useCallback(() => {
        if (modeTimeout) {
            clearTimeout(modeTimeout);
        }
        setActiveMode(null);
    }, [modeTimeout]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            const { key } = e;
            if (key.length !== 1) return; // Only single characters

            const newInput = [...input, key.toLowerCase()].slice(-12); // Keep last 12 chars
            setInput(newInput);

            // Check each secret code
            for (const [name, code] of Object.entries(SECRET_CODES)) {
                const inputEnd = newInput.slice(-code.length);
                if (inputEnd.join('') === code.join('')) {
                    activateMode(name);
                    setInput([]);
                    break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (modeTimeout) {
                clearTimeout(modeTimeout);
            }
        };
    }, [input, activateMode, modeTimeout]);

    return {
        activeMode,
        activateMode,
        deactivateMode,
        isPianoMode: activeMode === 'beethoven',
        isDiscoMode: activeMode === 'disco' || activeMode === 'party',
        isRalphMode: activeMode === 'ralphwiggum',
        isPikachuMode: activeMode === 'pikachu',
        isPacmanMode: activeMode === 'waka',
        isApolloMode: activeMode === 'apollo',
    };
};

export default useSecretCodes;
