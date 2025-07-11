document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.nav_menu-item.menu-icon');
    const overlay = document.querySelector('.nav_overlay');
    const mobileMenu = document.querySelector('.nav-mob_menu-open');
    const closeOverlay = document.querySelector('.nav_overlay');

    function openMenu() {
        overlay.classList.add('is-active');
        mobileMenu.classList.add('is-active');
    }
    

    function closeMenu() {
        overlay.classList.remove('is-active');
        mobileMenu.classList.remove('is-active');
    }

    menuIcon.addEventListener('click', openMenu);
    closeOverlay.addEventListener('click', closeMenu);
});






// ~ Handle clipboard copy functionality
document.addEventListener('DOMContentLoaded', () => {
    const copyElements = document.querySelectorAll('.copy');

    copyElements.forEach(element => {
        element.addEventListener('click', () => {
            const textToCopy = element.getAttribute('clipboard');
            const copyIcon = element.querySelector('.copysvg');
            
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        // Create temporary feedback element
                        const feedback = document.createElement('span');
                        feedback.textContent = 'Copied!';
                        feedback.style.position = 'absolute';
                        feedback.style.left = '50%';
                        feedback.style.top = '50%';
                        feedback.style.transform = 'translate(-50%, -50%)';
                        element.style.position = 'relative';
                        
                        // Hide the copy icon
                        if (copyIcon) {
                            copyIcon.style.display = 'none';
                        }
                        
                        element.appendChild(feedback);

                        // Remove feedback and show icon after animation
                        setTimeout(() => {
                            element.removeChild(feedback);
                            if (copyIcon) {
                                copyIcon.style.display = 'block';
                            }
                        }, 1000);
                    })
                    .catch(err => {
                        console.error('Failed to copy text:', err);
                    });
            }
        });
    });
});
// ~! end clipboard copy functionality









