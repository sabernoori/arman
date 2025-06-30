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
    rotationRange: 15,
    moveRange: 8,
    // Back card animation disabled
    // mobileRotationRange: 5, // Mobile animations disabled
    // mobileMovementRange: 3, // Mobile animations disabled
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
    gsap.set(frontCard, {
        transformOrigin: cardSettings.transformOrigin,
        clearProps: 'all'
    });
    
    gsap.set(backCard, {
        transformOrigin: cardSettings.transformOrigin,
        z: -10
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

        // Determine which card is being hovered
        const hoveredCard = e.target.closest('.card_frontt, .card_back');
        const isBackCardHovered = hoveredCard && hoveredCard.classList.contains('card_back');

        if (isBackCardHovered) {
            // Keep back card in place and front card slightly moved
            gsap.to(backCard, {
                z: -10,
                duration: 0.5,
                ease: 'power2.out'
            });
            gsap.to(frontCard, {
                rotationX: rotateX * 0.3,
                rotationY: rotateY * 0.3,
                x: (mouseX - centerX) * (cardSettings.moveRange / 200),
                z: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        } else {
            // Regular front card animation
            gsap.to(frontCard, {
                rotationX: rotateX,
                rotationY: rotateY,
                x: (mouseX - centerX) * (cardSettings.moveRange / 100),
                z: 10,
                duration: 0.5,
                ease: 'power2.out'
            });
            gsap.to(backCard, {
                z: -10,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }

    // Reset animation
    function handleMouseLeave() {
        if (window.innerWidth <= 991) return;

        // Return front card to original position
        gsap.to(frontCard, {
            rotationX: 0,
            rotationY: 0,
            x: 0,
            y: 0,
            z: 0,
            duration: 0.7,
            ease: 'power3.out',
            clearProps: 'transform'
        });
        
        // Ensure back card stays in place
        gsap.to(backCard, {
            z: -10,
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