// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
});

// Header Animations
function initHeader() {
    // Animate header on page load
    gsap.from('.header', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.4)'
    });

    // Animate logo digits
    gsap.from('.logo-digit', {
        y: -8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'bounce.out',
        delay: 0.4
    });

    // Animate logo
    animateLogo();

    // Animate menu items
    gsap.from('.menu-item', {
        scale: 0.5,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(2)',
        delay: 0.6
    });

    // Header scroll effect - subtle scale
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const header = document.querySelector('.header');

        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down - slightly smaller
            gsap.to(header, {
                scale: 0.92,
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            // Scrolling up - normal size
            gsap.to(header, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power3.inOut'
                });
            }
        });
    });
}

// Logo Animation - Playful 2020
function animateLogo() {
    const colors = ['#FF6B35', '#A855F7', '#84CC16', '#FFFFFF', '#C4B5FD', '#FDE047']; // orange, purple, lime, white, lavender, yellow
    
    // Animate first "20" together
    gsap.to(['.digit-1', '.digit-2'], {
        y: -1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    // Animate second "20" together
    gsap.to(['.digit-3', '.digit-4'], {
        y: 1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.7
    });

    // Color cycling animation - all digits same color
    const logo = document.querySelector('.logo');
    let colorIndex = 0;
    
    function cycleColor() {
        colorIndex = (colorIndex + 1) % colors.length;
        gsap.to('.logo-digit', {
            color: colors[colorIndex],
            duration: 1.5,
            ease: 'power2.inOut'
        });
    }
    
    // Start cycling colors every 2 seconds
    setInterval(cycleColor, 2000);

    // Add playful rotation on hover
    document.querySelector('.logo').addEventListener('mouseenter', () => {
        gsap.to('.logo-digit', {
            rotation: 360,
            scale: 1.1,
            duration: 0.6,
            stagger: 0.05,
            ease: 'back.out(2)'
        });
    });

    document.querySelector('.logo').addEventListener('mouseleave', () => {
        gsap.to('.logo-digit', {
            rotation: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
        });
    });
}
