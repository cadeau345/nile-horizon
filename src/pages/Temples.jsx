import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

function Temples() {

const [temples,setTemples]=useState([]);

useEffect(()=>{

const fetchTemples=async()=>{

const snapshot=await getDocs(
collection(db,"temples")
);

setTemples(
snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}))
);

};

fetchTemples();

},[]);

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">

Temples & Attractions

</h1>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{temples.map(item=>(
<Link key={item.id} to={`/temple/${item.id}`}>

<div className="shadow-lg rounded-xl overflow-hidden">

<img
src={item.image}
className="h-52 w-full object-cover"
alt=""
/>

<div className="p-4">

<h2 className="text-xl font-bold">

{item.name}

</h2>

<p className="text-orange-500">

${item.price}

</p>

</div>

</div>

</Link>
))}

</div>

</div>

);

}

export default Temples;