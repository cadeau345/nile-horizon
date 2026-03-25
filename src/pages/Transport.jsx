import { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase";

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";


function Transport() {

  const [transport, setTransport] = useState([]);

  const [filter, setFilter] = useState("All");

  const [date, setDate] = useState("");

  const [passengers, setPassengers] = useState("");

  const [searchClicked, setSearchClicked] = useState(false);


  useEffect(() => {

    const fetchTransport = async () => {

      const querySnapshot = await getDocs(
        collection(db, "transport")
      );

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setTransport(data);

    };

    fetchTransport();

  }, []);


  const filteredTransport =

    filter === "All"

      ? transport

      : transport.filter(item =>
          item.type.toLowerCase().includes(
            filter.toLowerCase()
          )
        );


  return (

    <div className="p-10">
        <Helmet>

        <title>
          Cairo to Aswan Transport | Bus Train Private Car
        </title>

        <meta
          name="description"
          content="Book transport from Cairo to Aswan by bus, train or private car with comfortable travel options."
        />

      </Helmet>

      <h1 className="text-3xl font-bold text-blue-900 mb-6">

        Cairo → Aswan Transport

      </h1>


      {/* Search Bar */}

      <div className="bg-gray-100 p-6 rounded-xl mb-8 flex flex-wrap gap-4">

        <input
  type="date"
  lang="en"
  className="border p-2 rounded"
  onChange={(e) => setDate(e.target.value)}
/>


        <input
          type="number"
          placeholder="Passengers"
          className="border p-2 rounded"
          onChange={(e) => setPassengers(e.target.value)}
        />


        <button
          onClick={() => setSearchClicked(true)}
          className="bg-blue-900 text-white px-6 py-2 rounded"
        >
          Search
        </button>

      </div>


      {/* Filter Buttons */}

      <div className="flex gap-3 mb-8 flex-wrap">

        <button
          onClick={() => setFilter("All")}
          className={`px-4 py-2 rounded ${
            filter === "All"
              ? "bg-blue-900 text-white"
              : "bg-gray-200"
          }`}
        >
          All
        </button>


        <button
          onClick={() => setFilter("Bus")}
          className={`px-4 py-2 rounded ${
            filter === "Bus"
              ? "bg-blue-900 text-white"
              : "bg-gray-200"
          }`}
        >
          Bus
        </button>


        <button
          onClick={() => setFilter("Train")}
          className={`px-4 py-2 rounded ${
            filter === "Train"
              ? "bg-blue-900 text-white"
              : "bg-gray-200"
          }`}
        >
          Train
        </button>


        <button
          onClick={() => setFilter("Car")}
          className={`px-4 py-2 rounded ${
            filter === "Car"
              ? "bg-blue-900 text-white"
              : "bg-gray-200"
          }`}
        >
          Private Car
        </button>

      </div>


      {/* Results */}

      {!searchClicked ? (

        <p className="text-gray-500 mb-6">

          Please select date and passengers then click search

        </p>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredTransport.map(item => (

            <Link
              key={item.id}
              to={`/transport/${item.id}`}
            >

              <div className="shadow-lg rounded-xl overflow-hidden hover:scale-105 transition">

                <img
                  src={item.image}
                  className="h-52 w-full object-cover"
                />


                <div className="p-4">

                  <h2 className="text-xl font-bold">

                    {item.company}

                  </h2>


                  <p className="text-gray-500">

                    {item.from} → {item.to}

                  </p>


                  <p className="text-gray-600">

                    {item.type}

                  </p>


                  <p className="text-orange-500 font-bold mt-2">

                    ${item.price} / seat

                  </p>


                  <button className="mt-3 bg-blue-900 text-white px-4 py-2 rounded">

                    View Details

                  </button>

                </div>

              </div>

            </Link>

          ))}

        </div>

      )}

    </div>

  );

}

export default Transport;