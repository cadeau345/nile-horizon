import { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase";

import { Link } from "react-router-dom";

import { Helmet } from "react-helmet-async";


function Hotels() {

const [hotels, setHotels] = useState([]);


useEffect(() => {

const fetchHotels = async () => {

const querySnapshot = await getDocs(
collection(db, "hotels")
);

const hotelsData = querySnapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}));

setHotels(hotelsData);

};

fetchHotels();

}, []);


return (

<div className="p-10">

<Helmet>

<title>Hotels in Aswan | Nile Horizon</title>

<meta
name="description"
content="Explore the best hotels in Aswan with competitive prices and easy booking options."
/>

</Helmet>


<h1 className="text-3xl font-bold mb-6 text-blue-900">
Hotels in Egypt
</h1>


<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{hotels.map(hotel => (

<Link
to={`/hotel/${hotel.id}`}
key={hotel.id}
>

<div className="shadow-lg rounded-xl overflow-hidden hover:scale-105 transition duration-300 cursor-pointer">

<img
src={
hotel.images?.[0] ||
hotel.image ||
"/placeholder.jpg"
}
alt={hotel.name}
className="h-52 w-full object-cover"
/>


<div className="p-4">

<h2 className="text-xl font-bold">
{hotel.name}
</h2>


<p className="text-gray-500">
{hotel.location}
</p>


{/* السعر مع عرض لو موجود */}

{hotel.isOffer && hotel.discountPrice ? (

<div>

<p className="text-gray-400 line-through">
${hotel.price}
</p>

<p className="text-red-500 font-bold">
${hotel.discountPrice} / night
</p>

</div>

) : (

<p className="text-orange-500 font-bold mt-2">
${hotel.price} / night
</p>

)}


{/* نجمة Best Seller */}

{hotel.isBestSeller && (

<p className="text-yellow-500 mt-2">
⭐ Best Seller
</p>

)}


</div>

</div>

</Link>

))}

</div>

</div>

);

}


export default Hotels;