import { Link } from "react-router-dom";
import { useState , useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {

const [menuOpen,setMenuOpen]=useState(false);

const [profileOpen,setProfileOpen]=useState(false);

const { user , logout } = useContext(AuthContext);

const closeMenu=()=>{

setMenuOpen(false);

};


return (

<nav className="bg-white shadow-md px-4 md:px-10 py-4 flex items-center justify-between relative z-50">

{/* Logo */}

<Link
to="/"
className="text-blue-900 font-bold text-xl"
>

Nile Horizon

</Link>


{/* Desktop Menu */}

<div className="hidden md:flex gap-6 items-center">

<Link to="/">Home</Link>

<Link to="/hotels">Hotels</Link>

<Link to="/transport">Transport</Link>

<Link to="/trips">Trips</Link>

<Link to="/offers">Offers</Link>

<Link to="/about">About Aswan</Link>

<Link to="/contact">Contact</Link>

<Link to="/Temples">Temples</Link>

<Link to="/my-bookings">
My Bookings
</Link>


{/* Auth Buttons */}

{

!user ?

<>

<Link
to="/customer-login"
className="text-blue-900 font-semibold"
>

Login

</Link>

<Link
to="/register"
className="bg-blue-900 text-white px-4 py-2 rounded-lg"
>

Register

</Link>

</>

:

<div className="relative">

<button
onClick={()=>setProfileOpen(!profileOpen)}
className="text-3xl text-blue-900"
>

<FaUserCircle />

</button>


{/* Profile Dropdown */}

{

profileOpen && (

<div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-44 py-2">

<Link
to="/profile"
className="block px-4 py-2 hover:bg-gray-100"
>

Profile

</Link>


<Link
to="/my-bookings"
className="block px-4 py-2 hover:bg-gray-100"
>

My Bookings

</Link>


<button
onClick={logout}
className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
>

Logout

</button>

</div>

)

}

</div>

}

</div>


{/* Mobile Menu Button */}

<div className="flex items-center gap-3 md:hidden">

<Link
to="/cart"
className="bg-blue-900 text-white px-3 py-1.5 rounded-lg text-sm"
>

Cart

</Link>

<button
onClick={()=>setMenuOpen(!menuOpen)}
className="text-3xl text-blue-900"
>

{menuOpen ? "✕" : "☰"}

</button>

</div>


{/* Mobile Menu */}

<div
className={`absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-5 py-6 md:hidden transition-all duration-300 ease-in-out
${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"}
`}
>

<Link to="/" onClick={closeMenu}>Home</Link>

<Link to="/hotels" onClick={closeMenu}>Hotels</Link>

<Link to="/transport" onClick={closeMenu}>Transport</Link>

<Link to="/trips" onClick={closeMenu}>Trips</Link>

<Link to="/offers" onClick={closeMenu}>Offers</Link>

<Link to="/about" onClick={closeMenu}>About Aswan</Link>

<Link to="/contact" onClick={closeMenu}>Contact</Link>

<Link to="/Temples" onClick={closeMenu}>Temples</Link>

<Link to="/my-bookings">
My Bookings
</Link>


{/* Auth Buttons Mobile */}

{

!user ?

<>

<Link
to="/customer-login"
onClick={closeMenu}
className="text-blue-900 font-semibold"
>

Login

</Link>

<Link
to="/register"
onClick={closeMenu}
className="bg-blue-900 text-white px-6 py-2 rounded-lg"
>

Register

</Link>

</>

:

<>

<Link
to="/profile"
onClick={closeMenu}
className="text-blue-900 font-semibold"
>

Profile

</Link>

<button
onClick={()=>{

logout();

closeMenu();

}}
className="bg-red-500 text-white px-6 py-2 rounded-lg"
>

Logout

</button>

</>

}

</div>

</nav>

);

}

export default Navbar;