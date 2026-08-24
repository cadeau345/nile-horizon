import { Link, useLocation } from "react-router-dom";

import {
  useState,
  useEffect,
  useContext
} from "react";

import { useCurrency } from "../context/CurrencyContext";

import { CartContext } from "../context/CartContext";

import {
  Menu,
  X,
  ShoppingCart
} from "lucide-react";

import {
  auth,
  db
} from "../firebase";

import {
  onAuthStateChanged
} from "firebase/auth";

import {
  doc,
  getDoc
} from "firebase/firestore";


function Navbar() {

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [isOpen, setIsOpen] =
    useState(false);


  const location =
    useLocation();


  /* =========================
     CURRENCY
  ========================= */

  const {
    currency,
    setCurrency
  } = useCurrency();


  /* =========================
     CART
  ========================= */

  const {
    cartItems
  } = useContext(
    CartContext
  );


  /* =========================
     CHECK ADMIN
  ========================= */

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {

          if (!currentUser) {

            setIsAdmin(false);

            return;

          }


          try {

            const docRef =
              doc(
                db,
                "users",
                currentUser.uid
              );


            const docSnap =
              await getDoc(
                docRef
              );


            if (
              docSnap.exists()
            ) {

              setIsAdmin(
                docSnap.data().role ===
                "admin"
              );

            } else {

              setIsAdmin(false);

            }

          } catch (error) {

            console.log(
              "Admin authentication check failed:",
              error
            );

            setIsAdmin(false);

          }

        }
      );


    return () =>
      unsubscribe();

  }, []);


  /* =========================
     HOME
  ========================= */

  const isHome =
    location.pathname === "/";


  return (

    <nav
      className={`
        fixed
        w-full
        top-0
        left-0
        z-50
        transition-all
        duration-300

        ${
          isHome
            ? "bg-transparent text-white"
            : "bg-white shadow text-gray-800"
        }
      `}
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          py-3
          flex
          items-center
          justify-between
          relative
        "
      >


        {/* =====================
            LOGO
        ===================== */}

        <Link
          to="/"
          className="
            text-xl
            font-bold
            whitespace-nowrap
          "
        >

          <span className="text-indigo-600">
            Nile
          </span>

          Horizon

        </Link>



        {/* =====================
            DESKTOP MENU
        ===================== */}

        <div
          className="
            hidden
            lg:flex
            items-center
            gap-6
          "
        >

          <Link to="/">
            Home
          </Link>


          <Link to="/hotels">
            Hotels
          </Link>


          <Link to="/transport">
            Transport
          </Link>


          <Link to="/trips">
            Trips
          </Link>


          <Link to="/offers">
            Offers
          </Link>


          <Link to="/about">
            About Aswan
          </Link>


          <Link to="/contact">
            Contact
          </Link>



          {/* =====================
              BOOKING CART
          ===================== */}

          <Link
            to="/cart"
            className="
              flex
              items-center
              gap-2
              font-semibold
              relative
            "
          >

            <ShoppingCart
              size={20}
            />

            <span>
              Cart
            </span>


            {cartItems.length > 0 && (

              <span
                className="
                  absolute
                  -top-3
                  -right-3
                  bg-red-500
                  text-white
                  text-xs
                  font-bold
                  w-5
                  h-5
                  rounded-full
                  flex
                  items-center
                  justify-center
                "
              >

                {cartItems.length}

              </span>

            )}

          </Link>



          {/* =====================
              CURRENCY
          ===================== */}

          <select
            value={currency}
            onChange={(e) =>
              setCurrency(
                e.target.value
              )
            }
            className="
              border
              px-2
              py-1
              rounded
              text-black
            "
          >

            <option value="USD">
              USD
            </option>

            <option value="EGP">
              EGP
            </option>

            <option value="EUR">
              EUR
            </option>

            <option value="SAR">
              SAR
            </option>

            <option value="AED">
              AED
            </option>

          </select>



          {/* =====================
              ADMIN
          ===================== */}

          {isAdmin && (

            <Link
              to="/admin"
            >

              <button
                className="
                  bg-indigo-600
                  text-white
                  px-5
                  py-2
                  rounded-xl
                "
              >

                Admin Dashboard

              </button>

            </Link>

          )}

        </div>



        {/* =====================
            MOBILE RIGHT SIDE
        ===================== */}

        <div
          className="
            flex
            items-center
            gap-3
            lg:hidden
          "
        >


          {/* MOBILE CART */}

          <Link
            to="/cart"
            className="
              relative
              p-1
            "
          >

            <ShoppingCart
              size={24}
            />


            {cartItems.length > 0 && (

              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  bg-red-500
                  text-white
                  text-xs
                  font-bold
                  w-5
                  h-5
                  rounded-full
                  flex
                  items-center
                  justify-center
                "
              >

                {cartItems.length}

              </span>

            )}

          </Link>



          {/* ADMIN */}

          {isAdmin && (

            <Link
              to="/admin"
            >

              <button
                className="
                  bg-indigo-600
                  text-white
                  px-3
                  py-1
                  rounded-md
                  text-xs
                "
              >

                Admin

              </button>

            </Link>

          )}



          {/* MENU BUTTON */}

          <button
            onClick={() =>
              setIsOpen(!isOpen)
            }
            className="p-1"
          >

            {isOpen ? (

              <X size={26} />

            ) : (

              <Menu size={26} />

            )}

          </button>

        </div>

      </div>



      {/* =====================
          MOBILE MENU
      ===================== */}

      {isOpen && (

        <div
          className="
            lg:hidden
            w-full
            bg-white
            shadow-lg
            px-6
            py-5
            flex
            flex-col
            gap-4
            text-gray-800
          "
        >

          <Link
            to="/"
            onClick={() =>
              setIsOpen(false)
            }
          >

            Home

          </Link>


          <Link
            to="/hotels"
            onClick={() =>
              setIsOpen(false)
            }
          >

            Hotels

          </Link>


          <Link
            to="/transport"
            onClick={() =>
              setIsOpen(false)
            }
          >

            Transport

          </Link>


          <Link
            to="/trips"
            onClick={() =>
              setIsOpen(false)
            }
          >

            Trips

          </Link>


          <Link
            to="/offers"
            onClick={() =>
              setIsOpen(false)
            }
          >

            Offers

          </Link>


          <Link
            to="/about"
            onClick={() =>
              setIsOpen(false)
            }
          >

            About Aswan

          </Link>


          <Link
            to="/contact"
            onClick={() =>
              setIsOpen(false)
            }
          >

            Contact

          </Link>



          {/* =====================
              MOBILE CART
          ===================== */}

          <Link
            to="/cart"
            onClick={() =>
              setIsOpen(false)
            }
            className="
              flex
              items-center
              gap-2
              font-semibold
            "
          >

            <ShoppingCart
              size={20}
            />

            Booking Cart


            {cartItems.length > 0 && (

              <span
                className="
                  bg-red-500
                  text-white
                  text-xs
                  font-bold
                  px-2
                  py-1
                  rounded-full
                "
              >

                {cartItems.length}

              </span>

            )}

          </Link>



          {/* =====================
              CURRENCY
          ===================== */}

          <select
            value={currency}
            onChange={(e) =>
              setCurrency(
                e.target.value
              )
            }
            className="
              border
              px-2
              py-1
              rounded
            "
          >

            <option value="USD">
              USD
            </option>

            <option value="EGP">
              EGP
            </option>

            <option value="EUR">
              EUR
            </option>

            <option value="SAR">
              SAR
            </option>

            <option value="AED">
              AED
            </option>

          </select>



          {/* =====================
              ADMIN MOBILE
          ===================== */}

          {isAdmin && (

            <Link
              to="/admin"
              onClick={() =>
                setIsOpen(false)
              }
            >

              <button
                className="
                  bg-indigo-600
                  text-white
                  w-full
                  py-2
                  rounded-xl
                "
              >

                Admin Dashboard

              </button>

            </Link>

          )}

        </div>

      )}

    </nav>

  );

}


export default Navbar;