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


function TripDetails() {

  const { id } = useParams();

  const { addToCart } =
    useContext(CartContext);

  const price = usePrice();


  /* =========================
     TRIP
  ========================= */

  const [trip, setTrip] = useState(null);


  /* =========================
     BOOKING DATA
  ========================= */

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [date, setDate] = useState("");

  const [guests, setGuests] = useState("");


  /* =========================
     LOAD TRIP
  ========================= */

  useEffect(() => {

    const fetchTrip = async () => {

      try {

        /*
          Your current project stores
          trips inside "tours".
        */

        const docRef = doc(
          db,
          "tours",
          id
        );


        const docSnap =
          await getDoc(docRef);


        if (docSnap.exists()) {

          setTrip({

            id: docSnap.id,

            ...docSnap.data()

          });

        } else {

          console.log(
            "Trip not found"
          );

        }

      } catch (error) {

        console.error(
          "Error loading trip:",
          error
        );

      }

    };


    fetchTrip();

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
        "اكتب عدد الأشخاص"
      );

      return;

    }


    addToCart({

      name:
        trip.title ||
        trip.name ||
        "Trip",


      price:
        Number(
          trip.price || 0
        ),


      serviceType:
        "trip",


      tripId:
        id,


      city:
        trip.city || "",


      duration:
        trip.duration || "",


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
      "تمت إضافة الرحلة إلى الحجز بنجاح"
    );

  };



  /* =========================
     WHATSAPP
  ========================= */

  const handleWhatsAppBooking = () => {

    if (!trip) return;


    const phoneNumber =
      "201034022992";


    const message = `عايز أحجز رحلة:

اسم الرحلة:
${trip.title || trip.name}

الاسم:
${name || "غير محدد"}

رقم الهاتف:
${phone || "غير محدد"}

عدد الأشخاص:
${guests || "غير محدد"}

التاريخ:
${date || "غير محدد"}

السعر:
${trip.price || 0}`;


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

  if (!trip) {

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
      max-w-6xl
      mx-auto
      pt-32
    ">


      {/* =====================
          IMAGE
      ===================== */}

      <ImageGallery

        images={
          trip.images || []
        }

        fallback={
          trip.image
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

        {trip.title ||
          trip.name}

      </h1>



      {/* =====================
          CITY
      ===================== */}

      {trip.city && (

        <p className="
          text-sm
          text-blue-700
          mt-2
        ">

          📍 {trip.city}

        </p>

      )}



      {/* =====================
          DURATION
      ===================== */}

      {trip.duration && (

        <p className="
          text-gray-500
          mt-2
        ">

          Duration:
          {" "}
          {trip.duration}

        </p>

      )}



      {/* =====================
          DESCRIPTION
      ===================== */}

      {trip.description && (

        <p className="
          mt-4
          text-gray-700
          leading-7
        ">

          {trip.description}

        </p>

      )}



      {/* =====================
          RATING
      ===================== */}

      {trip.rating && (

        <p className="
          mt-3
          text-yellow-600
        ">

          ⭐ {trip.rating}

          {trip.reviews && (

            <>
              {" "}
              ({trip.reviews} reviews)
            </>

          )}

        </p>

      )}



      {/* =====================
          PRICE
      ===================== */}

      <div className="mt-5">

        <p className="
          text-orange-500
          text-2xl
          font-bold
        ">

          {price(
            Number(
              trip.price || 0
            )
          )}

        </p>

      </div>



      {/* =====================
          BOOKING SECTION
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

          Book this trip

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

          Trip Date

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
            trip.title ||
            trip.name
          }

        />

      </div>

    </div>

  );

}


export default TripDetails;