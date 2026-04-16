import { useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {

const navigate = useNavigate();

useEffect(() => {

const saveBooking = async () => {

try {

const bookingData = JSON.parse(
localStorage.getItem("pendingBooking")
);

if (!bookingData) return;

await addDoc(collection(db, "bookings"), {

...bookingData,

status: "paid",

createdAt: new Date()

});

localStorage.removeItem("pendingBooking");

alert("Payment successful 🎉 Booking confirmed");

navigate("/");

} catch (error) {

console.log(error);

}

};

saveBooking();

}, []);


return (

<div className="flex flex-col items-center justify-center h-screen">

<h1 className="text-3xl font-bold text-green-600">

Payment Successful ✅

</h1>

<p className="mt-3">

Your booking has been confirmed.

</p>

</div>

);

}

export default PaymentSuccess;