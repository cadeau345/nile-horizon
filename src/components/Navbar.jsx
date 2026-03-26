import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {

const [menuOpen,setMenuOpen]=useState(false);

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

<Link
to="/cart"
className="bg-blue-900 text-white px-4 py-2 rounded-lg"
>
Cart
</Link>

</div>


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

<Link
to="/cart"
onClick={closeMenu}
className="bg-blue-900 text-white px-6 py-2 rounded-lg"
>
Cart
</Link>

</div>

</nav>

);

}

export default Navbar;