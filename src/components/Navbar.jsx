import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Navbar() {
const [isAdmin,setIsAdmin]=useState(false);
const [isOpen,setIsOpen]=useState(false);
const [isScrolled,setIsScrolled]=useState(false);
const [activeDropdown,setActiveDropdown]=useState(null);
const [user,setUser]=useState(null);
useEffect(()=>{

const unsubscribe = onAuthStateChanged(auth, async(currentUser)=>{

setUser(currentUser);

if(currentUser){

const docRef = doc(db,"users",currentUser.uid);

const docSnap = await getDoc(docRef);

if(docSnap.exists()){

if(docSnap.data().role==="admin"){

setIsAdmin(true);

}

}

}

});

return ()=>unsubscribe();

},[]);

const location=useLocation();


// SCROLL EFFECT

useEffect(()=>{

const handleScroll=()=>{

setIsScrolled(window.scrollY>50);

};

window.addEventListener("scroll",handleScroll);

return()=>window.removeEventListener("scroll",handleScroll);

},[]);


const isHome=location.pathname==="/";


// DROPDOWN DATA

const dropdownMenus={

hotels:[
{label:"Luxury Hotels",link:"/hotels?type=luxury"},
{label:"Budget Hotels",link:"/hotels?type=budget"},
{label:"Nile View Hotels",link:"/hotels?view=nile"}
],

trips:[
{label:"Daily Trips",link:"/trips?type=daily"},
{label:"Nile Cruise",link:"/trips?type=cruise"},
{label:"Historical Tours",link:"/trips?type=history"}
],

transport:[
{label:"Airport Transfer",link:"/transport?type=airport"},
{label:"Private Car",link:"/transport?type=private"},
{label:"Bus Booking",link:"/transport?type=bus"}
]

};


return(

<nav
className={`fixed top-0 left-0 w-full z-50 transition-all duration-300

${
isHome && !isScrolled
? "bg-transparent text-white"
: "bg-white shadow text-gray-800"
}

`}
>

<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">


{/* LOGO */}

<Link to="/" className="text-2xl font-extrabold tracking-tight">

<span className="text-indigo-600">Nile</span> Horizon

</Link>



{/* DESKTOP MENU */}

<div className="hidden lg:flex gap-6 items-center font-medium relative">


<Link to="/">Home</Link>


{/* HOTELS DROPDOWN */}

<div
className="relative"
onMouseEnter={()=>setActiveDropdown("hotels")}
onMouseLeave={()=>setActiveDropdown(null)}
>

<div className="flex items-center gap-1 cursor-pointer">

Hotels <ChevronDown size={16}/>

</div>

{
activeDropdown==="hotels" && (

<div className="absolute top-8 left-0 bg-white shadow-xl rounded-xl p-4 space-y-2 text-gray-800 min-w-[200px]">

{
dropdownMenus.hotels.map(item=>(

<Link key={item.label} to={item.link}>

<div className="hover:text-indigo-600">

{item.label}

</div>

</Link>

))
}

</div>

)

}

</div>



{/* TRANSPORT DROPDOWN */}

<div
className="relative"
onMouseEnter={()=>setActiveDropdown("transport")}
onMouseLeave={()=>setActiveDropdown(null)}
>

<div className="flex items-center gap-1 cursor-pointer">

Transport <ChevronDown size={16}/>

</div>

{
activeDropdown==="transport" && (

<div className="absolute top-8 left-0 bg-white shadow-xl rounded-xl p-4 space-y-2 text-gray-800 min-w-[200px]">

{
dropdownMenus.transport.map(item=>(

<Link key={item.label} to={item.link}>

<div className="hover:text-indigo-600">

{item.label}

</div>

</Link>

))
}

</div>

)

}

</div>



{/* TRIPS DROPDOWN */}

<div
className="relative"
onMouseEnter={()=>setActiveDropdown("trips")}
onMouseLeave={()=>setActiveDropdown(null)}
>

<div className="flex items-center gap-1 cursor-pointer">

Trips <ChevronDown size={16}/>

</div>

{
activeDropdown==="trips" && (

<div className="absolute top-8 left-0 bg-white shadow-xl rounded-xl p-4 space-y-2 text-gray-800 min-w-[200px]">

{
dropdownMenus.trips.map(item=>(

<Link key={item.label} to={item.link}>

<div className="hover:text-indigo-600">

{item.label}

</div>

</Link>

))
}

</div>

)

}

</div>



<Link to="/offers">Offers</Link>

<Link to="/about">About Aswan</Link>

<Link to="/contact">Contact</Link>

<Link to="/temples">Temples</Link>

<Link to="/flights">Flights</Link>

<Link to="/bookings">My Bookings</Link>



{
isAdmin && (

<Link to="/admin">

<button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl">

Admin Dashboard

</button>

</Link>

)
}


<div className="relative">

<User
onClick={()=>setActiveDropdown("user")}
className="cursor-pointer"
/>

{
activeDropdown==="user" && (

<div className="absolute right-0 top-8 bg-white shadow-xl rounded-xl p-4 space-y-2 text-gray-800 min-w-[180px]">

{
user ? (

<>

{
isAdmin && (

<Link to="/bookings">

My Bookings

</Link>

)
}


<Link to="/profile">

<div className="hover:text-indigo-600">
Profile
</div>

</Link>


<div
onClick={handleLogout}
className="hover:text-red-500 cursor-pointer"
>

Logout

</div>

</>

) : (

<>

<Link to="/login">

<div className="hover:text-indigo-600">
Login
</div>

</Link>


<Link to="/register">

<div className="hover:text-indigo-600">
Register
</div>

</Link>

</>

)

}

</div>

)

}

</div>




</div>



{/* MOBILE ICON */}

<button
onClick={()=>setIsOpen(!isOpen)}
className="lg:hidden"
>

{
isOpen
?

<X size={28}/>

:

<Menu size={28}/>

}

</button>


</div>



{/* MOBILE MENU */}

{
isOpen && (

<div className="lg:hidden bg-white shadow-lg px-6 pb-6 space-y-4 text-gray-800">

<Link to="/">Home</Link>
<Link to="/hotels">Hotels</Link>
<Link to="/transport">Transport</Link>
<Link to="/trips">Trips</Link>
<Link to="/offers">Offers</Link>
<Link to="/about">About Aswan</Link>
<Link to="/contact">Contact</Link>
<Link to="/temples">Temples</Link>
<Link to="/flights">Flights</Link>
<Link to="/bookings">My Bookings</Link>

<Link to="/admin">

<button className="bg-indigo-600 text-white w-full py-2 rounded-xl">

Admin Dashboard

</button>

</Link>

</div>

)

}


</nav>

);

}

export default Navbar;