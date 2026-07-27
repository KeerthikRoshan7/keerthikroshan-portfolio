/* ==========================================================================
   KEERTHIK ROSHAN G. | PORTFOLIO APP LOGIC & INTERACTION ENGINE
   Smart Scroll, Terminal CLI, 3D Tilt, Toast System
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollObserver();
    init3DTilt();
    initTerminalCLI();
    initSynthPads();
    initToastSystem();
});

/* 1. SMART SCROLL OBSERVER & NAV PROGRESS */
function initScrollObserver() {
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Calculate scroll percentage
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        // Active link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* 2. 3D CARD PERSPECTIVE TILT EFFECT */
function init3DTilt() {
    const cards = document.querySelectorAll('.cyber-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });
}

/* 3. INTERACTIVE TERMINAL CLI MODAL */
function initTerminalCLI() {
    const modal = document.getElementById('terminal-modal');
    const toggleBtn = document.getElementById('toggle-terminal');
    const closeDot = document.getElementById('close-terminal');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');

    if (!modal || !input) return;

    function openTerminal() {
        modal.classList.add('open');
        input.focus();
        if (window.roznAudio) window.roznAudio.playUiClick(1200, 'square');
    }

    function closeTerminal() {
        modal.classList.remove('open');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openTerminal);
    if (closeDot) closeDot.addEventListener('click', closeTerminal);

    // Keyboard shortcut (tilde ` or Escape)
    window.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            e.preventDefault();
            modal.classList.contains('open') ? closeTerminal() : openTerminal();
        }
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeTerminal();
        }
    });

    const commands = {
        help: `AVAILABLE COMMANDS:
  <span style="color:#00f3ff">about</span>      - Learn about Keerthik Roshan's dual AI & Sonic focus
  <span style="color:#00f3ff">projects</span>   - View selected legal tech & data science work
  <span style="color:#00f3ff">skills</span>     - Display tech stack & music production tools
  <span style="color:#00f3ff">contact</span>    - Show contact links & copy email
  <span style="color:#00f3ff">play</span>       - Trigger cyber synth audio pulse
  <span style="color:#00f3ff">clear</span>      - Clear terminal screen
  <span style="color:#00f3ff">exit</span>       - Close terminal CLI`,
        about: `KEERTHIK ROSHAN G. | AI & DATA SCIENCE
  20-year-old student specializing in LLM Agentic Architectures & Legal NLP.
  Music Producer & Vocalist (@roznmusic).
  Interests: Generative AI, Sound Synthesis, Constitutional Law.`,
        projects: `SELECTED PROJECTS:
  1. <span style="color:#ffbe0b">[IN PROGRESS]</span> VidhiDesk: Legal NLP research assistant
  2. <span style="color:#00f3ff">[RESEARCH]</span> Equality & Affirmative Action Paper (UNOM Legal Dept)
  3. <span style="color:#8a2be2">[CAPSTONE]</span> DigiDARA Tech Data Science Internship`,
        skills: `TECH & CREATIVE MATRIX:
  Code: Python, SQL, Pandas, NumPy, LLM Frameworks, JavaScript
  Music: FL Studio, Sound Design, Vocals, Mixing & Mastering`,
        contact: `CONTACT MATRIX:
  Email: gkrosh.0712@gmail.com
  LinkedIn: linkedin.com/in/keerthikroshan
  GitHub: github.com/KeerthikRoshan7
  Instagram: @roznmusic`,
        play: () => {
            if (window.roznAudio) {
                window.roznAudio.playSynthPad(1);
                return 'Playing Cyber Synth Chime...';
            }
            return 'Audio Engine inactive.';
        }
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            input.value = '';

            const line = document.createElement('div');
            line.style.marginBottom = '8px';
            line.innerHTML = `<span style="color:#8a2be2">user@keerthik:~$</span> ${cmd}`;
            output.appendChild(line);

            if (cmd === 'clear') {
                output.innerHTML = '';
            } else if (cmd === 'exit') {
                closeTerminal();
            } else if (commands[cmd]) {
                const response = document.createElement('div');
                response.style.marginBottom = '12px';
                response.style.color = '#e2e8f0';
                response.innerHTML = typeof commands[cmd] === 'function' ? commands[cmd]() : commands[cmd];
                output.appendChild(response);
            } else if (cmd !== '') {
                const errLine = document.createElement('div');
                errLine.style.color = '#ff0055';
                errLine.style.marginBottom = '12px';
                errLine.innerHTML = `Command not found: '${cmd}'. Type <span style="color:#00f3ff">help</span> for assistance.`;
                output.appendChild(errLine);
            }

            output.scrollTop = output.scrollHeight;
        }
    });
}

/* 4. SYNTH PADS LISTENER */
function initSynthPads() {
    const pads = document.querySelectorAll('.synth-pad');
    pads.forEach((pad, index) => {
        pad.addEventListener('click', () => {
            pad.classList.add('active');
            setTimeout(() => pad.classList.remove('active'), 200);

            if (window.roznAudio) {
                window.roznAudio.playSynthPad(index);
            }
        });
    });

    // Keyboard hotkeys 1, 2, 3, 4
    window.addEventListener('keydown', (e) => {
        if (['1', '2', '3', '4'].includes(e.key) && document.activeElement.tagName !== 'INPUT') {
            const idx = parseInt(e.key) - 1;
            if (pads[idx]) {
                pads[idx].click();
            }
        }
    });
}

/* 5. TOAST NOTIFICATION SYSTEM */
function initToastSystem() {
    const toast = document.getElementById('cyber-toast');
    window.showToast = function (msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    // Copy email helper
    window.copyEmail = function () {
        const email = 'gkrosh.0712@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            window.showToast('Copied email: ' + email);
            if (window.roznAudio) window.roznAudio.playUiClick(1000, 'sine');
        }).catch(() => {
            window.showToast('Email: ' + email);
        });
    };
}
