// ~ calculation and updating price variables in buy form

// Price calculation variables
const priceConfig = {
    momentPrice: 85000,  // Base price from API
    exchangeFee: 10000,  // Fixed exchange fee
    networkFeeRate: 0.6,  // Network fee rate from API
    minOrder: 10         // Minimum order amount
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

        // Prevent form submission if amount is under minimum
        const form = tetherInput.closest('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                const amount = parseFloat(tetherInput.value) || 0;
                console.log('Form submit attempt with amount:', amount, 'Min required:', priceConfig.minOrder);
                if (amount < priceConfig.minOrder) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log('Form submission prevented - amount below minimum');
                    return false;
                }
            });
        }

        // Additional prevention on submit button click
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                const amount = parseFloat(tetherInput.value) || 0;
                if (amount < priceConfig.minOrder) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log('Submit button click prevented - amount below minimum');
                    return false;
                }
            });
        }
    }

});

// ~! end calculation and updating price variables in buy form

// ~ Handle radio button selection
document.addEventListener('DOMContentLoaded', () => {
    // Function to handle radio button state changes
    function handleRadioChange(radioBtn, input) {
        const groupIsolate = radioBtn.getAttribute('groupisolate');
        if (!groupIsolate) return;

        // Remove checked class from all radios in the same group
        const groupRadios = document.querySelectorAll(`[groupisolate="${groupIsolate}"]`);
        groupRadios.forEach(rb => rb.classList.remove('is-checked'));

        // Add checked class to the selected radio
        if (input.checked) {
            radioBtn.classList.add('is-checked');
        }
    }

    // Initialize and attach event listeners to all radio buttons
    document.querySelectorAll('.radio-button').forEach(radioBtn => {
        const input = radioBtn.querySelector('input[type="radio"]');
        if (!input) return;

        // Set initial state
        if (input.checked) {
            handleRadioChange(radioBtn, input);
        }

        // Handle click on the radio button container
        radioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            input.checked = true;
            handleRadioChange(radioBtn, input);
        });

        // Handle direct input changes
        input.addEventListener('change', () => {
            handleRadioChange(radioBtn, input);
        });
    });
});
// ~! End Handle radio button selection


