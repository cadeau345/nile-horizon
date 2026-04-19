import { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase";

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";


function Trips() {

const [trips,setTrips]=useState([]);


// تحميل الرحلات من Firebase

useEffect(()=>{

const fetchTrips=async()=>{

const querySnapshot=await getDocs(
collection(db,"trips")
);

const data=querySnapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

setTrips(data);

};

fetchTrips();

},[]);


// تحميل Travelpayouts widget

useEffect(()=>{

const script=document.createElement("script");

script.src=
"https://tpemd.com/content?currency=USD&trs=519404&shmarker=719849&product=1020186%2C1091294%2C1102460%2C1107020&language=en&layout=horizontal&powered_by=true&campaign_id=89&promo_id=3948";

script.async=true;

script.charset="utf-8";

const container=document.getElementById("travelpayouts-widget");

if(container){

container.appendChild(script);

}

},[]);


return(

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


{/* الرحلات اليدوية من Firebase */}

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


{/* Travelpayouts Tours Widget */}

<div className="mt-16">

<h2 className="text-2xl font-bold text-blue-900 mb-6">

Recommended Egypt Tours

</h2>

<div id="travelpayouts-widget"></div>

</div>


</div>

);

}

export default Trips;