import { useEffect, useState } from "react";

import { doc, getDoc, collection, addDoc } from "firebase/firestore";

import { useParams } from "react-router-dom";

import { db } from "../firebase";
import WhatsAppButton from "../components/WhatsAppButton";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";


function TripDetails() {

  const { id } = useParams();

  const [trip, setTrip] = useState(null);

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [date, setDate] = useState("");

  const [guests, setGuests] = useState("");
  const { addToCart } = useContext(CartContext);


  useEffect(() => {

    const fetchTrip = async () => {

      const docRef = doc(db, "trips", id);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        setTrip(docSnap.data());

      }

    };

    fetchTrip();

  }, [id]);


  const handleBooking = async () => {

    if (!name || !phone) {

      alert("Please fill required fields");

      return;

    }


    await addDoc(collection(db, "bookings"), {

      serviceName: trip.name,

      name,

      phone,

      date,

      guests,

      createdAt: new Date()

    });


    alert("Trip booked successfully");

  };


  if (!trip) return <p>Loading...</p>;


  return (

    <div className="p-10 max-w-5xl mx-auto">

      <img
        src={trip.image}
        className="w-full h-[400px] object-cover rounded-xl"
      />


      <h1 className="text-3xl font-bold mt-6">

        {trip.name}

      </h1>


      <p className="text-gray-500 mt-2">

        Duration: {trip.duration}

      </p>


      <p className="mt-4">

        {trip.description}

      </p>


      <p className="text-orange-500 text-xl mt-4">

        ${trip.price}

      </p>
      <button
  onClick={() =>
    addToCart({
      name: trip.name,
      price: trip.price
    })
  }
  className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl w-full"
>
  Add to Cart
</button>


      {/* Booking Form */}

      <div className="mt-10 bg-gray-100 p-6 rounded-xl">

        <h2 className="text-2xl font-bold mb-4">

          Book this trip

        </h2>
<WhatsAppButton serviceName={trip.name} />

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
          onChange={(e) => setDate(e.target.value)}
        />


        <input
          placeholder="Guests number"
          className="border p-2 rounded w-full mb-3"
          onChange={(e) => setGuests(e.target.value)}
        />


        <button
          onClick={handleBooking}
          className="bg-blue-900 text-white px-6 py-3 rounded-xl w-full"
        >

          Send booking request

        </button>

      </div>

    </div>

  );

}

export default TripDetails;