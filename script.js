// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Force scroll to top immediately (before any rendering)
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

// Loading Screen Animation
function initLoadingScreen(onReveal) {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingDigits = document.querySelectorAll('.loading-digit');
    const digitGlows = document.querySelectorAll('.digit-glow');
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingPercentage = document.querySelector('.loading-percentage');
    const loadingText = document.querySelector('.loading-text');
    const loadingBarContainer = document.querySelector('.loading-bar-container');
    const loadingParticles = document.querySelector('.loading-particles');
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255, 107, 53, 0.6)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.boxShadow = '0 0 10px rgba(255, 107, 53, 0.8)';
        loadingParticles.appendChild(particle);
        
        // Animate particle
        gsap.to(particle, {
            y: -100 - Math.random() * 200,
            x: (Math.random() - 0.5) * 100,
            opacity: 0,
            duration: 2 + Math.random() * 3,
            repeat: -1,
            delay: Math.random() * 2,
            ease: 'power1.out'
        });
    }
    
    // Main timeline
    const tl = gsap.timeline();
    
    // Animate digits with 3D rotation effect
    tl.to(loadingDigits, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
    })
    .to(digitGlows, {
        opacity: 1,
        scale: 1.2,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
    }, '<0.2')
    .to(loadingText, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.4')
    .to(loadingBarContainer, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.3');
    
    // Pulse animation for glows
    gsap.to(digitGlows, {
        scale: 1.3,
        opacity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.2
    });
    
    // Rotate digits slightly
    gsap.to(loadingDigits, {
        rotateY: 360,
        duration: 3,
        repeat: -1,
        ease: 'none',
        stagger: 0.2
    });
    
    // Animate progress bar with percentage counter
    const progressTween = gsap.to(loadingProgress, {
        width: '100%',
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: function() {
            const progress = Math.round(this.progress() * 100);
            loadingPercentage.textContent = progress + '%';
        }
    });
    
    // Track when loading started
    const loadingStartTime = Date.now();
    const minimumLoadingTime = 2000; // Minimum 2 seconds display time
    
    // Remove loading screen after everything is ready
    return new Promise((resolve) => {
        window.addEventListener('load', () => {
            // Calculate how long the loading screen has been displayed
            const elapsedTime = Date.now() - loadingStartTime;
            const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
            
            setTimeout(() => {
                // Final animation sequence
                const exitTl = gsap.timeline({
                    onComplete: () => {
                        loadingScreen.style.display = 'none';
                        resolve();
                    }
                });
                
                exitTl
                    .to(loadingProgress, {
                        width: '100%',
                        duration: 0.3,
                        ease: 'power2.out'
                    })
                    .to(loadingPercentage, {
                        innerText: 100,
                        duration: 0.3,
                        snap: { innerText: 1 },
                        ease: 'power2.out',
                        onUpdate: function() {
                            loadingPercentage.textContent = Math.round(this.targets()[0].innerText) + '%';
                        }
                    }, '<')
                    .to([loadingBarContainer, loadingText], {
                        opacity: 0,
                        y: 20,
                        duration: 0.4,
                        ease: 'power2.in'
                    }, '+=0.2')
                    .to(loadingDigits, {
                        scale: 1.5,
                        opacity: 0,
                        rotateX: 90,
                        duration: 0.6,
                        stagger: 0.05,
                        ease: 'back.in(2)'
                    }, '-=0.2')
                    .call(() => {
                        // Initialize site animations (sets opacity: 0)
                        if (onReveal) onReveal();
                        // Reveal container (content is hidden by GSAP now)
                        document.body.classList.add('loaded');
                    })
                    .to(loadingScreen, {
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.inOut'
                    }, '-=0.3');
            }, remainingTime);
        });
    });
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Ensure we're at the top
    window.scrollTo(0, 0);

    // Initialize loading screen first
    initLoadingScreen(() => {
        // Initialize site animations right before loading screen fades out
        initHeader();
        initHeroSection();
        initAboutSection();
        initProjectSection();
        initServicesSection();
    });
});

// Some browsers restore scroll position after DOMContentLoaded (bfcache/pageshow).
// This ensures we still reset to the top.
window.addEventListener('pageshow', (event) => {
    // Force scroll to top on page show
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 0);
    
    // If page was cached (back/forward), reload to reset state
    if (event.persisted) {
        window.location.reload();
    }
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

    // Smooth scroll for navigation links (no ScrollToPlugin required)
    // This site uses a scroll-driven transition rather than real section offsets,
    // so we map anchors to ScrollTrigger progress positions.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href) return;

            const st = ScrollTrigger.getById('homeToAbout');
            if (!st) return;

            const progressMap = {
                '#home': 0,
                '#about': 0.65,
                '#services': 0.85,
                '#contact': 1
            };

            if (!(href in progressMap)) return;
            e.preventDefault();

            const targetY = st.start + (st.end - st.start) * progressMap[href];
            window.scrollTo({ top: targetY, behavior: 'smooth' });
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
    // Set initial hidden state for text elements to prevent flash
    gsap.set('.productions-text', { y: 50, opacity: 0 });
    gsap.set('.tagline', { y: 30, opacity: 0 });
    
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

    // Set initial unique colors for each shape
    const containers = document.querySelectorAll('.shape-container');
    containers.forEach((container, i) => {
        const digitShape = container.querySelector('.digit-shape');
        const config = shapeConfigs[i % shapeConfigs.length];
        digitShape.style.background = `linear-gradient(135deg, ${config.colors[0]}, ${config.colors[1]})`;
    });

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
    gsap.to('.productions-text', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 2.0
    });

    // Animate tagline
    gsap.to('.tagline', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        delay: 2.3,
        onComplete: () => {
            document.body.classList.add('intro-done');
            // Rebuild the scroll timeline to ensure it picks up the correct starting positions
            // and clears any conflicting transforms from the entrance animation
            if (window.rebuildHomeToAbout) {
                window.rebuildHomeToAbout();
            }
        }
    });

    // Function to morph shapes
    function morphShape(container, shapeConfig) {
        const digitShape = container.querySelector('.digit-shape');

        // If a previous morph timeline exists, kill it so we don't stack popouts
        if (digitShape.__morphTl) {
            digitShape.__morphTl.kill();
            digitShape.__morphTl = null;
        }
        
        // Kill any ongoing animations on this specific shape
        gsap.killTweensOf(digitShape);
        
        // Pop out animation
        const tl = gsap.timeline();
        digitShape.__morphTl = tl;
        
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
        })
        .eventCallback('onComplete', () => {
            if (digitShape.__morphTl === tl) digitShape.__morphTl = null;
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
    // Use a run id so any pending timeouts don't fire after we stop morphing.
    let morphRunId = 0;

    function randIndex(max) {
        return Math.floor(Math.random() * max);
    }

    function tickMorph(runId) {
        if (runId !== morphRunId) return;
        const containers = document.querySelectorAll('.shape-container');
        
        // Get array of available config indices
        const availableIndices = Array.from({ length: shapeConfigs.length }, (_, i) => i);
        // Shuffle the array to randomize
        for (let i = availableIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
        }
        
        containers.forEach((container, i) => {
            // Use different config for each shape (ensure no duplicates)
            const configIndex = availableIndices[i % availableIndices.length];
            setTimeout(() => {
                if (runId !== morphRunId) return;
                morphShape(container, shapeConfigs[configIndex]);
            }, i * 150);
        });
    }

    function startMorph() {
        if (window.shapeMorphInterval) return;
        morphRunId += 1;
        const runId = morphRunId;
        window.shapeMorphInterval = setInterval(() => tickMorph(runId), 2000);
    }

    function stopMorph() {
        // Invalidate any pending timeouts for the current cycle
        morphRunId += 1;
        if (window.shapeMorphInterval) {
            clearInterval(window.shapeMorphInterval);
            window.shapeMorphInterval = null;
        }

        // Kill any in-flight morph timelines/tweens so a mid-popout scroll doesn't glitch.
        document.querySelectorAll('.shape-container').forEach((container) => {
            const digitShape = container.querySelector('.digit-shape');
            const digit = container.querySelector('.shape-digit');
            const icon = container.querySelector('.shape-icon');

            if (digitShape && digitShape.__morphTl) {
                digitShape.__morphTl.kill();
                digitShape.__morphTl = null;
            }

            if (digitShape) gsap.killTweensOf(digitShape);
            if (digit) gsap.killTweensOf(digit);
            if (icon) gsap.killTweensOf(icon);

            // Reset to stable home state; scroll timeline will take over from here.
            if (digitShape) gsap.set(digitShape, { scale: 1, opacity: 1 });
            if (digit) gsap.set(digit, { autoAlpha: 1 });
            if (icon) gsap.set(icon, { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' });
        });
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

    // Add continuous floating animation to shape-containers using ticker
    const floatData = [
        { selector: '.shape-container.shape-1', amplitude: 8, speed: 3.2, offset: 0 },
        { selector: '.shape-container.shape-2', amplitude: -8, speed: 3.5, offset: 0.4 },
        { selector: '.shape-container.shape-3', amplitude: 8, speed: 2.9, offset: 0.8 },
        { selector: '.shape-container.shape-4', amplitude: -8, speed: 3.3, offset: 1.2 }
    ];

    const floatElements = floatData.map(data => ({
        element: document.querySelector(data.selector),
        amplitude: data.amplitude,
        speed: data.speed,
        offset: data.offset,
        startTime: Date.now()
    }));

    // Use GSAP ticker for continuous floating
    gsap.ticker.add(() => {
        const currentTime = (Date.now() / 1000);
        
        // Get scroll progress to reduce floating in about section
        const homeToAboutTrigger = ScrollTrigger.getById('homeToAbout');
        const scrollProgress = homeToAboutTrigger ? homeToAboutTrigger.progress : 0;
        
        // Reduce amplitude as we scroll into about section (after 30% progress)
        const amplitudeScale = scrollProgress > 0.3 ? Math.max(0.2, 1 - (scrollProgress - 0.3) * 1.4) : 1;
        
        floatElements.forEach(({ element, amplitude, speed, offset }) => {
            if (!element) return;
            const phase = ((currentTime + offset) / speed) * Math.PI * 2;
            const floatY = Math.sin(phase) * amplitude * amplitudeScale *0.5;
            gsap.set(element, { yPercent: floatY });
        });
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
    const aboutSection = document.querySelector('.about-section');
    const aboutTitle = document.querySelector('.about-title');
    const aboutText = document.querySelector('.about-text');
    const shapes = Array.from(document.querySelectorAll('.shape-container'));
    const shapeEls = shapes.map((shape) => ({
        shape,
        digitShape: shape.querySelector('.digit-shape'),
        digit: shape.querySelector('.shape-digit'),
        icon: shape.querySelector('.shape-icon')
    }));
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
        gsap.set(aboutSection, { opacity: 0, visibility: 'visible', backgroundColor: '#FFFFFF' });
        gsap.set(aboutTitle, { color: '#0D0D0D' });
        gsap.set(getImpactLines(), { color: '#0D0D0D' });
        gsap.set(aboutText, { color: '#0D0D0D' });
        
        // Only reset text visibility if we're not in the initial load phase
        // or if we are rebuilding due to resize after intro
        if (document.body.classList.contains('intro-done')) {
            gsap.set([productionsText, tagline], { clearProps: 'transform', autoAlpha: 1 });
        }

        shapeEls.forEach(({ digitShape, digit, icon }) => {
            gsap.set(digitShape, { scale: 1 });
            gsap.set(digit, { autoAlpha: 1 });
            gsap.set(icon, { autoAlpha: 0, scale: 0.6 });
        });

        // Reset shape-container scale to 1 at start
        shapes.forEach(shape => gsap.set(shape, { scale: 1 }));

        // Precompute deltas at rest
        // Force About to be layout-visible during measurements to prevent zeroed rects.
        const iconTargets = getIconTargets();

        // Size icon targets to match the computed line-height of the About description.
        // This makes the landed icons feel "inline" with the text.
        const aboutTextStyle = window.getComputedStyle(aboutText);
        const fontSize = parseFloat(aboutTextStyle.fontSize) || 32;
        let lineHeight = parseFloat(aboutTextStyle.lineHeight);
        if (!Number.isFinite(lineHeight)) {
            lineHeight = fontSize * 1.55;
        }
        const targetSize = Math.round(lineHeight); // Container size matches line height
        const iconFontSize = Math.round(lineHeight * 1.6); // Icon font size is larger than container

        const prevAboutOpacity = gsap.getProperty(aboutSection, 'opacity');
        gsap.set(aboutSection, { opacity: 1 });
        
        // Set icon-target containers to final size BEFORE measuring so scale calculations are accurate
        gsap.set(iconTargets, { width: targetSize, height: targetSize });

        const deltas = shapeEls.map(({ shape, digitShape }, index) => {
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
                return { dx: 0, dy: 0, targetScale: 0.12, containerScale: 0.29 };
            }
            const dx = (iconRect.left + iconRect.width / 2) - (shapeRect.left + shapeRect.width / 2);
            const dy = (iconRect.top + iconRect.height / 2) - (shapeRect.top + shapeRect.height / 2);

            // Scale digit-shape down to match target size
            const digitRect = digitShape.getBoundingClientRect();
            const iconSizePx = Math.min(iconRect.width || 0, iconRect.height || 0);
            const targetScale = iconSizePx && digitRect.width ? (iconSizePx / digitRect.width) : 0.133;

            // Calculate scale for shape-container to match target size
            // shape-container wraps digit-shape (180px), so to match targetSize we need: 180 * containerScale ≈ targetSize
            const containerScale = targetSize / 180;

            return { dx, dy, targetScale: Math.max(0.08, Math.min(0.35, targetScale)), containerScale };
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
                end: () => "+=" + (window.innerHeight * 2),
                scrub: true,
                onUpdate: (self) => {
                    // Pause pop animation while scrubbing; resume only at very top.
                    // IMPORTANT: don't kill digit-shape tweens here (that would cancel the scroll-morph scaling).
                    const shouldPauseMorph = self.progress > 0.001;
                    if (shouldPauseMorph && !tl._morphPaused) {
                        tl._morphPaused = true;
                        window.__heroMorph?.stop?.();
                    } else if (!shouldPauseMorph && tl._morphPaused) {
                        tl._morphPaused = false;
                        window.__heroMorph?.start?.();
                    }

                    // Hard cut (no smooth background transition) between Home and About.
                    const shouldShowAbout = self.progress >= 0.22;
                    if (shouldShowAbout !== tl._isAboutShown) {
                        tl._isAboutShown = shouldShowAbout;
                        if (shouldShowAbout) {
                            gsap.set(aboutSection, { opacity: 1, backgroundColor: '#FFFFFF' });

                            // Once About is shown, ensure digits are hidden and icons are visible.
                            // IMPORTANT: Don't override scale here - let the timeline tween handle smooth scaling.
                            shapeEls.forEach(({ digit, icon }) => {
                                gsap.set(digit, { autoAlpha: 0 });
                                // IMPORTANT: .digit-shape uses a huge font-size (180px). Ensure icons
                                // don't inherit that when About is shown.
                                gsap.set(icon, { autoAlpha: 1, scale: 1, fontSize: iconFontSize });
                            });
                        } else {
                            gsap.set(aboutSection, { opacity: 0, backgroundColor: '#FFFFFF' });

                            // Reset to home visuals
                            shapeEls.forEach(({ digit, icon }) => {
                                gsap.set(digit, { autoAlpha: 1 });
                                gsap.set(icon, { autoAlpha: 0, scale: 0.6, clearProps: 'fontSize' });
                            });
                        }
                    }
                }
            }
        });

        // Text swap
        tl.to(productionsText, { autoAlpha: 0, y: -30, duration: 0.6, ease: 'none' }, 0);
        tl.to(tagline, { autoAlpha: 0, y: -20, duration: 0.6, ease: 'none' }, 0);

        // Shapes to targets - scale both container and digit-shape to match line height
        shapeEls.forEach(({ shape, digitShape, digit, icon }, index) => {
            const d = deltas[index];
            if (!d) return;

            // Slight eased feel while still landing exactly on target
            tl.to(shape, { x: d.dx, y: d.dy, scale: d.containerScale, duration: 1.2, ease: 'power1.inOut' }, 0);
            tl.to(digitShape, { scale: d.targetScale, duration: 1.2, ease: 'power1.inOut' }, 0);
            tl.to(digit, { autoAlpha: 0, duration: 0.35, ease: 'none' }, 0.15);
            tl.to(icon, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'none' }, 0.25);
            // Ensure icon glyph size is larger than container for better visibility
            tl.to(icon, { fontSize: iconFontSize, duration: 1.2, ease: 'power1.inOut' }, 0);
        });

        // Words slide in
        tl.to(words, { x: 0, autoAlpha: 1, duration: 0.9, ease: 'none' }, 0.35);

        return tl;
    }

    function rebuildHomeToAbout() {
        buildHomeToAboutTimeline();
        ScrollTrigger.refresh();
        ScrollTrigger.update();
    }
    
    // Expose for external calls (e.g. from initHeroSection onComplete)
    window.rebuildHomeToAbout = rebuildHomeToAbout;

    // Build once after layout settles
    const ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    ready.then(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(rebuildHomeToAbout);
        });
    });

    // Rebuild on resize (targets move)
    window.addEventListener('resize', rebuildHomeToAbout);
}

// Project Section Transition (Now transitions to Services)
function initProjectSection() {
    const canvas = document.getElementById('transition-canvas');
    const ctx = canvas.getContext('2d');
    const servicesSection = document.querySelector('.services-section');
    const aboutSection = document.querySelector('.about-section');
    const shapesLayer = document.querySelector('.shapes-layer');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Arrow colors (solid)
    const colors = ['#C1FF00', '#80D0FF', '#FF6B35'];
    const secondaryColors = ['#FF5E00', '#7B61FF', '#FFC300'];
    
    // Draw arrow function with smooth rounded corners
    function drawArrow(ctx, x, y, width, height, color, arrowTipWidth) {
        const radius = 15; // Corner radius
        const tipRadius = 20; // Radius for the arrow tip
        
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        
        // Start from top-left, after the rounded corner
        ctx.moveTo(x + radius, y);
        
        // Top edge - go to before the arrow tip area
        ctx.lineTo(x + width - arrowTipWidth, y);
        
        // Arrow tip - rounded
        // Use arcTo to create a rounded tip at the vertex
        // Control point 1: The theoretical sharp tip
        // Control point 2: The bottom corner of the arrow head base
        ctx.arcTo(x + width, y + height / 2, x + width - arrowTipWidth, y + height, tipRadius);
        
        // Bottom edge start
        ctx.lineTo(x + width - arrowTipWidth, y + height);
        
        // Bottom edge
        ctx.lineTo(x + radius, y + height);
        
        // Bottom-left rounded corner
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        
        // Left edge
        ctx.lineTo(x, y + radius);
        
        // Top-left rounded corner
        ctx.quadraticCurveTo(x, y, x + radius, y);
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    // Draw curved arrow function
    function drawCurvedArrow(ctx, cx, cy, radius, thickness, arcLength, color, rotation) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        
        // Calculate angles
        // We center the arrow at -PI/2 (top of circle)
        const totalAngle = arcLength / radius;
        const startAngle = -Math.PI / 2 - totalAngle / 2;
        const endAngle = -Math.PI / 2 + totalAngle / 2;
        const tipAngle = 80 / radius; // Approx tip length in radians
        
        const rInner = radius - thickness / 2;
        const rOuter = radius + thickness / 2;
        const cornerRadius = 15;
        
        // Angular offsets for rounded corners at the tail
        const startAngleInner = startAngle + (cornerRadius / rInner);
        const startAngleOuter = startAngle + (cornerRadius / rOuter);
        
        ctx.beginPath();
        
        // Inner edge (moving forward)
        ctx.arc(0, 0, rInner, startAngleInner, endAngle - tipAngle);
        
        // Tip
        // Calculate tip points
        const tipX = Math.cos(endAngle) * radius;
        const tipY = Math.sin(endAngle) * radius;
        const outerTipBaseX = Math.cos(endAngle - tipAngle) * rOuter;
        const outerTipBaseY = Math.sin(endAngle - tipAngle) * rOuter;
        
        // Draw rounded tip
        ctx.arcTo(tipX + 20, tipY + 20, outerTipBaseX, outerTipBaseY, 20);
        
        // Outer edge (moving backward)
        ctx.lineTo(outerTipBaseX, outerTipBaseY);
        ctx.arc(0, 0, rOuter, endAngle - tipAngle, startAngleOuter, true);
        
        // Tail rounded corners
        // Point on the back edge (outer side)
        const backOuterX = Math.cos(startAngle) * (rOuter - cornerRadius);
        const backOuterY = Math.sin(startAngle) * (rOuter - cornerRadius);
        
        // Point on the back edge (inner side)
        const backInnerX = Math.cos(startAngle) * (rInner + cornerRadius);
        const backInnerY = Math.sin(startAngle) * (rInner + cornerRadius);
        
        // Outer tail corner
        const cpOuterX = Math.cos(startAngle) * rOuter;
        const cpOuterY = Math.sin(startAngle) * rOuter;
        
        ctx.quadraticCurveTo(cpOuterX, cpOuterY, backOuterX, backOuterY);
        
        // Back edge line
        ctx.lineTo(backInnerX, backInnerY);
        
        // Inner tail corner
        const cpInnerX = Math.cos(startAngle) * rInner;
        const cpInnerY = Math.sin(startAngle) * rInner;
        
        // The start of the inner arc
        const startInnerX = Math.cos(startAngleInner) * rInner;
        const startInnerY = Math.sin(startAngleInner) * rInner;
        
        ctx.quadraticCurveTo(cpInnerX, cpInnerY, startInnerX, startInnerY);
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Animation state
    const arrowState = { progress: 0 };
    
    function renderArrows() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const rowHeight = canvas.height / 3;
        const arrowWidth = canvas.width * 3;
        const arrowTipWidth = 80;
        const overlap = arrowWidth * 0.4; // Overlap amount
        
        colors.forEach((color, i) => {
            const stagger = i * 0.05;
            const adjustedProgress = Math.max(0, Math.min(1, arrowState.progress - stagger));
            
            // Calculate x position: start offscreen left, move to cover, then exit right
            let x;
            if (adjustedProgress < 0.5) {
                // Slide in from left
                x = -arrowWidth + (adjustedProgress * 2) * (arrowWidth + canvas.width * 0.1);
            } else {
                // Slide out to right
                x = canvas.width * 0.1 + ((adjustedProgress - 0.5) * 2) * (arrowWidth + canvas.width);
            }
            
            // Trailing arrow position
            const x2 = x - arrowWidth + overlap;
            
            // Draw leading arrow first (behind)
            drawArrow(ctx, x, i * rowHeight, arrowWidth, rowHeight, color, arrowTipWidth);
            
            // Draw trailing arrow second (on top)
            drawArrow(ctx, x2, i * rowHeight, arrowWidth, rowHeight, secondaryColors[i], arrowTipWidth);
        });

        // Draw the new curved arrow during the exit phase
        if (arrowState.progress > 0.05) {
            const curvedProgress = Math.max(0, (arrowState.progress - 0.05) / 0.7);
            // Rotation: 0 to 90 degrees (0 to PI/2)
            const rotation = 1.6*curvedProgress * (Math.PI / 2)-19.8;
            
            // Pivot point away from screen (below)
            const cx = canvas.width / 2 - canvas.width * 0.45; // Shift left slightly so it sweeps nicely
            const cy = canvas.height * 2.665; // Far below
            const radius = canvas.height * 2.5 - rowHeight; // Radius to put it on screen
            
            // Only draw if it's entering/on screen
            drawCurvedArrow(
                ctx, 
                cx, 
                cy, 
                radius, 
                rowHeight, 
                arrowWidth*0.6, 
                '#FF0055', // Distinct pink/red color
                rotation
            );
            // Only draw if it's entering/on screen
            drawCurvedArrow(
                ctx, 
                cx, 
                cy, 
                radius, 
                rowHeight, 
                arrowWidth*0.5, 
                '#84ff00ff', // Distinct pink/red color
                rotation-0.3
            );
        }
    }
    
    // Create the transition timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            id: 'aboutToServices',
            trigger: document.body,
            start: () => (window.innerHeight * 2.5) + "px top",
            end: () => "+=" + (window.innerHeight * 2),
            scrub: true,
            onUpdate: (self) => {
                arrowState.progress = self.progress;
                renderArrows();
                
                // Switch sections at midpoint
                if (self.progress >= 0.5 && servicesSection.style.opacity !== '1') {
                    servicesSection.style.opacity = '1';
                    servicesSection.style.visibility = 'visible';
                    servicesSection.style.pointerEvents = 'auto';
                    aboutSection.style.opacity = '0';
                    shapesLayer.style.opacity = '0';
                } else if (self.progress < 0.5 && aboutSection.style.opacity !== '1') {
                    servicesSection.style.opacity = '0';
                    servicesSection.style.visibility = 'hidden';
                    servicesSection.style.pointerEvents = 'none';
                    aboutSection.style.opacity = '1';
                    shapesLayer.style.opacity = '1';
                }
            },
            onLeave: () => {
                servicesSection.style.pointerEvents = 'auto';
            },
            onEnterBack: () => {
                servicesSection.style.pointerEvents = 'none';
            }
        }
    });
    
    // Initial render
    renderArrows();
}

// Services Section with Horizontal Scroll
function initServicesSection() {
    const servicesSection = document.querySelector('.services-section');
    const track = document.querySelector('.services-track');
    const tiles = Array.from(document.querySelectorAll('.service-tile'));
    const projectsSection = document.querySelector('.projects-section');
    
    if (!servicesSection || !track || tiles.length === 0) return;
    
    // Configuration
    const tileWidth = 300; // Match CSS width
    const gap = 40; // Match CSS gap
    const totalTileWidth = tileWidth + gap;
    
    // Calculate start position to center the first tile
    // Track starts at 0. We want first tile (0px) to be at center.
    // Structure: Padding(50) | Arrow(80) | Gap(40) | Tile1(300) ...
    const arrowWidth = 80;
    const arrowGap = 40; // Flex gap
    const trackPadding = 50;
    
    // Distance from start of track (inside padding) to start of first tile
    const firstTileStartOffset = arrowWidth + arrowGap;
    
    // Distance from left edge of screen to center of first tile
    const offsetToFirstTileCenter = trackPadding + firstTileStartOffset + (tileWidth / 2);
    
    // Correction factor: Shift left to fix visual centering
    // If tiles are to the right of center, we need to subtract more (move track left)
    const correction = 45; 
    const startX = (window.innerWidth / 2) - offsetToFirstTileCenter - correction;
    
    // Calculate total scroll distance to center the last tile
    // Last tile position is at index * totalTileWidth
    const lastTilePosition = (tiles.length - 1) * totalTileWidth;
    
    // Pre-calculate center point for performance
    // Adjust center point by correction to match visual center
    const centerPoint = (window.innerWidth / 2) - correction;

    // Function to update tile positions and scaling
    const updateTiles = (progress) => {
        // Horizontal scroll: Move from startX to (startX - lastTilePosition)
        const currentX = startX - (progress * lastTilePosition);
        gsap.set(track, { x: currentX });
        
        // Smooth Center Scaling Effect
        tiles.forEach((tile, i) => {
            // Calculate where this tile is relative to the track start (excluding padding)
            // Tile i pos = FirstTileStart + (i * (TileWidth + Gap))
            const tileRelativePos = firstTileStartOffset + (i * totalTileWidth);
            
            // Calculate its current screen position
            // ScreenPos = CurrentTrackX + Padding + TileRelativePos + HalfTileWidth
            // Note: We don't include 'correction' here because it's part of currentX
            // But since currentX includes the correction shift, the tileScreenPos is the ACTUAL screen position.
            // And since we shifted the track left to make it LOOK centered, the "Visual Center" is actually shifted left.
            // So we compare against (Center - Correction).
            const tileScreenPos = currentX + trackPadding + tileRelativePos + (tileWidth / 2);
            
            const distance = Math.abs(centerPoint - tileScreenPos);
            
            // Calculate scale based on distance from center
            // Max scale 1.3, Min scale 0.9
            // Effect range: 600px from center
            let scale = 1.3 - (distance / 600);
            scale = Math.max(0.9, Math.min(1.3, scale));
            
            // Z-index: higher for centered items
            const zIndex = Math.round(scale * 100);
            
            // Opacity: fade out distant items slightly
            let opacity = 1 - (distance / 1200);
            opacity = Math.max(0.4, Math.min(1, opacity));
            
            // Apply transforms
            gsap.set(tile, { 
                scale: scale, 
                zIndex: zIndex,
                opacity: opacity,
                filter: `blur(${Math.max(0, (distance - 200)/100)}px)`
            });
        });
    };
    
    // Initial setup - Run ONCE immediately to set initial state (centered & scaled)
    updateTiles(0);
    
    // Create scroll animation
    const scrollTl = gsap.timeline({
        scrollTrigger: {
            id: 'servicesScroll',
            trigger: document.body,
            // Start right after the arrow transition
            start: () => (window.innerHeight * 4.5) + "px top",
            end: () => "+=" + (window.innerHeight * 4), // Adjust length as needed
            scrub: 0.5, // Add smoothing to reduce jitter
            onUpdate: (self) => {
                updateTiles(self.progress);
            }
        }
    });
    
    // Transition to Projects Section
    // This triggers when we scroll PAST the end of the services scroll
    ScrollTrigger.create({
        trigger: document.body,
        start: () => (window.innerHeight * 8.5) + "px top", // 4.5 + 4 (end of services)
        end: () => "+=" + window.innerHeight,
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const lastTile = tiles[tiles.length - 1];
            const servicesTitle = document.querySelector('.services-title');
            const projectItems = document.querySelectorAll('.project-item');
            
            if (lastTile && projectsSection) {
                const tileText = lastTile.querySelectorAll('.tile-title, .tile-desc, .service-tile::before, .service-tile::after');
                const tileArrow = lastTile.querySelector('.tile-icon');

                // Scale up the last tile to fill screen
                // We need a massive scale to cover the screen from the center
                // Start scaling from 1.3 (max scale from previous anim)
                const scale = 1.3 + (progress * 25); 
                
                gsap.set(lastTile, { 
                    scale: scale,
                    zIndex: 1000,
                    opacity: 1,
                    filter: 'blur(0px)'
                });

                // Fade out Services Title & Tile Text immediately
                if (servicesTitle) {
                    gsap.set(servicesTitle, { opacity: 1 - (progress * 8) });
                }
                gsap.set(tileText, { opacity: 1 - (progress * 8) });

                // Handle Arrow: Keep it visible longer, move down, counter-scale
                if (tileArrow) {
                    // Counter-scale to keep arrow roughly same visual size
                    // As tile scales up, we scale arrow down
                    const counterScale = 1 / (scale / 1.3); 
                    
                    gsap.set(tileArrow, {
                        scale: counterScale,
                        y: progress * 300, // Move down relative to tile (which is scaling)
                        opacity: 1 - (progress * 3) // Fade out by 33%
                    });
                }
                
                // Hide other tiles to prevent them from showing on edges
                if (progress > 0.05) {
                    tiles.forEach((t, i) => {
                        if (i !== tiles.length - 1) {
                            gsap.set(t, { opacity: 1 - (progress * 10) });
                        }
                    });
                }

                // Reveal Projects Section
                // As the black tile expands, we fade in the projects section
                if (progress > 0.2) {
                    projectsSection.style.visibility = 'visible';
                    projectsSection.style.pointerEvents = 'auto';
                    projectsSection.style.opacity = 1;
                    
                    // Staggered Fade In for Project Items
                    // Map progress 0.2 -> 1.0 to item opacity
                    const projectProgress = (progress - 0.2) / 0.8;
                    
                    projectItems.forEach((item, i) => {
                        // Stagger logic: items appear one by one
                        const start = i * 0.15;
                        const end = start + 0.4;
                        const itemProgress = (projectProgress - start) / (end - start);
                        const clamped = Math.max(0, Math.min(1, itemProgress));
                        
                        gsap.set(item, {
                            opacity: clamped,
                            y: 100 * (1 - clamped), // Slide up from 100px
                            scale: 0.9 + (0.1 * clamped) // Subtle scale up
                        });
                    });

                    // Hide services section container when fully covered
                    if (progress > 0.8) {
                        servicesSection.style.opacity = 0;
                    } else {
                        servicesSection.style.opacity = 1;
                    }
                } else {
                    projectsSection.style.visibility = 'hidden';
                    projectsSection.style.pointerEvents = 'none';
                    projectsSection.style.opacity = 0;
                    servicesSection.style.opacity = 1;
                }
            }
        }
    });
    
    // Initial render call to set positions before scroll
    // We simulate a progress of 0
    const initialEvent = { progress: 0 };
    // We can't easily call the onUpdate manually without the self object, 
    // but the ScrollTrigger will fire on init usually.
}
