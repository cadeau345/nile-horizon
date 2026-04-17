import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { auth } from "../firebase";

import { signOut, onAuthStateChanged } from "firebase/auth";

import AddHotel from "../components/AddHotel";

import AddTransport from "../components/AddTransport";

import AddTrip from "../components/AddTrip";

import AddPackage from "../components/AddPackage";

import AddTemple from "../components/AddTemple";

import Bookings from "../components/Bookings";
import Users from "../components/Users";


function Admin() {

const navigate = useNavigate();

const [tab, setTab] = useState("hotel");


// حماية صفحة الأدمن بشكل صحيح

useEffect(() => {

const unsubscribe = onAuthStateChanged(auth, (user) => {

if (!user) {

navigate("/customer-login");

return;

}


// ضع هنا إيميل الأدمن الحقيقي فقط

if (user.email !== "cadeau200510@email.com") {

navigate("/");

}

});


return () => unsubscribe();

}, [navigate]);


// Logout function

const handleLogout = async () => {

await signOut(auth);

navigate("/customer-login");

};


return (

<div className="p-10">

<div className="flex justify-between items-center mb-6">

<h1 className="text-3xl font-bold">

Admin Dashboard

</h1>
<button
onClick={()=>setTab("users")}
className="bg-purple-600 text-white px-4 py-2 rounded"
>

Users

</button>


<button

onClick={handleLogout}

className="bg-red-600 text-white px-4 py-2 rounded"

>

Logout

</button>

</div>


<div className="flex gap-4 mb-8 flex-wrap">

<button
onClick={() => setTab("hotel")}
className="bg-blue-900 text-white px-4 py-2 rounded"
>

Add Hotel

</button>


<button
onClick={() => setTab("transport")}
className="bg-blue-900 text-white px-4 py-2 rounded"
>

Add Transport

</button>


<button
onClick={() => setTab("trip")}
className="bg-blue-900 text-white px-4 py-2 rounded"
>

Add Trip

</button>


<button
onClick={() => setTab("package")}
className="bg-blue-900 text-white px-4 py-2 rounded"
>

Add Package

</button>


<button
onClick={() => setTab("temple")}
className="bg-blue-900 text-white px-4 py-2 rounded"
>

Add Temple

</button>


<button
onClick={() => setTab("bookings")}
className="bg-indigo-600 text-white px-4 py-2 rounded"
>

Bookings

</button>

</div>


{tab === "hotel" && <AddHotel />}

{tab === "transport" && <AddTransport />}

{tab === "trip" && <AddTrip />}

{tab === "package" && <AddPackage />}

{tab === "temple" && <AddTemple />}

{tab === "bookings" && <Bookings />}
{tab === "users" && <Users />}

</div>

);

}


export default Admin;