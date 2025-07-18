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




// ~ start persian/arabic number conversion
function convertPersianArabicToEnglish(str) {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    let result = str;
    
    // Convert Persian numbers
    for (let i = 0; i < persianNumbers.length; i++) {
        result = result.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
    }
    
    // Convert Arabic numbers
    for (let i = 0; i < arabicNumbers.length; i++) {
        result = result.replace(new RegExp(arabicNumbers[i], 'g'), englishNumbers[i]);
    }
    
    return result;
}

// Apply conversion to all number input fields
document.addEventListener('input', function(e) {
    if (e.target.type === 'number' || e.target.type === 'text') {
        const originalValue = e.target.value;
        const convertedValue = convertPersianArabicToEnglish(originalValue);
        
        if (originalValue !== convertedValue) {
            const cursorPosition = e.target.selectionStart;
            e.target.value = convertedValue;
            // Restore cursor position
            e.target.setSelectionRange(cursorPosition, cursorPosition);
        }
    }
});
// ~! end persian/arabic number conversion





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




