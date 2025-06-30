// Wait for GSAP to be available
window.addEventListener('load', () => {
    if (typeof gsap === 'undefined') {
        console.error('GSAP is not loaded. Please ensure you have included the GSAP library.');
        return;
    }
    
    // Initialize GSAP
    gsap.registerPlugin(Observer);

// Card animation settings
const cardSettings = {
    perspective: 1000,
    transformOrigin: 'center center',
    rotationRange: 8,
    moveRange: 4
};

// Helper function to map mouse position to rotation
function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

// Setup card animations
function setupCardAnimation() {
    const cardWrapper = document.querySelector('.center_cards-wrapper');
    const frontCard = document.querySelector('.card_frontt');
    const backCard = document.querySelector('.card_back');

    if (!cardWrapper || !frontCard || !backCard) return;

    // Add perspective to wrapper
    gsap.set(cardWrapper, {
        perspective: cardSettings.perspective,
        transformStyle: 'preserve-3d'
    });

    // Console log for debugging
    console.log('Card animation setup complete', {
        wrapper: cardWrapper,
        frontCard: frontCard,
        backCard: backCard
    });

    // Initial state
    gsap.set([frontCard, backCard], {
        transformOrigin: cardSettings.transformOrigin
    });

    // Create animation context
    let bounds = cardWrapper.getBoundingClientRect();
    let centerX = bounds.width / 2;
    let centerY = bounds.height / 2;

    // Handle mouse movement
    function handleMouseMove(e) {
        // Skip animation on mobile
        if (window.innerWidth <= 991) return;

        const { left, top, width, height } = bounds;
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;

        // Calculate rotation based on mouse position
        const rotateY = mapRange(mouseX, 0, width, -cardSettings.rotationRange, cardSettings.rotationRange);
        const rotateX = mapRange(mouseY, 0, height, cardSettings.rotationRange, -cardSettings.rotationRange);

        // Animate front card
        gsap.to(frontCard, {
            rotationX: rotateX,
            rotationY: rotateY,
            x: (mouseX - centerX) * (cardSettings.moveRange / 100),
            duration: 0.5,
            ease: 'power2.out'
        });

        // Subtle back card movement
        gsap.to(backCard, {
            rotationX: rotateX * 0.2,
            rotationY: rotateY * 0.2,
            x: (mouseX - centerX) * (cardSettings.moveRange / 200),
            duration: 0.5,
            ease: 'power2.out'
        });
    }

    // Reset animation
    function handleMouseLeave() {
        if (window.innerWidth <= 991) return;

        // Return cards to original position
        gsap.to([frontCard, backCard], {
            rotationX: 0,
            rotationY: 0,
            x: 0,
            duration: 0.7,
            ease: 'power3.out'
        });
    }

    // Update bounds on resize
    function updateBounds() {
        bounds = cardWrapper.getBoundingClientRect();
        centerX = bounds.width / 2;
        centerY = bounds.height / 2;
    }

    // Event listeners
    cardWrapper.addEventListener('mousemove', handleMouseMove);
    cardWrapper.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', updateBounds);

    // Add hover effect class
    cardWrapper.classList.add('has-mouse-tracking');
}

    // Initialize card animations
    setupCardAnimation();
});

// Backup initialization for when GSAP loads later
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        setupCardAnimation();
    }
});