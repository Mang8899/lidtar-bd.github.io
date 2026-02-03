const starsContainer = document.getElementById('stars');
for (let i = 0; i < 150; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    starsContainer.appendChild(star);
}

function celebrate() {
    // Blow out candles
    const flames = document.querySelectorAll('.flame');
    flames.forEach(f => {
        f.style.animation = 'none';
        f.style.opacity = '0';
        f.style.transition = 'opacity 0.5s';
    });

    // Create fireworks
    for(let i = 0; i < 8; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.5;
            createFirework(x, y);
        }, i * 200);
    }
    
    // Show modal with image and wishes
    openModalWithWish();
}

function createFirework(x, y) {
    const colors = ['#ff4081', '#00e676', '#ffea00', '#3d5afe', '#ffffff'];
    const container = document.getElementById('fireworks');
    
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 150;
        p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
        
        container.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }
}

// Modal open/close logic
function openModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    // focus the close button for accessibility
    const closeBtn = document.getElementById('closeModal');
    if (closeBtn) closeBtn.focus();
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
}

// Wire up listeners
document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (!modal) return;
    const isVisible = modal.getAttribute('aria-hidden') === 'false';
    // close when clicking outside modal-content
    if (isVisible && e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

const closeBtn = document.getElementById('closeModal');
if (closeBtn) closeBtn.addEventListener('click', closeModal);

// Wishing/typewriter script
function typeLinesInto(element, lines, opts = {}) {
    const el = document.getElementById(element);
    if (!el) return Promise.resolve();

    const cursor = document.createElement('span');
    cursor.className = 'wish-cursor';
    el.innerHTML = '';
    el.appendChild(cursor);

    const speed = opts.speed || 60;
    const pause = opts.pause || 900;

    return new Promise((resolve) => {
        let lineIndex = 0;
        function typeLine() {
            const text = lines[lineIndex] || '';
            let i = 0;
            cursor.style.display = 'inline-block';
            el.textContent = '';
            el.appendChild(cursor);

            const t = setInterval(() => {
                el.textContent = text.slice(0, ++i);
                el.appendChild(cursor);
                if (i >= text.length) {
                    clearInterval(t);
                    lineIndex++;
                    if (lineIndex < lines.length) {
                        setTimeout(typeLine, pause);
                    } else {
                        // finish
                        cursor.remove();
                        resolve();
                    }
                }
            }, speed);
        }
        typeLine();
    });
}

// When opening modal, play the wishing script and ensure image loads
// Image source: images/ushagiiii.webp
const DEFAULT_IMAGE_PATH = 'ushagiiii.png';
function openModalWithWish() {
    const img = document.getElementById('popupImage');
    const popupContainer = document.querySelector('.popup-image');
    if (img) {
        // set up handlers before assigning src
        img.onload = () => {
            // ensure image is visible (CSS handles opacity)
            img.style.display = '';
            // remove any previous fallback note
            const note = document.getElementById('imageNote'); if (note) note.remove();
        };
        img.onerror = () => {
            // if the file isn't found, hide the <img> and show a small message + fallback SVG
            img.style.display = 'none';
            if (popupContainer) {
                // add a small friendly note for the user
                if (!document.getElementById('imageNote')) {
                    const note = document.createElement('div');
                    note.id = 'imageNote';
                    note.style.marginTop = '8px';
                    note.style.color = '#6b2742';
                    note.style.fontSize = '0.95rem';
                    popupContainer.appendChild(note);
                }
                // inject a simple inline fallback (small rabbit) so the popup still looks nice
                const fallback = `\n                    <svg width="160" height="160" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n                        <ellipse cx="100" cy="120" rx="50" ry="44" fill="#fff2d9" stroke="#6a3b2f" stroke-width="2"/>\n                        <circle cx="70" cy="70" r="26" fill="#fff2d9" stroke="#6a3b2f" stroke-width="2"/>\n                        <circle cx="130" cy="70" r="26" fill="#fff2d9" stroke="#6a3b2f" stroke-width="2"/>\n                        <circle cx="85" cy="125" r="5" fill="#6a3b2f"/>\n                        <circle cx="115" cy="125" r="5" fill="#6a3b2f"/>\n                    </svg>\n                `;
                // only append fallback svg if not already present
                if (!popupContainer.querySelector('svg')) popupContainer.insertAdjacentHTML('beforeend', fallback);
            }
        };
        img.alt = 'Surprise!';
        img.src = DEFAULT_IMAGE_PATH;
    }
    openModal();

    const lines = [
        "Happy Birthday, Lidtar! 🐰",
        "May your day be full of smiles, cake, and warm hugs.",
        "Make a wish — then blow the candles! ✨"
    ];
    // type into #wishLine
    typeLinesInto('wishLine', lines, { speed: 20, pause: 900 });
}

// Replace celebrate() call to use the combined behavior
const origCelebrate = celebrate;
function newCelebrate() {
    origCelebrate();
}
celebrate = newCelebrate;
