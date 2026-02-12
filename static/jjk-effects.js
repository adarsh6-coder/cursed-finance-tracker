// ============================================
// JUJUTSU KAISEN EFFECTS & INTERACTIONS
// ============================================

// Enhanced Sound Effects System with High-Quality Audio
class JJKSoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.4;
        this.masterGain = null;
        this.analyser = null;
        this.initSounds();
    }

    initSounds() {
        // Using Web Audio API to generate high-quality sounds
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create master gain for volume control
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.audioContext.destination);
        
        // Create analyser for visualization
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.masterGain.connect(this.analyser);
    }

    // Create a complex sound with multiple oscillators
    createComplexSound(config) {
        if (!this.enabled) return;
        
        const now = this.audioContext.currentTime;
        const masterGain = this.audioContext.createGain();
        masterGain.connect(this.masterGain);
        
        config.oscillators.forEach(oscConfig => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = oscConfig.type || 'sine';
            osc.frequency.setValueAtTime(oscConfig.startFreq, now);
            
            if (oscConfig.endFreq) {
                osc.frequency.exponentialRampToValueAtTime(oscConfig.endFreq, now + oscConfig.duration);
            }
            
            gain.gain.setValueAtTime(oscConfig.volume || 0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + oscConfig.duration);
            
            osc.connect(gain);
            gain.connect(masterGain);
            
            osc.start(now + (oscConfig.delay || 0));
            osc.stop(now + oscConfig.duration + (oscConfig.delay || 0));
        });
    }

    // High-quality click sound (cursed energy release)
    playClick() {
        this.createComplexSound({
            oscillators: [
                { type: 'sine', startFreq: 1200, endFreq: 800, duration: 0.08, volume: 0.4 },
                { type: 'sine', startFreq: 2400, endFreq: 1600, duration: 0.06, volume: 0.2 }
            ]
        });
    }

    // Epic domain expansion sound
    playDomainExpansion() {
        this.createComplexSound({
            oscillators: [
                { type: 'sawtooth', startFreq: 150, endFreq: 80, duration: 0.8, volume: 0.5 },
                { type: 'sine', startFreq: 300, endFreq: 160, duration: 0.8, volume: 0.3, delay: 0.1 },
                { type: 'triangle', startFreq: 450, endFreq: 240, duration: 0.6, volume: 0.2, delay: 0.2 },
                { type: 'sine', startFreq: 60, endFreq: 40, duration: 1.0, volume: 0.6 }
            ]
        });
    }

    // Success sound (technique activation)
    playSuccess() {
        this.createComplexSound({
            oscillators: [
                { type: 'triangle', startFreq: 523.25, duration: 0.15, volume: 0.5 },
                { type: 'triangle', startFreq: 659.25, duration: 0.15, volume: 0.5, delay: 0.1 },
                { type: 'triangle', startFreq: 783.99, duration: 0.2, volume: 0.5, delay: 0.2 },
                { type: 'sine', startFreq: 1046.50, duration: 0.3, volume: 0.3, delay: 0.3 }
            ]
        });
    }

    // Error sound (cursed spirit alert)
    playError() {
        this.createComplexSound({
            oscillators: [
                { type: 'square', startFreq: 180, duration: 0.15, volume: 0.4 },
                { type: 'square', startFreq: 160, duration: 0.15, volume: 0.4, delay: 0.15 },
                { type: 'sawtooth', startFreq: 100, duration: 0.3, volume: 0.3 }
            ]
        });
    }

    // Subtle hover sound
    playHover() {
        this.createComplexSound({
            oscillators: [
                { type: 'sine', startFreq: 1400, endFreq: 1200, duration: 0.04, volume: 0.15 }
            ]
        });
    }

    // NEW: Card flip sound
    playCardFlip() {
        this.createComplexSound({
            oscillators: [
                { type: 'sine', startFreq: 600, endFreq: 900, duration: 0.12, volume: 0.3 },
                { type: 'triangle', startFreq: 1200, endFreq: 1500, duration: 0.1, volume: 0.2 }
            ]
        });
    }

    // NEW: Power-up sound
    playPowerUp() {
        this.createComplexSound({
            oscillators: [
                { type: 'sawtooth', startFreq: 200, endFreq: 800, duration: 0.4, volume: 0.4 },
                { type: 'sine', startFreq: 400, endFreq: 1600, duration: 0.35, volume: 0.3, delay: 0.05 },
                { type: 'triangle', startFreq: 800, endFreq: 2400, duration: 0.3, volume: 0.2, delay: 0.1 }
            ]
        });
    }

    // NEW: Whoosh sound
    playWhoosh() {
        this.createComplexSound({
            oscillators: [
                { type: 'sawtooth', startFreq: 400, endFreq: 100, duration: 0.3, volume: 0.3 },
                { type: 'sine', startFreq: 800, endFreq: 200, duration: 0.25, volume: 0.2 }
            ]
        });
    }

    // NEW: Cursed energy charge
    playCursedCharge() {
        this.createComplexSound({
            oscillators: [
                { type: 'sawtooth', startFreq: 100, endFreq: 400, duration: 0.6, volume: 0.4 },
                { type: 'sine', startFreq: 200, endFreq: 800, duration: 0.5, volume: 0.3, delay: 0.1 },
                { type: 'triangle', startFreq: 300, endFreq: 1200, duration: 0.4, volume: 0.2, delay: 0.2 }
            ]
        });
    }

    // NEW: Technique cast
    playTechniqueCast() {
        this.createComplexSound({
            oscillators: [
                { type: 'sine', startFreq: 440, duration: 0.1, volume: 0.4 },
                { type: 'sine', startFreq: 554.37, duration: 0.1, volume: 0.4, delay: 0.08 },
                { type: 'sine', startFreq: 659.25, duration: 0.15, volume: 0.4, delay: 0.16 },
                { type: 'sine', startFreq: 880, duration: 0.2, volume: 0.5, delay: 0.24 }
            ]
        });
    }

    getAnalyserData() {
        if (!this.analyser) return null;
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
        return dataArray;
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Initialize sound manager
const soundManager = new JJKSoundManager();

// ============================================
// LOADING ANIMATION
// ============================================
function createLoader() {
    const loader = document.createElement('div');
    loader.className = 'jjk-loader';
    loader.innerHTML = `
        <span class="loader-kanji">呪</span>
        <span class="loader-kanji">術</span>
        <span class="loader-kanji">廻</span>
        <span class="loader-kanji">戦</span>
        <div class="loader-content">
            <div class="domain-loader">
                <div class="loader-ring"></div>
                <div class="loader-ring"></div>
                <div class="loader-ring"></div>
            </div>
            <div class="loader-text">EXPANDING DOMAIN...</div>
            <div class="loader-subtext">Channeling Cursed Energy</div>
        </div>
    `;
    document.body.appendChild(loader);
    return loader;
}

function showLoader() {
    let loader = document.querySelector('.jjk-loader');
    if (!loader) {
        loader = createLoader();
    }
    loader.classList.remove('hidden');
    soundManager.playDomainExpansion();
}

function hideLoader() {
    const loader = document.querySelector('.jjk-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }
}

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('click-ripple');

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ============================================
// ENHANCED BUTTON INTERACTIONS
// ============================================
function enhanceButtons() {
    // All clickable buttons
    const buttons = document.querySelectorAll('button, .btn-hero, .btn-primary, .btn-secondary, .btn-danger, .logout-btn');
    
    buttons.forEach(button => {
        // Add ripple effect
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        
        button.addEventListener('click', (e) => {
            createRipple(e);
            soundManager.playClick();
        });

        // Hover sound (throttled)
        let hoverTimeout;
        button.addEventListener('mouseenter', () => {
            if (!hoverTimeout) {
                soundManager.playHover();
                hoverTimeout = setTimeout(() => {
                    hoverTimeout = null;
                }, 100);
            }
        });
    });

    // Domain expansion buttons (special effect)
    const domainButtons = document.querySelectorAll('.btn-primary-hero, [href*="register"], [href*="login"]');
    domainButtons.forEach(button => {
        button.addEventListener('click', () => {
            soundManager.playDomainExpansion();
        });
    });
}

// ============================================
// AUDIO VISUALIZER
// ============================================
function createAudioVisualizer() {
    const visualizer = document.createElement('div');
    visualizer.className = 'audio-visualizer';
    visualizer.innerHTML = `
        <canvas id="audioCanvas" width="200" height="60"></canvas>
    `;
    
    // Style the visualizer
    visualizer.style.position = 'fixed';
    visualizer.style.bottom = '90px';
    visualizer.style.right = '2rem';
    visualizer.style.background = 'rgba(20, 27, 58, 0.8)';
    visualizer.style.padding = '10px';
    visualizer.style.borderRadius = '15px';
    visualizer.style.border = '2px solid var(--jjk-purple)';
    visualizer.style.zIndex = '9996';
    visualizer.style.display = 'none';
    visualizer.style.boxShadow = '0 5px 15px rgba(168, 85, 247, 0.4)';
    
    document.body.appendChild(visualizer);
    
    const canvas = document.getElementById('audioCanvas');
    const ctx = canvas.getContext('2d');
    
    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);
        
        const dataArray = soundManager.getAnalyserData();
        if (!dataArray || !soundManager.enabled) {
            visualizer.style.display = 'none';
            return;
        }
        
        visualizer.style.display = 'block';
        
        ctx.fillStyle = 'rgba(5, 8, 20, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = (canvas.width / dataArray.length) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < dataArray.length; i++) {
            barHeight = (dataArray[i] / 255) * canvas.height;
            
            // Gradient colors
            const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
            gradient.addColorStop(0, '#a855f7');
            gradient.addColorStop(0.5, '#22d3ee');
            gradient.addColorStop(1, '#f472b6');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }
    
    drawVisualizer();
}

// ============================================
// CARD HOVER EFFECTS
// ============================================
function enhanceCards() {
    const cards = document.querySelectorAll('.feature-card, .stat-card, .stat-box');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            soundManager.playCardFlip();
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Character card special effects
    const characterCards = document.querySelectorAll('[data-character]');
    characterCards.forEach(card => {
        card.addEventListener('click', () => {
            soundManager.playTechniqueCast();
            
            // Add flash effect
            card.style.transition = 'all 0.1s ease';
            card.style.filter = 'brightness(1.3)';
            setTimeout(() => {
                card.style.filter = 'brightness(1)';
            }, 200);
        });
    });
    
    // Stat cards power-up effect
    const statCards = document.querySelectorAll('.stat-card, .stat-box');
    statCards.forEach(card => {
        card.addEventListener('click', () => {
            soundManager.playPowerUp();
        });
    });
}

// ============================================
// CURSED ENERGY TRAIL (Mouse Trail)
// ============================================
let trailTimeout;
function createCursedTrail(x, y) {
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    trail.style.width = '10px';
    trail.style.height = '10px';
    trail.style.borderRadius = '50%';
    trail.style.background = 'radial-gradient(circle, rgba(147, 51, 234, 0.8), transparent)';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '9998';
    trail.style.animation = 'trailFade 1s ease-out forwards';
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 1000);
}

// Add trail animation to CSS dynamically
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.3);
        }
    }
`;
document.head.appendChild(trailStyle);

let trailActive = false;
function toggleCursedTrail() {
    trailActive = !trailActive;
    
    if (trailActive) {
        document.addEventListener('mousemove', handleMouseMove);
    } else {
        document.removeEventListener('mousemove', handleMouseMove);
    }
}

let lastTrailTime = 0;
function handleMouseMove(e) {
    const now = Date.now();
    if (now - lastTrailTime > 50) { // Throttle
        createCursedTrail(e.clientX, e.clientY);
        lastTrailTime = now;
    }
}

// ============================================
// FORM VALIDATION WITH SOUND
// ============================================
function enhanceForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const isValid = form.checkValidity();
            
            if (isValid) {
                showLoader();
                soundManager.playSuccess();
            } else {
                soundManager.playError();
            }
        });

        // Input focus effects
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                soundManager.playHover();
            });
        });
    });
}

// ============================================
// MESSAGE ANIMATIONS
// ============================================
function enhanceMessages() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.classList && node.classList.contains('message')) {
                    if (node.classList.contains('success')) {
                        soundManager.playSuccess();
                    } else if (node.classList.contains('error')) {
                        soundManager.playError();
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// ============================================
// SOUND TOGGLE BUTTON WITH VOLUME CONTROL
// ============================================
function createSoundToggle() {
    const container = document.createElement('div');
    container.className = 'sound-control-container';
    container.style.position = 'fixed';
    container.style.bottom = '2rem';
    container.style.right = '2rem';
    container.style.zIndex = '9997';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.alignItems = 'flex-end';
    
    // Volume slider
    const volumeControl = document.createElement('div');
    volumeControl.className = 'volume-control';
    volumeControl.style.display = 'none';
    volumeControl.style.background = 'var(--jjk-card-bg)';
    volumeControl.style.padding = '15px';
    volumeControl.style.borderRadius = '15px';
    volumeControl.style.border = '2px solid var(--jjk-purple)';
    volumeControl.style.boxShadow = '0 5px 15px rgba(168, 85, 247, 0.4)';
    
    volumeControl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <label style="color: var(--jjk-text-primary); font-size: 0.9rem;">🎚️ Volume</label>
            <input type="range" id="volumeSlider" min="0" max="100" value="40" 
                   style="width: 150px; cursor: pointer;">
            <div style="color: var(--jjk-text-secondary); font-size: 0.8rem; text-align: center;" id="volumeValue">40%</div>
        </div>
    `;
    
    // Toggle button
    const toggle = document.createElement('button');
    toggle.className = 'sound-toggle';
    toggle.innerHTML = '🔊';
    toggle.style.width = '60px';
    toggle.style.height = '60px';
    toggle.style.borderRadius = '50%';
    toggle.style.border = '2px solid var(--jjk-purple)';
    toggle.style.background = 'var(--jjk-card-bg)';
    toggle.style.color = 'white';
    toggle.style.fontSize = '1.8rem';
    toggle.style.cursor = 'pointer';
    toggle.style.boxShadow = '0 5px 15px rgba(168, 85, 247, 0.4)';
    toggle.style.transition = 'all 0.3s ease';
    
    container.appendChild(volumeControl);
    container.appendChild(toggle);
    document.body.appendChild(container);
    
    // Volume slider functionality
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    
    volumeSlider.addEventListener('input', (e) => {
        const vol = e.target.value / 100;
        soundManager.setVolume(vol);
        volumeValue.textContent = e.target.value + '%';
        soundManager.playClick();
    });
    
    // Toggle button functionality
    toggle.addEventListener('click', () => {
        const enabled = soundManager.toggle();
        toggle.innerHTML = enabled ? '🔊' : '🔇';
        toggle.style.opacity = enabled ? '1' : '0.5';
        
        if (enabled) {
            soundManager.playSuccess();
        }
    });
    
    // Show/hide volume on right-click
    toggle.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const isVisible = volumeControl.style.display !== 'none';
        volumeControl.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            soundManager.playWhoosh();
        }
    });
    
    toggle.addEventListener('mouseenter', () => {
        toggle.style.transform = 'scale(1.15) rotate(5deg)';
    });
    
    toggle.addEventListener('mouseleave', () => {
        toggle.style.transform = 'scale(1) rotate(0deg)';
    });
}

// ============================================
// SCROLL SOUND EFFECTS
// ============================================
let lastScrollY = 0;
let scrollTimeout;

function handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDiff = Math.abs(currentScrollY - lastScrollY);
    
    if (scrollDiff > 100) {
        soundManager.playWhoosh();
        lastScrollY = currentScrollY;
    }
}

window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScroll, 150);
});

// ============================================
// NAVIGATION LINK SOUNDS
// ============================================
function enhanceNavigation() {
    const navLinks = document.querySelectorAll('nav a, .nav-link, .navbar a');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            soundManager.playHover();
        });
        
        link.addEventListener('click', (e) => {
            soundManager.playCursedCharge();
            
            // Add visual feedback
            link.style.transition = 'all 0.2s ease';
            link.style.transform = 'scale(1.1)';
            setTimeout(() => {
                link.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// ============================================
// INPUT FIELD ENHANCEMENTS
// ============================================
function enhanceInputs() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            soundManager.playCardFlip();
            input.style.transform = 'scale(1.02)';
            input.style.transition = 'all 0.2s ease';
        });
        
        input.addEventListener('blur', () => {
            input.style.transform = 'scale(1)';
        });
        
        // Sound on typing
        let typingTimeout;
        input.addEventListener('input', () => {
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                soundManager.playClick();
            }, 100);
        });
    });
}

// ============================================
// PAGE TRANSITION EFFECTS
// ============================================
function enhancePageTransitions() {
    // Capture all link clicks for page transitions
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!link.target && link.href.includes(window.location.hostname)) {
                e.preventDefault();
                
                soundManager.playDomainExpansion();
                showLoader();
                
                setTimeout(() => {
                    window.location.href = link.href;
                }, 800);
            }
        });
    });
}

// ============================================
// TRANSACTION ANIMATIONS WITH SOUND
// ============================================
function observeTransactions() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.classList && node.classList.contains('transaction-item')) {
                    soundManager.playSuccess();
                    
                    // Animate in
                    node.style.opacity = '0';
                    node.style.transform = 'translateX(-50px)';
                    setTimeout(() => {
                        node.style.transition = 'all 0.5s ease';
                        node.style.opacity = '1';
                        node.style.transform = 'translateX(0)';
                    }, 100);
                }
                
                if (node.classList && node.classList.contains('stat-card')) {
                    soundManager.playPowerUp();
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Show loader initially with sound
    showLoader();
    
    // Initialize all enhancements
    setTimeout(() => {
        enhanceButtons();
        enhanceCards();
        enhanceForms();
        enhanceMessages();
        enhanceNavigation();
        enhanceInputs();
        enhancePageTransitions();
        observeTransactions();
        createSoundToggle();
        createAudioVisualizer();
        
        // Hide loader after everything is ready
        hideLoader();
        
        // Welcome sound
        soundManager.playPowerUp();
    }, 1000);
});

// Page load animations
window.addEventListener('load', () => {
    hideLoader();
});

// Play sound on page visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        soundManager.playCursedCharge();
    }
});

// Export for use in other scripts
window.JJK = {
    soundManager,
    showLoader,
    hideLoader,
    toggleCursedTrail
};
