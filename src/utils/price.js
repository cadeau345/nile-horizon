import { useCurrency } from "../context/CurrencyContext";

export const usePrice = () => {

const { formatPrice } = useCurrency();

return formatPrice;

};