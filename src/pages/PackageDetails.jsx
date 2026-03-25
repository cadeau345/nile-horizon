import { useEffect, useState } from "react";

import { doc, getDoc, collection, addDoc } from "firebase/firestore";

import { useParams } from "react-router-dom";

import { db } from "../firebase";
import WhatsAppButton from "../components/WhatsAppButton";


function PackageDetails() {

  const { id } = useParams();

  const [offer, setOffer] = useState(null);

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [date, setDate] = useState("");

  const [guests, setGuests] = useState("");


  useEffect(() => {

    const fetchOffer = async () => {

      const docRef = doc(db, "offers", id);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        setOffer(docSnap.data());

      }

    };

    fetchOffer();

  }, [id]);


  const handleBooking = async () => {

    if (!name || !phone) {

      alert("Please fill required fields");

      return;

    }


    await addDoc(collection(db, "bookings"), {

      serviceName: offer.title,

      name,

      phone,

      date,

      guests,

      createdAt: new Date()

    });


    alert("Package booked successfully");

  };


  if (!offer) return <p>Loading...</p>;


  return (

    <div className="p-10 max-w-5xl mx-auto">

      <img
        src={offer.image}
        className="w-full h-[400px] object-cover rounded-xl"
      />


      <h1 className="text-3xl font-bold mt-6">

        {offer.title}

      </h1>


      <p className="text-gray-500 mt-2">

        Duration: {offer.duration}

      </p>


      <div className="mt-4 space-y-2">

        <p>

          <strong>Hotel:</strong> {offer.hotel}

        </p>


        <p>

          <strong>Transport:</strong> {offer.transport}

        </p>


        <p>

          <strong>Trips Included:</strong> {offer.trips}

        </p>


        <p>

          <strong>Food:</strong> {offer.food}

        </p>

      </div>


      <p className="text-orange-500 text-xl mt-4">

        ${offer.price}

      </p>


      {/* Booking Form */}

      <div className="mt-10 bg-gray-100 p-6 rounded-xl">

        <h2 className="text-2xl font-bold mb-4">

          Book this package

        </h2>
<WhatsAppButton serviceName={offer.title} />

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

export default PackageDetails;