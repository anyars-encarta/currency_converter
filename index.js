import axios from "axios";

// https:fixer.io/
const FIXER_API_KEY = "f50565f7d3881f2a91c1f12aa05f46ac";
const FIXER_API = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`;

// https://countrylayer.com/
const COUNTRYLAYER_API_KEY = "a6f7cb4f94ffc277a350d3e2021a186c";
// const COUNTRYLAYER_API = `https://api.countrylayer.com/v2/currency/{currency}?${COUNTRYLAYER_API_KEY}`;
const COUNTRYLAYER_API = "https://api.countrylayer.com/v2/currency";

// Async/Await
// Fetch data about currencies
const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
        const { data: { rates } } = await axios.get(FIXER_API);
      
        const euro = 1 / rates[fromCurrency];
        const exchangeRate = euro * rates[toCurrency];
      
        return exchangeRate
    } catch (e) {
        throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`)
    }
};

// getExchangeRate('USD', 'EUR');

// Fetch data about countries
const getCountries = async (currencyCode) => {
    try { 
        const { data } = await axios.get(
          `${COUNTRYLAYER_API}/${currencyCode}?access_key=${COUNTRYLAYER_API_KEY}`
        );
      
        return data.map(({ name }) => name);
    } catch (e) {
        throw new Error(`Unable to get countries that use ${currencyCode}`)
    }
};

// getCountries("USD");

// Convert Currency
const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    try {
        fromCurrency = fromCurrency.toUpperCase();
        toCurrency = toCurrency.toUpperCase();
    
        const [exchangeRate, countries] = await Promise.all([
            getExchangeRate(fromCurrency, toCurrency),
            getCountries(toCurrency),
        ])
    
        const convertedAmount = (amount * exchangeRate).toFixed(2)
        
        return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.
        You can spend these in the following countries:
        ${countries}.`
    } catch (e) {
       throw new Error(`Unable to convert ${amount} from ${fromCurrency} to ${toCurrency}`) 
    }
}

// Output data
// convertCurrency("USD", "EUR", 300)
// .then((result) => console.log(result))
// .catch((error) => console.log(error))

const result = await convertCurrency("USD", "EUR", 300)
console.log(result)