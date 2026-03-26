import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {

const [menuOpen,setMenuOpen]=useState(false);

return (

<nav className="bg-white shadow-md px-4 md:px-10 py-4 flex items-center justify-between">

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

<Link
to="/cart"
className="bg-blue-900 text-white px-4 py-2 rounded-lg"
>

Cart

</Link>

</div>


{/* Mobile Button */}

<button

onClick={()=>setMenuOpen(!menuOpen)}

className="md:hidden text-2xl"

>

☰

</button>


{/* Mobile Menu */}

{

menuOpen && (

<div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-6 md:hidden">

<Link to="/">Home</Link>

<Link to="/hotels">Hotels</Link>

<Link to="/transport">Transport</Link>

<Link to="/trips">Trips</Link>

<Link to="/offers">Offers</Link>

<Link to="/about">About Aswan</Link>

<Link to="/contact">Contact</Link>

<Link
to="/cart"
className="bg-blue-900 text-white px-6 py-2 rounded-lg"
>

Cart

</Link>

</div>

)

}

</nav>

);

}

export default Navbar;