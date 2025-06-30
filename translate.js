
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
        "got": "Recevied",
        "langDisplay": "En"

    },

        tr: {
        "navCta": "Hızlı Al veya Sat",
        "navDashboard": "Kontrol Paneli",
        "navWallet": "Cüzdan",
        "navTransactions": "İşlemler",
        "navTicket": "Bilet",
        "navSetting": "Ayarlar",
        "profName": "Sab Nouri",
        "profStatus": "Kimlik Doğrulandı",
        "profEdit": "Profili Düzenle",
        "currentPriceRial": "Tether Canlı Fiyat",
        "currentPriceLira": "Türk Lirası Canlı Fiyat",
        "numPriceRial": "94.000",
        "numPriceLira": "38,5",
        "dashHeading": "Tether'ı En İyi Fiyata Al",
        "dashDescription": "{Brand Name} ekibimizle şimdi Tether alım veya satım emrinizi verin! Emriniz anında yerine getirilecektir.",
        "dashCTA": "Alım veya Satım Emri Ver",
        "yourBalance": "Tether Bakiyeniz",
        "usdt": "USDT",
        "num-balance": "537,00",
        "Withdraw": "Çek",
        "lastTransactions": "Son İşlemler",
        "buy": "Al",
        "sell": "Sat",
        "pending": "Beklemede",
        "done": "Tamamlandı",
        "canceled": "İptal Edildi",
        "basePrice": "Birim Fiyat:",
        "transactionToman": "Toman",
        "paid": "Ödendi",
        "got": "Alındı",
        "langDisplay": "Tr"
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
        "got": "دریافتی",
        "langDisplay": "Fa",
        "allTransactions": "",
    }
};



// --- DEFAULT LANGUAGE SETUP --- //
const savedLang = localStorage.getItem('lang');
const defaultLang = savedLang || 'fa';
document.documentElement.setAttribute('lang', defaultLang);
document.documentElement.setAttribute('dir', defaultLang === 'fa' ? 'rtl' : 'ltr');

// --- UPDATE CONTENT ON LANGUAGE CHANGE --- //
function updateLanguage() {
    const lang = document.documentElement.lang || 'en';
    const dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang]?.[key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update dropdown toggle text
    const langDisplay = document.querySelector('[data-i18n="langDisplay"]');
    if (langDisplay && translations[lang]?.langDisplay) {
        langDisplay.textContent = translations[lang].langDisplay;
    }
}

// --- OBSERVER FOR HTML LANG CHANGES --- //
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
            updateLanguage();
        }
    });
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

// --- CLICK HANDLER FOR LANGUAGE SWITCH --- //
document.querySelectorAll('.lang_item').forEach(item => {
    item.addEventListener('click', () => {
        const newLang = item.getAttribute('language');
        if (newLang) {
            document.documentElement.setAttribute('lang', newLang);
            localStorage.setItem('lang', newLang);
        }
    });
});

// --- INITIAL LOAD --- //
updateLanguage();


