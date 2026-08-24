import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addDoc, collection, Timestamp } from "firebase/firestore";

import { db } from "../firebase";
import { CartContext } from "../context/CartContext";
import { usePrice } from "../utils/price";


function Booking() {

  const navigate = useNavigate();

  const price = usePrice();

  const {
    cartItems,
    totalPrice,
    clearCart
  } = useContext(CartContext);


  /* =========================
     CUSTOMER DATA
  ========================= */

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");

  const [notes, setNotes] = useState("");


  /* =========================
     STATUS
  ========================= */

  const [loading, setLoading] = useState(false);


  /* =========================
     EMPTY CART
  ========================= */

  if (cartItems.length === 0) {

    return (

      <div className="min-h-screen flex items-center justify-center px-4">

        <div className="text-center">

          <h1 className="text-3xl font-bold mb-4">
            Your booking cart is empty
          </h1>

          <p className="text-gray-500 mb-6">
            Please select a hotel, trip or service first.
          </p>

          <Link
            to="/"
            className="
              inline-block
              bg-indigo-600
              hover:bg-indigo-700
              text-white
              px-6
              py-3
              rounded-xl
            "
          >
            Explore Services
          </Link>

        </div>

      </div>

    );

  }


  /* =========================
     CONFIRM BOOKING
  ========================= */

  const handleConfirmBooking = async () => {

    /* Validate name */

    if (!name.trim()) {

      alert("Please enter your name.");

      return;

    }


    /* Validate phone */

    if (!phone.trim()) {

      alert("Please enter your phone number.");

      return;

    }


    /* Prevent double click */

    if (loading) return;


    try {

      setLoading(true);


      /*
        Create one booking document
        containing all cart items.
      */

      await addDoc(
        collection(db, "bookings"),
        {

          /* Customer */

          name: name.trim(),

          phone: phone.trim(),

          userEmail:
            email.trim() || "",


          /* Services */

          items: cartItems.map(item => ({

            name: item.name || "",

            price:
              Number(item.price || 0),

            serviceType:
              item.serviceType || "",

            hotelId:
              item.hotelId || "",

            hotelLocation:
              item.hotelLocation || "",

            roomName:
              item.roomName || "",

            roomGuests:
              item.roomGuests || "",

            checkIn:
              item.checkIn || "",

            checkOut:
              item.checkOut || "",

            nights:
              item.nights || 0,

            guests:
              item.guests || "",

            from:
              item.from || "",

            to:
              item.to || "",

            travelDate:
              item.travelDate || "",

            visitDate:
              item.visitDate || ""

          })),


          /*
            Keep first item information
            for compatibility with the
            current Admin Bookings page.
          */

          serviceName:
            cartItems[0]?.name || "",

          serviceType:
            cartItems[0]?.serviceType || "",

          price:
            Number(totalPrice || 0),


          /* Payment */

          paymentMethod:
            "cash_on_arrival",


          paymentStatus:
            "pending",


          /* Booking status */

          status:
            "pending",


          /* Notes */

          notes:
            notes.trim() || "",


          /* Timestamp */

          createdAt:
            Timestamp.now()

        }
      );


      /*
        Clear cart after successful booking.
      */

      clearCart();


      alert(
        "Booking request sent successfully!"
      );


      /*
        Go back to home.
      */

      navigate("/");

    } catch (error) {

      console.error(
        "Booking error:",
        error
      );

      alert(
        "Something went wrong while sending your booking."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================
     PAGE
  ========================= */

  return (

    <div className="max-w-6xl mx-auto px-4 py-32">


      <h1 className="text-4xl font-bold mb-8">
        Complete Your Booking
      </h1>


      <div className="grid lg:grid-cols-2 gap-8">


        {/* =====================
            CUSTOMER INFORMATION
        ===================== */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-6">
            Customer Information
          </h2>


          {/* NAME */}

          <label className="block font-semibold mb-2">
            Full Name *
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Enter your full name"
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              mb-5
              outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
          />


          {/* PHONE */}

          <label className="block font-semibold mb-2">
            Phone Number *
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            placeholder="Enter your phone number"
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              mb-5
              outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
          />


          {/* EMAIL */}

          <label className="block font-semibold mb-2">
            Email
            <span className="text-gray-400 text-sm ml-2">
              Optional
            </span>
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              mb-5
              outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
          />


          {/* NOTES */}

          <label className="block font-semibold mb-2">
            Additional Notes
          </label>

          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            placeholder="Any special requests?"
            rows="5"
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              mb-5
              outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
          />


          {/* PAYMENT */}

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">

            <p className="font-bold text-green-700 mb-1">
              Payment Method
            </p>

            <p className="text-green-700">
              💵 Cash on Arrival
            </p>

            <p className="text-sm text-gray-600 mt-2">
              No online payment is required.
            </p>

          </div>

        </div>



        {/* =====================
            BOOKING SUMMARY
        ===================== */}

        <div className="bg-gray-50 rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-6">
            Booking Summary
          </h2>


          {/* ITEMS */}

          <div className="space-y-4">

            {cartItems.map(
              (item, index) => (

                <div
                  key={index}
                  className="
                    bg-white
                    rounded-xl
                    p-4
                    border
                  "
                >

                  <div className="flex justify-between gap-4">

                    <div>

                      <h3 className="font-bold">
                        {item.name}
                      </h3>


                      {item.serviceType && (

                        <p className="text-sm text-gray-500">
                          Type:{" "}
                          {item.serviceType}
                        </p>

                      )}

                    </div>


                    <p className="font-bold">

                      {price(
                        Number(
                          item.price || 0
                        )
                      )}

                    </p>

                  </div>



                  {/* HOTEL DETAILS */}

                  {item.serviceType ===
                    "hotel" && (

                    <div className="mt-3 text-sm text-gray-600 space-y-1">

                      {item.roomName && (

                        <p>
                          Room:{" "}
                          {item.roomName}
                        </p>

                      )}


                      {item.checkIn && (

                        <p>
                          Check-in:{" "}
                          {item.checkIn}
                        </p>

                      )}


                      {item.checkOut && (

                        <p>
                          Check-out:{" "}
                          {item.checkOut}
                        </p>

                      )}


                      {item.nights && (

                        <p>
                          Nights:{" "}
                          {item.nights}
                        </p>

                      )}


                      {item.guests && (

                        <p>
                          Guests:{" "}
                          {item.guests}
                        </p>

                      )}

                    </div>

                  )}



                  {/* TRANSPORT */}

                  {item.serviceType ===
                    "transport" && (

                    <div className="mt-3 text-sm text-gray-600 space-y-1">

                      {item.from && (

                        <p>
                          From:{" "}
                          {item.from}
                        </p>

                      )}


                      {item.to && (

                        <p>
                          To:{" "}
                          {item.to}
                        </p>

                      )}


                      {item.travelDate && (

                        <p>
                          Travel Date:{" "}
                          {item.travelDate}
                        </p>

                      )}

                    </div>

                  )}



                  {/* TEMPLE */}

                  {item.serviceType ===
                    "temple" && (

                    <div className="mt-3 text-sm text-gray-600">

                      {item.visitDate && (

                        <p>
                          Visit Date:{" "}
                          {item.visitDate}
                        </p>

                      )}

                    </div>

                  )}

                </div>

              )
            )}

          </div>



          {/* TOTAL */}

          <div className="border-t mt-6 pt-6">

            <div className="flex justify-between items-center">

              <span className="text-xl font-semibold">
                Total
              </span>

              <span className="text-2xl font-bold text-indigo-600">

                {price(
                  Number(
                    totalPrice || 0
                  )
                )}

              </span>

            </div>

          </div>



          {/* CONFIRM */}

          <button
            onClick={
              handleConfirmBooking
            }
            disabled={loading}
            className="
              w-full
              mt-6
              bg-indigo-600
              hover:bg-indigo-700
              disabled:bg-gray-400
              text-white
              py-4
              rounded-xl
              font-bold
              text-lg
              transition
            "
          >

            {loading
              ? "Sending Booking..."
              : "Confirm Booking"}

          </button>


          {/* BACK */}

          <Link
            to="/cart"
            className="
              block
              text-center
              mt-4
              text-gray-600
              hover:text-indigo-600
            "
          >
            ← Back to Cart
          </Link>

        </div>

      </div>

    </div>

  );

}


export default Booking;