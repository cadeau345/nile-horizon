import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase";

import { Helmet } from "react-helmet-async";

import heroImage from "../assets/trips.jpg";
import hotelsHero from "../assets/hotelsHero.jpg";
import tripsHero from "../assets/tripsHero.jpg";
import transportHero from "../assets/transportHero.jpg";


function Home() {

  const [hotels, setHotels] = useState([]);

  const [bestSellers, setBestSellers] = useState([]);

  const [offers, setOffers] = useState([]);

  const [bestTrips, setBestTrips] = useState([]);

  const [bestTransport, setBestTransport] = useState([]);
  const [serviceType, setServiceType] = useState("hotels");


  useEffect(() => {
    const getHeroImage = () => {

if(serviceType === "hotels") return hotelsHero;

if(serviceType === "transport") return transportHero;

if(serviceType === "cars") return transportHero;

return heroImage;

};

    const fetchData = async () => {

      // HOTELS

      const hotelsSnapshot = await getDocs(
        collection(db, "hotels")
      );

      const hotelsData = hotelsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setHotels(hotelsData.slice(0, 3));

      setBestSellers(
        hotelsData.filter(item => item.isBestSeller)
      );

      setOffers(
        hotelsData.filter(item => item.isOffer)
      );


      // TRIPS

      const tripsSnapshot = await getDocs(
        collection(db, "trips")
      );

      const tripsData = tripsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setBestTrips(
        tripsData.filter(item => item.isBestSeller)
      );


      // TRANSPORT

      const transportSnapshot = await getDocs(
        collection(db, "transport")
      );

      const transportData = transportSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setBestTransport(
        transportData.filter(item => item.isBestSeller)
      );

    };

    fetchData();

  }, []);


  return (

    <div>

      <Helmet>

        <title>
          Nile Horizon | Best Hotels & Trips in Aswan
        </title>

        <meta
          name="description"
          content="Book hotels, trips, transport and travel packages in Aswan with Nile Horizon. Discover Abu Simbel, Nubian Village and more."
        />

      </Helmet>


{/* Hero Section */}

<div className="relative min-h-[60vh] flex items-center justify-center px-4">

<img
src={heroImage}
className="absolute w-full h-full object-cover object-center transition-all duration-500"
/>
alt="Aswan Nile"


<div className="absolute inset-0 bg-black/40"></div>


<div className="relative bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl text-center w-full max-w-[90%] md:max-w-3xl">

<h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-blue-900">

Discover Aswan with Nile Horizon

</h1>


<p className="mt-3 text-gray-600 text-lg">

Hotels • Transport • Private Cars

</p>





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



{/* Featured Hotels */}

<div className="py-16 px-10 bg-gray-50">

<h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">

Featured Hotels

</h2>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{hotels.map(hotel => (

<Link to={`/hotel/${hotel.id}`} key={hotel.id}>

<div className="shadow-lg rounded-xl overflow-hidden hover:scale-105 transition duration-300">

<div className="relative">

{hotel.discountPrice && (

<span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">

SALE

</span>

)}

<img
src={hotel.image}
className="h-40 md:h-52 w-full object-cover"
/>

</div>
<div className="p-4">

<h3 className="text-xl font-bold">

{hotel.name}

</h3>

<p className="text-gray-500">

{hotel.location}

</p>

<p className="text-orange-500 font-bold mt-2">
{
hotel.discountPrice ? (

<div>

<span className="line-through text-gray-400 mr-2">

${hotel.price}

</span>

<span className="text-orange-500 font-bold">

${hotel.discountPrice}

</span>

</div>

) : (

<span className="text-orange-500 font-bold">

${hotel.price}

</span>

)
}

</p>

</div>

</div>

</Link>

))}

</div>

</div>



{/* Best Sellers Hotels */}

{bestSellers.length > 0 && (

<div className="py-16 px-10">

<h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">

Best Sellers

</h2>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{bestSellers.map(item => (

<Link to={`/hotel/${item.id}`} key={item.id}>

<div className="shadow-lg rounded-xl overflow-hidden border border-green-300">

<img
src={item.image}
className="h-40 md:h-52 w-full object-cover"
/>

<div className="p-4">

<h3 className="text-xl font-bold">

{item.name}

</h3>

<p className="text-orange-500 font-bold mt-2">

${item.price}

</p>

</div>

</div>

</Link>

))}

</div>

</div>

)}



{/* Special Offers Hotels */}

{offers.length > 0 && (

<div className="py-16 px-10 bg-gray-50">

<h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">

Special Offers

</h2>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{offers.map(item => (

<Link to={`/hotel/${item.id}`} key={item.id}>

<div className="shadow-lg rounded-xl overflow-hidden border border-orange-300">

<img
src={item.image}
className="h-40 md:h-52 w-full object-cover"
/>

<div className="p-4">

<h3 className="text-xl font-bold">

{item.name}

</h3>

<p className="text-orange-500 font-bold mt-2">

${item.price}

</p>

</div>

</div>

</Link>

))}

</div>

</div>

)}



{/* Popular Trips */}

{bestTrips.length > 0 && (

<div className="py-16 px-10">

<h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">

Popular Trips

</h2>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{bestTrips.map(trip => (

<Link to={`/trip/${trip.id}`} key={trip.id}>

<div className="shadow-lg rounded-xl overflow-hidden hover:scale-105 transition duration-300">

<img
src={trip.image}
className="h-40 md:h-52 w-full object-cover"
/>

<div className="p-4">

<h3 className="text-xl font-bold">

{trip.name}

</h3>

<p className="text-orange-500 font-bold mt-2">

${trip.price}

</p>

</div>

</div>

</Link>

))}

</div>

</div>

)}



{/* Top Transport Deals */}

{bestTransport.length > 0 && (

<div className="py-16 px-10 bg-gray-50">

<h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">

Top Transport Deals

</h2>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{bestTransport.map(item => (

<Link to={`/transport/${item.id}`} key={item.id}>

<div className="shadow-lg rounded-xl overflow-hidden hover:scale-105 transition duration-300">

<img
src={item.image}
className="h-40 md:h-52 w-full object-cover"
/>

<div className="p-4">

<h3 className="text-xl font-bold">

{item.company}

</h3>

<p className="text-orange-500 font-bold mt-2">

${item.price}

</p>

</div>

</div>

</Link>

))}

</div>

</div>

)}



{/* CTA Offers Section */}

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