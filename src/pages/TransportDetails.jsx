import { useEffect, useState, useContext } from "react";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import WhatsAppButton from "../components/WhatsAppButton";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { convertUSDToEGP } from "../utils/currencyConverter";

function TransportDetails() {

const { id } = useParams();
const navigate = useNavigate();

const { user } = useContext(AuthContext);
const { addToCart } = useContext(CartContext);

const [transport, setTransport] = useState(null);

const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [date, setDate] = useState("");
const [guests, setGuests] = useState("");

const [loading, setLoading] = useState(false);
const [priceEGP, setPriceEGP] = useState(null);


// تحميل البيانات

useEffect(() => {

const fetchTransport = async () => {

const docRef = doc(db, "transport", id);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
setTransport(docSnap.data());
} else {
alert("Transport not found");
}

};

fetchTransport();

}, [id]);


// ✅ تحويل السعر تلقائي بعد تحميل البيانات

useEffect(() => {

const convertPrice = async () => {

if (transport?.price) {

const egp = await convertUSDToEGP(transport.price);

setPriceEGP(egp);

}

};

convertPrice();

}, [transport]);


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

if (!transport) {
alert("Transport data not loaded yet");
return;
}

if (!name || !phone || !date || !guests) {
alert("Please fill all booking fields");
return;
}

try {

setLoading(true);

const serviceName = transport.company || transport.name || "Transport Service";
const transportType = transport.type || "Transport";
const fromLocation = transport.from || "Unknown";
const toLocation = transport.to || "Unknown";
const priceValue = transport.price || 0;

await addDoc(collection(db, "bookings"), {

userId: user.uid,
userEmail: user.email,

name,
phone,

serviceType: "transport",
serviceName,
transportType,

from: fromLocation,
to: toLocation,

price: priceValue,
travelDate: date,
guests,

status: "pending",

createdAt: new Date()

});

alert("Transport booking request sent successfully");

setName("");
setPhone("");
setDate("");
setGuests("");

} catch (error) {

console.error(error);
alert("Booking failed — please try again");

} finally {

setLoading(false);

}

};


// إضافة للكارت

const handleAddToCart = () => {

if (!checkAuthBeforeBooking()) return;

addToCart({

name: transport.company || transport.name,
price: transport.price,
type: "transport"

});

alert("Added to cart");

};


// واتساب

const handleWhatsAppBooking = () => {

const phoneNumber = "201034022992";

const message = `
عايز احجز وسيلة نقل:

الشركة: ${transport.company || transport.name}
من: ${transport.from}
إلى: ${transport.to}
عدد الركاب: ${guests || 1}
التاريخ: ${date || "غير محدد"}
السعر: ${transport.price} دولار
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

const priceConverted = await convertUSDToEGP(
transport.price
);

localStorage.setItem(
"pendingBooking",
JSON.stringify({

userId: user.uid,
userEmail: user.email,

serviceType: "transport",
serviceName: transport.company || transport.name,

name,
phone,

from: transport.from,
to: transport.to,

travelDate: date,
guests,

price: priceConverted

})
);

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


if (!transport) return <p>Loading...</p>;


return (

<div className="p-10 max-w-5xl mx-auto">

<img
src={transport.image}
className="w-full h-[400px] object-cover rounded-xl"
alt=""
/>

<h1 className="text-3xl font-bold mt-6">
{transport.company || transport.name}
</h1>

<p className="text-gray-600 mt-2">
{transport.from} → {transport.to}
</p>

<p className="mt-3">
Type: {transport.type}
</p>


{/* السعر بالدولار */}

<p className="text-orange-500 text-xl mt-4">
${transport.price} / seat
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
Book this transport
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
value={date}
className="border p-2 rounded w-full mb-3"
onChange={(e) => setDate(e.target.value)}
/>

<input
placeholder="Passengers number"
value={guests}
className="border p-2 rounded w-full mb-3"
onChange={(e) => setGuests(e.target.value)}
/>

<button
onClick={handleBooking}
disabled={loading}
className="bg-blue-900 text-white px-6 py-3 rounded-xl w-full"
>
{loading ? "Sending..." : "Send booking request"}
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

<WhatsAppButton serviceName={transport.company || transport.name} />

</div>

</div>

);

}

export default TransportDetails;