import { useEffect, useState, useContext } from "react";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import WhatsAppButton from "../components/WhatsAppButton";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { convertUSDToEGP } from "../utils/currencyConverter";

function TempleDetails() {

const { id } = useParams();
const navigate = useNavigate();

const { user } = useContext(AuthContext);
const { addToCart } = useContext(CartContext);

const [temple, setTemple] = useState(null);

const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [date, setDate] = useState("");

const [priceEGP, setPriceEGP] = useState(null);


// تحميل بيانات المعبد

useEffect(() => {

const fetchTemple = async () => {

const docRef = doc(db, "temples", id);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
setTemple(docSnap.data());
}

};

fetchTemple();

}, [id]);


// تحويل السعر تلقائي بعد تحميل البيانات

useEffect(() => {

const convertPrice = async () => {

if (temple?.price) {

const egp = await convertUSDToEGP(temple.price);

setPriceEGP(egp);

}

};

convertPrice();

}, [temple]);


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

if (!name || !phone || !date) {

alert("Please fill all fields");
return;

}

await addDoc(collection(db, "bookings"), {

userId: user.uid,
userEmail: user.email,

name,
phone,

serviceType: "temple",
serviceName: temple.name,

price: temple.price,

visitDate: date,

status: "pending",

createdAt: new Date()

});

alert("Temple booking request sent");

setName("");
setPhone("");
setDate("");

};


// إضافة للكارت

const handleAddToCart = () => {

if (!checkAuthBeforeBooking()) return;

addToCart({

name: temple.name,
price: temple.price,
type: "temple"

});

alert("Added to cart");

};


// واتساب

const handleWhatsAppBooking = () => {

const phoneNumber = "201034022992";

const message = `
عايز احجز زيارة معبد:

اسم المعبد: ${temple.name}
السعر: ${temple.price} دولار
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
temple.price
);


// حفظ بيانات الحجز مؤقتًا

localStorage.setItem(
"pendingBooking",
JSON.stringify({

userId: user.uid,
userEmail: user.email,

serviceType: "temple",
serviceName: temple.name,

name,
phone,

visitDate: date,

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


if (!temple) return <p>Loading...</p>;


return (

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


{/* السعر بالدولار */}

<p className="text-orange-500 text-xl mt-4">
${temple.price} / ticket
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
Book this temple visit
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


<WhatsAppButton serviceName={temple.name} />

</div>

</div>

);

}

export default TempleDetails;