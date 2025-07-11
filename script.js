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




// ~ Handle radio button selection
    const radioButtons = document.querySelectorAll('.radio-button');

    radioButtons.forEach(radioBtn => {
        const input = radioBtn.querySelector('input[type="radio"]');

        // Handle click on the radio-button div
        radioBtn.addEventListener('click', (e) => {
            // Prevent default to handle the click ourselves
            e.preventDefault();
            
            // Trigger the actual radio input
            input.checked = true;
            
            // Trigger change event manually
            input.dispatchEvent(new Event('change'));
        });

        // Add checked class when radio is selected
        input.addEventListener('change', () => {
            // Remove checked class from all radio buttons
            radioButtons.forEach(rb => rb.classList.remove('is-checked'));
            // Add checked class to selected radio button
            if (input.checked) {
                radioBtn.classList.add('is-checked');
            }
        });

        // Initial state check
        if (input.checked) {
            radioBtn.classList.add('is-checked');
        }
    });
 // ~! End Handle radio button selection

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









