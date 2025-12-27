// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initHeroSection();
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

// Hero Section Animations
function initHeroSection() {
    // Animate logo shapes with stagger
    gsap.from('.shape-container', {
        scale: 0,
        rotation: 180,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        delay: 0.5
    });

    // Animate PRODUCTIONS text
    gsap.from('.productions-text', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1.2
    });

    // Animate tagline
    gsap.from('.tagline', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 1.5
    });

    // Shape and color configurations
    const shapeConfigs = [
        { shape: 'square', colors: ['#2ECC71', '#27AE60'] },
        { shape: 'circle', colors: ['#5DADE2', '#3498DB'] },
        { shape: 'square', colors: ['#A855F7', '#9333EA'] },
        { shape: 'circle', colors: ['#EC4899', '#DB2777'] },
        { shape: 'square', colors: ['#F1C40F', '#F39C12'] },
        { shape: 'circle', colors: ['#FF7F50', '#FF6347'] },
        { shape: 'square', colors: ['#10B981', '#059669'] },
        { shape: 'circle', colors: ['#F59E0B', '#D97706'] }
    ];

    // Function to morph shapes
    function morphShape(container, shapeConfig) {
        const digitShape = container.querySelector('.digit-shape');
        
        // Kill any ongoing animations on this specific shape
        gsap.killTweensOf(digitShape);
        
        // Pop out animation
        const tl = gsap.timeline();
        
        tl.to(digitShape, {
            scale: 0.3,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in'
        })
        .call(() => {
            // Remove old classes
            digitShape.classList.remove('square', 'circle');
            // Add new shape class
            digitShape.classList.add(shapeConfig.shape);
            // Update gradient
            digitShape.style.background = `linear-gradient(135deg, ${shapeConfig.colors[0]}, ${shapeConfig.colors[1]})`;
            // Reset transform to prevent snap
            gsap.set(digitShape, { rotation: 0 });
        })
        .to(digitShape, {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            ease: 'back.out(1.7)'
        })
        .then(() => {
            // Restart the continuous float animation for this shape
            restartFloatAnimation(container);
        });
    }
    
    // Function to restart float animation for a specific shape
    function restartFloatAnimation(container) {
        const digitShape = container.querySelector('.digit-shape');
        const shapeClass = container.className.match(/shape-(\d)/)[1];
        
        const animations = {
            '1': { y: -8, rotation: -3, duration: 2.5, delay: 0 },
            '2': { y: 8, rotation: 3, duration: 2.8, delay: 0.3 },
            '3': { y: -8, rotation: 3, duration: 2.3, delay: 0.6 },
            '4': { y: 8, rotation: -3, duration: 2.6, delay: 0.9 }
        };
        
        const anim = animations[shapeClass];
        if (anim) {
            gsap.to(digitShape, {
                y: anim.y,
                rotation: anim.rotation,
                duration: anim.duration,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: anim.delay
            });
        }
    }

    // Cycle shapes every 2 seconds
    let currentIndex = 0;
    setInterval(() => {
        const containers = document.querySelectorAll('.shape-container');
        containers.forEach((container, i) => {
            const configIndex = (currentIndex + i) % shapeConfigs.length;
            setTimeout(() => {
                morphShape(container, shapeConfigs[configIndex]);
            }, i * 150);
        });
        currentIndex = (currentIndex + 1) % shapeConfigs.length;
    }, 2000);

    // Continuous subtle animation for shapes
    gsap.to('.shape-1 .digit-shape', {
        y: -8,
        rotation: -3,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.shape-2 .digit-shape', {
        y: 8,
        rotation: 3,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.3
    });

    gsap.to('.shape-3 .digit-shape', {
        y: -8,
        rotation: 3,
        duration: 2.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.6
    });

    gsap.to('.shape-4 .digit-shape', {
        y: 8,
        rotation: -3,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.9
    });

    // Cursor tracking for 3D tilt effect on PRODUCTIONS text
    const productionsText = document.querySelector('.productions-text');
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth tilt animation using requestAnimationFrame
    function updateTilt() {
        const { innerWidth, innerHeight } = window;
        
        // Calculate percentage position
        const xPercent = (mouseX / innerWidth - 0.5) * 2; // -1 to 1
        const yPercent = (mouseY / innerHeight - 0.5) * 2; // -1 to 1
        
        // Apply 3D tilt to PRODUCTIONS text
        gsap.to(productionsText, {
            rotationY: xPercent * 12,
            rotationX: -yPercent * 12,
            duration: 0.8,
            ease: 'power2.out'
        });
        
        requestAnimationFrame(updateTilt);
    }
    
    // Start the tilt animation loop
    updateTilt();

    // Add hover effect for shapes
    document.querySelectorAll('.digit-shape').forEach((shape, index) => {
        shape.addEventListener('mouseenter', () => {
            gsap.to(shape, {
                scale: 1.12,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        shape.addEventListener('mouseleave', () => {
            gsap.to(shape, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}
