import { useEffect, useState, useContext } from "react";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs
} from "firebase/firestore";

import { useParams } from "react-router-dom";

import { db } from "../firebase";

import WhatsAppButton from "../components/WhatsAppButton";
import ImageGallery from "../components/ImageGallery";

import { CartContext } from "../context/CartContext";

import { usePrice } from "../utils/price";


function HotelDetails() {

  const { id } = useParams();

  const { addToCart } = useContext(CartContext);

  const price = usePrice();


  /* HOTEL */

  const [hotel, setHotel] = useState(null);


  /* REVIEWS */

  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  const [reviewerName, setReviewerName] = useState("");

  const [averageRating, setAverageRating] = useState(null);


  /* BOOKING */

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [checkIn, setCheckIn] = useState("");

  const [checkOut, setCheckOut] = useState("");

  const [guests, setGuests] = useState("");


  /* PRICE */

  const [totalPrice, setTotalPrice] = useState(0);

  const [nights, setNights] = useState(0);


  /* ROOM */

  const [selectedRoom, setSelectedRoom] = useState(null);



  /* =========================
     LOAD HOTEL
  ========================= */

  useEffect(() => {

    const fetchHotel = async () => {

      try {

        const docRef = doc(
          db,
          "hotels",
          id
        );

        const docSnap = await getDoc(docRef);


        if (docSnap.exists()) {

          setHotel({
            id: docSnap.id,
            ...docSnap.data()
          });

        }

      } catch (error) {

        console.error(
          "Error loading hotel:",
          error
        );

      }

    };


    fetchHotel();

  }, [id]);



  /* =========================
     LOAD REVIEWS
  ========================= */

  useEffect(() => {

    const fetchReviews = async () => {

      try {

        const snapshot =
          await getDocs(
            collection(db, "reviews")
          );


        const filtered =
          snapshot.docs

            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))

            .filter(
              review =>
                review.hotelId === id
            );


        setReviews(filtered);


        if (filtered.length > 0) {

          const avg =
            filtered.reduce(
              (sum, review) =>
                sum +
                Number(review.rating || 0),
              0
            ) / filtered.length;


          setAverageRating(
            avg.toFixed(1)
          );

        } else {

          setAverageRating(null);

        }

      } catch (error) {

        console.error(
          "Error loading reviews:",
          error
        );

      }

    };


    fetchReviews();

  }, [id]);



  /* =========================
     CALCULATE NIGHTS
  ========================= */

  useEffect(() => {

    if (
      checkIn &&
      checkOut
    ) {

      const start =
        new Date(checkIn);

      const end =
        new Date(checkOut);


      const diff =
        (end - start) /
        (1000 * 60 * 60 * 24);


      if (diff > 0) {

        setNights(diff);


        /*
          If a room is selected,
          calculate using room price.
        */

        if (selectedRoom) {

          setTotalPrice(
            Number(selectedRoom.price) *
            diff
          );

        } else if (hotel?.price) {

          setTotalPrice(
            Number(hotel.price) *
            diff
          );

        }

      } else {

        setNights(0);

        setTotalPrice(0);

      }

    }

  }, [
    checkIn,
    checkOut,
    hotel,
    selectedRoom
  ]);



  /* =========================
     SELECT ROOM
  ========================= */

  const handleSelectRoom = (room) => {

    setSelectedRoom(room);


    if (checkIn && checkOut) {

      const start =
        new Date(checkIn);

      const end =
        new Date(checkOut);


      const diff =
        (end - start) /
        (1000 * 60 * 60 * 24);


      if (diff > 0) {

        setNights(diff);

        setTotalPrice(
          Number(room.price) *
          diff
        );

      }

    } else {

      setTotalPrice(
        Number(room.price)
      );

    }

  };



  /* =========================
     ADD REVIEW
  ========================= */

  const handleAddReview = async () => {

    if (!reviewerName.trim()) {

      alert("اكتب اسمك أولاً");

      return;

    }


    if (!comment.trim()) {

      alert("اكتب تعليقك أولاً");

      return;

    }


    try {

      await addDoc(
        collection(db, "reviews"),
        {

          hotelId: id,

          name: reviewerName.trim(),

          rating: Number(rating),

          comment: comment.trim(),

          date: new Date()

        }
      );


      alert(
        "تم إضافة تقييمك بنجاح"
      );


      setReviewerName("");

      setComment("");

      setRating(5);


      /*
        Reload reviews
      */

      const snapshot =
        await getDocs(
          collection(db, "reviews")
        );


      const filtered =
        snapshot.docs

          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))

          .filter(
            review =>
              review.hotelId === id
          );


      setReviews(filtered);


      if (filtered.length > 0) {

        const avg =
          filtered.reduce(
            (sum, review) =>
              sum +
              Number(review.rating || 0),
            0
          ) / filtered.length;


        setAverageRating(
          avg.toFixed(1)
        );

      }

    } catch (error) {

      console.error(error);

      alert(
        "حدث خطأ أثناء إضافة التقييم"
      );

    }

  };



  /* =========================
     ADD TO CART
  ========================= */

  const handleAddToCart = () => {

    if (!name.trim()) {

      alert("اكتب الاسم");

      return;

    }


    if (!phone.trim()) {

      alert("اكتب رقم الهاتف");

      return;

    }


    if (!checkIn) {

      alert("اختار تاريخ الدخول");

      return;

    }


    if (!checkOut) {

      alert("اختار تاريخ الخروج");

      return;

    }


    if (nights <= 0) {

      alert(
        "تاريخ الخروج يجب أن يكون بعد تاريخ الدخول"
      );

      return;

    }


    if (!guests) {

      alert("اكتب عدد الأشخاص");

      return;

    }


    /*
      Add complete hotel
      booking information
      to cart.
    */

    addToCart({

      name: hotel.name,

      price:
        Number(
          totalPrice ||
          hotel.price ||
          0
        ),

      serviceType: "hotel",

      hotelId: id,

      hotelLocation:
        hotel.location || "",

      roomName:
        selectedRoom?.name || "",

      roomGuests:
        selectedRoom?.guests || "",

      checkIn,

      checkOut,

      nights,

      guests,

      customerName:
        name.trim(),

      customerPhone:
        phone.trim()

    });


    alert(
      "تمت إضافة الفندق إلى الحجز بنجاح"
    );

  };



  /* =========================
     WHATSAPP
  ========================= */

  const handleWhatsAppBooking = () => {

    if (!hotel) return;


    const message = `عايز أحجز الفندق:

الفندق: ${hotel.name}

الاسم: ${name || "غير محدد"}

الهاتف: ${phone || "غير محدد"}

تاريخ الدخول: ${checkIn || "غير محدد"}

تاريخ الخروج: ${checkOut || "غير محدد"}

عدد الأشخاص: ${guests || "غير محدد"}

عدد الليالي: ${nights || 1}

الغرفة: ${selectedRoom?.name || "لم يتم الاختيار"}

السعر: ${
      totalPrice ||
      hotel.price ||
      0
    }`;


    window.open(

      `https://wa.me/201034022992?text=${encodeURIComponent(
        message
      )}`,

      "_blank"

    );

  };



  /* =========================
     LOADING
  ========================= */

  if (!hotel) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <p className="text-xl">
          Loading...
        </p>

      </div>

    );

  }


  const rooms =
    hotel.rooms || [];


  /* =========================
     PAGE
  ========================= */

  return (

    <div className="max-w-7xl mx-auto px-6 py-32">


      {/* HEADER */}

      <h1 className="text-4xl font-bold">

        {hotel.name}


        {averageRating && (

          <span className="ml-3 text-yellow-500">

            ⭐ {averageRating}

          </span>

        )}

      </h1>


      <p className="text-gray-500 mb-6">

        {hotel.location}

      </p>



      {/* MAIN GRID */}

      <div className="grid lg:grid-cols-3 gap-8">


        {/* LEFT */}

        <div className="lg:col-span-2">


          {/* GALLERY */}

          <ImageGallery
            images={hotel.images}
            fallback={hotel.image}
          />


          {/* DESCRIPTION */}

          <p className="mt-6 text-gray-700 leading-7">

            {hotel.description}

          </p>



          {/* LOCATION MAP */}

          {hotel.locationMap && (

            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-4">

                Location on map

              </h2>


              <iframe
                src={hotel.locationMap}
                width="100%"
                height="400"
                loading="lazy"
                className="rounded-xl border"
                title="Hotel Location"
              />

            </div>

          )}



          {/* ROOMS */}

          {rooms.length > 0 && (

            <div className="mt-10 border rounded-xl overflow-hidden">

              <div className="grid grid-cols-5 bg-blue-600 text-white p-3 gap-2">

                <span>
                  نوع الغرفة
                </span>

                <span>
                  الضيوف
                </span>

                <span>
                  السعر
                </span>

                <span>
                  المميزات
                </span>

                <span>
                  اختيار
                </span>

              </div>


              {rooms.map(
                (room, index) => (

                  <div
                    key={index}
                    className={`
                      grid
                      grid-cols-5
                      p-3
                      border-t
                      gap-2
                      items-center
                      ${
                        selectedRoom?.name ===
                        room.name
                          ? "bg-blue-50"
                          : ""
                      }
                    `}
                  >

                    <span>
                      {room.name}
                    </span>


                    <span>
                      {room.guests}
                    </span>


                    <span>
                      {price(room.price)}
                    </span>


                    <span>

                      {room.features?.join(
                        " + "
                      )}

                    </span>


                    <button

                      onClick={() =>
                        handleSelectRoom(
                          room
                        )
                      }

                      className={`
                        text-white
                        rounded
                        px-3
                        py-2
                        ${
                          selectedRoom?.name ===
                          room.name
                            ? "bg-green-600"
                            : "bg-blue-600"
                        }
                      `}
                    >

                      {selectedRoom?.name ===
                      room.name
                        ? "تم الاختيار"
                        : "اختيار"}

                    </button>

                  </div>

                )
              )}

            </div>

          )}



          {/* REVIEWS */}

          <div className="mt-12">


            <h2 className="text-2xl font-bold mb-4">

              تقييمات الضيوف

            </h2>


            {reviews.length === 0 && (

              <p className="text-gray-500 mb-4">

                لا توجد تقييمات حتى الآن.

              </p>

            )}


            {reviews.map(
              (review, index) => (

                <div
                  key={
                    review.id ||
                    index
                  }
                  className="bg-gray-100 p-4 rounded mb-3"
                >

                  <div className="flex justify-between">

                    <strong>
                      {review.name ||
                        "زائر"}
                    </strong>


                    <span>
                      ⭐{" "}
                      {review.rating}
                    </span>

                  </div>


                  <p className="mt-2">

                    {review.comment}

                  </p>

                </div>

              )
            )}



            {/* REVIEW FORM */}

            <div className="mt-6">

              <input
                type="text"
                placeholder="اسمك"
                value={reviewerName}
                onChange={(e) =>
                  setReviewerName(
                    e.target.value
                  )
                }
                className="border p-2 w-full mb-2 rounded"
              />


              <select
                value={rating}
                onChange={(e) =>
                  setRating(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="border p-2 w-full mb-2 rounded"
              >

                <option value={5}>
                  ⭐ 5
                </option>

                <option value={4}>
                  ⭐ 4
                </option>

                <option value={3}>
                  ⭐ 3
                </option>

                <option value={2}>
                  ⭐ 2
                </option>

                <option value={1}>
                  ⭐ 1
                </option>

              </select>


              <textarea
                placeholder="اكتب رأيك"
                value={comment}
                onChange={(e) =>
                  setComment(
                    e.target.value
                  )
                }
                className="border p-2 w-full mb-2 rounded"
                rows={4}
              />


              <button
                onClick={
                  handleAddReview
                }
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >

                إضافة تقييم

              </button>

            </div>

          </div>

        </div>



        {/* SIDEBAR */}

        <div className="bg-yellow-400 p-6 rounded-xl sticky top-20 h-fit">


          <h2 className="text-2xl font-bold mb-4">

            احجز إقامتك

          </h2>


          {/* NAME */}

          <input
            placeholder="الاسم"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="border p-2 w-full mb-2 rounded bg-white"
          />


          {/* PHONE */}

          <input
            type="tel"
            placeholder="رقم الهاتف"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            className="border p-2 w-full mb-2 rounded bg-white"
          />


          {/* CHECK IN */}

          <label className="block text-sm font-semibold mb-1">

            Check-in

          </label>


          <input
            type="date"
            value={checkIn}
            onChange={(e) =>
              setCheckIn(
                e.target.value
              )
            }
            className="border p-2 w-full mb-2 rounded bg-white"
          />


          {/* CHECK OUT */}

          <label className="block text-sm font-semibold mb-1">

            Check-out

          </label>


          <input
            type="date"
            value={checkOut}
            onChange={(e) =>
              setCheckOut(
                e.target.value
              )
            }
            className="border p-2 w-full mb-2 rounded bg-white"
          />


          {/* GUESTS */}

          <input
            type="number"
            min="1"
            placeholder="عدد الأشخاص"
            value={guests}
            onChange={(e) =>
              setGuests(
                e.target.value
              )
            }
            className="border p-2 w-full mb-4 rounded bg-white"
          />



          {/* SELECTED ROOM */}

          {selectedRoom && (

            <div className="bg-white rounded p-3 mb-3">

              <p className="font-semibold">

                الغرفة المختارة:

              </p>

              <p>

                {selectedRoom.name}

              </p>

            </div>

          )}



          {/* NIGHTS */}

          {nights > 0 && (

            <div className="bg-white rounded p-3 mb-3">

              <p>

                عدد الليالي:{" "}
                <strong>
                  {nights}
                </strong>

              </p>

              <p>

                الإجمالي:{" "}

                <strong>
                  {price(
                    totalPrice ||
                    hotel.price ||
                    0
                  )}
                </strong>

              </p>

            </div>

          )}



          {/* ADD TO CART */}

          <button
            onClick={
              handleAddToCart
            }
            className="
              bg-green-600
              hover:bg-green-700
              text-white
              w-full
              p-3
              mb-2
              rounded
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
              bg-green-500
              hover:bg-green-600
              text-white
              w-full
              p-3
              mb-3
              rounded
              font-semibold
            "
          >

            WhatsApp Booking

          </button>


          <WhatsAppButton
            serviceName={
              hotel.name
            }
          />

        </div>

      </div>

    </div>

  );

}


export default HotelDetails;