/* ==========================================================================
   KEERTHIK ROSHAN G. | FRAMER AGENCIY TEMPLATE ENGINE
   Cursor Physics & Scroll Reveals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCursorEngine();
    initScrollObserver();
});

/* 1. CURSOR ENGINE */
function initCursorEngine() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    function renderRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    const hoverables = document.querySelectorAll('a, button, .bento-card, .contact-pill');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

/* 2. SCROLL OBSERVER */
function initScrollObserver() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
}
