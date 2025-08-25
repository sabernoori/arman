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







// ~ calculation and updating price variables in buy form

// Price calculation variables
const priceConfig = {
    momentPrice: 85000,  // Base price from API (in Rial)
    momentPriceSell: 84750,  //Base Price for Selling from API (in Rial)
    momentPriceLira: 0,  // Calculated Lira price for buying
    momentPriceSellLira: 0,  // Calculated Lira price for selling
    exchangeFee: 10000,  // Fixed exchange fee
    exchangeFeeSell: 8000,  // Fixed exchange fee for sell
    exchangeFeeLira: 0,  // Fixed exchange fee
    exchangeFeeSellLira: 0,  // Fixed exchange fee for sell
    networkFeeRate: 0.6,  // Network fee rate from API
    minOrder: 10,        // Minimum order amount
    minOrderSell: 5,        // Minimum order amount for selling
    minWalletLength: 15,  // Minimum wallet address length
    userBalance: 596, //user's current balance
    liraToRialRate: 2350,  // 1 Turkish Lira = 2,350 Iranian Toman (will be updated from API)
    currentCurrencyBuy: 'rial',  // Track current selected currency for buy form
    currentCurrencySell: 'rial'  // Track current selected currency for sell form
};

// Calculate Lira prices based on Rial prices
function calculateLiraPrices() {
    priceConfig.momentPriceLira = parseFloat((priceConfig.momentPrice / priceConfig.liraToRialRate).toFixed(2));
    priceConfig.momentPriceSellLira = parseFloat((priceConfig.momentPriceSell / priceConfig.liraToRialRate).toFixed(2));
    priceConfig.exchangeFeeLira = parseFloat((priceConfig.exchangeFee / priceConfig.liraToRialRate).toFixed(2));
    priceConfig.exchangeFeeSellLira = parseFloat((priceConfig.exchangeFeeSell / priceConfig.liraToRialRate).toFixed(2));
}

// Calculate all prices based on tether amount
function calculatePrices(tetherAmount) {
    // Calculate for both currencies
    const networkFeeRial = priceConfig.networkFeeRate * priceConfig.momentPrice;
    const networkFeeLira = parseFloat((networkFeeRial / priceConfig.liraToRialRate).toFixed(2));
    
    const totalPriceRial = (tetherAmount * priceConfig.momentPrice) + priceConfig.exchangeFee + networkFeeRial;
    const totalPriceLira = parseFloat((totalPriceRial / priceConfig.liraToRialRate).toFixed(2));
    
    return {
        networkFeeRial,
        networkFeeLira,
        totalPriceRial,
        totalPriceLira
    };
}

// Calculate total receiving amount for sell form
function calculateTotalReceiving(tetherAmountSell) {
    const totalReceivingRial = (tetherAmountSell * priceConfig.momentPriceSell) + priceConfig.exchangeFeeSell;
    const totalReceivingLira = parseFloat((totalReceivingRial / priceConfig.liraToRialRate).toFixed(2));
    
    return {
        totalReceivingRial,
        totalReceivingLira
    };
}

// Update price displays in the form
function updatePriceDisplays(prices) {
    // Calculate Lira prices if needed
    calculateLiraPrices();
    
    // Update exchange fees based on buy form currency
    const exchangeFeeElement = document.querySelector('[data-wf-exchange-fee]');
    if (exchangeFeeElement) {
        if (priceConfig.currentCurrencyBuy === 'lira') {
            exchangeFeeElement.textContent = priceConfig.exchangeFeeLira.toLocaleString();
        } else {
            exchangeFeeElement.textContent = priceConfig.exchangeFee.toLocaleString();
        }
    }
    
    // Update sell exchange fees based on sell form currency
    const exchangeFeeSellElement = document.querySelector('[data-wf-exchange-fee-sell]');
    if (exchangeFeeSellElement) {
        if (priceConfig.currentCurrencySell === 'lira') {
            exchangeFeeSellElement.textContent = priceConfig.exchangeFeeSellLira.toLocaleString();
        } else {
            exchangeFeeSellElement.textContent = priceConfig.exchangeFeeSell.toLocaleString();
        }
    }
    
    // Update network fee based on buy form currency
    const networkFeeElement = document.querySelector('[data-wf-network-fee]');
    if (networkFeeElement) {
        if (priceConfig.currentCurrencyBuy === 'lira') {
            networkFeeElement.textContent = prices.networkFeeLira.toLocaleString();
        } else {
            networkFeeElement.textContent = prices.networkFeeRial.toLocaleString();
        }
    }
    
    // Update total price based on buy form currency
    const totalPriceElement = document.querySelector('[data-wf-total-price]');
    if (totalPriceElement) {
        if (priceConfig.currentCurrencyBuy === 'lira') {
            totalPriceElement.textContent = prices.totalPriceLira.toLocaleString();
        } else {
            totalPriceElement.textContent = prices.totalPriceRial.toLocaleString();
        }
    }
    
    // Update total receiving amount for sell form (if prices object has receiving data)
    if (prices.totalReceivingRial !== undefined) {
        const totalReceivingElement = document.querySelector('[data-wf-total-recieving]');
        if (totalReceivingElement) {
            if (priceConfig.currentCurrencySell === 'lira') {
                totalReceivingElement.textContent = prices.totalReceivingLira.toLocaleString();
            } else {
                totalReceivingElement.textContent = prices.totalReceivingRial.toLocaleString();
            }
        }
    }
    
    // Update moment prices based on form-specific currency selection
    const momentPriceElement = document.querySelector('[data-wf-moment-price]');
    const momentPriceSellElement = document.querySelector('[data-wf-moment-price-sell]');
    const momentPriceLiraElement = document.querySelector('[data-wf-moment-price-lira]');
    
    // Update buy form price based on buy currency selection
    if (momentPriceElement) {
        if (priceConfig.currentCurrencyBuy === 'lira') {
            momentPriceElement.textContent = priceConfig.momentPriceLira.toLocaleString();
        } else {
            momentPriceElement.textContent = priceConfig.momentPrice.toLocaleString();
        }
    }
    
    // Update sell form price based on sell currency selection
    if (momentPriceSellElement) {
        if (priceConfig.currentCurrencySell === 'lira') {
            momentPriceSellElement.textContent = priceConfig.momentPriceSellLira.toLocaleString();
        } else {
            momentPriceSellElement.textContent = priceConfig.momentPriceSell.toLocaleString();
        }
    }
    
    // Update Lira moment price display
    if (momentPriceLiraElement) {
        momentPriceLiraElement.textContent = priceConfig.momentPriceLira.toLocaleString();
    }
    
    document.querySelectorAll('[min-order-buy]').forEach(element => {
        element.textContent = priceConfig.minOrder.toLocaleString();
    });
    document.querySelectorAll('[min-order-sell]').forEach(element => {
        element.textContent = priceConfig.minOrderSell.toLocaleString();
    });
    document.querySelector('[user-total-balance]').textContent = priceConfig.userBalance.toLocaleString();
}

// Handle radio button checked states and price calculations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lira prices
    calculateLiraPrices();
    
    // Initialize price displays
    const initialPrices = calculatePrices(0);
    updatePriceDisplays(initialPrices);

    // Handle tether amount input and validation for buy form
    const tetherInput = document.querySelector('input[name="tetherAmount"]');
    const errorDisplay = document.querySelector('.deal_amount-error');
    const submitButton = document.querySelector('button[type="submit"]');
    
    // Handle tether amount input for sell form
    const tetherSellInput = document.querySelector('input[name="tetherAmountSell"]');
    
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
    }
    
    // Handle sell form tether amount input
    if (tetherSellInput) {
        // ~ start sell form min order error handling
        const errorDisplaySell = document.querySelector('.deal_amount-error-sell');
        const sellForm = document.getElementById('wf-form-sell-form-2');
        const submitButtonSell = sellForm ? sellForm.querySelector('input[type="submit"]') : null;
        function updateErrorStateSell(amount) {
            const isUnderMinimumSell = amount < priceConfig.minOrderSell;
            if (errorDisplaySell) errorDisplaySell.style.display = isUnderMinimumSell ? 'block' : 'none';
            return isUnderMinimumSell;
        }
        tetherSellInput.addEventListener('input', (e) => {
            const amount = parseFloat(e.target.value) || 0;
            const receivingPrices = calculateTotalReceiving(amount);
            // Merge with empty buy prices to update displays
            const combinedPrices = {
                ...calculatePrices(0), // Empty buy prices
                ...receivingPrices // Add receiving prices
            };
            updatePriceDisplays(combinedPrices);
            updateErrorStateSell(amount);
        });
        if (sellForm) {
            sellForm.addEventListener('submit', (e) => {
                const amount = parseFloat(tetherSellInput.value) || 0;
                if (amount < priceConfig.minOrderSell) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    if (errorDisplaySell) errorDisplaySell.style.display = 'block';
                    return false;
                }
                
                // ~ start add sell form additional data
                // Get the current currency unit for sell form
                const moneyUnitSellInput = document.querySelector('input[name="moneyUnitSell"]');
                const currentCurrency = moneyUnitSellInput ? moneyUnitSellInput.value : 'lira';
                
                // Get the data attributes values
                const momentPriceSell = document.querySelector('[data-wf-moment-price-sell]');
                const exchangeFeeSell = document.querySelector('[data-wf-exchange-fee-sell]');
                const totalReceiving = document.querySelector('[data-wf-total-recieving]');
                
                // Create hidden inputs for the additional data
                const createHiddenInput = (name, value) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = name;
                    input.value = value || '';
                    return input;
                };
                
                // Remove any existing hidden inputs to avoid duplicates
                const existingInputs = sellForm.querySelectorAll('input[name="sellMomentPrice"], input[name="sellExchangeFee"], input[name="sellTotalReceiving"]');
                existingInputs.forEach(input => input.remove());
                
                // Add the new hidden inputs
                if (momentPriceSell) {
                    sellForm.appendChild(createHiddenInput('sellMomentPrice', momentPriceSell.textContent.trim()));
                }
                if (exchangeFeeSell) {
                    sellForm.appendChild(createHiddenInput('sellExchangeFee', exchangeFeeSell.textContent.trim()));
                }
                if (totalReceiving) {
                    sellForm.appendChild(createHiddenInput('sellTotalReceiving', totalReceiving.textContent.trim()));
                }
                // ~! end add sell form additional data
            });
        }
        // ~! end sell form min order error handling
        
        // ~ start selltotal click functionality
        const sellTotalElements = document.querySelectorAll('.selltotal');
        sellTotalElements.forEach(element => {
            element.addEventListener('click', () => {
                tetherSellInput.value = priceConfig.userBalance;
                // Trigger input event to update calculations
                const inputEvent = new Event('input', { bubbles: true });
                tetherSellInput.dispatchEvent(inputEvent);
            });
        });
        // ~! end selltotal click functionality

        
        tetherSellInput.addEventListener('input', (e) => {
            const amount = parseFloat(e.target.value) || 0;
            const receivingPrices = calculateTotalReceiving(amount);
            // Merge with empty buy prices to update displays
            const combinedPrices = {
                ...calculatePrices(0), // Empty buy prices
                ...receivingPrices // Add receiving prices
            };
            updatePriceDisplays(combinedPrices);
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
                
                // ~ start add buy form additional data
                // Get the current currency unit for buy form
                const currentCurrency = moneyUnitInput ? moneyUnitInput.value : 'rial';
                
                // Get the data attributes values
                const momentPrice = document.querySelector('[data-wf-moment-price]');
                const networkFee = document.querySelector('[data-wf-network-fee]');
                const exchangeFee = document.querySelector('[data-wf-exchange-fee]');
                const totalPrice = document.querySelector('[data-wf-total-price]');
                
                // Create hidden inputs for the additional data
                const createHiddenInput = (name, value) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = name;
                    input.value = value || '';
                    return input;
                };
                
                // Remove any existing hidden inputs to avoid duplicates
                const existingInputs = form.querySelectorAll('input[name="buyMomentPrice"], input[name="buyNetworkFee"], input[name="buyExchangeFee"], input[name="buyTotalPrice"]');
                existingInputs.forEach(input => input.remove());
                
                // Add the new hidden inputs
                if (momentPrice) {
                    form.appendChild(createHiddenInput('buyMomentPrice', momentPrice.textContent.trim()));
                }
                if (networkFee) {
                    form.appendChild(createHiddenInput('buyNetworkFee', networkFee.textContent.trim()));
                }
                if (exchangeFee) {
                    form.appendChild(createHiddenInput('buyExchangeFee', exchangeFee.textContent.trim()));
                }
                if (totalPrice) {
                    form.appendChild(createHiddenInput('buyTotalPrice', totalPrice.textContent.trim()));
                }
                // ~! end add buy form additional data
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
        const initialMoneyUnit = activeMoneyTab.getAttribute('moneyunit');
        moneyUnitInput.value = initialMoneyUnit;
        // Set initial currency display for buy form
        updateCurrencyDisplayBuy(initialMoneyUnit);
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
            updateCurrencyDisplayBuy(moneyUnitValue); // Update currency text for buy form
            console.log('Money unit selected:', moneyUnitValue);
        });
    });
    
    // Set initial currency display based on default selection
    const defaultMoneyUnit = document.querySelector('input[name="moneyUnit"]:checked');
    if (defaultMoneyUnit) {
        updateCurrencyDisplay(defaultMoneyUnit.value);
    }
    
    // ~! end moneyUnit form data handling

});

// ~! end calculation and updating price variables in buy form

// ~ start currency display update functionality
// Function to update currency display based on selected money unit
function updateCurrencyDisplay(moneyUnit) {
    const currencyElements = document.querySelectorAll('[data-wf-currency-sell]');
    currencyElements.forEach(element => {
        if (moneyUnit === 'rial') {
            element.textContent = 'تومان';
        } else if (moneyUnit === 'lira') {
            element.textContent = 'لیر';
        }
    });
    
    // Update current currency in config for sell form and refresh price displays
    priceConfig.currentCurrencySell = moneyUnit;
    
    // Recalculate and update price displays for sell form
    const tetherSellInput = document.querySelector('input[name="tetherAmountSell"]');
    const currentSellAmount = tetherSellInput ? parseFloat(tetherSellInput.value) || 0 : 0;
    
    // Calculate receiving prices for sell form
    const receivingPrices = calculateTotalReceiving(currentSellAmount);
    
    // Merge with empty buy prices to update displays
    const combinedPrices = {
        ...calculatePrices(0), // Empty buy prices
        ...receivingPrices // Add receiving prices
    };
    
    updatePriceDisplays(combinedPrices);
}

function updateCurrencyDisplayBuy(moneyUnit) {
    const currencyElements = document.querySelectorAll('[data-wf-currency-buy]');
    currencyElements.forEach(element => {
        if (moneyUnit === 'rial') {
            element.textContent = 'تومان';
        } else if (moneyUnit === 'lira') {
            element.textContent = 'لیر';
        }
    });
    
    // Update current currency in config for buy form and refresh price displays
    priceConfig.currentCurrencyBuy = moneyUnit;
    
    // Recalculate and update price displays
    const tetherInput = document.querySelector('input[name="tetherAmount"]') || document.querySelector('input[name="tetherAmountSell"]');
    const currentAmount = tetherInput ? parseFloat(tetherInput.value) || 0 : 0;
    const prices = calculatePrices(currentAmount);
    updatePriceDisplays(prices);
}
// ~! end currency display update functionality

// ~ Handle radio button selection
const radioButtons = document.querySelectorAll('.radio-button');

radioButtons.forEach(radioBtn => {
    const input = radioBtn.querySelector('input[type="radio"]');
    const groupName = radioBtn.getAttribute('groupisolate');
    const isDefaultSelection = radioBtn.hasAttribute('defaultSelection');

    // Set default selection on page load
    if (isDefaultSelection) {
        input.checked = true;
        radioBtn.classList.add('is-checked');
    }

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
            
            // Update currency display if this is a money unit radio button
            if (input.name === 'moneyUnit' && typeof updateCurrencyDisplay === 'function') {
                // Check if this is for sell form (groupisolate="moneyUnitSell") or buy form
                if (groupName === 'moneyUnitSell') {
                    updateCurrencyDisplay(input.value);
                } else {
                    updateCurrencyDisplayBuy(input.value);
                }
            }
        }
    });

    // Initial state check
    if (input.checked) {
        radioBtn.classList.add('is-checked');
        
        // Set initial currency display for money unit radio buttons
        if (input.name === 'moneyUnit') {
            // Check if this is for sell form (groupisolate="moneyUnitSell") or buy form
            if (groupName === 'moneyUnitSell') {
                updateCurrencyDisplay(input.value);
            } else {
                updateCurrencyDisplayBuy(input.value);
            }
        }
    }
});
// ~! End Handle radio button selection


// ~ start numerical keyboard for mobile
// Set numerical keyboard for tether amount inputs
const tetherAmountInput = document.querySelector('input[name="tetherAmount"]');
const tetherAmountSellInput = document.querySelector('input[name="tetherAmountSell"]');

if (tetherAmountInput) {
    tetherAmountInput.setAttribute('inputmode', 'numeric');
    tetherAmountInput.setAttribute('pattern', '[0-9]*');
}

if (tetherAmountSellInput) {
    tetherAmountSellInput.setAttribute('inputmode', 'numeric');
    tetherAmountSellInput.setAttribute('pattern', '[0-9]*');
}
// ~! end numerical keyboard for mobile





///////////////////////////////

// ~ start application configuration constants
// Centralized configuration for all form constants
const appConfig = {
    // Minimum withdrawal amounts
    minWithdrawRial: 50000, // Minimum rial withdrawal amount
    minWithdrawLira: 25, // Minimum lira withdrawal amount
    minWithdrawTrc: 5, // Minimum TRC20 withdrawal amount
    minWithdrawErc: 5, // Minimum ERC20 withdrawal amount
    
    // User balance amounts
    userRialBalance: 1500000, // User's rial balance
    userLiraBalance: 750, // User's lira balance
    userTrcBalance: 100, // User's TRC20 balance
    userErcBalance: 95, // User's ERC20 balance
    
    // Minimum topup amounts
    minTopRial: 100000, // Minimum rial amount
    minTopLira: 50, // Minimum lira amount
    minTopTether: 10 // Minimum tether amount
};
// ~! end application configuration constants

// ~ start withdraw form constants and functionality

// Update UI with minimum withdrawal amounts
function updateMinimumWithdrawDisplays() {
    // Update rial minimum displays
    const rialMinElements = document.querySelectorAll('[min-withdraw-rial]');
    rialMinElements.forEach(element => {
        element.textContent = appConfig.minWithdrawRial.toLocaleString();
    });
    
    // Update lira minimum displays
    const liraMinElements = document.querySelectorAll('[min-withdraw-lira]');
    liraMinElements.forEach(element => {
        element.textContent = appConfig.minWithdrawLira.toLocaleString();
    });
    
    // Update TRC20 minimum displays
    const trcMinElements = document.querySelectorAll('[min-withdraw-trc]');
    trcMinElements.forEach(element => {
        element.textContent = appConfig.minWithdrawTrc.toLocaleString();
    });
    
    // Update ERC20 minimum displays
    const ercMinElements = document.querySelectorAll('[min-withdraw-erc]');
    ercMinElements.forEach(element => {
        element.textContent = appConfig.minWithdrawErc.toLocaleString();
    });
}

// Update UI with user balance amounts
function updateUserBalanceDisplays() {
    // Update rial balance displays
    const rialBalanceElements = document.querySelectorAll('[user-rial-balance]');
    rialBalanceElements.forEach(element => {
        element.textContent = appConfig.userRialBalance.toLocaleString();
    });
    
    // Update lira balance displays
    const liraBalanceElements = document.querySelectorAll('[user-lira-balance]');
    liraBalanceElements.forEach(element => {
        element.textContent = appConfig.userLiraBalance.toLocaleString();
    });
    
    // Update TRC20 balance displays
    const trcBalanceElements = document.querySelectorAll('[user-trc-balance]');
    trcBalanceElements.forEach(element => {
        element.textContent = appConfig.userTrcBalance.toLocaleString();
    });
    
    // Update ERC20 balance displays
    const ercBalanceElements = document.querySelectorAll('[user-erc-balance]');
    ercBalanceElements.forEach(element => {
        element.textContent = appConfig.userErcBalance.toLocaleString();
    });
}

// Withdraw all balance functionality
function initializeWithdrawAllButtons() {
    // Rial withdraw all button
    const rialWithdrawAllElements = document.querySelectorAll('[data-wf-sell-all-rial]');
    rialWithdrawAllElements.forEach(element => {
        element.addEventListener('click', () => {
            const rialAmountInput = document.getElementById('withdrawRialAmount');
            if (rialAmountInput) {
                rialAmountInput.value = appConfig.userRialBalance;
                // Trigger input event to update calculations
                const inputEvent = new Event('input', { bubbles: true });
                rialAmountInput.dispatchEvent(inputEvent);
            }
        });
    });
    
    // Lira withdraw all button
    const liraWithdrawAllElements = document.querySelectorAll('[data-wf-sell-all-lira]');
    liraWithdrawAllElements.forEach(element => {
        element.addEventListener('click', () => {
            const liraAmountInput = document.getElementById('withdrawLiraAmount');
            if (liraAmountInput) {
                liraAmountInput.value = appConfig.userLiraBalance;
                // Trigger input event to update calculations
                const inputEvent = new Event('input', { bubbles: true });
                liraAmountInput.dispatchEvent(inputEvent);
            }
        });
    });
    
    // TRC20 withdraw all button
    const trcWithdrawAllElements = document.querySelectorAll('[data-wf-sell-all-trc]');
    trcWithdrawAllElements.forEach(element => {
        element.addEventListener('click', () => {
            const trcAmountInput = document.getElementById('withdrawTrcAmount');
            if (trcAmountInput) {
                trcAmountInput.value = appConfig.userTrcBalance;
                // Trigger input event to update calculations
                const inputEvent = new Event('input', { bubbles: true });
                trcAmountInput.dispatchEvent(inputEvent);
            }
        });
    });
    
    // ERC20 withdraw all button
    const ercWithdrawAllElements = document.querySelectorAll('[data-wf-sell-all-erc]');
    ercWithdrawAllElements.forEach(element => {
        element.addEventListener('click', () => {
            const ercAmountInput = document.getElementById('withdrawErcAmount');
            if (ercAmountInput) {
                ercAmountInput.value = appConfig.userErcBalance;
                // Trigger input event to update calculations
                const inputEvent = new Event('input', { bubbles: true });
                ercAmountInput.dispatchEvent(inputEvent);
            }
        });
    });
}

// ~ start withdraw form validation and submission handling
// Handle withdraw form submission with validation
const withdrawForm = document.getElementById('wf-form-withdraw');
if (withdrawForm) {
    // Get amount input elements
    const withdrawRialAmountInput = document.getElementById('withdrawRialAmount');
    const withdrawLiraAmountInput = document.getElementById('withdrawLiraAmount');
    const withdrawTrcAmountInput = document.getElementById('withdrawTrcAmount');
    const withdrawErcAmountInput = document.getElementById('withdrawErcAmount');
    
    // Get wallet address inputs
    const walletAddressTrcInput = document.getElementById('walletAddressTrc');
    const walletAddressErcInput = document.getElementById('walletAddressErc');
    
    // Get error display elements (they are near the targeted elements)
    const rialWithdrawErrorDisplay = document.querySelector('.top_amount-error.is-rial');
    const liraWithdrawErrorDisplay = document.querySelector('.top_amount-error.is-lira'); 
    const trcWithdrawErrorDisplay = document.querySelector('.top_amount-error.is-trc20');
    const ercWithdrawErrorDisplay = document.querySelector('.top_amount-error.is-erc20'); // Note: HTML shows same class for erc
    const walletAddressErrorDisplay = document.querySelector('.deal_address-error');
    
    // Error handling functions for withdraw amounts
    function updateWithdrawRialErrorState(amount) {
        const isUnderMinimum = amount > 0 && amount < appConfig.minWithdrawRial;
        const hasError = isUnderMinimum;
        if (rialWithdrawErrorDisplay) rialWithdrawErrorDisplay.style.display = hasError ? 'block' : 'none';
        return hasError;
    }
    
    function updateWithdrawLiraErrorState(amount) {
        const isUnderMinimum = amount > 0 && amount < appConfig.minWithdrawLira;
        const hasError = isUnderMinimum;
        if (liraWithdrawErrorDisplay) liraWithdrawErrorDisplay.style.display = hasError ? 'block' : 'none';
        return hasError;
    }
    
    function updateWithdrawTrcErrorState(amount) {
        const isUnderMinimum = amount > 0 && amount < appConfig.minWithdrawTrc;
        const hasError = isUnderMinimum;
        if (trcWithdrawErrorDisplay) trcWithdrawErrorDisplay.style.display = hasError ? 'block' : 'none';
        return hasError;
    }
    
    function updateWithdrawErcErrorState(amount) {
        const isUnderMinimum = amount > 0 && amount < appConfig.minWithdrawErc;
        const hasError = isUnderMinimum;
        if (ercWithdrawErrorDisplay) ercWithdrawErrorDisplay.style.display = hasError ? 'block' : 'none';
        return hasError;
    }
    
    function updateWalletAddressErrorState(address, minLength = 15) {
        const isInvalid = address.length > 0 && address.length < minLength;
        if (walletAddressErrorDisplay) walletAddressErrorDisplay.style.display = isInvalid ? 'block' : 'none';
        return isInvalid;
    }
    
    // Add real-time input event listeners for withdraw amounts
    if (withdrawRialAmountInput) {
        withdrawRialAmountInput.addEventListener('input', (e) => {
            const amount = parseFloat(e.target.value) || 0;
            updateWithdrawRialErrorState(amount);
        });
    }
    
    if (withdrawLiraAmountInput) {
        withdrawLiraAmountInput.addEventListener('input', (e) => {
            const amount = parseFloat(e.target.value) || 0;
            updateWithdrawLiraErrorState(amount);
        });
    }
    
    if (withdrawTrcAmountInput) {
        withdrawTrcAmountInput.addEventListener('input', (e) => {
            const amount = parseFloat(e.target.value) || 0;
            updateWithdrawTrcErrorState(amount);
        });
    }
    
    if (withdrawErcAmountInput) {
        withdrawErcAmountInput.addEventListener('input', (e) => {
            const amount = parseFloat(e.target.value) || 0;
            updateWithdrawErcErrorState(amount);
        });
    }
    
    // Add real-time validation for wallet addresses
    if (walletAddressTrcInput) {
        walletAddressTrcInput.addEventListener('input', (e) => {
            updateWalletAddressErrorState(e.target.value.trim());
        });
    }
    
    if (walletAddressErcInput) {
        walletAddressErcInput.addEventListener('input', (e) => {
            updateWalletAddressErrorState(e.target.value.trim());
        });
    }
    
    // Handle form submission with comprehensive validation
    withdrawForm.addEventListener('submit', function(e) {
        // Determine active tab and network
        const activeMoneyTab = document.querySelector('.deal_choice-item.w--current');
        const moneyUnit = activeMoneyTab ? activeMoneyTab.getAttribute('moneyunit') : 'rial';
        
        let isValid = true;
        let amount = 0;
        let paymentMethodSelected = false;
        let walletAddressValid = true;
        let networkSelected = false;
        
        // Validate based on selected money unit
        if (moneyUnit === 'rial') {
            // Validate rial withdrawal
            amount = parseFloat(withdrawRialAmountInput.value) || 0;
            const rialRadios = document.querySelectorAll('input[name="rialRadio"]');
            paymentMethodSelected = Array.from(rialRadios).some(radio => radio.checked);
            
            // Check amount validation
            if (updateWithdrawRialErrorState(amount) || amount === 0) {
                isValid = false;
            }
            
        } else if (moneyUnit === 'lira') {
            // Validate lira withdrawal
            amount = parseFloat(withdrawLiraAmountInput.value) || 0;
            const liraRadios = document.querySelectorAll('input[name="liraRadio"]');
            paymentMethodSelected = Array.from(liraRadios).some(radio => radio.checked);
            
            // Check amount validation
            if (updateWithdrawLiraErrorState(amount) || amount === 0) {
                isValid = false;
            }
            
        } else if (moneyUnit === 'tether') {
            // Determine active network tab for tether
            const activeNetworkTab = document.querySelector('.deal_choice-item.is-eng.w--current');
            const network = activeNetworkTab ? activeNetworkTab.getAttribute('network') : 'trc20';
            
            if (network === 'trc20') {
                // Validate TRC20 withdrawal
                amount = parseFloat(withdrawTrcAmountInput.value) || 0;
                const walletAddress = walletAddressTrcInput ? walletAddressTrcInput.value.trim() : '';
                
                // Check amount validation
                if (updateWithdrawTrcErrorState(amount) || amount === 0) {
                    isValid = false;
                }
                
                // Check wallet address validation
                if (updateWalletAddressErrorState(walletAddress) || walletAddress === '') {
                    isValid = false;
                    walletAddressValid = false;
                }
                
                networkSelected = true; // Network is inherently selected by tab
                
            } else if (network === 'erc20') {
                // Validate ERC20 withdrawal
                amount = parseFloat(withdrawErcAmountInput.value) || 0;
                const walletAddress = walletAddressErcInput ? walletAddressErcInput.value.trim() : '';
                
                // Check amount validation
                if (updateWithdrawErcErrorState(amount) || amount === 0) {
                    isValid = false;
                }
                
                // Check wallet address validation
                if (updateWalletAddressErrorState(walletAddress) || walletAddress === '') {
                    isValid = false;
                    walletAddressValid = false;
                }
                
                networkSelected = true; // Network is inherently selected by tab
            }
            
            paymentMethodSelected = true; // For tether, wallet is the payment method
        }
        
        // Prevent form submission if validation fails
        if (!isValid || !paymentMethodSelected || !walletAddressValid) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            console.log('Withdraw form submission prevented - validation failed for', moneyUnit);
            return false;
        }
        
        // Add submission data as hidden inputs
        const createHiddenInput = (name, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value || '';
            return input;
        };
        
        // Remove any existing hidden inputs to avoid duplicates
        const existingInputs = withdrawForm.querySelectorAll('input[name="withdrawMoneyUnit"], input[name="withdrawNetwork"], input[name="withdrawAmount"], input[name="withdrawMethod"]');
        existingInputs.forEach(input => input.remove());
        
        // Add money unit
        withdrawForm.appendChild(createHiddenInput('withdrawMoneyUnit', moneyUnit));
        
        // Add amount
        withdrawForm.appendChild(createHiddenInput('withdrawAmount', amount.toString()));
        
        // Add network for tether withdrawals
        if (moneyUnit === 'tether') {
            const activeNetworkTab = document.querySelector('.deal_choice-item.is-eng.w--current');
            const network = activeNetworkTab ? activeNetworkTab.getAttribute('network') : 'trc20';
            withdrawForm.appendChild(createHiddenInput('withdrawNetwork', network));
        }
        
        // Add selected payment method
        if (moneyUnit === 'rial') {
            const selectedRialRadio = document.querySelector('input[name="rialRadio"]:checked');
            if (selectedRialRadio) {
                withdrawForm.appendChild(createHiddenInput('withdrawMethod', selectedRialRadio.value));
            }
        } else if (moneyUnit === 'lira') {
            const selectedLiraRadio = document.querySelector('input[name="liraRadio"]:checked');
            if (selectedLiraRadio) {
                withdrawForm.appendChild(createHiddenInput('withdrawMethod', selectedLiraRadio.value));
            }
        } else if (moneyUnit === 'tether') {
            withdrawForm.appendChild(createHiddenInput('withdrawMethod', 'wallet'));
        }
        
        console.log('Withdraw form submission successful for', moneyUnit, 'with amount:', amount);
    });
}
// ~! end withdraw form validation and submission handling

// ~ start withdraw form tab switching functionality
// Clear inactive tab inputs for withdraw form
function clearInactiveWithdrawTabInputs() {
    const activeTab = document.querySelector('.deal_choice-item.w--current');
    const moneyUnit = activeTab ? activeTab.getAttribute('moneyunit') : 'rial';
    
    // Get all input elements
    const withdrawRialAmountInput = document.getElementById('withdrawRialAmount');
    const withdrawLiraAmountInput = document.getElementById('withdrawLiraAmount');
    const withdrawTrcAmountInput = document.getElementById('withdrawTrcAmount');
    const withdrawErcAmountInput = document.getElementById('withdrawErcAmount');
    const walletAddressTrcInput = document.getElementById('walletAddressTrc');
    const walletAddressErcInput = document.getElementById('walletAddressErc');
    
    // Clear radio button selections and inputs for inactive tabs
    if (moneyUnit !== 'rial') {
        const rialRadios = document.querySelectorAll('input[name="rialRadio"]');
        rialRadios.forEach(radio => {
            radio.checked = false;
            // Remove is-checked class from parent label
            const parentLabel = radio.closest('label');
            if (parentLabel) parentLabel.classList.remove('is-checked');
        });
        
        // Clear rial amount input and remove required attribute
        if (withdrawRialAmountInput) {
            withdrawRialAmountInput.value = '';
            withdrawRialAmountInput.removeAttribute('required');
        }
    } else {
        // Add required attribute to active rial input
        if (withdrawRialAmountInput) {
            withdrawRialAmountInput.setAttribute('required', '');
        }
    }
    
    if (moneyUnit !== 'lira') {
        const liraRadios = document.querySelectorAll('input[name="liraRadio"]');
        liraRadios.forEach(radio => {
            radio.checked = false;
            // Remove is-checked class from parent label
            const parentLabel = radio.closest('label');
            if (parentLabel) parentLabel.classList.remove('is-checked');
        });
        
        // Clear lira amount input and remove required attribute
        if (withdrawLiraAmountInput) {
            withdrawLiraAmountInput.value = '';
            withdrawLiraAmountInput.removeAttribute('required');
        }
    } else {
        // Add required attribute to active lira input
        if (withdrawLiraAmountInput) {
            withdrawLiraAmountInput.setAttribute('required', '');
        }
    }
    
    if (moneyUnit !== 'tether') {
        // Clear tether amount inputs and wallet addresses, remove required attributes
        if (withdrawTrcAmountInput) {
            withdrawTrcAmountInput.value = '';
            withdrawTrcAmountInput.removeAttribute('required');
        }
        if (withdrawErcAmountInput) {
            withdrawErcAmountInput.value = '';
            withdrawErcAmountInput.removeAttribute('required');
        }
        if (walletAddressTrcInput) {
            walletAddressTrcInput.value = '';
            walletAddressTrcInput.removeAttribute('required');
        }
        if (walletAddressErcInput) {
            walletAddressErcInput.value = '';
            walletAddressErcInput.removeAttribute('required');
        }
    } else {
        // For tether, determine which network is active and set required attributes accordingly
        const activeNetworkTab = document.querySelector('.deal_choice-item.is-eng.w--current');
        const network = activeNetworkTab ? activeNetworkTab.getAttribute('network') : 'trc20';
        
        if (network === 'trc20') {
            if (withdrawTrcAmountInput) withdrawTrcAmountInput.setAttribute('required', '');
            if (walletAddressTrcInput) walletAddressTrcInput.setAttribute('required', '');
            // Clear ERC20 inputs
            if (withdrawErcAmountInput) {
                withdrawErcAmountInput.value = '';
                withdrawErcAmountInput.removeAttribute('required');
            }
            if (walletAddressErcInput) {
                walletAddressErcInput.value = '';
                walletAddressErcInput.removeAttribute('required');
            }
        } else if (network === 'erc20') {
            if (withdrawErcAmountInput) withdrawErcAmountInput.setAttribute('required', '');
            if (walletAddressErcInput) walletAddressErcInput.setAttribute('required', '');
            // Clear TRC20 inputs
            if (withdrawTrcAmountInput) {
                withdrawTrcAmountInput.value = '';
                withdrawTrcAmountInput.removeAttribute('required');
            }
            if (walletAddressTrcInput) {
                walletAddressTrcInput.value = '';
                walletAddressTrcInput.removeAttribute('required');
            }
        }
    }
    
    // Hide all error displays when switching tabs
    const errorDisplays = document.querySelectorAll('.top_amount-error, .deal_address-error');
    errorDisplays.forEach(error => error.style.display = 'none');
}

// Add event listeners to withdraw form tab links
const withdrawTabLinks = document.querySelectorAll('.deal_choice-item');
withdrawTabLinks.forEach(tabLink => {
    tabLink.addEventListener('click', () => {
        setTimeout(() => {
            clearInactiveWithdrawTabInputs();
        }, 100); // Small delay to ensure tab switch is complete
    });
});

// Add event listeners for tether network sub-tabs (TRC20/ERC20)
const tetherNetworkTabLinks = document.querySelectorAll('.deal_choice-item.is-eng');
tetherNetworkTabLinks.forEach(tabLink => {
    tabLink.addEventListener('click', () => {
        setTimeout(() => {
            // Only clear and update if we're in the tether tab
            const activeMainTab = document.querySelector('.deal_choice-item.w--current');
            const moneyUnit = activeMainTab ? activeMainTab.getAttribute('moneyunit') : '';
            if (moneyUnit === 'tether') {
                clearInactiveWithdrawTabInputs();
            }
        }, 100); // Small delay to ensure tab switch is complete
    });
});
// ~! end withdraw form tab switching functionality

// Initialize withdraw form displays
updateMinimumWithdrawDisplays();
updateUserBalanceDisplays();
initializeWithdrawAllButtons();
// ~! end withdraw form constants and functionality

// ~ start topup form moneyunit submission handling
// Handle topup form submission to include selected moneyunit and validate payment methods
const topupForm = document.getElementById('wf-form-topup');
if (topupForm) {
    // ~ start minimum topup amount configuration
    // Using centralized appConfig constants
    
    // Update UI with minimum amounts
    function updateMinimumAmountDisplays() {
        // Update rial minimum displays
        const rialMinElements = document.querySelectorAll('[min-top-rial]');
        rialMinElements.forEach(element => {
            element.textContent = appConfig.minTopRial.toLocaleString();
        });
        
        // Update lira minimum displays
        const liraMinElements = document.querySelectorAll('[min-top-lira]');
        liraMinElements.forEach(element => {
            element.textContent = appConfig.minTopLira.toLocaleString();
        });
        
        // Update tether minimum displays
        const tetherMinElements = document.querySelectorAll('[min-top-tether]');
        tetherMinElements.forEach(element => {
            element.textContent = appConfig.minTopTether.toLocaleString();
        });
    }
    
    // Initialize minimum amount displays
    updateMinimumAmountDisplays();
    // ~! end minimum topup amount configuration
    // Function to manage required attributes based on active tab
    function updateRequiredFields() {
        const activeTab = document.querySelector('.deal_choice-item.w--current');
        const moneyUnit = activeTab ? activeTab.getAttribute('moneyunit') : '';
        
        // Get all amount inputs
        const rialAmountInput = document.getElementById('topRialAmount');
        const liraAmountInput = document.getElementById('topLiraAmount');
        const tetherAmountInput = document.getElementById('topTetherAmount');
        
        // Remove required from all inputs first
        if (rialAmountInput) rialAmountInput.removeAttribute('required');
        if (liraAmountInput) liraAmountInput.removeAttribute('required');
        if (tetherAmountInput) tetherAmountInput.removeAttribute('required');
        
        // Add required only to the active tab's input
        if (moneyUnit === 'rial' && rialAmountInput) {
            rialAmountInput.setAttribute('required', '');
        } else if (moneyUnit === 'lira' && liraAmountInput) {
            liraAmountInput.setAttribute('required', '');
        } else if (moneyUnit === '' && tetherAmountInput) {
            tetherAmountInput.setAttribute('required', '');
        }
    }

    // ~ start clear form inputs on tab switch
    // Function to clear all form inputs except for the active tab
    function clearInactiveTabInputs() {
        const activeTab = document.querySelector('.tab-link.w--current');
        const moneyUnit = activeTab ? activeTab.getAttribute('moneyunit') : 'tether';
        
        // Clear radio button selections for inactive tabs
        if (moneyUnit !== 'rial') {
            // Clear rial radio buttons
            const rialRadios = document.querySelectorAll('input[name="irTopMethod"]');
            rialRadios.forEach(radio => radio.checked = false);
            // Clear rial amount
            const rialAmountInput = document.getElementById('topRialAmount');
            if (rialAmountInput) rialAmountInput.value = '';
        }
        
        if (moneyUnit !== 'lira') {
            // Clear lira radio buttons
            const liraRadios = document.querySelectorAll('input[name="trTopMethod"]');
            liraRadios.forEach(radio => radio.checked = false);
            // Clear lira amount
            const liraAmountInput = document.getElementById('topLiraAmount');
            if (liraAmountInput) liraAmountInput.value = '';
        }
        
        if (moneyUnit !== 'tether') {
            // Clear tether radio buttons
            const tetherRadios = document.querySelectorAll('input[name="network"]');
            tetherRadios.forEach(radio => radio.checked = false);
            // Clear tether amount
            const tetherAmountInput = document.getElementById('topTetherAmount');
            if (tetherAmountInput) tetherAmountInput.value = '';
        }
    }
    // ~! end clear form inputs on tab switch
    
    // Update required fields on page load
    updateRequiredFields();
    
    // Listen for tab changes to update required fields
    const tabLinks = document.querySelectorAll('.deal_choice-item');
    tabLinks.forEach(tab => {
        tab.addEventListener('click', function() {
            // Small delay to ensure tab change is complete
            setTimeout(() => {
                clearInactiveTabInputs();
                updateRequiredFields();
            }, 100);
        });
    });
    
    // ~ start minimum amount error handling for topup
    // Get amount input elements
    const rialAmountInput = document.getElementById('topRialAmount');
    const liraAmountInput = document.getElementById('topLiraAmount');
    const tetherAmountInput = document.getElementById('topTetherAmount');
    
    // Get error display elements
    const rialErrorDisplay = document.querySelector('.top_amount-error.is-rial');
    const liraErrorDisplay = document.querySelector('.top_amount-error.is-lira');
    const tetherErrorDisplay = document.querySelector('.top_amount-error.is-tether');
    
    // Error handling functions
    function updateRialErrorState(amount) {
        const isUnderMinimum = amount > 0 && amount < appConfig.minTopRial;
        if (rialErrorDisplay) rialErrorDisplay.style.display = isUnderMinimum ? 'block' : 'none';
        return isUnderMinimum;
    }
    
    function updateLiraErrorState(amount) {
        const isUnderMinimum = amount > 0 && amount < appConfig.minTopLira;
        if (liraErrorDisplay) liraErrorDisplay.style.display = isUnderMinimum ? 'block' : 'none';
        return isUnderMinimum;
    }
    
    function updateTetherErrorState(amount) {
        const isUnderMinimum = amount > 0 && amount < appConfig.minTopTether;
        if (tetherErrorDisplay) tetherErrorDisplay.style.display = isUnderMinimum ? 'block' : 'none';
        return isUnderMinimum;
    }
    
    // Add input event listeners for real-time validation
    if (rialAmountInput) {
        rialAmountInput.addEventListener('input', (e) => {
            const amount = parseFloat(e.target.value) || 0;
            updateRialErrorState(amount);
        });
    }
    
    if (liraAmountInput) {
        liraAmountInput.addEventListener('input', (e) => {
            const amount = parseFloat(e.target.value) || 0;
            updateLiraErrorState(amount);
        });
    }
    
    if (tetherAmountInput) {
        tetherAmountInput.addEventListener('input', (e) => {
            const amount = parseFloat(e.target.value) || 0;
            updateTetherErrorState(amount);
        });
    }
    // ~! end minimum amount error handling for topup
    
    topupForm.addEventListener('submit', function(e) {
        // Find the currently active tab to get the moneyunit value
        const activeTab = document.querySelector('.deal_choice-item.w--current');
        
        if (activeTab) {
            const moneyUnit = activeTab.getAttribute('moneyunit');
            
            // Validate payment method and amount based on selected money unit
            let isPaymentMethodSelected = false;
            let isAmountFilled = false;
            let isAmountValid = true;
            let methodError = null;
            
            if (moneyUnit === 'rial') {
                // Check irTopMethod group
                const irTopMethodRadios = document.querySelectorAll('input[name="irTopMethod"]');
                isPaymentMethodSelected = Array.from(irTopMethodRadios).some(radio => radio.checked);
                // Check if topRialAmount is filled and valid
                const amount = parseFloat(rialAmountInput.value) || 0;
                isAmountFilled = rialAmountInput && rialAmountInput.value.trim() !== '';
                isAmountValid = amount >= appConfig.minTopRial;
                // Find error div within the rial tab pane
                const rialTabPane = document.querySelector('#w-tabs-0-data-w-pane-0');
                methodError = rialTabPane ? rialTabPane.querySelector('.deal_method-error') : null;
            } else if (moneyUnit === 'lira') {
                // Check trTopMethod group
                const trTopMethodRadios = document.querySelectorAll('input[name="trTopMethod"]');
                isPaymentMethodSelected = Array.from(trTopMethodRadios).some(radio => radio.checked);
                // Check if topLiraAmount is filled and valid
                const amount = parseFloat(liraAmountInput.value) || 0;
                isAmountFilled = liraAmountInput && liraAmountInput.value.trim() !== '';
                isAmountValid = amount >= appConfig.minTopLira;
                // Find error div within the lira tab pane
                const liraTabPane = document.querySelector('#w-tabs-0-data-w-pane-1');
                methodError = liraTabPane ? liraTabPane.querySelector('.deal_method-error') : null;
            } else if (moneyUnit === '') {
                // For tether tab, check network selection instead
                const networkRadios = document.querySelectorAll('input[name="network"]');
                isPaymentMethodSelected = Array.from(networkRadios).some(radio => radio.checked);
                // Check if topTetherAmount is filled and valid
                const amount = parseFloat(tetherAmountInput.value) || 0;
                isAmountFilled = tetherAmountInput && tetherAmountInput.value.trim() !== '';
                isAmountValid = amount >= appConfig.minTopTether;
                // Find error div within the tether tab pane
                const tetherTabPane = document.querySelector('#w-tabs-0-data-w-pane-2');
                methodError = tetherTabPane ? tetherTabPane.querySelector('.deal_network-error') : null;
            }
            
            // Prevent form submission if validation fails
            if (!isPaymentMethodSelected || !isAmountFilled || !isAmountValid) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                // Show method error if payment method not selected
                if (methodError && !isPaymentMethodSelected) {
                    methodError.style.display = 'block';
                }
                
                // Show amount errors if amount is invalid
                if (moneyUnit === 'rial' && !isAmountValid) {
                    updateRialErrorState(parseFloat(rialAmountInput.value) || 0);
                } else if (moneyUnit === 'lira' && !isAmountValid) {
                    updateLiraErrorState(parseFloat(liraAmountInput.value) || 0);
                } else if (moneyUnit === '' && !isAmountValid) {
                    updateTetherErrorState(parseFloat(tetherAmountInput.value) || 0);
                }
                
                console.log('Form submission prevented - validation failed for', moneyUnit);
                return false;
            }
            
            // Hide errors if validation passes
            if (methodError) {
                methodError.style.display = 'none';
            }
            
            // Remove any existing moneyunit hidden input to avoid duplicates
            const existingInput = topupForm.querySelector('input[name="moneyUnit"]');
            if (existingInput) {
                existingInput.remove();
            }
            
            // Create and add hidden input for moneyunit - ensure it's added before form submission
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'moneyUnit';
            hiddenInput.value = moneyUnit || 'tether'; // Default to 'tether' if empty
            topupForm.appendChild(hiddenInput);
            
            console.log('Topup form submission with moneyUnit:', moneyUnit || 'tether');
        }
    });
}
// ~! end topup form moneyunit submission handling