import { Link, useLocation } from "react-router-dom";
import { Home, Hotel, Map, Bus, ShoppingCart } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function MobileBottomNav() {

const location = useLocation();

const { cartItems } = useContext(CartContext);

const navItems = [

{
name: "Home",
icon: <Home size={20} />,
path: "/"
},

{
name: "Hotels",
icon: <Hotel size={20} />,
path: "/hotels"
},

{
name: "Trips",
icon: <Map size={20} />,
path: "/trips"
},

{
name: "Transport",
icon: <Bus size={20} />,
path: "/transport"
},

{
name: "Cart",
icon: <ShoppingCart size={20} />,
path: "/cart"
}

];

return (

<div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t flex justify-around items-center py-2 md:hidden z-50">

{navItems.map((item,index)=>(

<Link
key={index}
to={item.path}
className={`relative flex flex-col items-center text-xs ${
location.pathname===item.path
? "text-blue-900"
: "text-gray-500"
}`}
>

<div className="relative">

{item.icon}

{item.name==="Cart" && cartItems.length>0 && (

<span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] px-1.5 rounded-full">

{cartItems.length}

</span>

)}

</div>

<span>{item.name}</span>

</Link>

))}

</div>

);

}

export default MobileBottomNav;