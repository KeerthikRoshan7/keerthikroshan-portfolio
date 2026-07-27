/* ==========================================================================
   KEERTHIK ROSHAN G. | VECTOR CURSOR & SMART SCROLL PANEL ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initVectorCursor();
    initSmartScrollTracker();
});

/* 1. VECTOR SVG CURSOR ENGINE */
function initVectorCursor() {
    const cursor = document.getElementById('vector-cursor');
    if (!cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currX = mouseX;
    let currY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animCursor() {
        currX += (mouseX - currX) * 0.2;
        currY += (mouseY - currY) * 0.2;

        cursor.style.left = `${currX}px`;
        cursor.style.top = `${currY}px`;

        requestAnimationFrame(animCursor);
    }
    requestAnimationFrame(animCursor);

    // Dynamic Hover Listeners for Vector Cursor Amplification
    const hoverTargets = document.querySelectorAll('a, button, .liquid-glass-card, .contact-pill');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        target.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

/* 2. SMART SCROLL PANEL HIGHLIGHTING & INDEX TRACKER */
function initSmartScrollTracker() {
    const panels = document.querySelectorAll('.smart-panel');
    const trackerNodes = document.querySelectorAll('.tracker-node');

    const observerOptions = {
        threshold: 0.35
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Highlight active section
                panels.forEach(p => p.classList.remove('active-panel'));
                entry.target.classList.add('active-panel');

                const panelId = entry.target.getAttribute('id');
                trackerNodes.forEach(node => {
                    node.classList.remove('active');
                    if (node.getAttribute('href') === `#${panelId}`) {
                        node.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    panels.forEach(panel => observer.observe(panel));
}
