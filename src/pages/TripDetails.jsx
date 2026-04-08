import { useEffect, useState, useContext } from "react";

import { doc, getDoc, collection, addDoc } from "firebase/firestore";

import { useParams, useNavigate } from "react-router-dom";

import { db } from "../firebase";

import WhatsAppButton from "../components/WhatsAppButton";

import { CartContext } from "../context/CartContext";

import { AuthContext } from "../context/AuthContext";


function TripDetails() {

const { id } = useParams();

const navigate = useNavigate();

const { user } = useContext(AuthContext);

const { addToCart } = useContext(CartContext);

const [trip, setTrip] = useState(null);

const [name, setName] = useState("");

const [phone, setPhone] = useState("");

const [date, setDate] = useState("");

const [guests, setGuests] = useState("");


// تحميل بيانات الرحلة

useEffect(() => {

const fetchTrip = async () => {

const docRef = doc(db, "trips", id);

const docSnap = await getDoc(docRef);

if (docSnap.exists()) {

setTrip(docSnap.data());

}

};

fetchTrip();

}, [id]);


// حماية العمليات

const checkAuthBeforeBooking = () => {

if (!user) {

alert("يجب تسجيل الدخول أولاً");

navigate("/customer-login");

return false;

}

if (!user.emailVerified) {

alert("يجب تأكيد البريد الإلكتروني أولاً");

return false;

}

return true;

};


// إرسال الحجز

const handleBooking = async () => {

if (!checkAuthBeforeBooking()) return;

if (!name || !phone) {

alert("Please fill required fields");

return;

}

await addDoc(collection(db, "bookings"), {

userId: user.uid,

userEmail: user.email,

serviceType: "trip",

serviceName: trip.name,

name,

phone,

date,

guests,

price: trip.price,

status: "pending",

createdAt: new Date()

});


alert("Trip booked successfully");

};


// إضافة للكارت

const handleAddToCart = () => {

if (!checkAuthBeforeBooking()) return;

addToCart({

name: trip.name,

price: trip.price,

type: "trip"

});

alert("Added to cart");

};


// الدفع

const handlePayment = () => {

if (!checkAuthBeforeBooking()) return;

window.open(

"https://accept.paymob.com/api/acceptance/iframes/1029284?payment_token=TEST_TOKEN",

"_blank"

);

};


if (!trip) return <p>Loading...</p>;


return (

<div className="p-10 max-w-5xl mx-auto">

<img
src={trip.image}
className="w-full h-[400px] object-cover rounded-xl"
alt=""
/>


<h1 className="text-3xl font-bold mt-6">

{trip.name}

</h1>


<p className="text-gray-500 mt-2">

Duration: {trip.duration}

</p>


<p className="mt-4">

{trip.description}

</p>


<p className="text-orange-500 text-xl mt-4">

${trip.price}

</p>


<button
onClick={handleAddToCart}
className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl w-full"
>

Add to Cart

</button>


{/* Booking Form */}

<div className="mt-10 bg-gray-100 p-6 rounded-xl">

<h2 className="text-2xl font-bold mb-4">

Book this trip

</h2>


<WhatsAppButton serviceName={trip.name} />


<input
placeholder="Your name"
className="border p-2 rounded w-full mb-3"
onChange={(e) => setName(e.target.value)}
/>


<input
placeholder="Phone number"
className="border p-2 rounded w-full mb-3"
onChange={(e) => setPhone(e.target.value)}
/>


<input
type="date"
lang="en"
className="border p-2 rounded w-full mb-3"
onChange={(e) => setDate(e.target.value)}
/>


<input
placeholder="Guests number"
className="border p-2 rounded w-full mb-3"
onChange={(e) => setGuests(e.target.value)}
/>


<button
onClick={handleBooking}
className="bg-blue-900 text-white px-6 py-3 rounded-xl w-full"
>

Send booking request

</button>


<button
onClick={handlePayment}
className="mt-3 block text-center bg-green-600 text-white px-6 py-3 rounded-xl w-full"
>

Pay Online Now

</button>

</div>

</div>

);

}

export default TripDetails;