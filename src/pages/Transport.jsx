import { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase";

import { Link, useSearchParams } from "react-router-dom";

import { Helmet } from "react-helmet-async";


function Transport() {

const [searchParams]=useSearchParams();

const [transport,setTransport]=useState([]);

const [filter,setFilter]=useState("All");

const [date,setDate]=useState("");

const [returnDate,setReturnDate]=useState("");

const [passengers,setPassengers]=useState("");

const [searchClicked,setSearchClicked]=useState(true);

const [tripType,setTripType]=useState("oneway");

const [direction,setDirection]=useState("aswan-cairo");



/*
============================
قراءة بيانات البحث من الرابط
============================
*/

useEffect(()=>{

const urlDirection=searchParams.get("direction");

const urlDate=searchParams.get("date");

const urlReturnDate=searchParams.get("returnDate");

const urlPassengers=searchParams.get("passengers");


if(urlDirection)setDirection(urlDirection);

if(urlDate)setDate(urlDate);

if(urlReturnDate)setReturnDate(urlReturnDate);

if(urlPassengers)setPassengers(urlPassengers);

},[searchParams]);



/*
============================
تحميل البيانات
============================
*/

useEffect(()=>{

const fetchTransport=async()=>{

const querySnapshot=await getDocs(
collection(db,"transport")
);

const data=querySnapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

setTransport(data);

};

fetchTransport();

},[]);



/*
============================
فلترة حسب النوع
============================
*/

const filteredTransport = transport
.filter(item => {

if(direction === "aswan-cairo"){

return (
item.from?.toLowerCase() === "aswan" &&
item.to?.toLowerCase() === "cairo"
);

}

if(direction === "cairo-aswan"){

return (
item.from?.toLowerCase() === "cairo" &&
item.to?.toLowerCase() === "aswan"
);

}

return true;

})
.filter(item => {

if(filter === "All") return true;

return item.type
?.toLowerCase()
.includes(filter.toLowerCase());

});



return(

<div className="p-10">

<Helmet>

<title>

Transport Booking | Aswan ⇄ Cairo Bus Train Private Car

</title>

<meta

name="description"

content="Book transport between Aswan and Cairo by bus, train or private car with flexible one-way or round-trip options."

/>

</Helmet>



<h1 className="text-3xl font-bold text-blue-900 mb-6">

{direction==="aswan-cairo"

?"Aswan → Cairo Transport"

:"Cairo → Aswan Transport"}

</h1>



{/* Direction Buttons */}

<div className="flex gap-3 mb-6 flex-wrap">

<button

onClick={()=>setDirection("aswan-cairo")}

className={`px-4 py-2 rounded ${
direction==="aswan-cairo"
?"bg-blue-900 text-white"
:"bg-gray-200"
}`}
>

Aswan → Cairo

</button>


<button

onClick={()=>setDirection("cairo-aswan")}

className={`px-4 py-2 rounded ${
direction==="cairo-aswan"
?"bg-blue-900 text-white"
:"bg-gray-200"
}`}
>

Cairo → Aswan

</button>

</div>



{/* Trip Type */}

<div className="flex gap-3 mb-6 flex-wrap">

<button

onClick={()=>setTripType("oneway")}

className={`px-4 py-2 rounded ${
tripType==="oneway"
?"bg-orange-500 text-white"
:"bg-gray-200"
}`}
>

One Way

</button>


<button

onClick={()=>setTripType("roundtrip")}

className={`px-4 py-2 rounded ${
tripType==="roundtrip"
?"bg-orange-500 text-white"
:"bg-gray-200"
}`}
>

Round Trip

</button>

</div>



{/* Search Box */}

<div className="bg-gray-100 p-6 rounded-xl mb-8 flex flex-wrap gap-4">

<input

type="date"

className="border p-2 rounded"

value={date}

onChange={(e)=>setDate(e.target.value)}

/>


{tripType==="roundtrip"&&(

<input

type="date"

className="border p-2 rounded"

value={returnDate}

onChange={(e)=>setReturnDate(e.target.value)}

/>

)}


<input

type="number"

placeholder="Passengers"

className="border p-2 rounded"

value={passengers}

onChange={(e)=>setPassengers(e.target.value)}

/>


<button

onClick={()=>setSearchClicked(true)}

className="bg-blue-900 text-white px-6 py-2 rounded"

>

Search

</button>

</div>



{/* Filters */}

<div className="flex gap-3 mb-8 flex-wrap">

{["All","Bus","Train","Car"].map(type=>(

<button

key={type}

onClick={()=>setFilter(type)}

className={`px-4 py-2 rounded ${
filter===type
?"bg-blue-900 text-white"
:"bg-gray-200"
}`}
>

{type==="Car"?"Private Car":type}

</button>

))}

</div>



{/* Results */}

{!searchClicked?(

<p className="text-gray-500 mb-6">

Please select trip details then click search

</p>

):( 

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{filteredTransport.map(item=>(

<Link key={item.id} to={`/transport/${item.id}`}>

<div className="shadow-lg rounded-xl overflow-hidden hover:scale-105 transition">

<img

src={
item.images?.[0] ||
item.image ||
"/placeholder.jpg"
}

alt={item.company}

className="h-52 w-full object-cover"

/>


<div className="p-4">

<h2 className="text-xl font-bold">

{item.company}

</h2>


<p className="text-gray-500">

{direction==="aswan-cairo"

?"Aswan → Cairo"

:"Cairo → Aswan"}

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