import { useEffect, useState, useContext } from "react";

import {
  doc,
  getDoc
} from "firebase/firestore";

import { useParams } from "react-router-dom";

import { db } from "../firebase";

import WhatsAppButton from "../components/WhatsAppButton";

import { CartContext } from "../context/CartContext";

import { convertUSDToEGP } from "../utils/currencyConverter";

import ImageGallery from "../components/ImageGallery";

import { usePrice } from "../utils/price";


function PackageDetails() {

  const { id } = useParams();

  const { addToCart } =
    useContext(CartContext);

  const price = usePrice();


  /* =========================
     OFFER
  ========================= */

  const [offer, setOffer] =
    useState(null);


  /* =========================
     BOOKING DATA
  ========================= */

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [date, setDate] =
    useState("");

  const [guests, setGuests] =
    useState("");


  /* =========================
     PRICE
  ========================= */

  const [priceEGP, setPriceEGP] =
    useState(null);



  /* =========================
     LOAD OFFER
  ========================= */

  useEffect(() => {

    const fetchOffer =
      async () => {

        try {

          const docRef =
            doc(
              db,
              "offers",
              id
            );


          const docSnap =
            await getDoc(
              docRef
            );


          if (docSnap.exists()) {

            setOffer({

              id: docSnap.id,

              ...docSnap.data()

            });

          } else {

            console.log(
              "Offer not found"
            );

          }

        } catch (error) {

          console.error(
            "Error loading offer:",
            error
          );

        }

      };


    fetchOffer();

  }, [id]);



  /* =========================
     CONVERT PRICE
  ========================= */

  useEffect(() => {

    const convertPrice =
      async () => {

        if (
          offer?.price
        ) {

          try {

            const egp =
              await convertUSDToEGP(
                Number(
                  offer.price
                )
              );


            setPriceEGP(
              egp
            );

          } catch (error) {

            console.error(
              "Currency conversion error:",
              error
            );

          }

        }

      };


    convertPrice();

  }, [offer]);



  /* =========================
     ADD TO BOOKING CART
  ========================= */

  const handleAddToCart =
    () => {

      if (!offer) {

        alert(
          "Package data is not loaded yet."
        );

        return;

      }


      if (!name.trim()) {

        alert(
          "اكتب اسمك أولاً"
        );

        return;

      }


      if (!phone.trim()) {

        alert(
          "اكتب رقم الهاتف"
        );

        return;

      }


      if (!date) {

        alert(
          "اختار تاريخ الرحلة"
        );

        return;

      }


      if (!guests) {

        alert(
          "اكتب عدد الأشخاص"
        );

        return;

      }


      /*
        السعر الأساسي في Firestore
        + السعر بالمصري للعرض.
      */

      addToCart({

        name:
          offer.title ||
          "Tour Package",


        price:
          Number(
            offer.price || 0
          ),


        priceEGP:
          Number(
            priceEGP || 0
          ),


        serviceType:
          "package",


        packageId:
          id,


        duration:
          offer.duration || "",


        hotel:
          offer.hotel || "",


        transport:
          offer.transport || "",


        trips:
          offer.trips || "",


        food:
          offer.food || "",


        date:
          date,


        guests:
          guests,


        customerName:
          name.trim(),


        customerPhone:
          phone.trim()

      });


      alert(
        "تمت إضافة الباقة إلى الحجز بنجاح"
      );

    };



  /* =========================
     WHATSAPP
  ========================= */

  const handleWhatsAppBooking =
    () => {

      if (!offer) return;


      const phoneNumber =
        "201034022992";


      const message = `عايز أحجز العرض السياحي:

اسم العرض:
${offer.title}

الاسم:
${name || "غير محدد"}

رقم الهاتف:
${phone || "غير محدد"}

عدد الأفراد:
${guests || "غير محدد"}

التاريخ:
${date || "غير محدد"}

السعر:
${priceEGP || offer.price || 0} جنيه مصري`;


      window.open(

        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          message
        )}`,

        "_blank"

      );

    };



  /* =========================
     LOADING
  ========================= */

  if (!offer) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        <p className="text-xl">
          Loading...
        </p>

      </div>

    );

  }



  /* =========================
     PAGE
  ========================= */

  return (

    <div className="
      p-6
      md:p-10
      max-w-5xl
      mx-auto
      pt-32
    ">


      {/* =====================
          IMAGE
      ===================== */}

      <ImageGallery

        images={
          offer.images || []
        }

        fallback={
          offer.image
        }

      />



      {/* =====================
          TITLE
      ===================== */}

      <h1 className="
        text-3xl
        md:text-4xl
        font-bold
        mt-6
      ">

        {offer.title}

      </h1>



      {/* =====================
          DURATION
      ===================== */}

      {offer.duration && (

        <p className="
          text-gray-500
          mt-2
        ">

          Duration:
          {" "}
          {offer.duration}

        </p>

      )}



      {/* =====================
          PACKAGE DETAILS
      ===================== */}

      <div className="
        mt-5
        space-y-3
        text-gray-700
      ">


        {offer.hotel && (

          <p>

            <strong>
              Hotel:
            </strong>

            {" "}

            {offer.hotel}

          </p>

        )}



        {offer.transport && (

          <p>

            <strong>
              Transport:
            </strong>

            {" "}

            {offer.transport}

          </p>

        )}



        {offer.trips && (

          <p>

            <strong>
              Trips Included:
            </strong>

            {" "}

            {offer.trips}

          </p>

        )}



        {offer.food && (

          <p>

            <strong>
              Food:
            </strong>

            {" "}

            {offer.food}

          </p>

        )}

      </div>



      {/* =====================
          PRICE
      ===================== */}

      <div className="mt-6">

        <p className="
          text-orange-500
          text-2xl
          font-bold
        ">

          {priceEGP
            ? `${priceEGP} EGP`
            : price(
                Number(
                  offer.price || 0
                )
              )}

        </p>


        {offer.price && (

          <p className="
            text-gray-500
            text-sm
            mt-1
          ">

            Original price:
            {" "}
            {price(
              Number(
                offer.price
              )
            )}

          </p>

        )}

      </div>



      {/* =====================
          ADD TO BOOKING
      ===================== */}

      <button

        onClick={
          handleAddToCart
        }

        className="
          mt-6
          bg-green-600
          hover:bg-green-700
          text-white
          px-6
          py-3
          rounded-xl
          w-full
          font-semibold
        "

      >

        Add to Booking

      </button>



      {/* =====================
          BOOKING FORM
      ===================== */}

      <div className="
        mt-10
        bg-gray-100
        p-6
        rounded-2xl
        shadow
      ">


        <h2 className="
          text-2xl
          font-bold
          mb-5
        ">

          Book this package

        </h2>



        {/* NAME */}

        <input

          placeholder="Your name"

          value={name}

          onChange={(e) =>
            setName(
              e.target.value
            )
          }

          className="
            border
            p-3
            rounded-xl
            w-full
            mb-3
            bg-white
          "

        />



        {/* PHONE */}

        <input

          type="tel"

          placeholder="Phone number"

          value={phone}

          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }

          className="
            border
            p-3
            rounded-xl
            w-full
            mb-3
            bg-white
          "

        />



        {/* DATE */}

        <label className="
          block
          text-sm
          font-semibold
          mb-1
        ">

          Travel Date

        </label>


        <input

          type="date"

          value={date}

          onChange={(e) =>
            setDate(
              e.target.value
            )
          }

          className="
            border
            p-3
            rounded-xl
            w-full
            mb-3
            bg-white
          "

        />



        {/* GUESTS */}

        <input

          type="number"

          min="1"

          placeholder="Guests number"

          value={guests}

          onChange={(e) =>
            setGuests(
              e.target.value
            )
          }

          className="
            border
            p-3
            rounded-xl
            w-full
            mb-5
            bg-white
          "

        />



        {/* PAYMENT INFO */}

        <div className="
          bg-green-50
          border
          border-green-200
          rounded-xl
          p-4
          mb-4
        ">

          <p className="
            font-bold
            text-green-700
          ">

            Payment Method

          </p>


          <p className="
            text-green-700
            mt-1
          ">

            💵 Cash on Arrival

          </p>


          <p className="
            text-gray-600
            text-sm
            mt-1
          ">

            No online payment is required.

          </p>

        </div>



        {/* ADD TO BOOKING */}

        <button

          onClick={
            handleAddToCart
          }

          className="
            bg-green-600
            hover:bg-green-700
            text-white
            px-6
            py-3
            rounded-xl
            w-full
            font-semibold
          "

        >

          Add to Booking

        </button>



        {/* WHATSAPP */}

        <button

          onClick={
            handleWhatsAppBooking
          }

          className="
            mt-3
            bg-green-500
            hover:bg-green-600
            text-white
            px-6
            py-3
            rounded-xl
            w-full
            font-semibold
          "

        >

          Book via WhatsApp

        </button>



        <WhatsAppButton

          serviceName={
            offer.title
          }

        />

      </div>

    </div>

  );

}


export default PackageDetails;