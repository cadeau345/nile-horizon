import { useCurrency } from "../context/CurrencyContext";

function Price({ value }) {

const { currency, convertPrice } = useCurrency();

return (

<>
{convertPrice(value)} {currency}
</>

);

}

export default Price;