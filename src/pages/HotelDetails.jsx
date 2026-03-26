import { useEffect, useState } from "react";

import { doc, getDoc, collection, addDoc } from "firebase/firestore";

import { useParams } from "react-router-dom";

import { db } from "../firebase";

import WhatsAppButton from "../components/WhatsAppButton";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";


function HotelDetails() {

  const { id } = useParams();

  const [hotel, setHotel] = useState(null);

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [checkIn, setCheckIn] = useState("");

  const [checkOut, setCheckOut] = useState("");

  const [guests, setGuests] = useState("");

  const [totalPrice, setTotalPrice] = useState(0);

  const [nights, setNights] = useState(0);
  const { addToCart } = useContext(CartContext);


  useEffect(() => {

    const fetchHotel = async () => {

      const docRef = doc(db, "hotels", id);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        setHotel(docSnap.data());

      }

    };

    fetchHotel();

  }, [id]);


  useEffect(() => {

    if (checkIn && checkOut && hotel) {

      const start = new Date(checkIn);

      const end = new Date(checkOut);

      const diffTime = end - start;

      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays > 0) {

        setNights(diffDays);

        setTotalPrice(diffDays * hotel.price);

      }

    }

  }, [checkIn, checkOut, hotel]);


  const handleBooking = async () => {

    await addDoc(collection(db, "bookings"), {

      hotelName: hotel.name,

      name,

      phone,

      checkIn,

      checkOut,

      guests,

      nights,

      totalPrice,

      createdAt: new Date()

    });

    alert("Booking request sent successfully");

  };


  if (!hotel) return <p>Loading...</p>;


  return (

    <div className="p-10 max-w-5xl mx-auto">

      <img
        src={hotel.image}
        className="w-full h-[400px] object-cover rounded-xl"
      />


      <h1 className="text-3xl font-bold mt-6">

        {hotel.name}

      </h1>


      <p className="mt-2 text-gray-600">

        {hotel.location}

      </p>


      <p className="mt-4">

        {hotel.description}

      </p>


      <p className="text-orange-500 text-xl mt-4">

        ${hotel.price} / night

      </p>


      <div className="mt-10 bg-gray-100 p-6 rounded-xl">

        <h2 className="text-2xl font-bold mb-4">

          Book this hotel

        </h2>


        <input
          placeholder="Your name"
          className="border p-2 rounded w-full mb-3"
          onChange={(e) => setName(e.target.value)}
        />


        <input
          placeholder="Phone number"
          className="border p-2 rounded w-full mb-3"
          onChange={(e) => setPhone(e.target.value)}
        />


        <input
          type="date"
          lang="en"
          className="border p-2 rounded w-full mb-3"
          onChange={(e) => setCheckIn(e.target.value)}
        />


        <input
          type="date"
          lang="en"
          className="border p-2 rounded w-full mb-3"
          onChange={(e) => setCheckOut(e.target.value)}
        />


        <input
          placeholder="Guests number"
          className="border p-2 rounded w-full mb-3"
          onChange={(e) => setGuests(e.target.value)}
        />


        {nights > 0 && (

          <div className="bg-white p-4 rounded-lg mb-3">

            <p className="text-gray-600">

              Nights: {nights}

            </p>
            <button
  onClick={() =>
    addToCart({
      name: hotel.name,
      price: totalPrice || hotel.price
    })
  }
  className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl w-full"
>
  Add to Cart
</button>

            <p className="text-green-600 font-bold text-xl">

              Total Price: ${totalPrice}

            </p>

          </div>

        )}


        <button
          onClick={handleBooking}
          className="bg-blue-900 text-white px-6 py-3 rounded-xl w-full"
        >

          Send booking request

        </button>


        <WhatsAppButton serviceName={hotel.name} />

      </div>

    </div>

  );

}

export default HotelDetails;