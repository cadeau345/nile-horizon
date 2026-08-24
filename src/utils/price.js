import { useCurrency } from "../context/CurrencyContext";

export const usePrice = () => {

  const {
    formatPrice
  } = useCurrency();


  return (
    amount,
    sourceCurrency = "USD"
  ) => {

    return formatPrice(
      amount,
      sourceCurrency
    );

  };

};