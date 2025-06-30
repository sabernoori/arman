// Card 3D Animation with Mouse/Touch Movement and Parallax
document.addEventListener('DOMContentLoaded', () => {
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.error('GSAP is not loaded. Please include the GSAP script before this file.');
    return;
  }
  const cards = document.querySelector('.center_cards-wrapper');
  const frontCard = cards.querySelector('.card_frontt');
  const backCard = cards.querySelector('.card_back');

  if (!cards || !frontCard || !backCard) {
    console.error('Required elements not found:', {
      cards: !!cards,
      frontCard: !!frontCard,
      backCard: !!backCard
    });
    return;
  }

  // Check if device supports touch
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Set initial transforms and ensure GPU acceleration
  gsap.set([frontCard, backCard], {
    transformPerspective: 1000,
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden'
  });

  // Track mouse/touch position for smooth animation
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let isInteracting = false;
  let rafId = null;

  // Handle mouse/touch movement
  function handleMove(x, y) {
    if (!isInteracting) return;
    
    const rect = cards.getBoundingClientRect();
    // Calculate position relative to card center (-1 to 1)
    mouseX = ((x - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((y - rect.top) / rect.height - 0.5) * 2;
  }

  // Mouse events
  cards.addEventListener('mouseenter', () => isInteracting = true);
  cards.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));

  // Touch events
  cards.addEventListener('touchstart', () => isInteracting = true, { passive: true });
  cards.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Smooth animation loop with performance optimization
  function animate() {
    if (!isInteracting && Math.abs(currentX) < 0.001 && Math.abs(currentY) < 0.001) {
      cancelAnimationFrame(rafId);
      rafId = null;
      return;
    }

    // Smooth transition of current position
    const deltaX = (mouseX - currentX) * (isTouchDevice ? 0.15 : 0.1);
    const deltaY = (mouseY - currentY) * (isTouchDevice ? 0.15 : 0.1);
    currentX += deltaX;
    currentY += deltaY;
    
    // Calculate rotation based on mouse position
    const rotateY = currentX * (isTouchDevice ? 10 : 15); // Reduced rotation for touch
    const rotateX = -currentY * (isTouchDevice ? 10 : 15);
    
    // Add slight movement based on position
    const translateZ = Math.abs(currentX * currentY) * (isTouchDevice ? 10 : 20);

    // Animate front card with dynamic shadow
    gsap.set(frontCard, {
      rotateX: rotateX,
      rotateY: rotateY,
      z: translateZ,
      boxShadow: `
        ${-rotateY}px ${rotateX}px ${20 + Math.abs(translateZ/2)}px rgba(0,0,0,0.1),
        ${rotateY}px ${-rotateX}px ${15 + Math.abs(translateZ/3)}px rgba(0,0,0,0.05)
      `
    });

    // Animate back card with smoother movement and dynamic shadow
    gsap.set(backCard, {
      rotateX: rotateX * 0.7,
      rotateY: rotateY * 0.7,
      z: translateZ * 0.5,
      boxShadow: `
        ${-rotateY * 0.5}px ${rotateX * 0.5}px ${15 + Math.abs(translateZ/3)}px rgba(0,0,0,0.08),
        ${rotateY * 0.5}px ${-rotateX * 0.5}px ${10 + Math.abs(translateZ/4)}px rgba(0,0,0,0.04)
      `
    });

    rafId = requestAnimationFrame(animate);
  }

  // Handle interaction end
  function resetAnimation() {
    isInteracting = false;
    
    gsap.to(frontCard, {
      rotateX: 0,
      rotateY: 0,
      z: 0,
      boxShadow: 'rgba(0, 0, 0, 0.05) 25px -4px 25px 0px, rgba(0, 0, 0, 0.03) -5px 5px 15px 0px',
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.to(backCard, {
      rotateX: 0,
      rotateY: 0,
      z: 0,
      boxShadow: 'rgba(0, 0, 0, 0.04) 20px -3px 20px 0px, rgba(0, 0, 0, 0.02) -4px 4px 12px 0px',
      duration: 1,
      ease: 'power2.out'
    });

    // Gradually reset tracking variables
    gsap.to({ x: mouseX, y: mouseY }, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: function() {
        mouseX = this.targets()[0].x;
        mouseY = this.targets()[0].y;
      }
    });
  }

  // Add event listeners for ending interaction
  cards.addEventListener('mouseleave', resetAnimation);
  cards.addEventListener('touchend', resetAnimation, { passive: true });

  // Start animation loop when interacting
  function startAnimationIfNeeded() {
    if (!rafId) {
      rafId = requestAnimationFrame(animate);
    }
  }

  // Start animation on interaction
  cards.addEventListener('mouseenter', startAnimationIfNeeded);
  cards.addEventListener('touchstart', startAnimationIfNeeded, { passive: true });
});