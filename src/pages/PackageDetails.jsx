import { useEffect, useState, useContext } from "react";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

import { db } from "../firebase";
import WhatsAppButton from "../components/WhatsAppButton";

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

import { convertUSDToEGP } from "../utils/currencyConverter";
import ImageGallery from "../components/ImageGallery";

function PackageDetails() {

const { id } = useParams();
const navigate = useNavigate();

const { user } = useContext(AuthContext);
const { addToCart } = useContext(CartContext);

const [offer, setOffer] = useState(null);
const [currentImageIndex, setCurrentImageIndex] = useState(0);

const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [date, setDate] = useState("");
const [guests, setGuests] = useState("");

const [priceEGP, setPriceEGP] = useState(null);


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


// تحويل السعر تلقائي بعد تحميل البيانات

useEffect(() => {

const convertPrice = async () => {

if (offer?.price) {

const egp = await convertUSDToEGP(offer.price);

setPriceEGP(egp);

}

};

convertPrice();

}, [offer]);


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

setName("");
setPhone("");
setDate("");
setGuests("");

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


// واتساب ديناميكي

const handleWhatsAppBooking = () => {

const phoneNumber = "201034022992";

const message = `
عايز احجز العرض السياحي:

اسم العرض: ${offer.title}
السعر: ${offer.price} دولار
عدد الأفراد: ${guests || 1}
التاريخ: ${date || "غير محدد"}
`;

window.open(

`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,

"_blank"

);

};


// الدفع Paymob بعد الإصلاح الكامل

const handlePayment = async () => {


if (!checkAuthBeforeBooking()) return;

// ✅ منع الدفع بدون إدخال البيانات

if (!name || !phone || !checkIn || !checkOut || !guests) {

alert("Please fill booking details first");

return;

}


// تحويل السعر من دولار إلى جنيه

const priceConverted = await convertUSDToEGP(
offer.price
);


// حفظ بيانات الحجز مؤقتًا

localStorage.setItem(
"pendingBooking",
JSON.stringify({

userId: user.uid,
userEmail: user.email,

serviceType: "package",
serviceName: offer.title,

name,
phone,
date,
guests,

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


if (!offer) return <p>Loading...</p>;


return (

<div className="p-10 max-w-5xl mx-auto">

<ImageGallery
images={offer.images}
fallback={offer.image}
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


{/* السعر بالدولار */}

<p className="text-orange-500 text-xl mt-4">
${offer.price}
</p>


{/* السعر بالمصري */}

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
Book this package
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


<WhatsAppButton serviceName={offer.title} />

</div>

</div>

);

}

export default PackageDetails;