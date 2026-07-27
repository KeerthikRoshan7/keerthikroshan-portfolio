/* ==========================================================================
   KEERTHIK ROSHAN G. | CYBERSIGILISTIC CURSOR CANVAS ENGINE
   Procedural Gothic-Cyber Sigil Math & Particle Physics
   ========================================================================== */

class CybersigilEngine {
    constructor() {
        this.canvas = document.getElementById('sigil-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.prevTarget = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        this.rotation = 0;
        this.hoverScale = 1;
        this.targetHoverScale = 1;
        this.hoveredState = false;

        this.particles = [];
        this.maxParticles = 40;

        this.mode = 'sigil'; // 'sigil' | 'particles' | 'disabled'

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Attach hover listeners for interactive UI elements
        this.setupHoverListeners();

        // Start animation loop
        requestAnimationFrame((time) => this.render(time));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    onMouseMove(e) {
        this.target.x = e.clientX;
        this.target.y = e.clientY;

        // Emit particle dust on speed
        const dist = Math.hypot(this.target.x - this.prevTarget.x, this.target.y - this.prevTarget.y);
        if (dist > 3 && this.mode !== 'disabled') {
            this.emitParticle(this.target.x, this.target.y, dist);
        }

        this.prevTarget.x = this.target.x;
        this.prevTarget.y = this.target.y;
    }

    setupHoverListeners() {
        const interactiveElements = document.querySelectorAll('a, button, .cyber-card, .synth-pad, .contact-chip, .cyber-btn-icon');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.targetHoverScale = 1.6;
                this.hoveredState = true;
            });
            el.addEventListener('mouseleave', () => {
                this.targetHoverScale = 1;
                this.hoveredState = false;
            });
        });
    }

    emitParticle(x, y, speed) {
        if (this.particles.length >= this.maxParticles) return;
        const angle = Math.random() * Math.PI * 2;
        const pSpeed = Math.random() * 2 + 0.5;
        this.particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * pSpeed,
            vy: Math.sin(angle) * pSpeed,
            size: Math.random() * 2 + 1,
            alpha: 1,
            color: Math.random() > 0.5 ? '#00f3ff' : '#8a2be2',
            decay: Math.random() * 0.03 + 0.015
        });
    }

    drawCyberSigil(x, y, scale, rotationTime) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.rotation);
        ctx.scale(scale, scale);

        const cyan = '#00f3ff';
        const violet = '#8a2be2';
        const glowColor = this.hoveredState ? 'rgba(0, 243, 255, 0.8)' : 'rgba(138, 43, 226, 0.5)';

        ctx.shadowColor = glowColor;
        ctx.shadowBlur = this.hoveredState ? 20 : 10;

        // 1. Concentric Cyber Outer Ring
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.strokeStyle = cyan;
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 4]);
        ctx.stroke();

        // 2. Inner Reverse Ring
        ctx.save();
        ctx.rotate(-this.rotation * 2);
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.strokeStyle = violet;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.stroke();

        // 3. Gothic Cyber Star Spikes (8-pointed sigil star)
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const rOuter = i % 2 === 0 ? 32 : 14;
            const rInner = 8;
            const px = Math.cos(angle) * rOuter;
            const py = Math.sin(angle) * rOuter;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = cyan;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([]);
        ctx.stroke();

        // 4. Central Sigil Rune Core (Diamond Hexagon)
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(6, 0);
        ctx.lineTo(0, 8);
        ctx.lineTo(-6, 0);
        ctx.closePath();
        ctx.fillStyle = this.hoveredState ? '#00f3ff' : '#8a2be2';
        ctx.fill();

        ctx.restore();

        // 5. Crosshair Guides
        ctx.beginPath();
        ctx.moveTo(-4, 0); ctx.lineTo(4, 0);
        ctx.moveTo(0, -4); ctx.lineTo(0, 4);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 8;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    render(time) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Smooth Lerp physics for cursor
        this.mouse.x += (this.target.x - this.mouse.x) * 0.15;
        this.mouse.y += (this.target.y - this.mouse.y) * 0.15;

        this.hoverScale += (this.targetHoverScale - this.hoverScale) * 0.1;
        this.rotation += this.hoveredState ? 0.04 : 0.015;

        // Render Particles
        this.updateParticles();

        // Render Cybersigil Cursor
        if (this.mode === 'sigil') {
            this.drawCyberSigil(this.mouse.x, this.mouse.y, this.hoverScale, time);
        }

        requestAnimationFrame((t) => this.render(t));
    }

    toggleMode() {
        if (this.mode === 'sigil') {
            this.mode = 'particles';
        } else if (this.mode === 'particles') {
            this.mode = 'disabled';
        } else {
            this.mode = 'sigil';
        }
        return this.mode;
    }
}

// Global instance
window.cybersigil = null;
document.addEventListener('DOMContentLoaded', () => {
    window.cybersigil = new CybersigilEngine();
});
