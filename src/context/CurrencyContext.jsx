import { createContext, useContext, useEffect, useState } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {

const [currency, setCurrency] = useState(
localStorage.getItem("currency") || "USD"
);

const [rates, setRates] = useState({
USD: 1
});


/*
تحميل أسعار العملات تلقائي
*/

useEffect(() => {

const fetchRates = async () => {

try {

const res = await fetch(
"https://open.er-api.com/v6/latest/USD"
);

const data = await res.json();

setRates(data.rates);

} catch {

setRates({
USD: 1,
EGP: 50,
EUR: 0.92,
SAR: 3.75,
AED: 3.67
});

}

};

fetchRates();

}, []);


/*
حفظ العملة المختارة
*/

useEffect(() => {

localStorage.setItem("currency", currency);

}, [currency]);


/*
تحويل السعر تلقائي
*/

const formatPrice = (priceUSD) => {

if (priceUSD === undefined || priceUSD === null)
return `-- ${currency}`;

const converted =
priceUSD * (rates[currency] || 1);

return `${converted.toFixed(2)} ${currency}`;

};


return (

<CurrencyContext.Provider
value={{
currency,
setCurrency,
formatPrice
}}
>

{children}

</CurrencyContext.Provider>

);

};


export const useCurrency = () => useContext(CurrencyContext);