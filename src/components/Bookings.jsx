import { useEffect, useState } from "react";

import {
collection,
deleteDoc,
doc,
updateDoc,
onSnapshot
} from "firebase/firestore";

import { db } from "../firebase";


function Bookings(){

const [bookings,setBookings]=useState([]);

const notificationSound = new Audio("/notification.mp3");


/*
طلب إذن الإشعارات
*/

useEffect(()=>{

if("Notification" in window){

if(Notification.permission !== "granted"){

Notification.requestPermission();

}

}

},[]);


/*
Realtime Firestore listener
*/

useEffect(()=>{

const unsubscribe = onSnapshot(

collection(db,"bookings"),

(snapshot)=>{

const newBookings = snapshot.docs.map(doc=>({

id:doc.id,
...doc.data()

}));


// تشغيل إشعار عند وصول حجز جديد فقط

if(newBookings.length > bookings.length){

try{

notificationSound.play();

}catch(e){}


if(Notification.permission === "granted"){

new Notification("New Booking Received!",{

body:"A new reservation has been added"

});

}

}


setBookings(newBookings);

}

);


return ()=>unsubscribe();

},[bookings.length]);


const confirmBooking=async(id)=>{

await updateDoc(doc(db,"bookings",id),{

status:"confirmed"

});

};


const deleteBooking=async(id)=>{

await deleteDoc(doc(db,"bookings",id));

};


return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">

All Bookings

</h1>


{bookings.length === 0 && (

<p className="text-gray-500">

No bookings yet

</p>

)}


{bookings.map(item=>(

<div
key={item.id}
className="shadow-lg rounded-xl p-6 mb-5 bg-white border"
>

<h3 className="font-bold text-lg">

Customer: {item.name || "N/A"}

</h3>


<p>

Phone: {item.phone || "N/A"}

</p>


<p>

Service: {item.serviceName || "N/A"}

</p>


<p>

Type: {item.serviceType || "N/A"}

</p>


<p>

Price: ${item.price || 0}

</p>


{/* HOTEL */}

{item.serviceType === "hotel" && (

<>

{item.checkIn && <p>Check-in: {item.checkIn}</p>}

{item.checkOut && <p>Check-out: {item.checkOut}</p>}

{item.nights && <p>Nights: {item.nights}</p>}

{item.guests && <p>Guests: {item.guests}</p>}

</>

)}


{/* TEMPLE */}

{item.serviceType === "temple" && (

<>

{item.visitDate && (

<p>

Visit Date: {item.visitDate}

</p>

)}

</>

)}


{/* TRANSPORT */}

{item.serviceType === "transport" && (

<>

{item.from && <p>From: {item.from}</p>}

{item.to && <p>To: {item.to}</p>}

{item.travelDate && <p>Travel Date: {item.travelDate}</p>}

{item.guests && <p>Passengers: {item.guests}</p>}

</>

)}


{/* CREATED DATE */}

{item.createdAt && (

<p>

Created at:

{" "}

{new Date(

item.createdAt.seconds * 1000

).toLocaleDateString()}

</p>

)}


<p
className={`font-bold mt-2 ${
item.status === "confirmed"
? "text-green-600"
: "text-orange-500"
}`}
>

Status: {item.status || "pending"}

</p>


<div className="flex gap-2 mt-4">

<button
onClick={()=>confirmBooking(item.id)}
className="bg-green-600 text-white px-4 py-2 rounded"
>

Confirm

</button>


<button
onClick={()=>deleteBooking(item.id)}
className="bg-red-600 text-white px-4 py-2 rounded"
>

Delete

</button>

</div>

</div>

))}

</div>

);

}


export default Bookings;