(function() {
    'use strict';

    // ===== MOBILE NAVIGATION =====
    const navToggle = document.querySelector('.nav-toggle');
    const primaryNav = document.querySelector('.primary-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && primaryNav) {
        // Toggle menu
        navToggle.addEventListener('click', function() {
            const isOpen = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isOpen);
            primaryNav.classList.toggle('is-open');
        });

        // Close menu on link click (for single-page navigation)
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('is-open');
            });
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
                navToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('is-open');
                navToggle.focus();
            }
        });

        // Close menu on outside click
        document.addEventListener('click', function(e) {
            const header = document.querySelector('.site-header');
            if (header && !header.contains(e.target) && primaryNav.classList.contains('is-open')) {
                navToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('is-open');
            }
        });
    }

    // ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without causing page jump
                history.pushState(null, '', targetId);
            }
        });
    });

    // ===== SCROLL REVEAL ANIMATIONS (Intersection Observer) =====
    const revealElements = document.querySelectorAll('.service-card, .work-item, .process-step');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show all elements immediately
        revealElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }

    // ===== ACTIVE NAVIGATION STATE =====
    const sections = document.querySelectorAll('section[id]');
    const navLinkElements = document.querySelectorAll('.nav-link:not(.nav-cta)');

    if (sections.length && navLinkElements.length && 'IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.id;
                    navLinkElements.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === '#' + currentId) {
                            link.style.color = 'var(--color-accent)';
                            link.style.fontWeight = '600';
                        } else {
                            link.style.color = '';
                            link.style.fontWeight = '';
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -80px 0px'
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // ===== CHART BARS ANIMATION ON SCROLL =====
    const chartBars = document.querySelectorAll('.chart-bar');

    if ('IntersectionObserver' in window && chartBars.length) {
        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    chartBars.forEach((bar, index) => {
                        const targetHeight = bar.style.height;
                        bar.style.height = '0%';
                        setTimeout(() => {
                            bar.style.height = targetHeight;
                            bar.style.transition = `height 0.6s ease ${index * 60}ms`;
                        }, 100);
                    });
                    chartObserver.disconnect(); // Only animate once
                }
            });
        }, { threshold: 0.2 });

        const visualCard = document.querySelector('.visual-card');
        if (visualCard) {
            chartObserver.observe(visualCard);
        }
    }

    // ===== KEYBOARD TRAP FOR MOBILE NAV =====
    // Ensure focus stays within nav when open (basic implementation)
    // More robust trap would be needed for production, but this is sufficient for this scope

})();
