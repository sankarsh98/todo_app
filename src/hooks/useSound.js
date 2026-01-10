import { useCallback, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

// Singleton AudioContext to avoid creating too many contexts
let audioContext = null;

export const useSound = () => {
    const { soundEnabled } = useTheme();
    const contextRef = useRef(null);

    // Initialize/Unlock AudioContext on user interaction
    useEffect(() => {
        const initAudio = () => {
            if (!audioContext) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    audioContext = new AudioContext();
                }
            }

            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            contextRef.current = audioContext;
        };

        const handleInteraction = () => {
            initAudio();
            // Remove listeners once initialized
            if (audioContext && audioContext.state === 'running') {
                window.removeEventListener('click', handleInteraction);
                window.removeEventListener('keydown', handleInteraction);
                window.removeEventListener('touchstart', handleInteraction);
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };
    }, []);

    const playTone = useCallback((frequency, type, duration, volume = 0.1) => {
        if (!soundEnabled) return;

        // Ensure context exists
        if (!audioContext) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioContext = new AudioContext();
            } else {
                return;
            }
        }

        const ctx = audioContext;

        // If suspended, try to resume (though usually needs user gesture)
        if (ctx.state === 'suspended') {
            ctx.resume().catch(e => console.warn('AudioContext resume failed:', e));
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration + 0.1); // Small buffer for decay

        // Clean up
        setTimeout(() => {
            osc.disconnect();
            gain.disconnect();
        }, (duration + 0.1) * 1000);
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

        // Safety check for context
        if (!audioContext) return;
        const ctx = audioContext;

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

    // 🎹 BEETHOVEN MODE - Epic celebration sounds
    const playFanfare = useCallback(() => {
        if (!soundEnabled) return;
        // Triumphant ascending fanfare (C4 - E4 - G4 - C5)
        setTimeout(() => playTone(261.63, 'triangle', 0.15, 0.12), 0);
        setTimeout(() => playTone(329.63, 'triangle', 0.15, 0.12), 150);
        setTimeout(() => playTone(392.00, 'triangle', 0.15, 0.12), 300);
        setTimeout(() => playTone(523.25, 'triangle', 0.4, 0.15), 450);
    }, [playTone, soundEnabled]);

    const playLevelUp = useCallback(() => {
        if (!soundEnabled) return;
        // Epic ascending arpeggio with harmonic overtones
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
        notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 'sine', 0.2, 0.08), i * 80);
            setTimeout(() => playTone(freq * 1.5, 'sine', 0.15, 0.04), i * 80 + 40);
        });
        // Final chord
        setTimeout(() => {
            playTone(523.25, 'sine', 0.5, 0.1);
            playTone(659.25, 'sine', 0.5, 0.08);
            playTone(783.99, 'sine', 0.5, 0.08);
        }, 550);
    }, [playTone, soundEnabled]);

    const playEpicWin = useCallback(() => {
        if (!soundEnabled) return;
        // Full orchestral-style celebration
        // Bass foundation
        setTimeout(() => playTone(130.81, 'triangle', 0.8, 0.15), 0);
        // Harmony build
        setTimeout(() => playTone(164.81, 'sine', 0.6, 0.1), 100);
        setTimeout(() => playTone(196.00, 'sine', 0.6, 0.1), 200);
        setTimeout(() => playTone(261.63, 'sine', 0.6, 0.12), 300);
        // Melodic climax
        setTimeout(() => playTone(329.63, 'triangle', 0.3, 0.12), 400);
        setTimeout(() => playTone(392.00, 'triangle', 0.3, 0.12), 500);
        setTimeout(() => playTone(523.25, 'triangle', 0.5, 0.15), 600);
        // Final triumphant chord
        setTimeout(() => {
            playTone(523.25, 'sine', 0.8, 0.12);
            playTone(659.25, 'sine', 0.8, 0.1);
            playTone(783.99, 'sine', 0.8, 0.1);
            playTone(1046.50, 'sine', 0.8, 0.08);
        }, 750);
    }, [playTone, soundEnabled]);

    const playStreak = useCallback(() => {
        if (!soundEnabled) return;
        // Quick ascending sparkle
        const sparkle = [880, 988, 1108, 1318, 1568];
        sparkle.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 'sine', 0.1, 0.06), i * 50);
        });
    }, [playTone, soundEnabled]);

    const playPianoNote = useCallback((noteIndex) => {
        if (!soundEnabled) return;
        // Piano scale from C4
        const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
        const freq = frequencies[noteIndex % frequencies.length];
        playTone(freq, 'sine', 0.3, 0.1);
    }, [playTone, soundEnabled]);

    const playPacmanChomp = useCallback(() => {
        if (!soundEnabled) return;
        // Waka waka!
        playTone(400, 'square', 0.08, 0.06);
        setTimeout(() => playTone(300, 'square', 0.08, 0.06), 100);
    }, [playTone, soundEnabled]);

    const playPikachuCry = useCallback(() => {
        if (!soundEnabled) return;
        // Ascending chirp like "Pika!"
        setTimeout(() => playTone(800, 'sine', 0.1, 0.08), 0);
        setTimeout(() => playTone(1000, 'sine', 0.15, 0.1), 100);
        setTimeout(() => playTone(1200, 'sine', 0.2, 0.08), 200);
    }, [playTone, soundEnabled]);

    const playRalphGiggle = useCallback(() => {
        if (!soundEnabled) return;
        // Silly wobbling sound
        setTimeout(() => playTone(350, 'triangle', 0.1, 0.08), 0);
        setTimeout(() => playTone(400, 'triangle', 0.1, 0.08), 100);
        setTimeout(() => playTone(350, 'triangle', 0.1, 0.08), 200);
        setTimeout(() => playTone(450, 'triangle', 0.15, 0.1), 300);
    }, [playTone, soundEnabled]);

    const playDiscoBeep = useCallback(() => {
        if (!soundEnabled) return;
        // Quick disco beat
        playTone(220, 'square', 0.1, 0.05);
        setTimeout(() => playTone(440, 'square', 0.05, 0.05), 150);
    }, [playTone, soundEnabled]);

    return {
        playSuccess,
        playClick,
        playRemove,
        playThemeSwitch,
        // Beethoven Mode sounds
        playFanfare,
        playLevelUp,
        playEpicWin,
        playStreak,
        playPianoNote,
        // Theme-specific sounds
        playPacmanChomp,
        playPikachuCry,
        playRalphGiggle,
        playDiscoBeep
    };
};

export default useSound;
