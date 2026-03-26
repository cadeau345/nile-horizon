import { useEffect, useState } from "react";

import { doc, getDoc, collection, addDoc } from "firebase/firestore";

import { useParams } from "react-router-dom";

import { db } from "../firebase";

function TransportDetails() {

const { id } = useParams();

const [transport,setTransport] = useState(null);

const [name,setName] = useState("");

const [phone,setPhone] = useState("");

const [date,setDate] = useState("");

const [passengers,setPassengers] = useState("");


useEffect(()=>{

const fetchTransport = async ()=>{

const docRef = doc(db,"transport",id);

const docSnap = await getDoc(docRef);

if(docSnap.exists()){

setTransport(docSnap.data());

}

};

fetchTransport();

},[id]);


const handleBooking = async ()=>{

if(!name || !phone || !date || !passengers){

alert("Please fill all fields");

return;

}

await addDoc(collection(db,"transportBookings"),{

transportCompany: transport.company,

from: transport.from,

to: transport.to,

name,

phone,

date,

passengers,

createdAt: new Date()

});

alert("Transport booking request sent successfully");

};


if(!transport) return <p>Loading...</p>;


return(

<div className="p-10 max-w-4xl mx-auto">

<img

src={transport.image}

className="w-full h-[400px] object-cover rounded-xl"

/>


<h1 className="text-3xl font-bold mt-6">

{transport.company}

</h1>


<p className="text-gray-600 mt-2">

{transport.from} → {transport.to}

</p>


<p className="text-orange-500 text-xl mt-4">

${transport.price} / seat

</p>


<div className="mt-10 bg-gray-100 p-6 rounded-xl">

<h2 className="text-2xl font-bold mb-4">

Book this transport

</h2>


<input

placeholder="Your name"

className="border p-2 rounded w-full mb-3"

onChange={(e)=>setName(e.target.value)}

/>


<input

placeholder="Phone number"

className="border p-2 rounded w-full mb-3"

onChange={(e)=>setPhone(e.target.value)}

/>


<input

type="date"

className="border p-2 rounded w-full mb-3"

onChange={(e)=>setDate(e.target.value)}

/>


<input

type="number"

placeholder="Passengers"

className="border p-2 rounded w-full mb-3"

onChange={(e)=>setPassengers(e.target.value)}

/>


<button

onClick={handleBooking}

className="bg-blue-900 text-white px-6 py-3 rounded-xl w-full"

>

Send booking request

</button>

</div>

</div>

);

}

export default TransportDetails;