import { useContext } from "react";

import { CartContext } from "../context/CartContext";

function Cart() {

  const {

    cartItems,
    removeFromCart,
    totalPrice

  } = useContext(CartContext);


  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">

        Your Cart

      </h1>


      {cartItems.map((item, index) => (

        <div
          key={index}
          className="flex justify-between mb-4"
        >

          <p>

            {item.name}

          </p>

          <p>

            ${item.price}

          </p>


          <button
            onClick={() =>
              removeFromCart(index)
            }
            className="text-red-500"
          >

            Remove

          </button>

        </div>

      ))}


      <h2 className="text-xl font-bold mt-6">

        Total: ${totalPrice}

      </h2>

    </div>

  );

}

export default Cart;