/**
 * Advanced Animations using Anime.js v4
 * Inspired by the examples from the Anime.js v4 library
 */

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Wait for anime.js to load
function waitForAnime() {
    return new Promise((resolve) => {
        if (typeof anime !== 'undefined') {
            resolve();
        } else {
            const checkAnime = setInterval(() => {
                if (typeof anime !== 'undefined') {
                    clearInterval(checkAnime);
                    resolve();
                }
            }, 100);
        }
    });
}

// ===== UTILITY FUNCTIONS =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    // Create floating particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// ===== LOADING SCREEN ANIMATION =====
async function initLoadingAnimation() {
    await waitForAnime();
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (!loadingSpinner) return;

    if (prefersReducedMotion) return;

    // Spinner rotation with Anime.js
    anime({
        targets: loadingSpinner,
        rotate: '1turn',
        duration: 1000,
        loop: true,
        easing: 'linear'
    });
}

// ===== MAIN INTRO TIMELINE =====
async function createIntroTimeline() {
    await waitForAnime();
    
    if (prefersReducedMotion) {
        // Show all elements immediately if reduced motion is preferred
        const elements = document.querySelectorAll('#navbar, #logoContainer, #heroTitle, #heroSubtitle, #buttonGroup, #featuresSection, #footer');
        elements.forEach(el => {
            if (el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
        return;
    }

    // Create main timeline with Anime.js
    const tl = anime.timeline({
        easing: 'easeOutExpo',
        duration: 800
    });

    // Add animations to timeline
    tl.add({
        targets: '#navbar',
        translateY: ['-100%', 0],
        opacity: [0, 1],
        duration: 600
    })
    .add({
        targets: '#logoContainer',
        scale: [0.8, 1],
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 700
    }, '-=400')
    .add({
        targets: '#heroTitle .title-line',
        translateY: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 600
    }, '-=500')
    .add({
        targets: '#heroSubtitle',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 600
    }, '-=400')
    .add({
        targets: '#buttonGroup',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 600
    }, '-=300')
    .add({
        targets: '#featuresSection',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 700
    }, '-=200');

    return tl;
}

// ===== SCROLL-TRIGGERED ANIMATIONS =====
async function initScrollAnimations() {
    await waitForAnime();
    if (prefersReducedMotion) return;

    // Simple scroll-triggered animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                anime({
                    targets: target,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    scale: [0.95, 1],
                    duration: 600,
                    easing: 'easeOutQuint'
                });
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
        '.feature-card, .page-title, .page-subtitle, .search-section, ' +
        '.notice-section, .selection-buttons, .category-section, ' +
        '.plugin-card, .theme-card, .config-section, .footer'
    );
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.95)';
        observer.observe(el);
    });
}

// ===== FLOATING ORBS ANIMATION =====
async function animateFloatingOrbs() {
    await waitForAnime();
    if (prefersReducedMotion) return;

    const orbs = document.querySelectorAll('.gradient-orb');
    
    orbs.forEach((orb, index) => {
        anime({
            targets: orb,
            translateX: () => anime.random(-100, 100),
            translateY: () => anime.random(-100, 100),
            rotate: () => anime.random(0, 360),
            scale: () => anime.random(0.8, 1.2),
            duration: () => anime.random(8000, 15000),
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
            delay: index * 2000
        });
    });
}

// ===== INTERACTIVE ANIMATIONS =====
async function initInteractiveAnimations() {
    await waitForAnime();
    if (prefersReducedMotion) return;

    // Button hover animations
    const buttons = document.querySelectorAll('.btn, .selection-btn, .config-btn, .btn-preview');
    buttons.forEach(btn => {
        let hoverAnimation;
        
        btn.addEventListener('mouseenter', () => {
            hoverAnimation = anime({
                targets: btn,
                scale: [1, 1.05],
                translateY: [0, -2],
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            if (hoverAnimation) hoverAnimation.pause();
            anime({
                targets: btn,
                scale: [btn.style.transform ? 1.05 : 1, 1],
                translateY: [btn.style.transform ? -2 : 0, 0],
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
    });

    // Navigation link hover animations
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            anime({
                targets: link,
                translateY: [0, -3],
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
        
        link.addEventListener('mouseleave', () => {
            anime({
                targets: link,
                translateY: [-3, 0],
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
    });

    // Feature card hover animations
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                translateY: [0, -10],
                scale: [1, 1.02],
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                translateY: [-10, 0],
                scale: [1.02, 1],
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
    });

    // Plugin card hover animations
    const pluginCards = document.querySelectorAll('.plugin-card');
    pluginCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                translateY: [0, -5],
                scale: [1, 1.01],
                duration: 250,
                easing: 'easeOutQuart'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                translateY: [-5, 0],
                scale: [1.01, 1],
                duration: 250,
                easing: 'easeOutQuart'
            });
        });
    });
}

// ===== CLICK PARTICLE EFFECT =====
async function initClickParticleEffect() {
    await waitForAnime();
    if (prefersReducedMotion) return;

    document.addEventListener('click', (e) => {
        // Create particle element
        const particle = document.createElement('div');
        particle.className = 'click-particle';
        particle.style.left = `${e.clientX - 5}px`;
        particle.style.top = `${e.clientY - 5}px`;
        document.body.appendChild(particle);

        // Animate particle
        anime({
            targets: particle,
            scale: [0, 8],
            opacity: [0.8, 0],
            duration: 600,
            easing: 'easeOutQuart',
            complete: () => particle.remove()
        });
    });
}

// ===== TYPEWRITER EFFECT =====
function createTypewriterEffect(element, text, speed = 50) {
    if (prefersReducedMotion || !element) return;

    element.textContent = '';
    let i = 0;
    
    function typeChar() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, speed);
        }
    }
    
    typeChar();
}

// ===== LOADING SCREEN MANAGEMENT =====
async function hideLoadingScreen() {
    await waitForAnime();
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) return;

    if (prefersReducedMotion) {
        loadingOverlay.style.display = 'none';
        return;
    }

    anime({
        targets: loadingOverlay,
        opacity: [1, 0],
        scale: [1, 1.1],
        duration: 800,
        easing: 'easeOutQuart',
        complete: () => {
            loadingOverlay.style.display = 'none';
        }
    });
}

// ===== INITIALIZATION =====
async function initAnimations() {
    // Create particles
    createParticles();
    
    // Initialize loading animation
    await initLoadingAnimation();
    
    // Hide loading screen after delay
    setTimeout(async () => {
        await hideLoadingScreen();
        
        // Start main animations after loading screen is hidden
        setTimeout(async () => {
            await createIntroTimeline();
            await initScrollAnimations();
            await animateFloatingOrbs();
            await initInteractiveAnimations();
            await initClickParticleEffect();
        }, 300);
    }, 1500);
}

// ===== EXPORT FOR USE IN OTHER FILES =====
window.VenShortAnimations = {
    initAnimations,
    createIntroTimeline,
    initScrollAnimations,
    animateFloatingOrbs,
    initInteractiveAnimations,
    hideLoadingScreen,
    createTypewriterEffect,
    prefersReducedMotion
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}

