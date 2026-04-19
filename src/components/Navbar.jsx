import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import {
Menu,
X,
User
} from "lucide-react";

import { auth } from "../firebase";

import {
onAuthStateChanged,
signOut
} from "firebase/auth";

import {
doc,
getDoc
} from "firebase/firestore";

import { db } from "../firebase";


function Navbar(){

const [user,setUser]=useState(null);
const [isAdmin,setIsAdmin]=useState(false);
const [isOpen,setIsOpen]=useState(false);
const [activeDropdown,setActiveDropdown]=useState(null);

const location = useLocation();


// CHECK USER AUTH
useEffect(()=>{

const unsubscribe = onAuthStateChanged(
auth,
async(currentUser)=>{

setUser(currentUser);

if(currentUser){

const docRef = doc(
db,
"users",
currentUser.uid
);

const docSnap = await getDoc(docRef);

if(docSnap.exists()){

setIsAdmin(
docSnap.data().role === "admin"
);

}

}

}
);

return ()=>unsubscribe();

},[]);


// LOGOUT
const handleLogout = async()=>{

await signOut(auth);
setUser(null);

};


const isHome = location.pathname === "/";


return(

<nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
isHome
? "bg-transparent text-white"
: "bg-white shadow text-gray-800"
}`}>

<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">


{/* LOGO */}
<Link to="/" className="text-xl font-bold whitespace-nowrap">
<span className="text-indigo-600">
Nile
</span>
Horizon
</Link>



{/* DESKTOP MENU */}
<div className="hidden lg:flex items-center gap-6">

<Link to="/">Home</Link>
<Link to="/hotels">Hotels</Link>
<Link to="/transport">Transport</Link>
<Link to="/trips">Trips</Link>
<Link to="/offers">Offers</Link>
<Link to="/about">About Aswan</Link>
<Link to="/contact">Contact</Link>
<Link to="/temples">Temples</Link>
<Link to="/flights">Flights</Link>


{isAdmin && (

<Link to="/admin">
<button className="bg-indigo-600 text-white px-5 py-2 rounded-xl">
Admin Dashboard
</button>
</Link>

)}


{/* USER ICON */}
<div className="relative">

<User
className="cursor-pointer"
onClick={()=>setActiveDropdown(
activeDropdown==="user"
? null
: "user"
)}
/>


{activeDropdown==="user" && (

<div className="absolute right-0 top-10 bg-white shadow-xl rounded-xl p-4 space-y-2 min-w-[150px] text-gray-800">

{user ? (

<>
<Link to="/profile">Profile</Link>
<Link to="/my-bookings">My Bookings</Link>

<div
onClick={handleLogout}
className="text-red-500 cursor-pointer"
>
Logout
</div>

</>

) : (

<>
<Link to="/login">Login</Link>
<Link to="/register">Register</Link>
</>

)}

</div>

)}

</div>

</div>



{/* MOBILE RIGHT SIDE */}
<div className="flex items-center gap-3 lg:hidden">


{/* LOGIN / REGISTER */}
{!user && (

<div className="flex items-center gap-2">

<Link
to="/login"
className={`text-xs font-semibold px-2 py-1 rounded ${
isHome
? "text-white bg-black/40"
: "text-gray-800"
}`}
>
Login
</Link>


<Link
to="/register"
className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-md text-xs"
>
Register
</Link>

</div>

)}


{/* USER ICON */}
{user && (

<div className="relative">

<User
className="cursor-pointer"
onClick={()=>setActiveDropdown(
activeDropdown==="user"
? null
: "user"
)}
/>


{activeDropdown==="user" && (

<div className="absolute right-0 top-10 bg-white shadow-xl rounded-xl p-4 space-y-2 min-w-[150px] text-gray-800">

<Link to="/profile">Profile</Link>
<Link to="/my-bookings">My Bookings</Link>

<div
onClick={handleLogout}
className="text-red-500 cursor-pointer"
>
Logout
</div>

</div>

)}

</div>

)}


{/* MENU BUTTON */}
<button
onClick={()=>setIsOpen(!isOpen)}
>
{isOpen ? <X size={26}/> : <Menu size={26}/>}
</button>

</div>

</div>



{/* MOBILE MENU */}
{isOpen && (

<div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg px-6 py-4 space-y-4 text-gray-800">

<Link to="/" onClick={()=>setIsOpen(false)}>Home</Link>
<Link to="/hotels" onClick={()=>setIsOpen(false)}>Hotels</Link>
<Link to="/transport" onClick={()=>setIsOpen(false)}>Transport</Link>
<Link to="/trips" onClick={()=>setIsOpen(false)}>Trips</Link>
<Link to="/offers" onClick={()=>setIsOpen(false)}>Offers</Link>
<Link to="/about" onClick={()=>setIsOpen(false)}>About Aswan</Link>
<Link to="/contact" onClick={()=>setIsOpen(false)}>Contact</Link>
<Link to="/temples" onClick={()=>setIsOpen(false)}>Temples</Link>
<Link to="/flights" onClick={()=>setIsOpen(false)}>Flights</Link>


{isAdmin && (

<Link to="/admin" onClick={()=>setIsOpen(false)}>

<button className="bg-indigo-600 text-white w-full py-2 rounded-xl">
Admin Dashboard
</button>

</Link>

)}


{user && (

<div
onClick={handleLogout}
className="text-red-500 cursor-pointer"
>
Logout
</div>

)}

</div>

)}

</nav>

);

}

export default Navbar;