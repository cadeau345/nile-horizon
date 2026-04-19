import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Helmet } from "react-helmet-async";

import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";

function Home(){

const navigate=useNavigate();

const heroImages=[hero1,hero2,hero3];

const [heroIndex,setHeroIndex]=useState(0);

const [hotels,setHotels]=useState([]);
const [bestTrips,setBestTrips]=useState([]);
const [bestTransport,setBestTransport]=useState([]);
const [offers,setOffers]=useState([]);

const [searchLocation,setSearchLocation]=useState("");
const [locations,setLocations]=useState([]);
const [filteredLocations,setFilteredLocations]=useState([]);


// HERO SLIDER AUTO CHANGE

useEffect(()=>{

const interval=setInterval(()=>{

setHeroIndex(prev=>

(prev+1)%heroImages.length

);

},4000);

return()=>clearInterval(interval);

},[]);


// FETCH DATA

useEffect(()=>{

const fetchData=async()=>{

const hotelsSnapshot=await getDocs(

collection(db,"hotels")

);

const hotelsData=hotelsSnapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

setHotels(hotelsData.slice(0,3));


setOffers(

hotelsData.filter(item=>item.isOffer)

);


const uniqueLocations=[

...new Set(

hotelsData.map(h=>h.location).filter(Boolean)

)

];

setLocations(uniqueLocations);


// TRIPS

const tripsSnapshot=await getDocs(

collection(db,"trips")

);

const tripsData=tripsSnapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

setBestTrips(

tripsData.filter(item=>item.isBestSeller)

);


// TRANSPORT

const transportSnapshot=await getDocs(

collection(db,"transport")

);

const transportData=transportSnapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

setBestTransport(

transportData.filter(item=>item.isBestSeller)

);

};

fetchData();

},[]);


// AUTOCOMPLETE FILTER

useEffect(()=>{

if(searchLocation===""){

setFilteredLocations([]);

}else{

setFilteredLocations(

locations.filter(loc=>

loc.toLowerCase().includes(

searchLocation.toLowerCase()

)

)

);

}

},[searchLocation,locations]);


// SEARCH FUNCTION

const handleSearch=()=>{

if(searchLocation.trim()!==""){

navigate(

`/hotels?location=${searchLocation}`

);

}

};


return(

<div className="bg-slate-50 text-slate-800">

<Helmet>

<title>Nile Horizon | Travel Egypt</title>

</Helmet>


{/* HERO SECTION */}


<div className="relative h-[88vh] flex items-center justify-center transition-all duration-700">

<img

src={heroImages[heroIndex]}

className="absolute w-full h-full object-cover transition-opacity duration-1000"

/>


<div className="absolute inset-0 bg-black/25"></div>


<div className="relative text-center text-white max-w-4xl px-4">

<h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">

Explore Egypt with

<span className="text-orange-400">

Nile Horizon

</span>

</h1>


<p className="mt-4 text-lg opacity-90">

Hotels • Trips • Transport • Packages

</p>


{/* SEARCH BOX */}


<div className="relative mt-8 bg-white shadow-2xl rounded-2xl p-5 flex flex-wrap gap-3 justify-center border">


<input

placeholder="Where are you going?"

value={searchLocation}

onChange={(e)=>setSearchLocation(e.target.value)}

onKeyDown={(e)=>{

if(e.key==="Enter"){

handleSearch();

}

}}

className="px-4 py-3 rounded-xl border text-black w-[240px]"

/>


{/* AUTOCOMPLETE */}


{filteredLocations.length>0&&(

<div className="absolute top-full mt-2 w-[240px] bg-white shadow-xl rounded-xl overflow-hidden z-50">

{filteredLocations.map(location=>(

<div

key={location}

onClick={()=>{

setSearchLocation(location);

setFilteredLocations([]);

}}

className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-black text-left"

>

{location}

</div>

))}

</div>

)}


<button

onClick={handleSearch}

className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition"

>

Search

</button>


</div>

</div>

</div>



{/* SERVICES */}


<div className="py-16 px-10 grid md:grid-cols-4 gap-6">

{[

["🏨 Hotels","/hotels"],

["🚗 Transport","/transport"],

["🎒 Packages","/offers"],

["🗺 Trips","/trips"]

].map(service=>(

<Link key={service[0]} to={service[1]}>

<div className="shadow-lg rounded-xl p-6 bg-blue-800 text-white hover:scale-105 transition">

<h2 className="text-xl font-bold">

{service[0]}

</h2>

<p className="opacity-80">

Explore best options

</p>

</div>

</Link>

))}

</div>



{/* FEATURED HOTELS */}


<div className="py-16 px-10">

<h2 className="text-3xl font-bold text-center mb-8">

Featured Hotels

</h2>


<div className="grid md:grid-cols-3 gap-6">

{hotels.map(hotel=>(

<Link key={hotel.id} to={`/hotel/${hotel.id}`}>

<div className="shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition">

<img

src={hotel.images?.[0]||hotel.image}

className="h-56 w-full object-cover"

/>


<div className="p-4">

<h3 className="font-bold">

{hotel.name}

</h3>

<p className="text-gray-500">

{hotel.location}

</p>


<p className="text-orange-500 font-bold">

${hotel.discountPrice||hotel.price}

</p>

</div>

</div>

</Link>

))}

</div>

</div>



{/* BEST TRIPS */}


<div className="py-16 px-10 bg-white">

<h2 className="text-3xl font-bold text-center mb-8">

Best Trips

</h2>


<div className="grid md:grid-cols-3 gap-6">

{bestTrips.slice(0,3).map(trip=>(

<Link key={trip.id} to={`/trip/${trip.id}`}>

<div className="shadow-lg rounded-xl overflow-hidden">

<img

src={trip.images?.[0]||trip.image}

className="h-56 w-full object-cover"

/>


<div className="p-4">

<h3 className="font-bold">

{trip.name}

</h3>


<p className="text-orange-500">

${trip.price}

</p>

</div>

</div>

</Link>

))}

</div>

</div>



{/* BEST TRANSPORT */}


<div className="py-16 px-10">

<h2 className="text-3xl font-bold text-center mb-8">

Best Transport

</h2>


<div className="grid md:grid-cols-3 gap-6">

{bestTransport.slice(0,3).map(item=>(

<Link key={item.id} to={`/transport/${item.id}`}>

<div className="shadow-lg rounded-xl overflow-hidden">

<img

src={item.images?.[0]||item.image}

className="h-56 w-full object-cover"

/>


<div className="p-4">

<h3 className="font-bold">

{item.name}

</h3>


<p className="text-orange-500">

${item.price}

</p>

</div>

</div>

</Link>

))}

</div>

</div>



{/* SPECIAL OFFERS */}


<div className="py-16 px-10 bg-white">

<h2 className="text-3xl font-bold text-center mb-8">

Special Offers 🔥

</h2>


<div className="grid md:grid-cols-3 gap-6">

{offers.slice(0,3).map(item=>(

<Link key={item.id} to={`/hotel/${item.id}`}>

<div className="shadow-lg rounded-xl overflow-hidden">

<img

src={item.images?.[0]||item.image}

className="h-56 w-full object-cover"

/>


<div className="p-4">

<h3 className="font-bold">

{item.name}

</h3>


<p className="text-red-500 font-bold">

${item.discountPrice}

</p>

</div>

</div>

</Link>

))}

</div>

</div>


</div>

);

}

export default Home;