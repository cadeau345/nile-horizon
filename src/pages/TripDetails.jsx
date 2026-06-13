import { useEffect, useState, useContext } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc
} from "firebase/firestore";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import { db } from "../firebase";

import WhatsAppButton from "../components/WhatsAppButton";

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

import ImageGallery from "../components/ImageGallery";

import { usePrice } from "../utils/price";
import { convertUSDToEGP } from "../utils/currencyConverter";

function TripDetails() {
  const price = usePrice();

  const { id } = useParams();
  const navigate = useNavigate();

  const { user } =
    useContext(AuthContext);

  const { addToCart } =
    useContext(CartContext);

  const [trip, setTrip] =
    useState(null);

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [date, setDate] =
    useState("");

  const [guests, setGuests] =
    useState("");

  const [priceEGP, setPriceEGP] =
    useState(null);

  /*
  ============================
  تحميل الرحلة
  ============================
  */

  useEffect(() => {
    const fetchTrip =
      async () => {
        try {
          // ✅ tours بدل trips
          const docRef = doc(
            db,
            "tours",
            id
          );

          const docSnap =
            await getDoc(
              docRef
            );

          if (
            docSnap.exists()
          ) {
            setTrip({
              id:
                docSnap.id,
              ...docSnap.data(),
            });
          } else {
            console.log(
              "Trip not found"
            );
          }
        } catch (err) {
          console.error(
            err
          );
        }
      };

    fetchTrip();
  }, [id]);

  /*
  ============================
  تحويل السعر للمصري
  ============================
  */

  useEffect(() => {
    const convertPrice =
      async () => {
        if (
          trip?.price
        ) {
          try {
            const egp =
              await convertUSDToEGP(
                trip.price
              );

            setPriceEGP(
              egp
            );
          } catch (
            error
          ) {
            console.log(
              error
            );
          }
        }
      };

    convertPrice();
  }, [trip]);

  /*
  ============================
  حماية العمليات
  ============================
  */

  const checkAuthBeforeBooking =
    () => {
      if (!user) {
        alert(
          "يجب تسجيل الدخول أولاً"
        );

        navigate(
          "/customer-login"
        );

        return false;
      }

      if (
        !user.emailVerified
      ) {
        alert(
          "يجب تأكيد البريد الإلكتروني أولاً"
        );

        return false;
      }

      return true;
    };

  /*
  ============================
  الحجز العادي
  ============================
  */

  const handleBooking =
    async () => {
      if (
        !checkAuthBeforeBooking()
      )
        return;

      if (
        !name ||
        !phone
      ) {
        alert(
          "Please fill required fields"
        );

        return;
      }

      await addDoc(
        collection(
          db,
          "bookings"
        ),
        {
          userId:
            user.uid,

          userEmail:
            user.email,

          serviceType:
            "trip",

          serviceName:
            trip.title ||
            trip.name,

          name,
          phone,

          date,
          guests,

          price:
            trip.price,

          status:
            "pending",

          createdAt:
            new Date(),
        }
      );

      alert(
        "Trip booked successfully"
      );

      setName("");
      setPhone("");
      setDate("");
      setGuests("");
    };

  /*
  ============================
  إضافة للكارت
  ============================
  */

  const handleAddToCart =
    () => {
      if (
        !checkAuthBeforeBooking()
      )
        return;

      addToCart({
        name:
          trip.title ||
          trip.name,

        price:
          trip.price,

        type:
          "trip",
      });

      alert(
        "Added to cart"
      );
    };

  /*
  ============================
  واتساب
  ============================
  */

  const handleWhatsAppBooking =
    () => {
      const phoneNumber =
        "201034022992";

      const message = `
عايز احجز رحلة:

اسم الرحلة:
${trip.title || trip.name}

عدد الأشخاص:
${guests || 1}

التاريخ:
${date || "غير محدد"}

السعر:
${trip.price}
`;

      window.open(
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          message
        )}`,
        "_blank"
      );
    };

  /*
  ============================
  الدفع
  ============================
  */

  const handlePayment =
    async () => {
      if (
        !checkAuthBeforeBooking()
      )
        return;

      // ✅ fix bug
      if (
        !name ||
        !phone ||
        !date ||
        !guests
      ) {
        alert(
          "Please fill booking details first"
        );

        return;
      }

      const convertedPrice =
        await convertUSDToEGP(
          trip.price
        );

      localStorage.setItem(
        "pendingBooking",
        JSON.stringify(
          {
            userId:
              user.uid,

            userEmail:
              user.email,

            serviceType:
              "trip",

            serviceName:
              trip.title ||
              trip.name,

            name,
            phone,
            date,
            guests,

            price:
              convertedPrice,
          }
        )
      );

      const response =
        await fetch(
          "http://localhost:5000/pay",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  price:
                    convertedPrice,
                }
              ),
          }
        );

      const data =
        await response.json();

      window.location.href =
        `https://accept.paymob.com/api/acceptance/iframes/1029284?payment_token=${data.payment_token}`;
    };

  if (!trip)
    return (
      <p>
        Loading...
      </p>
    );

  return (
    <div className="p-10 max-w-5xl mx-auto">

      {/* صور الرحلة */}
      <ImageGallery
        images={
          trip.images ||
          []
        }
        fallback={
          trip.image
        }
      />

      {/* عنوان الرحلة */}
      <h1 className="text-3xl font-bold mt-6">
        {trip.title ||
          trip.name}
      </h1>

      {/* المدينة */}
      {trip.city && (
        <p className="text-sm text-blue-700 mt-2">
          {trip.city}
        </p>
      )}

      {/* المدة */}
      <p className="text-gray-500 mt-2">
        Duration:
        {" "}
        {trip.duration}
      </p>

      {/* الوصف */}
      <p className="mt-4">
        {
          trip.description
        }
      </p>

      {/* التقييم */}
      {trip.rating && (
        <p className="mt-2 text-yellow-600">
          ⭐
          {" "}
          {trip.rating}
          {" "}
          (
          {
            trip.reviews
          }
          {" "}
          reviews)
        </p>
      )}

      {/* السعر */}
      <p className="text-orange-500 text-xl mt-4">
        {price(
          trip.price
        )}
      </p>

      {/* سعر بالمصري */}
      {priceEGP && (
        <p className="text-green-600 text-sm">
          ≈
          {" "}
          {priceEGP}
          {" "}
          جنيه مصري
        </p>
      )}

      {/* كارت */}
      <button
        onClick={
          handleAddToCart
        }
        className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl w-full"
      >
        Add to Cart
      </button>

      {/* الحجز */}
      <div className="mt-10 bg-gray-100 p-6 rounded-xl">

        <h2 className="text-2xl font-bold mb-4">
          Book this trip
        </h2>

        <input
          placeholder="Your name"
          value={name}
          className="border p-2 rounded w-full mb-3"
          onChange={(
            e
          ) =>
            setName(
              e.target
                .value
            )
          }
        />

        <input
          placeholder="Phone number"
          value={phone}
          className="border p-2 rounded w-full mb-3"
          onChange={(
            e
          ) =>
            setPhone(
              e.target
                .value
            )
          }
        />

        <input
          type="date"
          value={date}
          className="border p-2 rounded w-full mb-3"
          onChange={(
            e
          ) =>
            setDate(
              e.target
                .value
            )
          }
        />

        <input
          placeholder="Guests number"
          value={guests}
          className="border p-2 rounded w-full mb-3"
          onChange={(
            e
          ) =>
            setGuests(
              e.target
                .value
            )
          }
        />

        <button
          onClick={
            handleBooking
          }
          className="bg-blue-900 text-white px-6 py-3 rounded-xl w-full"
        >
          Send booking request
        </button>

        <button
          onClick={
            handleWhatsAppBooking
          }
          className="mt-3 bg-green-500 text-white px-6 py-3 rounded-xl w-full"
        >
          Book via WhatsApp
        </button>

        <button
          onClick={
            handlePayment
          }
          className="mt-3 bg-orange-600 text-white px-6 py-3 rounded-xl w-full"
        >
          Pay Online Now
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