import { useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

export const useSound = () => {
    const { soundEnabled } = useTheme();

    const playTone = useCallback((frequency, type, duration, volume = 0.1) => {
        if (!soundEnabled) return;
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    }, [soundEnabled]);

    const playSuccess = useCallback(() => {
        if (!soundEnabled) return;
        // C5 - E5 - G5 (Major Triad)
        setTimeout(() => playTone(523.25, 'sine', 0.1, 0.1), 0);
        setTimeout(() => playTone(659.25, 'sine', 0.1, 0.1), 100);
        setTimeout(() => playTone(783.99, 'sine', 0.3, 0.1), 200);
    }, [playTone, soundEnabled]);

    const playClick = useCallback(() => {
        if (!soundEnabled) return;
        // Short high blip
        playTone(800, 'sine', 0.05, 0.05);
    }, [playTone, soundEnabled]);

    const playRemove = useCallback(() => {
        if (!soundEnabled) return;
        // Descending
        setTimeout(() => playTone(400, 'square', 0.1, 0.05), 0);
        setTimeout(() => playTone(300, 'square', 0.2, 0.05), 100);
    }, [playTone, soundEnabled]);

    const playThemeSwitch = useCallback(() => {
        if (!soundEnabled) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }, [soundEnabled]);

    return {
        playSuccess,
        playClick,
        playRemove,
        playThemeSwitch
    };
};

export default useSound;
