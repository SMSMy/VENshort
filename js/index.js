/**
 * Index Page Specific JavaScript
 * Handles home page functionality and animations
 */

document.addEventListener("DOMContentLoaded", () => {
  initIndexPage();
});

function initIndexPage() {
  // Initialize hero section animations
  initHeroAnimations();

  // Initialize feature cards interactions
  initFeatureCards();

  // Initialize navigation interactions
  initNavigation();

  // Initialize scroll effects
  initScrollEffects();
}

// ===== HERO SECTION ANIMATIONS =====
function initHeroAnimations() {
  if (window.VenShortAnimations?.prefersReducedMotion) return;

  // Animate hero logo with floating effect
  const heroLogo = document.querySelector(".hero-logo");
  if (heroLogo) {
    anime({
      targets: heroLogo,
      translateY: [0, -10, 0],
      rotate: [0, 2, -2, 0],
      duration: 4000,
      loop: true,
      easing: "easeInOutSine",
    });
  }

  // Animate title lines with wave effect
  const titleLines = document.querySelectorAll(".title-line");
  titleLines.forEach((line, index) => {
    anime({
      targets: line,
      translateY: [0, -5, 0],
      duration: 3000,
      delay: index * 500,
      loop: true,
      easing: "easeInOutSine",
    });
  });

  // Animate button icons
  const buttonIcons = document.querySelectorAll(".btn-icon");
  buttonIcons.forEach((icon, index) => {
    anime({
      targets: icon,
      rotate: [0, 10, -10, 0],
      scale: [1, 1.1, 1],
      duration: 2000,
      delay: index * 300,
      loop: true,
      easing: "easeInOutSine",
    });
  });
}

// ===== FEATURE CARDS INTERACTIONS =====
function initFeatureCards() {
  const featureCards = document.querySelectorAll(".feature-card");

  featureCards.forEach((card, index) => {
    // Add data attributes for enhanced interactions
    card.setAttribute("data-index", index);

    // Enhanced hover effects
    card.addEventListener("mouseenter", () => {
      if (window.VenShortAnimations?.prefersReducedMotion) return;

      // Animate the icon
      const icon = card.querySelector(".feature-icon");
      if (icon) {
        anime({
          targets: icon,
          scale: [1, 1.2],
          rotate: [0, 10],
          duration: 300,
          easing: "easeOutQuart",
        });
      }

      // Animate the card border
      anime({
        targets: card,
        borderColor: ["rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 0.8)"],
        duration: 300,
        easing: "easeOutQuart",
      });
    });

    card.addEventListener("mouseleave", () => {
      if (window.VenShortAnimations?.prefersReducedMotion) return;

      // Reset icon animation
      const icon = card.querySelector(".feature-icon");
      if (icon) {
        anime({
          targets: icon,
          scale: [1.2, 1],
          rotate: [10, 0],
          duration: 300,
          easing: "easeOutQuart",
        });
      }

      // Reset card border
      anime({
        targets: card,
        borderColor: ["rgba(59, 130, 246, 0.8)", "rgba(59, 130, 246, 0.2)"],
        duration: 300,
        easing: "easeOutQuart",
      });
    });

    // Click animation
    card.addEventListener("click", () => {
      if (window.VenShortAnimations?.prefersReducedMotion) return;

      anime({
        targets: card,
        scale: [1, 0.98, 1],
        duration: 200,
        easing: "easeOutQuart",
      });
    });
  });
}

// ===== NAVIGATION INTERACTIONS =====
function initNavigation() {
  const navLogo = document.querySelector(".nav-logo");
  const logoIcon = document.querySelector(".logo-icon");

  // Logo hover animation
  if (navLogo && logoIcon) {
    navLogo.addEventListener("mouseenter", () => {
      if (window.VenShortAnimations?.prefersReducedMotion) return;

      anime({
        targets: logoIcon,
        rotate: [0, 360],
        scale: [1, 1.1, 1],
        duration: 600,
        easing: "easeOutQuart",
      });
    });
  }

  // Navigation links enhanced animations
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link, index) => {
    link.addEventListener("mouseenter", () => {
      if (window.VenShortAnimations?.prefersReducedMotion) return;

      // Create ripple effect
      const ripple = document.createElement("div");
      ripple.style.position = "absolute";
      ripple.style.width = "100%";
      ripple.style.height = "100%";
      ripple.style.background = "rgba(59, 130, 246, 0.1)";
      ripple.style.borderRadius = "inherit";
      ripple.style.top = "0";
      ripple.style.left = "0";
      ripple.style.pointerEvents = "none";
      ripple.style.zIndex = "-1";

      link.style.position = "relative";
      link.appendChild(ripple);

      anime({
        targets: ripple,
        scale: [0, 1],
        opacity: [0, 1, 0],
        duration: 600,
        easing: "easeOutQuart",
        complete: () => ripple.remove(),
      });
    });
  });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
  // Parallax effect for hero section
  window.addEventListener("scroll", () => {
    if (window.VenShortAnimations?.prefersReducedMotion) return;

    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector(".hero-content");

    if (heroContent) {
      const parallaxSpeed = 0.5;
      heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }

    // Animate floating orbs based on scroll
    const orbs = document.querySelectorAll(".gradient-orb");
    orbs.forEach((orb, index) => {
      const speed = 0.1 + index * 0.05;
      orb.style.transform = `translateY(${scrolled * speed}px) rotate(${
        scrolled * 0.1
      }deg)`;
    });
  });

  // Smooth scroll for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// ===== UTILITY FUNCTIONS =====
function createFloatingElements() {
  if (window.VenShortAnimations?.prefersReducedMotion) return;

  // Create floating geometric shapes
  const shapes = ["circle", "triangle", "square"];
  const container = document.querySelector(".hero-section");

  if (!container) return;

  for (let i = 0; i < 5; i++) {
    const shape = document.createElement("div");
    shape.className = `floating-shape floating-${shapes[i % shapes.length]}`;
    shape.style.position = "absolute";
    shape.style.width = "20px";
    shape.style.height = "20px";
    shape.style.background = "rgba(59, 130, 246, 0.1)";
    shape.style.borderRadius =
      shapes[i % shapes.length] === "circle" ? "50%" : "0";
    shape.style.left = Math.random() * 100 + "%";
    shape.style.top = Math.random() * 100 + "%";
    shape.style.pointerEvents = "none";
    shape.style.zIndex = "-1";

    container.appendChild(shape);

    // Animate floating shapes
    anime({
      targets: shape,
      translateX: anime.random(-100, 100),
      translateY: anime.random(-100, 100),
      rotate: anime.random(0, 360),
      scale: anime.random(0.5, 1.5),
      duration: anime.random(10000, 20000),
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
      delay: i * 1000,
    });
  }
}

// ===== PERFORMANCE OPTIMIZATION =====
function optimizeAnimations() {
  // Use Intersection Observer for better performance
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "50px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  }, observerOptions);

  // Observe elements that need animation
  const animatedElements = document.querySelectorAll(
    ".feature-card, .hero-content"
  );
  animatedElements.forEach((el) => observer.observe(el));
}

// Initialize everything when the page loads
document.addEventListener("DOMContentLoaded", () => {
  initIndexPage();
  createFloatingElements();
  optimizeAnimations();
});

// إخفاء شاشة التحميل بعد تحميل الصفحة
window.addEventListener("load", function () {
  var overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.style.display = "none";
});

// Export functions for external use
window.IndexPage = {
  initHeroAnimations,
  initFeatureCards,
  initNavigation,
  initScrollEffects,
  createFloatingElements,
};
