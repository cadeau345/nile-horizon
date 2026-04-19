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
const [loading, setLoading] = useState(true);


// حماية صفحة الأدمن

useEffect(() => {

const unsubscribe = onAuthStateChanged(auth, (user) => {

if (!user) {
navigate("/customer-login");
return;
}

// ايميل الأدمن الوحيد
if (user.email !== "cadeau200510@gmail.com") {
navigate("/");
return;
}

setLoading(false);

});

return () => unsubscribe();

}, [navigate]);


// تسجيل خروج الأدمن

const handleLogout = async () => {

await signOut(auth);

navigate("/customer-login");

};


// منع تحميل الصفحة قبل التحقق

if (loading) {

return (
<div className="p-10 text-center text-xl font-semibold">
Loading Admin Dashboard...
</div>
);

}


const tabs = [
{ id: "hotel", label: "Add Hotel" },
{ id: "transport", label: "Add Transport" },
{ id: "trip", label: "Add Trip" },
{ id: "package", label: "Add Package" },
{ id: "temple", label: "Add Temple" },
{ id: "bookings", label: "Bookings" },
{ id: "users", label: "Users" }
];


return (

<div className="p-10">

<div className="flex justify-between items-center mb-6">

<h1 className="text-3xl font-bold">
Admin Dashboard
</h1>

<button
onClick={handleLogout}
className="bg-red-600 text-white px-4 py-2 rounded"
>
Logout
</button>

</div>


<div className="flex gap-4 mb-8 flex-wrap">

{tabs.map((item) => (

<button
key={item.id}
onClick={() => setTab(item.id)}
className={`px-4 py-2 rounded text-white ${
tab === item.id
? "bg-indigo-600"
: "bg-blue-900"
}`}
>

{item.label}

</button>

))}

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