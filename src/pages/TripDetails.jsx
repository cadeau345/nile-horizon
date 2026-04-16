import { useEffect, useState, useContext } from "react";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import WhatsAppButton from "../components/WhatsAppButton";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

// ✅ استدعاء محول العملة المركزي
import { convertUSDToEGP } from "../utils/currencyConverter";

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

// ✅ السعر بالمصري للعرض
const [priceEGP, setPriceEGP] = useState(null);


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


// ✅ تحويل السعر تلقائي بعد تحميل الرحلة

useEffect(() => {

const convertPrice = async () => {

if (trip?.price) {

const egp = await convertUSDToEGP(trip.price);

setPriceEGP(egp);

}

};

convertPrice();

}, [trip]);


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


// إرسال الحجز العادي بدون دفع

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

setName("");
setPhone("");
setDate("");
setGuests("");

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


// واتساب

const handleWhatsAppBooking = () => {

const phoneNumber = "201034022992";

const message = `
عايز احجز رحلة:

اسم الرحلة: ${trip.name}
عدد الأشخاص: ${guests || 1}
التاريخ: ${date || "غير محدد"}
السعر: ${trip.price} دولار
`;

window.open(
`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
"_blank"
);

};


// الدفع Paymob بعد التحويل التلقائي

const handlePayment = async () => {


if (!checkAuthBeforeBooking()) return;

// ✅ منع الدفع بدون إدخال البيانات

if (!name || !phone || !checkIn || !checkOut || !guests) {

alert("Please fill booking details first");

return;

}

// تحويل السعر

const priceEGP = await convertUSDToEGP(trip.price);


// حفظ بيانات الحجز

localStorage.setItem(
"pendingBooking",
JSON.stringify({

userId: user.uid,
userEmail: user.email,

serviceType: "trip",
serviceName: trip.name,

name,
phone,
date,
guests,

price: priceEGP

})
);


// إرسال السعر للسيرفر

const response = await fetch(
"http://localhost:5000/pay",
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
price: priceEGP
})
}
);

const data = await response.json();

window.location.href =
`https://accept.paymob.com/api/acceptance/iframes/1029284?payment_token=${data.payment_token}`;

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


{/* ✅ عرض السعر بالدولار والمصري */}

<p className="text-orange-500 text-xl mt-4">
${trip.price}
</p>

{priceEGP && (
<p className="text-green-600 text-sm">
≈ {priceEGP} جنيه مصري
</p>
)}


<button
onClick={handleAddToCart}
className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl w-full"
>
Add to Cart
</button>


<div className="mt-10 bg-gray-100 p-6 rounded-xl">

<h2 className="text-2xl font-bold mb-4">
Book this trip
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
onChange={(e) => setDate(e.target.value)}
/>


<input
placeholder="Guests number"
value={guests}
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
onClick={handleWhatsAppBooking}
className="mt-3 bg-green-500 text-white px-6 py-3 rounded-xl w-full"
>
Book via WhatsApp
</button>


<button
onClick={handlePayment}
className="mt-3 bg-orange-600 text-white px-6 py-3 rounded-xl w-full"
>
Pay Online Now
</button>


<WhatsAppButton serviceName={trip.name} />

</div>

</div>

);

}

export default TripDetails;