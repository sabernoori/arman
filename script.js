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









