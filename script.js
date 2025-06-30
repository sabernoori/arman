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