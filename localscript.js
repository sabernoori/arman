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
        const isOverBalance = amount > appConfig.userRialBalance;
        const hasError = isUnderMinimum || isOverBalance;
        if (rialWithdrawErrorDisplay) rialWithdrawErrorDisplay.style.display = hasError ? 'block' : 'none';
        return hasError;
    }
    
    function updateWithdrawLiraErrorState(amount) {
        const isUnderMinimum = amount > 0 && amount < appConfig.minWithdrawLira;
        const isOverBalance = amount > appConfig.userLiraBalance;
        const hasError = isUnderMinimum || isOverBalance;
        if (liraWithdrawErrorDisplay) liraWithdrawErrorDisplay.style.display = hasError ? 'block' : 'none';
        return hasError;
    }
    
    function updateWithdrawTrcErrorState(amount) {
        const isUnderMinimum = amount > 0 && amount < appConfig.minWithdrawTrc;
        const isOverBalance = amount > appConfig.userTrcBalance;
        const hasError = isUnderMinimum || isOverBalance;
        if (trcWithdrawErrorDisplay) trcWithdrawErrorDisplay.style.display = hasError ? 'block' : 'none';
        return hasError;
    }
    
    function updateWithdrawErcErrorState(amount) {
        const isUnderMinimum = amount > 0 && amount < appConfig.minWithdrawErc;
        const isOverBalance = amount > appConfig.userErcBalance;
        const hasError = isUnderMinimum || isOverBalance;
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
    
    // Clear radio button selections for inactive tabs
    if (moneyUnit !== 'rial') {
        const rialRadios = document.querySelectorAll('input[name="rialRadio"]');
        rialRadios.forEach(radio => radio.checked = false);
        
        // Clear rial amount input
        const withdrawRialAmountInput = document.getElementById('withdrawRialAmount');
        if (withdrawRialAmountInput) withdrawRialAmountInput.value = '';
    }
    
    if (moneyUnit !== 'lira') {
        const liraRadios = document.querySelectorAll('input[name="liraRadio"]');
        liraRadios.forEach(radio => radio.checked = false);
        
        // Clear lira amount input
        const withdrawLiraAmountInput = document.getElementById('withdrawLiraAmount');
        if (withdrawLiraAmountInput) withdrawLiraAmountInput.value = '';
    }
    
    if (moneyUnit !== 'tether') {
        // Clear tether amount inputs
        const withdrawTrcAmountInput = document.getElementById('withdrawTrcAmount');
        const withdrawErcAmountInput = document.getElementById('withdrawErcAmount');
        const walletAddressTrcInput = document.getElementById('walletAddressTrc');
        const walletAddressErcInput = document.getElementById('walletAddressErc');
        
        if (withdrawTrcAmountInput) withdrawTrcAmountInput.value = '';
        if (withdrawErcAmountInput) withdrawErcAmountInput.value = '';
        if (walletAddressTrcInput) walletAddressTrcInput.value = '';
        if (walletAddressErcInput) walletAddressErcInput.value = '';
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