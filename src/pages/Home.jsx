import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase";
import { Helmet } from "react-helmet-async";

function Home() {

  const [hotels, setHotels] = useState([]);


  useEffect(() => {

    const fetchHotels = async () => {

      const querySnapshot = await getDocs(
        collection(db, "hotels")
      );

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setHotels(data.slice(0, 3)); // يعرض أول 3 فنادق فقط

    };

    fetchHotels();

  }, []);


  return (

    <div>
 
 <Helmet>
  <title>Nile Horizon | Best Hotels & Trips in Aswan</title>

  <meta
    name="description"
    content="Book hotels, trips, transport and travel packages in Aswan with Nile Horizon. Discover Abu Simbel, Nubian Village and more."
  />
</Helmet>

      {/* Hero Section */}

      <div className="relative h-[90vh] flex items-center justify-center">

        <img
          src="https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?q=80&w=2070&auto=format&fit=crop"
          className="absolute w-full h-full object-cover"
          alt="Aswan Nile"
        />

        <div className="absolute inset-0 bg-black/40"></div>


        <div className="relative bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl text-center">

          <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
            Discover Aswan with Nile Horizon
          </h1>

          <p className="mt-3 text-gray-600 text-lg">
            Hotels • Transport • Trips • Packages
          </p>


          <div className="mt-6 flex gap-4 justify-center">

            <Link to="/hotels">

              <button className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl">

                Explore Hotels

              </button>

            </Link>


            <Link to="/offers">

              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl">

                View Offers

              </button>

            </Link>

          </div>

        </div>

      </div>



      {/* Services Section */}

      <div className="py-16 px-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Link to="/hotels">

          <div className="shadow-lg rounded-xl p-6 hover:scale-105 transition bg-white">

            <h2 className="text-xl font-bold">
              Hotels
            </h2>

            <p className="text-gray-500">
              Best hotels in Aswan
            </p>

          </div>

        </Link>


        <Link to="/transport">

          <div className="shadow-lg rounded-xl p-6 hover:scale-105 transition bg-white">

            <h2 className="text-xl font-bold">
              Transport
            </h2>

            <p className="text-gray-500">
              Cairo ⇄ Aswan transport
            </p>

          </div>

        </Link>


        <Link to="/offers">

          <div className="shadow-lg rounded-xl p-6 hover:scale-105 transition bg-white">

            <h2 className="text-xl font-bold">
              Packages
            </h2>

            <p className="text-gray-500">
              All-inclusive travel deals
            </p>

          </div>

        </Link>


        <Link to="/trips">

          <div className="shadow-lg rounded-xl p-6 hover:scale-105 transition bg-white">

            <h2 className="text-xl font-bold">
              Trips
            </h2>

            <p className="text-gray-500">
              Abu Simbel • Nubian Village • Felucca
            </p>

          </div>

        </Link>

      </div>



      {/* Featured Hotels Section */}

      <div className="py-16 px-10 bg-gray-50">

        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">

          Featured Hotels

        </h2>


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {hotels.map(hotel => (

            <Link
              to={`/hotel/${hotel.id}`}
              key={hotel.id}
            >

              <div className="shadow-lg rounded-xl overflow-hidden hover:scale-105 transition">

                <img
                  src={hotel.image}
                  className="h-52 w-full object-cover"
                  alt={hotel.name}
                />


                <div className="p-4">

                  <h3 className="text-xl font-bold">

                    {hotel.name}

                  </h3>


                  <p className="text-gray-500">

                    {hotel.location}

                  </p>


                  <p className="text-orange-500 font-bold mt-2">

                    ${hotel.price} / night

                  </p>

                </div>

              </div>

            </Link>

          ))}

        </div>


        <div className="text-center mt-8">

          <Link to="/hotels">

            <button className="bg-blue-900 text-white px-6 py-3 rounded-xl">

              View All Hotels

            </button>

          </Link>

        </div>

      </div>



      {/* Special Offers Section */}

      <div className="bg-gray-100 py-16 px-10 text-center">

        <h2 className="text-3xl font-bold text-blue-900">

          Special Offers

        </h2>


        <p className="text-gray-500 mt-2">

          Best value packages for your trip

        </p>


        <Link to="/offers">

          <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl">

            View Packages

          </button>

        </Link>

      </div>



      {/* Why Choose Us */}

      <div className="py-16 px-10 grid md:grid-cols-3 gap-6 text-center">

        <div className="shadow-md rounded-xl p-6">

          <h3 className="text-xl font-bold">
            Best Prices
          </h3>

          <p className="text-gray-500">
            Local deals with competitive rates
          </p>

        </div>


        <div className="shadow-md rounded-xl p-6">

          <h3 className="text-xl font-bold">
            Local Experts
          </h3>

          <p className="text-gray-500">
            Real experience in Aswan tourism
          </p>

        </div>


        <div className="shadow-md rounded-xl p-6">

          <h3 className="text-xl font-bold">
            Easy Booking
          </h3>

          <p className="text-gray-500">
            Simple reservation process
          </p>

        </div>

      </div>


    </div>

  );

}

export default Home;