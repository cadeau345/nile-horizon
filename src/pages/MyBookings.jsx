import { useEffect , useState , useContext } from "react";

import { collection , query , where , getDocs } from "firebase/firestore";

import { db } from "../firebase";

import { AuthContext } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";


function MyBookings(){

const { user } = useContext(AuthContext);

const navigate = useNavigate();

const [bookings,setBookings]=useState([]);

const [loading,setLoading]=useState(true);


// منع الدخول بدون تسجيل دخول

useEffect(()=>{

if(!user){

navigate("/customer-login");

}

},[user,navigate]);


// تحميل حجوزات المستخدم

useEffect(()=>{

const fetchBookings = async ()=>{

if(!user) return;

const q = query(

collection(db,"bookings"),

where("userId","==",user.uid)

);

const querySnapshot = await getDocs(q);

const data = querySnapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

setBookings(data);

setLoading(false);

};

fetchBookings();

},[user]);


if(loading){

return <p className="p-10">Loading bookings...</p>;

}


return(

<div className="p-10 max-w-5xl mx-auto">

<h1 className="text-3xl font-bold mb-6">

My Bookings

</h1>


{

bookings.length === 0 ?

<p>No bookings yet</p>

:

bookings.map((booking)=>(

<div

key={booking.id}

className="bg-white shadow-md p-5 rounded-xl mb-4"

>

<h2 className="text-xl font-semibold">

{booking.serviceName}

</h2>


<p>

Type: {booking.serviceType}

</p>


<p>

Price: ${booking.price || "-"}

</p>


<p>

Status:

<span className="ml-2 font-semibold text-orange-500">

{booking.status}

</span>

</p>


<p className="text-gray-500 text-sm mt-2">

{booking.createdAt?.toDate().toLocaleDateString()}

</p>


</div>

))

}

</div>

);

}


export default MyBookings;