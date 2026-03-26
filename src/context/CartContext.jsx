import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {

    setCartItems(prev => [...prev, item]);

  };

  const removeFromCart = (index) => {

    setCartItems(prev =>
      prev.filter((_, i) => i !== index)
    );

  };

  const clearCart = () => {

    setCartItems([]);

  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return (

    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice
      }}
    >

      {children}

    </CartContext.Provider>

  );

}