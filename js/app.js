/* ==========================================================================
   KEERTHIK ROSHAN G. | ANIME.JS MOTION ENGINE INFRASTRUCTURE
   Spring Physics, Timeline Orchestration, Staggered Reveals & Vector Cursor
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeroTimeline();
    initVectorCursorEngine();
    initScrollStaggerAnimations();
    initMagneticHoverPhysics();
    initSmartScrollTracker();
});

/* 1. ANIME.JS HERO ENTRANCE TIMELINE */
function initHeroTimeline() {
    if (typeof anime === 'undefined') return;

    const timeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    });

    timeline
        .add({
            targets: '.academic-badge',
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 800
        })
        .add({
            targets: '.hero-title',
            opacity: [0, 1],
            translateY: [30, 0],
            scale: [0.96, 1],
            duration: 1000,
            easing: 'spring(1, 80, 12, 0)'
        }, '-=600')
        .add({
            targets: '.hero-desc',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800
        }, '-=600')
        .add({
            targets: '.hero-actions',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800
        }, '-=600')
        .add({
            targets: '.profile-liquid-frame',
            opacity: [0, 1],
            scale: [0.8, 1],
            rotate: [-10, 0],
            duration: 1200,
            easing: 'spring(1, 70, 10, 0)'
        }, '-=900')
        .add({
            targets: '.stat-card',
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(120),
            duration: 800
        }, '-=800');
}

/* 2. ANIME.JS VECTOR CURSOR & RETICLE ENGINE */
function initVectorCursorEngine() {
    const cursor = document.getElementById('vector-cursor');
    const svgReticle = cursor ? cursor.querySelector('svg') : null;

    if (!cursor || typeof anime === 'undefined') return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Smooth Anime.js translation for cursor position
        anime({
            targets: cursor,
            left: mouseX,
            top: mouseY,
            duration: 250,
            easing: 'easeOutQuad'
        });
    });

    // Continuous smooth rotation for the reticle ring
    if (svgReticle) {
        anime({
            targets: svgReticle,
            rotate: 360,
            duration: 12000,
            loop: true,
            easing: 'linear'
        });
    }

    // Hover Amplification using Anime.js
    const hoverElements = document.querySelectorAll('a, button, .liquid-glass-card, .contact-pill');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            anime({
                targets: cursor,
                scale: 1.4,
                duration: 400,
                easing: 'easeOutElastic(1, .6)'
            });
            anime({
                targets: '#vector-cursor .cursor-dot',
                fill: '#ffffff',
                duration: 300
            });
        });

        el.addEventListener('mouseleave', () => {
            anime({
                targets: cursor,
                scale: 1,
                duration: 400,
                easing: 'easeOutExpo'
            });
            anime({
                targets: '#vector-cursor .cursor-dot',
                fill: '#00f3ff',
                duration: 300
            });
        });
    });
}

/* 3. SCROLL OBSERVER & ANIME.JS STAGGERED REVEALS */
function initScrollStaggerAnimations() {
    if (typeof anime === 'undefined') return;

    const sections = document.querySelectorAll('section.smart-panel:not(#hero)');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');

                const tag = entry.target.querySelector('.section-tag');
                const title = entry.target.querySelector('.section-title');
                const desc = entry.target.querySelector('.section-desc');
                const cards = entry.target.querySelectorAll('.liquid-glass-card');
                const pills = entry.target.querySelectorAll('.contact-pill');

                const panelTimeline = anime.timeline({
                    easing: 'easeOutExpo'
                });

                if (tag) {
                    panelTimeline.add({
                        targets: tag,
                        opacity: [0, 1],
                        translateX: [-20, 0],
                        duration: 600
                    });
                }

                if (title) {
                    panelTimeline.add({
                        targets: title,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        duration: 800,
                        easing: 'spring(1, 80, 12, 0)'
                    }, '-=400');
                }

                if (desc) {
                    panelTimeline.add({
                        targets: desc,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 600
                    }, '-=400');
                }

                if (cards.length > 0) {
                    panelTimeline.add({
                        targets: cards,
                        opacity: [0, 1],
                        translateY: [40, 0],
                        scale: [0.95, 1],
                        delay: anime.stagger(150),
                        duration: 900,
                        easing: 'spring(1, 80, 10, 0)'
                    }, '-=300');
                }

                if (pills.length > 0) {
                    panelTimeline.add({
                        targets: pills,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        scale: [0.9, 1],
                        delay: anime.stagger(100),
                        duration: 700,
                        easing: 'spring(1, 80, 10, 0)'
                    }, '-=300');
                }
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(s => observer.observe(s));
}

/* 4. MAGNETIC HOVER PHYSICS VIA ANIME.JS */
function initMagneticHoverPhysics() {
    if (typeof anime === 'undefined') return;

    const magneticElements = document.querySelectorAll('.btn-liquid, .btn-liquid-secondary, .liquid-glass-card');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            anime({
                targets: el,
                translateX: x * 0.15,
                translateY: y * 0.15,
                duration: 400,
                easing: 'easeOutQuad'
            });
        });

        el.addEventListener('mouseleave', () => {
            anime({
                targets: el,
                translateX: 0,
                translateY: 0,
                duration: 600,
                easing: 'spring(1, 80, 10, 0)'
            });
        });
    });
}

/* 5. SMART SCROLL TRACKER INDEX HIGHLIGHTING */
function initSmartScrollTracker() {
    const panels = document.querySelectorAll('.smart-panel');
    const trackerNodes = document.querySelectorAll('.tracker-node');

    const trackerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const panelId = entry.target.getAttribute('id');
                trackerNodes.forEach(node => {
                    node.classList.remove('active');
                    if (node.getAttribute('href') === `#${panelId}`) {
                        node.classList.add('active');
                        if (typeof anime !== 'undefined') {
                            anime({
                                targets: node.querySelector('.tracker-line'),
                                width: [16, 34],
                                duration: 400,
                                easing: 'easeOutExpo'
                            });
                        }
                    }
                });
            }
        });
    }, { threshold: 0.35 });

    panels.forEach(panel => trackerObserver.observe(panel));
}
