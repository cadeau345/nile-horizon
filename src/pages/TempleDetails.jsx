import { useEffect,useState,useContext } from "react";

import { doc,getDoc,collection,addDoc } from "firebase/firestore";

import { useParams } from "react-router-dom";

import { db } from "../firebase";

import WhatsAppButton from "../components/WhatsAppButton";

import { CartContext } from "../context/CartContext";


function TempleDetails(){

const { id } = useParams();

const [temple,setTemple]=useState(null);

const [name,setName]=useState("");

const [phone,setPhone]=useState("");

const [date,setDate]=useState("");

const { addToCart } = useContext(CartContext);


useEffect(()=>{

const fetchTemple=async()=>{

const docRef=doc(db,"temples",id);

const docSnap=await getDoc(docRef);

if(docSnap.exists()){

setTemple(docSnap.data());

}

};

fetchTemple();

},[id]);


const handleBooking=async()=>{

if(!name || !phone || !date){

alert("Please fill all fields");

return;

}


// حماية إضافية لو البيانات مش جاهزة
if(!temple){

alert("Temple data not loaded yet");

return;

}


await addDoc(collection(db,"bookings"),{

name,

phone,

serviceType:"temple",

serviceName: temple.name || "Temple Visit",

price: temple.price || 0,

visitDate: date,

status:"pending",

createdAt:new Date()

});


alert("Temple booking request sent");


// reset form
setName("");

setPhone("");

setDate("");

};


if(!temple) return <p>Loading...</p>;


return(

<div className="p-10 max-w-5xl mx-auto">

<img
src={temple.image}
className="w-full h-[400px] object-cover rounded-xl"
alt=""
/>


<h1 className="text-3xl font-bold mt-6">

{temple.name}

</h1>


<p className="text-gray-600 mt-2">

{temple.location}

</p>


<p className="mt-4">

{temple.description}

</p>


<p className="text-orange-500 text-xl mt-4">

${temple.price} / ticket

</p>


<button
onClick={()=>addToCart({

name:temple.name,

price:temple.price,

type:"temple"

})}
className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl w-full"
>

Add to Cart

</button>


<div className="mt-10 bg-gray-100 p-6 rounded-xl">

<h2 className="text-2xl font-bold mb-4">

Book this temple visit

</h2>


<input
placeholder="Your name"
value={name}
className="border p-2 rounded w-full mb-3"
onChange={(e)=>setName(e.target.value)}
/>


<input
placeholder="Phone number"
value={phone}
className="border p-2 rounded w-full mb-3"
onChange={(e)=>setPhone(e.target.value)}
/>


<input
type="date"
value={date}
className="border p-2 rounded w-full mb-3"
onChange={(e)=>setDate(e.target.value)}
/>


<button
onClick={handleBooking}
className="bg-blue-900 text-white px-6 py-3 rounded-xl w-full"
>

Send booking request

</button>
<a
href="https://accept.paymob.com/api/acceptance/iframes/1029284?payment_token=TEST_TOKEN"
target="_blank"
className="mt-3 block text-center bg-green-600 text-white px-6 py-3 rounded-xl"
>
Pay Online Now
</a>


<WhatsAppButton serviceName={temple.name} />

</div>

</div>

);

}

export default TempleDetails;