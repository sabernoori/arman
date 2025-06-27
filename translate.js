
const translations = {
    en: {
        "navCta": "Quick Buy or Sell",
        "navDashboard": "Dashboard",
        "navWallet": "Wallet",
        "navTransactions": "Transactions",
        "navTicket": "Ticket",
        "navSetting": "Settings",
        "profName": "Sab Nouri",
        "profStatus": "Identity Verified",
        "profEdit": "Edit Profile",
        "currentPriceRial": "Tether Live Price",
        "currentPriceLira": "Live Price in Turkish Lira",
        "numPriceRial": "94,000",
        "numPriceLira": "38.5",
        "dashHeading": "Buy Tether at the Best Price",
        "dashDescription": "Place your Tether buy or sell order now! Our team at {Brand Name} will fulfill your order immediately.",
        "dashCTA": "Place Buy or Sell Order",
        "yourBalance": "Your Tether Balance",
        "usdt": "USDT",
        "num-balance": "537.00",
        "Withdraw": "Withdraw",
        "lastTransactions": "Recent Transactions",
        "buy": "Buy",
        "sell": "Sell",
        "pending": "Pending",
        "done": "Done",
        "canceled": "Canceled",
        "basePrice": "Unit Price:",
        "transactionToman": "Toman",
        "paid": "Paid",
        "got": "Recevied"
    },
    fa: {
        "navCta": "خرید یا فروش سریع",
        "navDashboard": "داشبورد",
        "navWallet": "کیف پول",
        "navTransactions": "تراکنش ها",
        "navTicket": "تیکت",
        "navSetting": "تنظیمات",
        "profName": "صابر نوری",
        "profStatus": "تایید هویت شده",
        "profEdit": "ویرایش پروفایل",
        "currentPriceRial": "قیمت لحظه ای تتر",
        "currentPriceLira": "قیمت لحظه ای به لیر ترکیه",
        "numPriceRial": "94,000",
        "numPriceLira": "38,5",
        "dashHeading": "خرید تتر با بهترین قیمت",
        "dashDescription": "همین حالا سفارش خرید یا فروش تتر خود را ثبت کنید! همکاران ما در {نام برند} بصورت فوری سفارش شما را تحویل خواهند داد.",
        "dashCTA": "ثبت سفارش خرید یا فروش",
        "yourBalance": "موجودی تتر شما",
        "usdt": "USDT",
        "num-balance": "537.00",
        "Withdraw": "برداشت",
        "lastTransactions": "تراکنش های اخیر",
        "buy": "خرید",
        "sell": "فروش",
        "pending": "درحال انجام",
        "done": "انجام شده",
        "canceled": "لغو شده",
        "basePrice": "قیمت واحد:",
        "transactionToman": "تومان",
        "paid": "پرداختی",
        "got": "دریافتی"
    }
};




// Update page content based on language
function updateLanguage() {
    const lang = document.documentElement.lang || 'en';
    const dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translations[lang]?.[key] || element.textContent;
    });
}

// MutationObserver to detect lang attribute changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
            updateLanguage();
        }
    });
});

// Observe changes to the lang attribute
observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
});

// Initial load
updateLanguage();
