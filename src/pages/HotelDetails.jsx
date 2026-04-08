import { useEffect, useState, useContext } from "react";

import { doc, getDoc, collection, addDoc } from "firebase/firestore";

import { useParams, useNavigate } from "react-router-dom";

import { db } from "../firebase";

import WhatsAppButton from "../components/WhatsAppButton";

import { CartContext } from "../context/CartContext";

import { AuthContext } from "../context/AuthContext";


function HotelDetails() {

const { user } = useContext(AuthContext);

const navigate = useNavigate();

const { id } = useParams();

const { addToCart } = useContext(CartContext);

const [hotel, setHotel] = useState(null);

const [name, setName] = useState("");

const [phone, setPhone] = useState("");

const [checkIn, setCheckIn] = useState("");

const [checkOut, setCheckOut] = useState("");

const [guests, setGuests] = useState("");

const [totalPrice, setTotalPrice] = useState(0);

const [nights, setNights] = useState(0);


// تحميل الفندق

useEffect(() => {

const fetchHotel = async () => {

const docRef = doc(db, "hotels", id);

const docSnap = await getDoc(docRef);

if (docSnap.exists()) {

setHotel(docSnap.data());

}

};

fetchHotel();

}, [id]);


// حساب عدد الليالي والسعر

useEffect(() => {

if (checkIn && checkOut && hotel) {

const start = new Date(checkIn);

const end = new Date(checkOut);

const diffTime = end - start;

const diffDays = diffTime / (1000 * 60 * 60 * 24);

if (diffDays > 0) {

setNights(diffDays);

setTotalPrice(diffDays * hotel.price);

}

}

}, [checkIn, checkOut, hotel]);


// حماية الحجز

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

if (!name || !phone || !checkIn || !checkOut || !guests) {

alert("Please fill all booking details");

return;

}


await addDoc(collection(db, "bookings"), {

userId: user.uid,

userEmail: user.email,

name,

phone,

serviceName: hotel.name,

serviceType: "hotel",

price: totalPrice || hotel.price,

checkIn,

checkOut,

guests,

nights,

status: "pending",

createdAt: new Date()

});


alert("Booking request sent successfully");


setName("");

setPhone("");

setCheckIn("");

setCheckOut("");

setGuests("");

setTotalPrice(0);

setNights(0);

};


// إضافة للكارت

const handleAddToCart = () => {

if (!checkAuthBeforeBooking()) return;

addToCart({

name: hotel.name,

price: totalPrice || hotel.price

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


if (!hotel) return <p>Loading...</p>;


return (

<div className="p-10 max-w-5xl mx-auto">

<img
src={hotel.image}
className="w-full h-[400px] object-cover rounded-xl"
alt=""
/>


<h1 className="text-3xl font-bold mt-6">

{hotel.name}

</h1>


<p className="mt-2 text-gray-600">

{hotel.location}

</p>


<p className="mt-4">

{hotel.description}

</p>


<p className="text-orange-500 text-xl mt-4">

${hotel.price} / night

</p>


<div className="mt-10 bg-gray-100 p-6 rounded-xl">

<h2 className="text-2xl font-bold mb-4">

Book this hotel

</h2>


<input
placeholder="Your name"
value={name}
className="border p-2 rounded w-full mb-3"
onChange={(e) => setName(e.target.value)}
/>


<input
placeholder="Phone number"
value={phone}
className="border p-2 rounded w-full mb-3"
onChange={(e) => setPhone(e.target.value)}
/>


<input
type="date"
className="border p-2 rounded w-full mb-3"
onChange={(e) => setCheckIn(e.target.value)}
/>


<input
type="date"
className="border p-2 rounded w-full mb-3"
onChange={(e) => setCheckOut(e.target.value)}
/>


<input
placeholder="Guests number"
value={guests}
className="border p-2 rounded w-full mb-3"
onChange={(e) => setGuests(e.target.value)}
/>


{nights > 0 && (

<div className="bg-white p-4 rounded-lg mb-3">

<p className="text-gray-600">

Nights: {nights}

</p>


<p className="text-green-600 font-bold text-xl">

Total Price: ${totalPrice}

</p>


<button
onClick={handleAddToCart}
className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl w-full"
>

Add to Cart

</button>

</div>

)}


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


<WhatsAppButton serviceName={hotel.name} />

</div>

</div>

);

}

export default HotelDetails;