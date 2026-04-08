import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

function Users(){

const [users,setUsers]=useState([]);

useEffect(()=>{

const unsubscribe = onSnapshot(

collection(db,"users"),

(snapshot)=>{

setUsers(

snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}))

);

}

);

return ()=>unsubscribe();

},[]);

return(

<div>

<h2 className="text-2xl font-bold mb-4">

Registered Users

</h2>

{users.length === 0 && <p>No users yet</p>}

{users.map(user=>(

<div
key={user.id}
className="bg-white shadow rounded p-4 mb-3"
>

<p>Email: {user.email}</p>

<p>Status: {user.verified ? "Verified" : "Not verified"}</p>

</div>

))}

</div>

);

}

export default Users;