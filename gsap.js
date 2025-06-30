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
    rotationRange: 15, // Reduced rotation for smoother effect
    moveRange: 8, // Reduced movement range
    backCardFactor: 0.4, // Reduced back card movement
    mobileRotationRange: 5, // Very subtle rotation for mobile
    mobileMovementRange: 3, // Minimal movement for mobile
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
        const { left, top, width, height } = bounds;
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;

        // Check if we're on mobile/tablet
        const isMobile = window.innerWidth <= 991;
        const currentRotationRange = isMobile ? cardSettings.mobileRotationRange : cardSettings.rotationRange;
        const currentMovementRange = isMobile ? cardSettings.mobileMovementRange : cardSettings.moveRange;

        // Calculate rotation based on mouse position
        const rotateY = mapRange(mouseX, 0, width, -currentRotationRange, currentRotationRange);
        const rotateX = mapRange(mouseY, 0, height, currentRotationRange, -currentRotationRange);

        // Animate front card with reduced Y movement
        gsap.to(frontCard, {
            rotationX: rotateX,
            rotationY: rotateY,
            x: (mouseX - centerX) * (currentMovementRange / 100),
            y: (mouseY - centerY) * (currentMovementRange / 200), // Reduced Y movement
            duration: isMobile ? 0.8 : 0.5,
            ease: 'power2.out'
        });

        // Animate back card with reduced effect
        gsap.to(backCard, {
            rotationX: rotateX * cardSettings.backCardFactor,
            rotationY: rotateY * cardSettings.backCardFactor,
            x: (mouseX - centerX) * (currentMovementRange / 200),
            y: (mouseY - centerY) * (currentMovementRange / 400), // Reduced Y movement
            duration: isMobile ? 1 : 0.7,
            ease: 'power2.out'
        });
    }

    // Reset animation
    function handleMouseLeave() {
        // Return cards to original position
        gsap.to([frontCard, backCard], {
            rotationX: 0,
            rotationY: 0,
            x: 0,
            y: 0,
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