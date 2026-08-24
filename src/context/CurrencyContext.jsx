import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {

  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "EGP"
  );

  const [rates, setRates] = useState({
    USD: 1,
    EGP: 50,
    EUR: 0.92,
    SAR: 3.75,
    AED: 3.67
  });


  // =========================
  // GET EXCHANGE RATES
  // =========================

  useEffect(() => {

    const fetchRates = async () => {

      try {

        const response = await fetch(
          "https://open.er-api.com/v6/latest/USD"
        );

        const data = await response.json();

        if (
          data &&
          data.rates
        ) {

          setRates(data.rates);

        }

      } catch (error) {

        console.log(
          "Currency API failed. Using fallback rates."
        );

      }

    };

    fetchRates();

  }, []);


  // =========================
  // SAVE SELECTED CURRENCY
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "currency",
      currency
    );

  }, [currency]);


  // =========================
  // FORMAT PRICE
  //
  // amount:
  // السعر
  //
  // sourceCurrency:
  // العملة الأصلية للسعر
  // =========================

  const formatPrice = (
    amount,
    sourceCurrency = "USD"
  ) => {

    if (
      amount === undefined ||
      amount === null ||
      amount === "" ||
      isNaN(Number(amount))
    ) {

      return `-- ${currency}`;

    }


    const value = Number(amount);


    // =========================
    // SAME CURRENCY
    // =========================

    if (
      sourceCurrency === currency
    ) {

      return `${value.toFixed(2)} ${currency}`;

    }


    // =========================
    // USD → TARGET
    // =========================

    if (
      sourceCurrency === "USD"
    ) {

      const targetRate =
        rates[currency] || 1;

      const converted =
        value * targetRate;

      return `${converted.toFixed(2)} ${currency}`;

    }


    // =========================
    // EGP → TARGET
    // =========================

    if (
      sourceCurrency === "EGP"
    ) {

      const egpRate =
        rates.EGP || 50;


      // EGP → USD
      const usdValue =
        value / egpRate;


      // USD → TARGET
      const targetRate =
        rates[currency] || 1;


      const converted =
        usdValue * targetRate;


      return `${converted.toFixed(2)} ${currency}`;

    }


    // =========================
    // OTHER CURRENCIES
    // =========================

    const sourceRate =
      rates[sourceCurrency];


    if (
      !sourceRate
    ) {

      return `${value.toFixed(2)} ${sourceCurrency}`;

    }


    // Source → USD
    const usdValue =
      value / sourceRate;


    // USD → Target
    const targetRate =
      rates[currency] || 1;


    const converted =
      usdValue * targetRate;


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


export const useCurrency =
  () => useContext(CurrencyContext);