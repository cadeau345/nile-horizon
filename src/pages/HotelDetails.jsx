import { useEffect, useState, useContext } from "react";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import WhatsAppButton from "../components/WhatsAppButton";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { convertUSDToEGP } from "../utils/currencyConverter";

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

const [priceEGP, setPriceEGP] = useState(null);


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


// حساب السعر حسب عدد الليالي

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


// تحويل السعر للمصري

useEffect(() => {

const convertPrice = async () => {

if (hotel?.price) {

const egp = await convertUSDToEGP(
totalPrice || hotel.price
);

setPriceEGP(egp);

}

};

convertPrice();

}, [hotel, totalPrice]);


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


// إرسال الحجز بدون دفع

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


// واتساب

const handleWhatsAppBooking = () => {

const phoneNumber = "201034022992";

const message = `
عايز احجز الفندق:

اسم الفندق: ${hotel.name}
عدد الليالي: ${nights || 1}
السعر: ${totalPrice || hotel.price} دولار
`;

window.open(
`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
"_blank"
);

};


// الدفع Paymob

const handlePayment = async () => {


if (!checkAuthBeforeBooking()) return;

// ✅ منع الدفع بدون إدخال البيانات

if (!name || !phone || !checkIn || !checkOut || !guests) {

alert("Please fill booking details first");

return;

}

// تحويل السعر تلقائي للمصري

const priceConverted = await convertUSDToEGP(
totalPrice || hotel.price
);


// حفظ بيانات الحجز مؤقتًا

localStorage.setItem(
"pendingBooking",
JSON.stringify({

userId: user.uid,
userEmail: user.email,

serviceType: "hotel",
serviceName: hotel.name,

name,
phone,

checkIn,
checkOut,
guests,
nights,

price: priceConverted

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
price: priceConverted
})
}
);

const data = await response.json();

window.location.href =
`https://accept.paymob.com/api/acceptance/iframes/1029284?payment_token=${data.payment_token}`;

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


{priceEGP && (

<p className="text-green-600 text-sm">

≈ {priceEGP} جنيه مصري

</p>

)}


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


<WhatsAppButton serviceName={hotel.name} />

</div>

</div>

);

}

export default HotelDetails;