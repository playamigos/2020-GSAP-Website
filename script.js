// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initHeroSection();
    initAboutSection();
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
        .add(() => {
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

    // Cycle shapes every 2 seconds (pop-out / pop-in)
    let currentIndex = 0;

    function tickMorph() {
        const containers = document.querySelectorAll('.shape-container');
        containers.forEach((container, i) => {
            const configIndex = (currentIndex + i) % shapeConfigs.length;
            setTimeout(() => {
                morphShape(container, shapeConfigs[configIndex]);
            }, i * 150);
        });
        currentIndex = (currentIndex + 1) % shapeConfigs.length;
    }

    function startMorph() {
        if (window.shapeMorphInterval) return;
        window.shapeMorphInterval = setInterval(tickMorph, 2000);
    }

    function stopMorph() {
        if (!window.shapeMorphInterval) return;
        clearInterval(window.shapeMorphInterval);
        window.shapeMorphInterval = null;
    }

    // Expose so scroll section can pause/resume
    window.__heroMorph = {
        start: startMorph,
        stop: stopMorph
    };

    startMorph();

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

// About Section with Scroll Animations
function initAboutSection() {
    const homeSection = document.querySelector('.home-section');
    const aboutSection = document.querySelector('.about-section');
    const aboutTitle = document.querySelector('.about-title');
    const aboutText = document.querySelector('.about-text');
    const shapes = document.querySelectorAll('.shape-container');
    const productionsText = document.querySelector('.productions-text');
    const tagline = document.querySelector('.tagline');
    
    // Function to wrap text nodes in spans while preserving HTML and spacing
    function wrapTextNodes(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        let wordIndex = 0;
        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            if (!text.trim()) return; // Skip empty text nodes
            
            // Split by spaces but keep the spaces
            const parts = text.split(/( +)/);
            const fragment = document.createDocumentFragment();
            
            parts.forEach(part => {
                if (part.trim().length > 0) {
                    // It's a word
                    const span = document.createElement('span');
                    span.className = `word word-${wordIndex % 2 === 0 ? 'left' : 'right'}`;
                    span.textContent = part;
                    fragment.appendChild(span);
                    wordIndex++;
                } else if (part.length > 0) {
                    // It's space(s)
                    fragment.appendChild(document.createTextNode(part));
                }
            });
            
            textNode.replaceWith(fragment);
        });
    }
    
    // Normalize whitespace first so wrapped words don't inherit indentation/newlines
    aboutTitle.innerHTML = aboutTitle.innerHTML.replace(/\s+/g, ' ').trim();
    aboutText.innerHTML = aboutText.innerHTML.replace(/\s+/g, ' ').trim();

    wrapTextNodes(aboutTitle);
    wrapTextNodes(aboutText);

    // IMPORTANT: icon targets are recreated when we rewrite innerHTML / wrap text.
    // Never cache them before the DOM changes.
    const getIconTargets = () => Array.from(document.querySelectorAll('.icon-target'));
    const getImpactLines = () => Array.from(aboutSection.querySelectorAll('.impact-line'));
    
    // Build a single scrubbed timeline (precompute offsets once so shapes land exactly on targets)
    function buildHomeToAboutTimeline() {
        // Kill existing triggers/tweens from previous builds
        const existing = ScrollTrigger.getById('homeToAbout');
        if (existing) existing.kill();

        gsap.killTweensOf(shapes);
        shapes.forEach(shape => gsap.set(shape, { x: 0, y: 0 }));

        // Ensure consistent starting state
        // NOTE: Avoid visibility:hidden here because Safari can report zeroed rects
        // for descendants when an ancestor is visibility:hidden.
        gsap.set(aboutSection, { opacity: 0, visibility: 'visible', backgroundColor: 'rgba(13, 13, 13, 0.88)' });
        gsap.set(aboutTitle, { color: '#FFFFFF' });
        gsap.set(aboutText, { color: '#B0B0B0' });
        gsap.set([productionsText, tagline], { clearProps: 'transform', autoAlpha: 1 });

        shapes.forEach(shape => {
            const digitShape = shape.querySelector('.digit-shape');
            const digit = shape.querySelector('.shape-digit');
            const icon = shape.querySelector('.shape-icon');

            gsap.set(digitShape, { scale: 1 });
            gsap.set(digit, { autoAlpha: 1 });
            gsap.set(icon, { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' });
        });

        // Precompute deltas at rest
        // Force About to be layout-visible during measurements to prevent zeroed rects.
        const iconTargets = getIconTargets();
        const prevAboutOpacity = gsap.getProperty(aboutSection, 'opacity');
        gsap.set(aboutSection, { opacity: 1 });

        const deltas = Array.from(shapes).map((shape, index) => {
            const iconTarget = iconTargets[index];
            if (!iconTarget) return null;

            const shapeRect = shape.getBoundingClientRect();
            let iconRect = iconTarget.getBoundingClientRect();
            if (!iconRect.width || !iconRect.height) {
                const rects = iconTarget.getClientRects();
                if (rects && rects.length) iconRect = rects[0];
            }

            // If the target is still invalid, fall back to no movement (prevents corner jump).
            if (!iconRect.width || !iconRect.height) {
                return { dx: 0, dy: 0, targetScale: 0.12 };
            }
            const dx = (iconRect.left + iconRect.width / 2) - (shapeRect.left + shapeRect.width / 2);
            const dy = (iconRect.top + iconRect.height / 2) - (shapeRect.top + shapeRect.height / 2);

            // Scale digit-shape down to match target size
            const digitShape = shape.querySelector('.digit-shape');
            const digitRect = digitShape.getBoundingClientRect();
            const targetScale = iconRect.width && digitRect.width ? (iconRect.width / digitRect.width) : 0.133;

            return { dx, dy, targetScale: Math.max(0.08, Math.min(0.2, targetScale)) };
        });

        gsap.set(aboutSection, { opacity: prevAboutOpacity });

        // Set initial offsets for word slides
        const words = aboutSection.querySelectorAll('.word');
        words.forEach(word => {
            const isLeft = word.classList.contains('word-left');
            gsap.set(word, { x: isLeft ? -90 : 90, autoAlpha: 0 });
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                id: 'homeToAbout',
                trigger: document.body,
                start: 'top top',
                end: '+=200%',
                scrub: true,
                onUpdate: (self) => {
                    // Pause pop animation while scrubbing; resume only at very top
                    if (self.progress > 0.001) {
                        window.__heroMorph?.stop?.();
                    } else {
                        window.__heroMorph?.start?.();
                    }
                }
            }
        });

        // Text swap + About dissolve
        tl.to(productionsText, { autoAlpha: 0, y: -30, duration: 0.6, ease: 'none' }, 0);
        tl.to(tagline, { autoAlpha: 0, y: -20, duration: 0.6, ease: 'none' }, 0);

        // About layer fades in slowly (dissolve)
        tl.to(aboutSection, { opacity: 1, duration: 1.2, ease: 'none' }, 0.05);

        // Background color dissolves from dark -> light (solid colors, partial opacity)
        tl.to(aboutSection, { backgroundColor: 'rgba(255, 255, 255, 0.88)', duration: 1.2, ease: 'none' }, 0.12);

        // Text colors dissolve in sync for readability
        tl.to(aboutTitle, { color: '#0D0D0D', duration: 1.2, ease: 'none' }, 0.12);
        tl.to(getImpactLines(), { color: '#0D0D0D', duration: 1.2, ease: 'none' }, 0.12);
        tl.to(aboutText, { color: 'rgba(13, 13, 13, 0.72)', duration: 1.2, ease: 'none' }, 0.12);

        // Shapes to targets
        shapes.forEach((shape, index) => {
            const d = deltas[index];
            if (!d) return;

            const digitShape = shape.querySelector('.digit-shape');
            const digit = shape.querySelector('.shape-digit');
            const icon = shape.querySelector('.shape-icon');

            // Slight eased feel while still landing exactly on target
            tl.to(shape, { x: d.dx, y: d.dy, duration: 1.2, ease: 'power1.inOut' }, 0);
            tl.to(digitShape, { scale: d.targetScale, duration: 1.2, ease: 'power1.inOut' }, 0);
            tl.to(digit, { autoAlpha: 0, duration: 0.35, ease: 'none' }, 0.15);
            tl.to(icon, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'none' }, 0.25);
        });

        // Words slide in
        tl.to(words, { x: 0, autoAlpha: 1, duration: 0.9, ease: 'none' }, 0.35);

        return tl;
    }

    // Build once after layout settles
    const ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    ready.then(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                buildHomeToAboutTimeline();
                ScrollTrigger.refresh();
                ScrollTrigger.update();
            });
        });
    });

    // Rebuild on resize (targets move)
    window.addEventListener('resize', () => {
        buildHomeToAboutTimeline();
        ScrollTrigger.refresh();
        ScrollTrigger.update();
    });
}
