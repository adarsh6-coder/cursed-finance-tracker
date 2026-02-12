// Hamburger Menu Animation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for floating symbols
let scrollPosition = 0;
window.addEventListener('scroll', () => {
    scrollPosition = window.pageYOffset;
    const symbols = document.querySelectorAll('.symbol');
    symbols.forEach((symbol, index) => {
        const speed = 0.5 + (index * 0.2);
        symbol.style.transform = `translateY(${scrollPosition * speed}px) rotate(${scrollPosition * 0.1}deg)`;
    });
});

// Intersection Observer for feature cards
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

// Cursed energy particles animation
function createCursedParticle() {
    const particle = document.createElement('div');
    particle.className = 'cursed-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    particle.style.opacity = Math.random() * 0.5 + 0.3;
    
    document.querySelector('.cursed-energy').appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 5000);
}

// Create particles periodically
setInterval(createCursedParticle, 300);

// Domain expansion animation on button hover
const heroButtons = document.querySelectorAll('.btn-hero');
heroButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) translateY(0)';
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.jjk-navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Animated counter for stats
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const isInfinity = target === Infinity;
    
    const timer = setInterval(() => {
        if (isInfinity) {
            element.textContent = '∞';
            clearInterval(timer);
        } else {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.dataset.suffix || '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.dataset.suffix || '');
            }
        }
    }, 16);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.stat-number');
            numbers.forEach(num => {
                const value = num.textContent.trim();
                if (value === '∞') {
                    // Already infinity, animate it differently
                    num.style.animation = 'pulse 2s infinite';
                } else {
                    const target = parseInt(value);
                    if (!isNaN(target)) {
                        num.dataset.suffix = value.includes('%') ? '%' : '';
                        animateCounter(num, target);
                    }
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
    statsObserver.observe(statsGrid);
}
