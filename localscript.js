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
const radioButtons = document.querySelectorAll('.radio-button');

radioButtons.forEach(radioBtn => {
    const input = radioBtn.querySelector('input[type="radio"]');
    const groupName = input.getAttribute('groupisolate');

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
        document.querySelectorAll(`.radio-button input[groupisolate="${groupName}"]`).forEach(groupInput => {
            groupInput.closest('.radio-button').classList.remove('is-checked');
        });
        
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


