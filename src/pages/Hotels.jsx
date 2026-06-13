import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function Hotels() {

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "hotels")
        );

        const hotelsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHotels(hotelsData);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="p-10">
      <Helmet>
        <title>Hotels in Aswan | Nile Horizon</title>

        <meta
          name="description"
          content="Explore the best hotels in Aswan with competitive prices and easy booking options."
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6 text-blue-900">
        Hotels in Egypt
      </h1>

      {loading ? (
        <p className="text-center text-lg">
          Loading hotels...
        </p>
      ) : hotels.length === 0 ? (
        <p className="text-center text-red-500 text-lg">
          No hotels found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
          {hotels.map((hotel) => (

            <Link
              to={`/hotel/${hotel.id}`}
              key={hotel.id}
            >
              <div className="shadow-lg rounded-xl overflow-hidden hover:scale-105 transition duration-300 cursor-pointer bg-white h-full">
                <img
                  src={
                    hotel.images?.[0] ||
                    hotel.image ||
                    "https://via.placeholder.com/500x300?text=Hotel"
                  }
                  alt={hotel.name}
                  className="h-52 w-full object-cover"
                />

                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {hotel.name}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    📍 {hotel.location || "Aswan"}
                  </p>

                  {hotel.rating && (
                    <p className="text-yellow-500 mt-2">
                      ⭐ {hotel.rating}
                    </p>
                  )}

                  {/* السعر مع عرض لو موجود */}
                 {hotel.isOffer && hotel.discountPrice ? (
  <div className="mt-2">
    <p className="text-gray-400 line-through">
      {Number(hotel.price).toLocaleString()} EGP / night
    </p>

    <p className="text-red-500 font-bold">
      {Number(
        hotel.discountPrice
      ).toLocaleString()} EGP / night
    </p>
  </div>
) : (
  <p className="text-orange-500 font-bold mt-2">
    {Number(
      hotel.price
    ).toLocaleString()} EGP / night
  </p>
)}

                  {/* Best Seller */}
                  {hotel.isBestSeller && (
                    <p className="text-yellow-500 mt-2 font-semibold">
                      ⭐ Best Seller
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Hotels;