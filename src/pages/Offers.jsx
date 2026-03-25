import { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase";

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";


function Offers() {

  const [offers, setOffers] = useState([]);


  useEffect(() => {

    const fetchOffers = async () => {

      const querySnapshot = await getDocs(
        collection(db, "offers")
      );

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOffers(data);

    };

    fetchOffers();

  }, []);


  return (

    <div className="p-10">
           <Helmet>

        <title>
          Aswan Travel Packages | Nile Horizon Offers
        </title>

        <meta
          name="description"
          content="Exclusive Aswan travel packages including hotels, transport and guided tours at affordable prices."
        />

      </Helmet>

      <h1 className="text-3xl font-bold text-blue-900 mb-6">

        Special Offers in Aswan

      </h1>


      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {offers.map(item => (

          <Link key={item.id} to={`/offer/${item.id}`}>

            <div className="shadow-lg rounded-xl overflow-hidden hover:scale-105 transition">

              <img
                src={item.image}
                className="h-52 w-full object-cover"
              />


              <div className="p-4">

                <h2 className="text-xl font-bold">

                  {item.title}

                </h2>


                <p className="text-gray-500">

                  {item.duration}

                </p>


                <p className="mt-2">

                  Hotel: {item.hotel}

                </p>


                <p>

                  Trips: {item.trips}

                </p>


                <p>

                  Food: {item.food}

                </p>


                <p className="text-orange-500 font-bold mt-2">

                  ${item.price}

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

export default Offers;