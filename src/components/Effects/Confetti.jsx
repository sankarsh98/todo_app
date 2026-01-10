// Confetti Celebration Component - Canvas-based particle system
import { useEffect, useRef, useCallback } from 'react';
import './Confetti.css';

const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8B500', '#FF69B4', '#00CED1', '#FF4500', '#32CD32'
];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 10 + 5;
        this.speedX = (Math.random() - 0.5) * 15;
        this.speedY = Math.random() * -15 - 5;
        this.gravity = 0.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.opacity = 1;
        this.decay = Math.random() * 0.02 + 0.005;
        this.shape = Math.floor(Math.random() * 3); // 0: square, 1: circle, 2: star
    }

    update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.opacity -= this.decay;
        this.speedX *= 0.99;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        if (this.shape === 0) {
            // Square
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else if (this.shape === 1) {
            // Circle
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Star
            this.drawStar(ctx, 0, 0, 5, this.size / 2, this.size / 4);
        }

        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }

        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }
}

const Confetti = ({ trigger, intensity = 'medium', originX, originY }) => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationRef = useRef(null);

    const getParticleCount = useCallback(() => {
        switch (intensity) {
            case 'small': return 30;
            case 'medium': return 60;
            case 'large': return 100;
            case 'epic': return 200;
            default: return 60;
        }
    }, [intensity]);

    const createParticles = useCallback((x, y) => {
        const count = getParticleCount();
        const newParticles = [];

        for (let i = 0; i < count; i++) {
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            newParticles.push(new Particle(x, y, color));
        }

        particlesRef.current = [...particlesRef.current, ...newParticles];
    }, [getParticleCount]);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current = particlesRef.current.filter(p => p.opacity > 0);

        particlesRef.current.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        if (particlesRef.current.length > 0) {
            animationRef.current = requestAnimationFrame(animate);
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (trigger > 0) {
            const x = originX ?? window.innerWidth / 2;
            const y = originY ?? window.innerHeight / 3;
            createParticles(x, y);

            if (!animationRef.current) {
                animate();
            }
        }
    }, [trigger, originX, originY, createParticles, animate]);

    return (
        <canvas
            ref={canvasRef}
            className="confetti-canvas"
        />
    );
};

export default Confetti;
