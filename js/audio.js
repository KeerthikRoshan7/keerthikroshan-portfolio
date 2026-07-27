/* ==========================================================================
   KEERTHIK ROSHAN G. | WEB AUDIO SYNTH & SPECTRUM VISUALIZER ENGINE
   Sound Design Persona: Rozn Music (@roznmusic)
   ========================================================================== */

class RoznAudioEngine {
    constructor() {
        this.ctx = null;
        this.analyser = null;
        this.canvas = document.getElementById('spectrum-canvas');
        this.canvasCtx = this.canvas ? this.canvas.getContext('2d') : null;
        this.isPlaying = false;
        this.activeNodes = [];

        this.freqData = new Uint8Array(32);

        this.initCanvas();
    }

    initCtx() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();

            this.analyser = this.ctx.createAnalyser();
            this.analyser.fftSize = 64;
            this.analyser.connect(this.ctx.destination);
            this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initCanvas() {
        if (!this.canvas) return;
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        requestAnimationFrame(() => this.drawSpectrum());
    }

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio || 600;
        this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio || 120;
    }

    playUiClick(freq = 800, type = 'sine') {
        try {
            this.initCtx();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(this.analyser);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
        } catch (e) {
            console.log('Audio init error:', e);
        }
    }

    playSynthPad(padIndex) {
        this.initCtx();
        const now = this.ctx.currentTime;
        const gain = this.ctx.createGain();
        gain.connect(this.analyser);

        const freqMap = [
            [55, 110, 165],     // Sub Bass 808 (A1)
            [440, 554.37, 659.25], // Cyber Chime (A4 Major)
            [880, 1318.51, 1760], // Glitch Arp (A5)
            [220, 277.18, 329.63] // Ambient Vocal Drone (A3)
        ];

        const frequencies = freqMap[padIndex] || [440];

        frequencies.forEach(f => {
            const osc = this.ctx.createOscillator();
            osc.type = padIndex === 0 ? 'triangle' : padIndex === 2 ? 'sawtooth' : 'sine';
            osc.frequency.setValueAtTime(f, now);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            osc.connect(gain);
            osc.start(now);
            osc.stop(now + 1.2);
        });

        // Simulating spectrum activity for visual feedback
        for (let i = 0; i < this.freqData.length; i++) {
            this.freqData[i] = Math.floor(Math.random() * 200 + 55);
        }
    }

    drawSpectrum() {
        if (!this.canvasCtx || !this.canvas) return;
        const ctx = this.canvasCtx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.clearRect(0, 0, width, height);

        if (this.analyser) {
            this.analyser.getByteFrequencyData(this.freqData);
        }

        const barCount = 32;
        const barWidth = width / barCount - 4;

        for (let i = 0; i < barCount; i++) {
            // Decay frequency data naturally for smooth motion
            let value = this.freqData[i] || Math.sin(Date.now() * 0.003 + i * 0.2) * 20 + 25;
            const percent = value / 255;
            const barHeight = Math.max(6, percent * height * 0.85);

            const x = i * (barWidth + 4);
            const y = height - barHeight;

            // Gradient cyan to violet
            const gradient = ctx.createLinearGradient(0, height, 0, 0);
            gradient.addColorStop(0, '#00f3ff');
            gradient.addColorStop(0.6, '#8a2be2');
            gradient.addColorStop(1, '#ff0055');

            ctx.fillStyle = gradient;
            ctx.shadowColor = 'rgba(0, 243, 255, 0.4)';
            ctx.shadowBlur = 8;
            ctx.fillRect(x, y, barWidth, barHeight);
        }

        requestAnimationFrame(() => this.drawSpectrum());
    }
}

// Global audio engine instance
window.roznAudio = null;
document.addEventListener('DOMContentLoaded', () => {
    window.roznAudio = new RoznAudioEngine();
});
