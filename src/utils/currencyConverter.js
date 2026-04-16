export const convertUSDToEGP = async (priceUSD) => {

try {

const response = await fetch(
"https://open.er-api.com/v6/latest/USD"
);

const data = await response.json();

const rate = data.rates.EGP;

return Math.round(priceUSD * rate);

} catch (error) {

console.log("Currency conversion error:", error);

// fallback احتياطي لو API وقف

return Math.round(priceUSD * 50);

}

};