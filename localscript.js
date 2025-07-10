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
    }

    // Prevent form submission if amount is under minimum
    const form = tetherInput.closest('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            const amount = parseFloat(tetherInput.value) || 0;
            if (amount < priceConfig.minOrder) {
                e.preventDefault();
            }
        });
    }

// ~! end calculation and updating price variables in buy form





});





