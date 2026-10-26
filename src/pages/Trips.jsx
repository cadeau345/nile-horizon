import { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase";

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCurrency } from "../context/CurrencyContext";
import { usePrice } from "../utils/price";

function Trips() {

    const price = usePrice();
const { currency, convertPrice } = useCurrency();
const [trips,setTrips]=useState([]);


// تحميل الرحلات من Firebase

useEffect(()=>{

const fetchTrips=async()=>{

const querySnapshot=await getDocs(
collection(db,"tours")
);

const data=querySnapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

setTrips(data);

};

fetchTrips();

},[]);


// widget رقم 1

useEffect(()=>{

if(document.getElementById("tp-widget-1-script")) return;

const script=document.createElement("script");

script.id="tp-widget-1-script";

script.src=
"https://tpemd.com/content?currency=USD&trs=519404&shmarker=719849&locale=en&city_id=365308&category=4&amount=3&powered_by=true&campaign_id=137&promo_id=4497";

script.async=true;

script.charset="utf-8";

document
.getElementById("travelpayouts-widget-1")
?.appendChild(script);

},[]);


// widget رقم 2

useEffect(()=>{

if(document.getElementById("tp-widget-2-script")) return;

const script=document.createElement("script");

script.id="tp-widget-2-script";

script.src=
"https://tpemd.com/content?currency=USD&trs=519404&shmarker=719849&product=1020186%2C1115262%2C1091294%2C1110632%2C1104412%2C1107615%2C1095488%2C1107619%2C1095248%2C1102719&language=en&layout=horizontal&powered_by=true&campaign_id=89&promo_id=3948";

script.async=true;

script.charset="utf-8";

document
.getElementById("travelpayouts-widget-2")
?.appendChild(script);

},[]);


return(

<div className="p-10">


<Helmet>
  <title>Egypt Tours & Excursions | Nile Horizon</title>

  <meta
    name="description"
    content="Explore Egypt tours and excursions with Nile Horizon. Discover historical sites, cultural experiences, Nile cruises, guided trips, and holiday activities across Egypt."
  />

  <link
    rel="canonical"
    href="https://www.nilehorizon.org/trips"
  />

  <meta
    property="og:type"
    content="website"
  />

  <meta
    property="og:title"
    content="Egypt Tours & Excursions | Nile Horizon"
  />

  <meta
    property="og:description"
    content="Discover tours, cultural experiences, Nile cruises, and excursions across Egypt with Nile Horizon."
  />

  <meta
    property="og:url"
    content="https://www.nilehorizon.org/trips"
  />
</Helmet>



<h1 className="text-3xl font-bold text-blue-900 mb-6">
  Explore Tours & Trips Across Egypt
</h1>
<p className="text-gray-600 max-w-3xl mb-8 leading-7">
  Discover Egypt through historical landmarks, cultural experiences,
  Nile cruises, guided excursions, and local activities. Explore
  available trips and choose the experience that best fits your
  Egyptian holiday.
</p>


{/* الرحلات من Firebase */}

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{trips.map(trip=>(

<Link
key={trip.id}
to={`/trip/${trip.id}`}
>

<div className="shadow-lg rounded-xl overflow-hidden hover:scale-105 transition duration-300 cursor-pointer">

<img
src={
trip.images?.[0] ||
trip.image ||
"/placeholder.jpg"
}
alt={trip.title}
className="h-52 w-full object-cover"
/>


<div className="p-4">

<h2 className="text-xl font-bold">
{trip.title}
</h2>


<p className="text-gray-500">
Duration: {trip.duration}
</p>


<p className="mt-2 text-gray-600 line-clamp-2">
{trip.description}
</p>


<p className="text-orange-500 font-bold mt-3">
{price(trip.price)}
</p>


<button className="mt-3 bg-blue-900 text-white px-4 py-2 rounded">
View Details
</button>

</div>

</div>

</Link>

))}

</div>


{/* widget الأول */}

<div className="mt-16">

<h2 className="text-2xl font-bold text-blue-900 mb-6">

Recommended Aswan Experiences

</h2>

<div id="travelpayouts-widget-1"></div>

</div>


{/* widget الثاني */}

<div className="mt-16">

<h2 className="text-2xl font-bold text-blue-900 mb-6">

Top Egypt Tours

</h2>

<div id="travelpayouts-widget-2"></div>

</div>


</div>

);

}

export default Trips;