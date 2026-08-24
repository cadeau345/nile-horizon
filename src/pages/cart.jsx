import { useContext } from "react";
import { Link } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { usePrice } from "../utils/price";

function Cart() {

  const price = usePrice();

  const {
    cartItems,
    removeFromCart,
    totalPrice
  } = useContext(CartContext);


  return (

    <div className="max-w-5xl mx-auto px-4 py-32">

      <h1 className="text-3xl font-bold mb-8">
        Your Booking Cart
      </h1>


      {/* EMPTY CART */}

      {cartItems.length === 0 ? (

        <div className="text-center py-16">

          <h2 className="text-xl font-semibold mb-4">
            Your cart is empty
          </h2>

          <Link
            to="/"
            className="
              inline-block
              bg-indigo-600
              text-white
              px-6
              py-3
              rounded-xl
            "
          >
            Explore Our Services
          </Link>

        </div>

      ) : (

        <>

          {/* CART ITEMS */}

          <div className="space-y-4">

            {cartItems.map((item, index) => (

              <div
                key={index}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  p-5
                  bg-white
                  rounded-2xl
                  shadow
                "
              >

                <div>

                  <h3 className="font-bold text-lg">
                    {item.name}
                  </h3>

                  {item.type && (
                    <p className="text-gray-500 text-sm">
                      {item.type}
                    </p>
                  )}

                </div>


                <div className="flex items-center gap-5">

                  <p className="font-semibold">
                    {price(item.price)}
                  </p>

                  <button
                    onClick={() =>
                      removeFromCart(index)
                    }
                    className="
                      text-red-500
                      hover:text-red-700
                      font-medium
                    "
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* TOTAL */}

          <div
            className="
              mt-8
              p-6
              bg-gray-50
              rounded-2xl
              flex
              flex-col
              md:flex-row
              items-center
              justify-between
              gap-5
            "
          >

            <div>

              <p className="text-gray-500">
                Total Booking Amount
              </p>

              <h2 className="text-2xl font-bold">
                {price(totalPrice)}
              </h2>

            </div>


            {/* BOOKING BUTTON */}

            <Link
              to="/booking"
              className="
                bg-indigo-600
                hover:bg-indigo-700
                text-white
                px-8
                py-3
                rounded-xl
                font-semibold
                transition
              "
            >
              Continue Booking
            </Link>

          </div>

        </>

      )}

    </div>

  );

}

export default Cart;