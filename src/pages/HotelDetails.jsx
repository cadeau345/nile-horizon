import { useEffect, useState, useContext } from "react";
import {
doc,
getDoc,
collection,
addDoc,
getDocs
} from "firebase/firestore";

import { useParams, useNavigate } from "react-router-dom";

import { db } from "../firebase";

import WhatsAppButton from "../components/WhatsAppButton";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

import { convertUSDToEGP } from "../utils/currencyConverter";

import ImageGallery from "../components/ImageGallery";

import { usePrice } from "../utils/price";
function HotelDetails() {

    const price = usePrice();
const { user } = useContext(AuthContext);
const navigate = useNavigate();
const { id } = useParams();
const { addToCart } = useContext(CartContext);

const [hotel, setHotel] = useState(null);

const [reviews, setReviews] = useState([]);
const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");

const [averageRating, setAverageRating] = useState(null);

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


// تحميل التقييمات

useEffect(() => {

const fetchReviews = async () => {

const snapshot = await getDocs(collection(db, "reviews"));

const filtered = snapshot.docs
.map(doc => doc.data())
.filter(r => r.hotelId === id);

setReviews(filtered);

if (filtered.length > 0) {

const avg =
filtered.reduce((a, b) => a + Number(b.rating), 0)
/
filtered.length;

setAverageRating(avg.toFixed(1));

}

};

fetchReviews();

}, [id]);


// حساب السعر حسب عدد الليالي

useEffect(() => {

if (checkIn && checkOut && hotel) {

const start = new Date(checkIn);
const end = new Date(checkOut);

const diff =
(end - start) /
(1000 * 60 * 60 * 24);

if (diff > 0) {

setNights(diff);

setTotalPrice(diff * hotel.price);

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

alert("يجب تأكيد البريد الإلكتروني");

return false;

}

return true;

};


// إضافة تقييم

const handleAddReview = async () => {

if (!user) {

alert("سجل الدخول أولاً");

return;

}

await addDoc(collection(db, "reviews"), {

hotelId: id,

userId: user.uid,

rating,

comment,

date: new Date()

});

alert("تم إضافة تقييمك");

setComment("");

};


// إرسال الحجز

const handleBooking = async () => {

if (!checkAuthBeforeBooking()) return;

if (!name || !phone || !checkIn || !checkOut || !guests) {

alert("املأ بيانات الحجز");

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

alert("تم إرسال طلب الحجز");

};


// إضافة للكارت

const handleAddToCart = () => {

if (!checkAuthBeforeBooking()) return;

addToCart({

name: hotel.name,

price: totalPrice || hotel.price

});

alert("تمت الإضافة للكارت");

};


// واتساب

const handleWhatsAppBooking = () => {

const message = `

عايز احجز الفندق:

${hotel.name}

عدد الليالي:

${nights || 1}

السعر:

${totalPrice || hotel.price}

`;

window.open(

`https://wa.me/201034022992?text=${encodeURIComponent(message)}`,

"_blank"

);

};


// الدفع

const handlePayment = async () => {

if (!checkAuthBeforeBooking()) return;

const priceConverted = await convertUSDToEGP(

totalPrice || hotel.price

);

localStorage.setItem(

"pendingBooking",

JSON.stringify({

userId: user.uid,

serviceType: "hotel",

serviceName: hotel.name,

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


if (!hotel) return <p>Loading...</p>;

const rooms = hotel.rooms || [];


return (

<div className="max-w-7xl mx-auto px-6 py-10">


{/* HEADER */}

<h1 className="text-4xl font-bold">

{hotel.name}

{averageRating && (

<span className="ml-3 text-yellow-500">

⭐ {averageRating}

</span>

)}

</h1>


<p className="text-gray-500 mb-6">

{hotel.location}

</p>



{/* GALLERY + SIDEBAR */}

<div className="grid lg:grid-cols-3 gap-8">


<div className="lg:col-span-2">


<ImageGallery

images={hotel.images}

fallback={hotel.image}

/>


<p className="mt-6 text-gray-700">

{hotel.description}

</p>




{/* ROOMS TABLE */}


{hotel.locationMap && (

<div className="mt-10">

<h2 className="text-2xl font-bold mb-4">
Location on map
</h2>

<iframe
src={hotel.locationMap}
width="100%"
height="400"
loading="lazy"
className="rounded-xl border"
/>

</div>

)}
{rooms.length > 0 && (

<div className="mt-10 border rounded-xl">


<div className="grid grid-cols-5 bg-blue-600 text-white p-3">

نوع الغرفة

عدد الضيوف

السعر

المميزات

اختيار

</div>



{rooms.map((room, i) => (

<div

key={i}

className="grid grid-cols-5 p-3 border-t"

>


<span>{room.name}</span>

<span>{room.guests}</span>

<span>{price(room.price)}</span>

<span>

{room.features?.join(" + ")}

</span>


<button

onClick={() =>

setTotalPrice(room.price * (nights || 1))

}

className="bg-blue-600 text-white rounded"

>

اختيار

</button>

</div>

))}

</div>

)}



{/* REVIEWS */}


<div className="mt-12">


<h2 className="text-2xl font-bold mb-4">

تقييمات الضيوف

</h2>


{reviews.map((r, i) => (

<div

key={i}

className="bg-gray-100 p-3 rounded mb-2"

>

⭐ {r.rating}

<p>{r.comment}</p>

</div>

))}



<select

value={rating}

onChange={(e) => setRating(e.target.value)}

className="border p-2 w-full mb-2"

>

<option>5</option>

<option>4</option>

<option>3</option>

<option>2</option>

<option>1</option>

</select>


<textarea

placeholder="اكتب رأيك"

value={comment}

onChange={(e) => setComment(e.target.value)}

className="border p-2 w-full mb-2"

/>


<button

onClick={handleAddReview}

className="bg-blue-600 text-white px-4 py-2 rounded"

>

إضافة تقييم

</button>


</div>


</div>



{/* SIDEBAR */}


<div className="bg-yellow-400 p-6 rounded-xl sticky top-20">


<input

placeholder="الاسم"

value={name}

onChange={(e) => setName(e.target.value)}

className="border p-2 w-full mb-2"

/>


<input

placeholder="الهاتف"

value={phone}

onChange={(e) => setPhone(e.target.value)}

className="border p-2 w-full mb-2"

/>


<input

type="date"

onChange={(e) => setCheckIn(e.target.value)}

className="border p-2 w-full mb-2"

/>


<input

type="date"

onChange={(e) => setCheckOut(e.target.value)}

className="border p-2 w-full mb-2"

/>


<input

placeholder="عدد الأشخاص"

value={guests}

onChange={(e) => setGuests(e.target.value)}

className="border p-2 w-full mb-2"

/>


<button

onClick={handleAddToCart}

className="bg-green-600 text-white w-full p-2 mb-2"

>

Add to cart

</button>


<button

onClick={handleBooking}

className="bg-blue-900 text-white w-full p-2 mb-2"

>

Send booking

</button>


<button

onClick={handleWhatsAppBooking}

className="bg-green-500 text-white w-full p-2 mb-2"

>

WhatsApp booking

</button>


<button

onClick={handlePayment}

className="bg-orange-600 text-white w-full p-2"

>

Pay now

</button>


<WhatsAppButton serviceName={hotel.name} />


</div>


</div>


</div>

);

}


export default HotelDetails;