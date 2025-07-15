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



// ~ calculation and updating price variables in buy form

// Price calculation variables
const priceConfig = {
    momentPrice: 85000,  // Base price from API
    exchangeFee: 10000,  // Fixed exchange fee
    networkFeeRate: 0.6,  // Network fee rate from API
    minOrder: 10,        // Minimum order amount
    minWalletLength: 15  // Minimum wallet address length
};

// Calculate all prices based on tether amount
function calculatePrices(tetherAmount) {
    const networkFee = priceConfig.networkFeeRate * priceConfig.momentPrice;
    const totalPrice = (tetherAmount * priceConfig.momentPrice) + priceConfig.exchangeFee + networkFee;
    
    return {
        networkFee,
        totalPrice
    };
}

// Update price displays in the form
function updatePriceDisplays(prices) {
    // Update elements with custom attributes
    document.querySelector('[data-wf-exchange-fee]').textContent = priceConfig.exchangeFee.toLocaleString();
    document.querySelector('[data-wf-network-fee]').textContent = prices.networkFee.toLocaleString();
    document.querySelector('[data-wf-moment-price]').textContent = priceConfig.momentPrice.toLocaleString();
    document.querySelector('[min-order-buy]').textContent = priceConfig.minOrder.toLocaleString();

    document.querySelector('[data-wf-total-price]').textContent = prices.totalPrice.toLocaleString();
}

// Handle radio button checked states and price calculations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize price displays
    const initialPrices = calculatePrices(0);
    updatePriceDisplays(initialPrices);

    // Handle tether amount input and validation
    const tetherInput = document.querySelector('input[name="tetherAmount"]');
    const errorDisplay = document.querySelector('.deal_amount-error');
    const submitButton = document.querySelector('button[type="submit"]');
    
    // Handle network selection validation
    const networkRadios = document.querySelectorAll('input[name="network"]');
    const networkErrorDisplay = document.querySelector('.deal_network-error');
    
    // Handle wallet address validation
    const walletAddressInput = document.querySelector('input[name="walletAddress"]');
    const walletAddressError = document.querySelector('.deal_address-error');

    function updateErrorState(amount) {
        const isUnderMinimum = amount < priceConfig.minOrder;
        errorDisplay.style.display = isUnderMinimum ? 'block' : 'none';
        return isUnderMinimum;
    }

    if (tetherInput) {
        tetherInput.addEventListener('input', (e) => {
            const amount = parseFloat(e.target.value) || 0;
            const prices = calculatePrices(amount);
            updatePriceDisplays(prices);
            updateErrorState(amount);
        });

        // Prevent form submission if amount is under minimum or network not selected
        const form = tetherInput.closest('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                const amount = parseFloat(tetherInput.value) || 0;
                const networkSelected = Array.from(networkRadios).some(radio => radio.checked);
                
                console.log('Form submit attempt with amount:', amount, 'Min required:', priceConfig.minOrder);
                console.log('Network selected:', networkSelected);
                
                // Check if amount is below minimum
                if (amount < priceConfig.minOrder) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log('Form submission prevented - amount below minimum');
                    return false;
                }
                
                // Check if network is not selected
                if (!networkSelected) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    networkErrorDisplay.style.display = 'block';
                    console.log('Form submission prevented - no network selected');
                    return false;
                }
                
                // Validate payment method based on selected money unit
                const moneyUnitInput = document.querySelector('input[name="moneyUnit"]');
                if (moneyUnitInput) {
                    const moneyUnit = moneyUnitInput.value;
                    let isPaymentMethodSelected = false;
                    
                    if (moneyUnit === 'rial') {
                        // Check irPaymentMethod group
                        const irPaymentRadios = document.querySelectorAll('input[name="irPaymentMethod"]');
                        isPaymentMethodSelected = Array.from(irPaymentRadios).some(radio => radio.checked);
                    } else if (moneyUnit === 'lira') {
                        // Check trPaymentMethod group
                        const trPaymentRadios = document.querySelectorAll('input[name="trPaymentMethod"]');
                        isPaymentMethodSelected = Array.from(trPaymentRadios).some(radio => radio.checked);
                    }
                    
                    if (!isPaymentMethodSelected) {
                    // Target the correct error div based on moneyUnit
                    let methodError;
                    if (moneyUnit === 'rial') {
                        // Find error div within the rial tab pane (money unit tabs)
                        const rialTabPane = document.querySelector('#w-tabs-2-data-w-pane-0');
                        methodError = rialTabPane ? rialTabPane.querySelector('.deal_method-error') : null;
                    } else if (moneyUnit === 'lira') {
                        // Find error div within the lira tab pane (money unit tabs)
                        const liraTabPane = document.querySelector('#w-tabs-2-data-w-pane-1');
                        methodError = liraTabPane ? liraTabPane.querySelector('.deal_method-error') : null;
                    }
                    if (methodError) {
                        methodError.style.display = 'block';
                    }
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        console.log('Form submission prevented - no payment method selected');
                        return false;
                    }
                }
                
                // Check wallet address validation when wallet method is selected
                const currentGettingMethod = gettingMethodInput ? gettingMethodInput.value : '';
                if (currentGettingMethod === 'wallet') {
                    const walletAddress = walletAddressInput ? walletAddressInput.value.trim() : '';
                    if (walletAddress.length < priceConfig.minWalletLength) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        walletAddressError.style.display = 'block';
                        console.log('Form submission prevented - invalid wallet address');
                        return false;
                    }
                }
            });
        }

        // Additional prevention on submit button click
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                const amount = parseFloat(tetherInput.value) || 0;
                const networkSelected = Array.from(networkRadios).some(radio => radio.checked);
                
                if (amount < priceConfig.minOrder) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log('Submit button click prevented - amount below minimum');
                    return false;
                }
                
                if (!networkSelected) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    networkErrorDisplay.style.display = 'block';
                    console.log('Submit button click prevented - no network selected');
                    return false;
                }
                
                // Validate payment method based on selected money unit
                const moneyUnitInput = document.querySelector('input[name="moneyUnit"]');
                let isPaymentMethodSelected = false;
                if (moneyUnitInput) {
                    const moneyUnit = moneyUnitInput.value;
                    if (moneyUnit === 'rial') {
                        const irPaymentRadios = document.querySelectorAll('input[name="irPaymentMethod"]');
                        isPaymentMethodSelected = Array.from(irPaymentRadios).some(radio => radio.checked);
                    } else if (moneyUnit === 'lira') {
                        const trPaymentRadios = document.querySelectorAll('input[name="trPaymentMethod"]');
                        isPaymentMethodSelected = Array.from(trPaymentRadios).some(radio => radio.checked);
                    }
                }
                
                if (!isPaymentMethodSelected) {
                    // Target the correct error div based on moneyUnit
                    let methodError;
                    if (moneyUnit === 'rial') {
                         // Find error div within the rial tab pane (money unit tabs)
                         const rialTabPane = document.querySelector('#w-tabs-2-data-w-pane-0');
                         methodError = rialTabPane ? rialTabPane.querySelector('.deal_method-error') : null;
                     } else if (moneyUnit === 'lira') {
                         // Find error div within the lira tab pane (money unit tabs)
                         const liraTabPane = document.querySelector('#w-tabs-2-data-w-pane-1');
                         methodError = liraTabPane ? liraTabPane.querySelector('.deal_method-error') : null;
                     }
                    if (methodError) {
                        methodError.style.display = 'block';
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log('Submit button click prevented - no payment method selected');
                    return false;
                }
                
                // Check wallet address validation when wallet method is selected
                const currentGettingMethod = gettingMethodInput ? gettingMethodInput.value : '';
                if (currentGettingMethod === 'wallet') {
                    const walletAddress = walletAddressInput ? walletAddressInput.value.trim() : '';
                    if (walletAddress.length < priceConfig.minWalletLength) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        walletAddressError.style.display = 'block';
                        console.log('Submit button click prevented - invalid wallet address');
                        return false;
                    }
                }
            });
        }
    }
    
    // Hide network error when a network option is selected
    networkRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                networkErrorDisplay.style.display = 'none';
            }
        });
    });
    
    // Handle wallet address input validation
    if (walletAddressInput) {
        walletAddressInput.addEventListener('input', () => {
            const walletAddress = walletAddressInput.value.trim();
            if (walletAddress.length >= priceConfig.minWalletLength) {
                walletAddressError.style.display = 'none';
            }
        });
    }
    
    // Hide payment method error when user selects a payment method
    const irPaymentRadios = document.querySelectorAll('input[name="irPaymentMethod"]');
    const trPaymentRadios = document.querySelectorAll('input[name="trPaymentMethod"]');
    
    irPaymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                // Hide error in rial tab pane (money unit tabs)
                const rialTabPane = document.querySelector('#w-tabs-2-data-w-pane-0');
                const methodError = rialTabPane ? rialTabPane.querySelector('.deal_method-error') : null;
                if (methodError) {
                    methodError.style.display = 'none';
                }
            }
        });
    });
    
    trPaymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                // Hide error in lira tab pane (money unit tabs)
                const liraTabPane = document.querySelector('#w-tabs-2-data-w-pane-1');
                const methodError = liraTabPane ? liraTabPane.querySelector('.deal_method-error') : null;
                if (methodError) {
                    methodError.style.display = 'none';
                }
            }
        });
    });

    // ~ start gettingMethod form data handling
    // Handle gettingMethod tab selection and add to form data
    const gettingMethodTabs = document.querySelectorAll('[gettingmethod]');
    const form = document.querySelector('#wf-form-buy-form');
    
    // Create hidden input for gettingMethod if it doesn't exist
    let gettingMethodInput = form.querySelector('input[name="gettingMethod"]');
    if (!gettingMethodInput) {
        gettingMethodInput = document.createElement('input');
        gettingMethodInput.type = 'hidden';
        gettingMethodInput.name = 'gettingMethod';
        form.appendChild(gettingMethodInput);
    }
    
    // Set initial value based on active tab
    const activeGettingTab = document.querySelector('[gettingmethod].w--current');
    if (activeGettingTab) {
        gettingMethodInput.value = activeGettingTab.getAttribute('gettingmethod');
    }
    
    // Add click event listeners to gettingMethod tabs
    gettingMethodTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const gettingMethodValue = tab.getAttribute('gettingmethod');
            gettingMethodInput.value = gettingMethodValue;
            console.log('Getting method selected:', gettingMethodValue);
        });
    });
    // ~! end gettingMethod form data handling

    // ~ start moneyUnit form data handling
    // Handle moneyUnit tab selection and add to form data
    const moneyUnitTabs = document.querySelectorAll('[moneyunit]');
    
    // Create hidden input for moneyUnit if it doesn't exist
    let moneyUnitInput = form.querySelector('input[name="moneyUnit"]');
    if (!moneyUnitInput) {
        moneyUnitInput = document.createElement('input');
        moneyUnitInput.type = 'hidden';
        moneyUnitInput.name = 'moneyUnit';
        form.appendChild(moneyUnitInput);
    }
    
    // Set initial value based on active tab
    const activeMoneyTab = document.querySelector('[moneyunit].w--current');
    if (activeMoneyTab) {
        moneyUnitInput.value = activeMoneyTab.getAttribute('moneyunit');
    }
    
    // Function to clear payment method selections when switching money units
    function clearPaymentMethods() {
        // Clear Iranian payment methods
        const irPaymentRadios = document.querySelectorAll('input[name="irPaymentMethod"]');
        irPaymentRadios.forEach(radio => {
            radio.checked = false;
            const label = radio.closest('label');
            if (label) {
                label.classList.remove('is-checked');
            }
        });
        
        // Clear Turkish payment methods
        const trPaymentRadios = document.querySelectorAll('input[name="trPaymentMethod"]');
        trPaymentRadios.forEach(radio => {
            radio.checked = false;
            const label = radio.closest('label');
            if (label) {
                label.classList.remove('is-checked');
            }
        });
        
        // Hide payment method errors in both tab panes (money unit tabs)
        const rialTabPane = document.querySelector('#w-tabs-2-data-w-pane-0');
        const liraTabPane = document.querySelector('#w-tabs-2-data-w-pane-1');
        const rialMethodError = rialTabPane ? rialTabPane.querySelector('.deal_method-error') : null;
        const liraMethodError = liraTabPane ? liraTabPane.querySelector('.deal_method-error') : null;
        
        if (rialMethodError) {
            rialMethodError.style.display = 'none';
        }
        if (liraMethodError) {
            liraMethodError.style.display = 'none';
        }
    }
    
    // Add click event listeners to moneyUnit tabs
    moneyUnitTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const moneyUnitValue = tab.getAttribute('moneyunit');
            moneyUnitInput.value = moneyUnitValue;
            clearPaymentMethods(); // Clear previous payment selections
            console.log('Money unit selected:', moneyUnitValue);
        });
    });
    // ~! end moneyUnit form data handling

});

// ~! end calculation and updating price variables in buy form

// ~ Handle radio button selection
const radioButtons = document.querySelectorAll('.radio-button');

radioButtons.forEach(radioBtn => {
    const input = radioBtn.querySelector('input[type="radio"]');
    const groupName = radioBtn.getAttribute('groupisolate');

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
        // Remove checked class only from radio buttons in the same group
        if (groupName) {
            document.querySelectorAll(`label[groupisolate="${groupName}"]`).forEach(groupLabel => {
                groupLabel.classList.remove('is-checked');
            });
        }
        
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









