/* ==========================================================================
   KEERTHIK ROSHAN G. | HYPER-INTERFACE ANIME.JS ENGINE
   Motion Orchestration: Timelines, Reticle Physics, Live Clock & Magnetic Pull
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initLiveClock();
    initHeroEntranceTimeline();
    initVectorReticle();
    initScrollStaggers();
    initMagneticHoverPhysics();
    initIndexTracker();
});

/* 1. LIVE TIME CLOCK (IST // CHENNAI, IN) */
function initLiveClock() {
    const clockEl = document.getElementById('live-time-clock');
    if (!clockEl) return;

    function updateClock() {
        const now = new Date();
        const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const timeStr = now.toLocaleTimeString('en-US', options);
        clockEl.textContent = `${timeStr} IST`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/* 2. ANIME.JS HERO TIMELINE */
function initHeroEntranceTimeline() {
    if (typeof anime === 'undefined') return;

    const timeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    });

    timeline
        .add({
            targets: '.hero-pill-badge',
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 800
        })
        .add({
            targets: '.hero-main-title',
            opacity: [0, 1],
            translateY: [35, 0],
            scale: [0.95, 1],
            duration: 1100,
            easing: 'spring(1, 80, 11, 0)'
        }, '-=600')
        .add({
            targets: '.hero-lead-text',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800
        }, '-=700')
        .add({
            targets: '.hero-cta-group',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800
        }, '-=600')
        .add({
            targets: '.profile-avatar-wrapper',
            opacity: [0, 1],
            scale: [0.8, 1],
            rotate: [-10, 0],
            duration: 1200,
            easing: 'spring(1, 70, 10, 0)'
        }, '-=900');
}

/* 3. VECTOR RETICLE CURSOR */
function initVectorReticle() {
    const reticle = document.getElementById('cursor-reticle');
    const svg = reticle ? reticle.querySelector('svg') : null;

    if (!reticle || typeof anime === 'undefined') return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        anime({
            targets: reticle,
            left: mouseX,
            top: mouseY,
            duration: 250,
            easing: 'easeOutQuad'
        });
    });

    if (svg) {
        anime({
            targets: svg,
            rotate: 360,
            duration: 12000,
            loop: true,
            easing: 'linear'
        });
    }

    const hoverTargets = document.querySelectorAll('a, button, .hyper-glass-card, .contact-pill-item');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            anime({
                targets: reticle,
                scale: 1.45,
                duration: 400,
                easing: 'easeOutElastic(1, .6)'
            });
            anime({
                targets: '#cursor-reticle .reticle-dot',
                fill: '#ffffff',
                duration: 300
            });
        });

        target.addEventListener('mouseleave', () => {
            anime({
                targets: reticle,
                scale: 1,
                duration: 400,
                easing: 'easeOutExpo'
            });
            anime({
                targets: '#cursor-reticle .reticle-dot',
                fill: '#00f0ff',
                duration: 300
            });
        });
    });
}

/* 4. SCROLL STAGGER OBSERVER */
function initScrollStaggers() {
    if (typeof anime === 'undefined') return;

    const panels = document.querySelectorAll('section.panel-section:not(#overview)');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');

                const tag = entry.target.querySelector('.section-meta-tag');
                const title = entry.target.querySelector('.section-main-title');
                const desc = entry.target.querySelector('.section-subtitle-text');
                const cards = entry.target.querySelectorAll('.hyper-glass-card');
                const pills = entry.target.querySelectorAll('.contact-pill-item');

                const timeline = anime.timeline({ easing: 'easeOutExpo' });

                if (tag) {
                    timeline.add({
                        targets: tag,
                        opacity: [0, 1],
                        translateX: [-20, 0],
                        duration: 600
                    });
                }

                if (title) {
                    timeline.add({
                        targets: title,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        duration: 800,
                        easing: 'spring(1, 80, 12, 0)'
                    }, '-=400');
                }

                if (desc) {
                    timeline.add({
                        targets: desc,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 600
                    }, '-=400');
                }

                if (cards.length > 0) {
                    timeline.add({
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
                    timeline.add({
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

    panels.forEach(p => observer.observe(p));
}

/* 5. MAGNETIC HOVER PHYSICS */
function initMagneticHoverPhysics() {
    if (typeof anime === 'undefined') return;

    const magnetics = document.querySelectorAll('.btn-hyper, .btn-hyper-outline, .hyper-glass-card');

    magnetics.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            anime({
                targets: el,
                translateX: x * 0.12,
                translateY: y * 0.12,
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

/* 6. LEFT INDEX TRACKER */
function initIndexTracker() {
    const panels = document.querySelectorAll('.panel-section');
    const trackerItems = document.querySelectorAll('.tracker-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                trackerItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                        if (typeof anime !== 'undefined') {
                            anime({
                                targets: item.querySelector('.tracker-bar'),
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

    panels.forEach(p => observer.observe(p));
}
