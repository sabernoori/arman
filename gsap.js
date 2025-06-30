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
    rotationRange: 25, // Increased rotation range
    moveRange: 15, // Increased movement range
    backCardFactor: 0.6, // Increased back card movement
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

        // Calculate rotation based on mouse position
        const rotateY = mapRange(mouseX, 0, width, -cardSettings.rotationRange, cardSettings.rotationRange);
        const rotateX = mapRange(mouseY, 0, height, cardSettings.rotationRange, -cardSettings.rotationRange);

        // Animate front card
        gsap.to(frontCard, {
            rotationX: rotateX,
            rotationY: rotateY,
            x: (mouseX - centerX) * 0.1,
            y: (mouseY - centerY) * 0.1,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Animate back card with reduced effect
        gsap.to(backCard, {
            rotationX: rotateX * cardSettings.backCardFactor,
            rotationY: rotateY * cardSettings.backCardFactor,
            x: (mouseX - centerX) * 0.05,
            y: (mouseY - centerY) * 0.05,
            duration: 0.7,
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

    // Initialize animations
    setupCardAnimation();
});

// Backup initialization for when GSAP loads later
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        setupCardAnimation();
    }
});