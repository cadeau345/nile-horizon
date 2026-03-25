import { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase";

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";


function Trips() {

  const [trips, setTrips] = useState([]);


  useEffect(() => {

    const fetchTrips = async () => {

      const querySnapshot = await getDocs(
        collection(db, "trips")
      );

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setTrips(data);

    };

    fetchTrips();

  }, []);


  return (

    <div className="p-10">
         <Helmet>

        <title>
          Trips in Aswan | Abu Simbel & Nubian Village Tours
        </title>

        <meta
          name="description"
          content="Discover top tours in Aswan including Abu Simbel temples, Nubian Village visits and Nile felucca rides."
        />

      </Helmet>

      <h1 className="text-3xl font-bold text-blue-900 mb-6">

        Trips in Aswan

      </h1>


      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {trips.map(trip => (

          <Link
            key={trip.id}
            to={`/trip/${trip.id}`}
          >

            <div className="shadow-lg rounded-xl overflow-hidden hover:scale-105 transition duration-300 cursor-pointer">

              <img
                src={trip.image}
                alt={trip.name}
                className="h-52 w-full object-cover"
              />


              <div className="p-4">

                <h2 className="text-xl font-bold">

                  {trip.name}

                </h2>


                <p className="text-gray-500">

                  Duration: {trip.duration}

                </p>


                <p className="mt-2 text-gray-600 line-clamp-2">

                  {trip.description}

                </p>


                <p className="text-orange-500 font-bold mt-3">

                  ${trip.price}

                </p>


                <button className="mt-3 bg-blue-900 text-white px-4 py-2 rounded">

                  View Details

                </button>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </div>

  );

}


export default Trips;