import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import {
  collection,
  getDocs
} from "firebase/firestore";

import {
  Helmet
} from "react-helmet-async";

import { db } from "../firebase";

import { usePrice } from "../utils/price";

import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";


function Home() {

  const price = usePrice();

  const navigate =
    useNavigate();


  // =========================
  // HERO
  // =========================

  const heroImages = [
    hero1,
    hero2,
    hero3
  ];

  const [
    heroIndex,
    setHeroIndex
  ] = useState(0);


  // =========================
  // DATA
  // =========================

  const [
    hotels,
    setHotels
  ] = useState([]);

  const [
    bestTrips,
    setBestTrips
  ] = useState([]);

  const [
    bestTransport,
    setBestTransport
  ] = useState([]);

  const [
    offers,
    setOffers
  ] = useState([]);


  // =========================
  // SEARCH
  // =========================

  const [
    searchLocation,
    setSearchLocation
  ] = useState("");

  const [
    locations,
    setLocations
  ] = useState([]);

  const [
    filteredLocations,
    setFilteredLocations
  ] = useState([]);


  // =========================
  // HERO SLIDER
  // =========================

  useEffect(() => {

    const interval =
      setInterval(() => {

        setHeroIndex(
          prev =>
            (prev + 1) %
            heroImages.length
        );

      }, 4000);


    return () =>
      clearInterval(interval);

  }, [heroImages.length]);


  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          // =====================
          // HOTELS
          // =====================

          const hotelsSnapshot =
            await getDocs(
              collection(
                db,
                "hotels"
              )
            );


          const hotelsData =
            hotelsSnapshot.docs.map(
              doc => ({
                id: doc.id,
                ...doc.data()
              })
            );


          setHotels(
            hotelsData.slice(0, 3)
          );


          // =====================
          // OFFERS
          // =====================

          const hotelOffers =
            hotelsData.filter(
              item =>
                item.isOffer
            );


          setOffers(
            hotelOffers
          );


          // =====================
          // LOCATIONS
          // =====================

          const uniqueLocations = [
            ...new Set(
              hotelsData
                .map(
                  hotel =>
                    hotel.location
                )
                .filter(Boolean)
            )
          ];


          setLocations(
            uniqueLocations
          );


          // =====================
          // TRIPS
          // =====================

          const tripsSnapshot =
            await getDocs(
              collection(
                db,
                "tours"
              )
            );


          const tripsData =
            tripsSnapshot.docs.map(
              doc => ({
                id: doc.id,
                ...doc.data()
              })
            );


          setBestTrips(
            tripsData
          );


          // =====================
          // TRANSPORT
          // =====================

          const transportSnapshot =
            await getDocs(
              collection(
                db,
                "transport"
              )
            );


          const transportData =
            transportSnapshot.docs.map(
              doc => ({
                id: doc.id,
                ...doc.data()
              })
            );


          setBestTransport(
            transportData
          );


        } catch (error) {

          console.error(
            "Error loading homepage:",
            error
          );

        }

      };


    fetchData();

  }, []);


  // =========================
  // AUTOCOMPLETE
  // =========================

  useEffect(() => {

    if (
      searchLocation.trim() === ""
    ) {

      setFilteredLocations([]);

      return;

    }


    const filtered =
      locations.filter(
        location =>
          location
            .toLowerCase()
            .includes(
              searchLocation
                .toLowerCase()
            )
      );


    setFilteredLocations(
      filtered
    );

  }, [
    searchLocation,
    locations
  ]);


  // =========================
  // SEARCH
  // =========================

  const handleSearch =
    () => {

      const location =
        searchLocation.trim();


      if (!location) {
        return;
      }


      navigate(
        `/hotels?location=${encodeURIComponent(
          location
        )}`
      );

    };


  // =========================
  // RETURN
  // =========================

  return (

    <div className="
      bg-slate-50
      text-slate-800
    ">


      <Helmet>

        <title>
          Nile Horizon | Travel Egypt
        </title>

        <meta
          name="description"
          content="
            Explore Egypt with Nile Horizon.
            Discover hotels, trips,
            transportation and travel packages.
          "
        />

      </Helmet>


      {/* =========================
          HERO
      ========================= */}

      <section className="
        relative
        h-[88vh]
        flex
        items-center
        justify-center
        overflow-hidden
      ">

        <img
          src={
            heroImages[
              heroIndex
            ]
          }
          alt="Explore Egypt"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
          "
        />


        <div className="
          absolute
          inset-0
          bg-black/30
        " />


        <div className="
          relative
          z-10
          text-center
          text-white
          max-w-4xl
          px-4
        ">

          <h1 className="
            text-4xl
            md:text-6xl
            font-extrabold
          ">

            Explore Egypt with{" "}

            <span className="
              text-orange-400
            ">

              Nile Horizon

            </span>

          </h1>


          <p className="
            mt-4
            text-lg
            opacity-90
          ">

            Hotels • Trips • Transport • Packages

          </p>


          {/* SEARCH */}

          <div className="
            relative
            mt-8
            bg-white
            shadow-2xl
            rounded-2xl
            p-5
            flex
            flex-wrap
            gap-3
            justify-center
          ">

            <input
              placeholder="Where are you going?"
              value={
                searchLocation
              }
              onChange={
                e =>
                  setSearchLocation(
                    e.target.value
                  )
              }
              onKeyDown={
                e => {

                  if (
                    e.key ===
                    "Enter"
                  ) {

                    handleSearch();

                  }

                }
              }
              className="
                px-4
                py-3
                rounded-xl
                border
                text-black
                w-full
                sm:w-[240px]
              "
            />


            {filteredLocations.length >
              0 && (

              <div className="
                absolute
                top-full
                mt-2
                w-full
                sm:w-[240px]
                bg-white
                shadow-xl
                rounded-xl
                overflow-hidden
                z-50
              ">

                {filteredLocations.map(
                  location => (

                    <button
                      key={
                        location
                      }
                      type="button"
                      onClick={() => {

                        setSearchLocation(
                          location
                        );

                        setFilteredLocations(
                          []
                        );

                      }}
                      className="
                        w-full
                        px-4
                        py-3
                        text-black
                        text-left
                        hover:bg-slate-100
                      "
                    >

                      {location}

                    </button>

                  )
                )}

              </div>

            )}


            <button
              onClick={
                handleSearch
              }
              className="
                bg-orange-500
                hover:bg-orange-600
                text-white
                px-8
                py-3
                rounded-xl
                font-semibold
              "
            >

              Search

            </button>

          </div>

        </div>

      </section>


      {/* =========================
          SERVICES
      ========================= */}

      <section className="
        py-16
        px-6
        md:px-10
        grid
        sm:grid-cols-2
        md:grid-cols-4
        gap-6
      ">

        {[
          ["🏨 Hotels", "/hotels"],
          ["🚗 Transport", "/transport"],
          ["🎒 Packages", "/offers"],
          ["🗺 Trips", "/trips"]
        ].map(
          service => (

            <Link
              key={
                service[0]
              }
              to={
                service[1]
              }
            >

              <div className="
                shadow-lg
                rounded-xl
                p-6
                bg-blue-800
                text-white
                hover:scale-105
                transition
                h-full
              ">

                <h2 className="
                  text-xl
                  font-bold
                ">

                  {service[0]}

                </h2>


                <p className="
                  opacity-80
                  mt-2
                ">

                  Explore best options

                </p>

              </div>

            </Link>

          )
        )}

      </section>


      {/* =========================
          FEATURED HOTELS
      ========================= */}

      <section className="
        py-16
        px-6
        md:px-10
      ">

        <h2 className="
          text-3xl
          font-bold
          text-center
          mb-8
        ">

          Featured Hotels

        </h2>


        <div className="
          grid
          md:grid-cols-3
          gap-6
        ">

          {hotels.map(
            hotel => (

              <Link
                key={
                  hotel.id
                }
                to={
                  `/hotel/${hotel.id}`
                }
              >

                <div className="
                  bg-white
                  rounded-xl
                  overflow-hidden
                  shadow-lg
                  hover:shadow-2xl
                  transition
                ">

                  <img
                    src={
                      hotel.images?.[0] ||
                      hotel.image
                    }
                    alt={
                      hotel.name ||
                      "Hotel"
                    }
                    className="
                      h-56
                      w-full
                      object-cover
                    "
                  />


                  <div className="
                    p-4
                  ">

                    <h3 className="
                      font-bold
                      text-lg
                    ">

                      {
                        hotel.name
                      }

                    </h3>


                    <p className="
                      text-gray-500
                      mt-1
                    ">

                      {
                        hotel.location
                      }

                    </p>


                    {/* =====================
                        HOTEL PRICE
                        
                        الفندق أصله EGP
                    ===================== */}

                    <p className="
                      text-orange-500
                      font-bold
                      mt-3
                    ">

                      {price(
                        Number(
                          hotel.discountPrice ||
                          hotel.price ||
                          0
                        ),
                        "EGP"
                      )}

                    </p>

                  </div>

                </div>

              </Link>

            )
          )}

        </div>

      </section>


      {/* =========================
          BEST TRIPS
      ========================= */}

      <section className="
        py-16
        px-6
        md:px-10
        bg-white
      ">

        <h2 className="
          text-3xl
          font-bold
          text-center
          mb-8
        ">

          Best Trips

        </h2>


        <div className="
          grid
          md:grid-cols-3
          gap-6
        ">

          {bestTrips
            .slice(0, 3)
            .map(
              trip => (

                <Link
                  key={
                    trip.id
                  }
                  to={
                    `/trip/${trip.id}`
                  }
                >

                  <div className="
                    bg-white
                    rounded-xl
                    overflow-hidden
                    shadow-lg
                    hover:shadow-2xl
                    transition
                  ">

                    <img
                      src={
                        trip.images?.[0] ||
                        trip.image ||
                        "https://via.placeholder.com/600x400"
                      }
                      alt={
                        trip.title ||
                        trip.name ||
                        "Trip"
                      }
                      className="
                        h-56
                        w-full
                        object-cover
                      "
                    />


                    <div className="
                      p-4
                    ">

                      <h3 className="
                        font-bold
                      ">

                        {
                          trip.title ||
                          trip.name ||
                          "Trip"
                        }

                      </h3>


                      <p className="
                        text-gray-500
                      ">

                        {
                          trip.duration
                        }

                      </p>


                      {/* TRIPS أصلها USD */}

                      <p className="
                        text-orange-500
                        font-bold
                        mt-3
                      ">

                        {price(
                          Number(
                            trip.price ||
                            0
                          ),
                          "USD"
                        )}

                      </p>

                    </div>

                  </div>

                </Link>

              )
            )}

        </div>

      </section>


      {/* =========================
          BEST TRANSPORT
      ========================= */}

      <section className="
        py-16
        px-6
        md:px-10
      ">

        <h2 className="
          text-3xl
          font-bold
          text-center
          mb-8
        ">

          Best Transport

        </h2>


        <div className="
          grid
          md:grid-cols-3
          gap-6
        ">

          {bestTransport
            .slice(0, 3)
            .map(
              item => (

                <Link
                  key={
                    item.id
                  }
                  to={
                    `/transport/${item.id}`
                  }
                >

                  <div className="
                    bg-white
                    rounded-xl
                    overflow-hidden
                    shadow-lg
                    hover:shadow-2xl
                    transition
                  ">

                    <img
                      src={
                        item.images?.[0] ||
                        item.image
                      }
                      alt={
                        item.company ||
                        item.name ||
                        "Transport"
                      }
                      className="
                        h-56
                        w-full
                        object-cover
                      "
                    />


                    <div className="
                      p-4
                    ">

                      <h3 className="
                        font-bold
                      ">

                        {
                          item.company ||
                          item.name
                        }

                      </h3>


                      <p className="
                        text-gray-500
                      ">

                        {
                          item.from
                        }

                        {" → "}

                        {
                          item.to
                        }

                      </p>


                      {/* TRANSPORT أصلها USD */}

                      <p className="
                        text-orange-500
                        font-bold
                        mt-3
                      ">

                        {price(
                          Number(
                            item.price ||
                            0
                          ),
                          "USD"
                        )}

                      </p>

                    </div>

                  </div>

                </Link>

              )
            )}

        </div>

      </section>


      {/* =========================
          SPECIAL OFFERS
      ========================= */}

      <section className="
        py-16
        px-6
        md:px-10
        bg-white
      ">

        <h2 className="
          text-3xl
          font-bold
          text-center
          mb-8
        ">

          Special Offers

        </h2>


        <div className="
          grid
          md:grid-cols-3
          gap-6
        ">

          {offers
            .slice(0, 3)
            .map(
              item => (

                <Link
                  key={
                    item.id
                  }
                  to={
                    `/hotel/${item.id}`
                  }
                >

                  <div className="
                    bg-white
                    rounded-xl
                    overflow-hidden
                    shadow-lg
                    hover:shadow-2xl
                    transition
                  ">

                    <img
                      src={
                        item.images?.[0] ||
                        item.image
                      }
                      alt={
                        item.name ||
                        "Special Offer"
                      }
                      className="
                        h-56
                        w-full
                        object-cover
                      "
                    />


                    <div className="
                      p-4
                    ">

                      <h3 className="
                        font-bold
                      ">

                        {
                          item.name
                        }

                      </h3>


                      {/* ORIGINAL PRICE */}

                      <p className="
                        text-gray-500
                        line-through
                        mt-2
                      ">

                        {price(
                          Number(
                            item.price ||
                            0
                          ),
                          "EGP"
                        )}

                      </p>


                      {/* DISCOUNT PRICE */}

                      <p className="
                        text-red-500
                        font-bold
                        text-xl
                        mt-1
                      ">

                        {price(
                          Number(
                            item.discountPrice ||
                            item.price ||
                            0
                          ),
                          "EGP"
                        )}

                      </p>

                    </div>

                  </div>

                </Link>

              )
            )}

        </div>

      </section>

    </div>

  );

}


export default Home;