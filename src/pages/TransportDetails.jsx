import { useEffect, useState, useContext } from "react";

import {
  doc,
  getDoc
} from "firebase/firestore";

import { useParams } from "react-router-dom";

import { db } from "../firebase";

import WhatsAppButton from "../components/WhatsAppButton";

import { CartContext } from "../context/CartContext";

import ImageGallery from "../components/ImageGallery";

import { usePrice } from "../utils/price";


function TransportDetails() {

  const { id } = useParams();

  const { addToCart } =
    useContext(CartContext);

  const price = usePrice();


  /* =========================
     TRANSPORT
  ========================= */

  const [transport, setTransport] =
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
     LOADING
  ========================= */

  const [loading, setLoading] =
    useState(false);


  /* =========================
     LOAD TRANSPORT
  ========================= */

  useEffect(() => {

    const fetchTransport =
      async () => {

        try {

          const docRef =
            doc(
              db,
              "transport",
              id
            );


          const docSnap =
            await getDoc(
              docRef
            );


          if (docSnap.exists()) {

            setTransport({

              id: docSnap.id,

              ...docSnap.data()

            });

          } else {

            console.log(
              "Transport not found"
            );

          }

        } catch (error) {

          console.error(
            "Error loading transport:",
            error
          );

        }

      };


    fetchTransport();

  }, [id]);



  /* =========================
     ADD TO BOOKING CART
  ========================= */

  const handleAddToCart = () => {

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
        "اكتب عدد الركاب"
      );

      return;

    }


    addToCart({

      name:
        transport.company ||
        transport.name ||
        "Transport Service",


      price:
        Number(
          transport.price || 0
        ),


      serviceType:
        "transport",


      transportId:
        id,


      transportType:
        transport.type ||
        "Transport",


      from:
        transport.from ||
        "",


      to:
        transport.to ||
        "",


      travelDate:
        date,


      guests:
        guests,


      customerName:
        name.trim(),


      customerPhone:
        phone.trim()

    });


    alert(
      "تمت إضافة وسيلة النقل إلى الحجز بنجاح"
    );

  };



  /* =========================
     WHATSAPP
  ========================= */

  const handleWhatsAppBooking = () => {

    if (!transport) return;


    const phoneNumber =
      "201034022992";


    const message = `عايز أحجز وسيلة نقل:

الشركة:
${transport.company || transport.name}

النوع:
${transport.type || "Transport"}

من:
${transport.from || "غير محدد"}

إلى:
${transport.to || "غير محدد"}

الاسم:
${name || "غير محدد"}

رقم الهاتف:
${phone || "غير محدد"}

عدد الركاب:
${guests || "غير محدد"}

التاريخ:
${date || "غير محدد"}

السعر:
${transport.price || 0}`;


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

  if (!transport) {

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
          transport.images || []
        }

        fallback={
          transport.image
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

        {transport.company ||
          transport.name}

      </h1>



      {/* =====================
          ROUTE
      ===================== */}

      {(transport.from ||
        transport.to) && (

        <p className="
          text-gray-600
          mt-2
          text-lg
        ">

          📍 {transport.from || "Unknown"}

          {" → "}

          {transport.to || "Unknown"}

        </p>

      )}



      {/* =====================
          TYPE
      ===================== */}

      {transport.type && (

        <p className="
          mt-3
          text-gray-700
        ">

          Type:
          {" "}
          {transport.type}

        </p>

      )}



      {/* =====================
          PRICE
      ===================== */}

      <p className="
        text-orange-500
        text-xl
        font-bold
        mt-4
      ">

        {price(
          Number(
            transport.price || 0
          )
        )}

        {" / seat"}

      </p>



      {/* =====================
          BOOKING
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

          Book this transport

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

          placeholder="Passengers number"

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



        {/* PAYMENT */}

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

          disabled={loading}

          className="
            bg-green-600
            hover:bg-green-700
            disabled:bg-gray-400
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
            transport.company ||
            transport.name
          }

        />

      </div>

    </div>

  );

}


export default TransportDetails;