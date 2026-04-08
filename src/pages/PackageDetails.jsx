import { useEffect, useState, useContext } from "react";

import { doc, getDoc, collection, addDoc } from "firebase/firestore";

import { useParams, useNavigate } from "react-router-dom";

import { db } from "../firebase";

import WhatsAppButton from "../components/WhatsAppButton";

import { CartContext } from "../context/CartContext";

import { AuthContext } from "../context/AuthContext";


function PackageDetails() {

const { id } = useParams();

const navigate = useNavigate();

const { user } = useContext(AuthContext);

const { addToCart } = useContext(CartContext);

const [offer, setOffer] = useState(null);

const [name, setName] = useState("");

const [phone, setPhone] = useState("");

const [date, setDate] = useState("");

const [guests, setGuests] = useState("");


// تحميل العرض

useEffect(() => {

const fetchOffer = async () => {

const docRef = doc(db, "offers", id);

const docSnap = await getDoc(docRef);

if (docSnap.exists()) {

setOffer(docSnap.data());

}

};

fetchOffer();

}, [id]);


// حماية العمليات قبل الحجز

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

serviceName: offer.title,

serviceType: "package",

name,

phone,

date,

guests,

price: offer.price,

status: "pending",

createdAt: new Date()

});


alert("Package booked successfully");

};


// إضافة للكارت

const handleAddToCart = () => {

if (!checkAuthBeforeBooking()) return;

addToCart({

name: offer.title,

price: offer.price

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


if (!offer) return <p>Loading...</p>;


return (

<div className="p-10 max-w-5xl mx-auto">

<img
src={offer.image}
className="w-full h-[400px] object-cover rounded-xl"
alt=""
/>


<h1 className="text-3xl font-bold mt-6">

{offer.title}

</h1>


<p className="text-gray-500 mt-2">

Duration: {offer.duration}

</p>


<div className="mt-4 space-y-2">

<p>

<strong>Hotel:</strong> {offer.hotel}

</p>


<p>

<strong>Transport:</strong> {offer.transport}

</p>


<p>

<strong>Trips Included:</strong> {offer.trips}

</p>


<p>

<strong>Food:</strong> {offer.food}

</p>

</div>


<p className="text-orange-500 text-xl mt-4">

${offer.price}

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

Book this package

</h2>


<WhatsAppButton serviceName={offer.title} />


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

export default PackageDetails;