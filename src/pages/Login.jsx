import { useState } from "react";

import {
signInWithEmailAndPassword,
reload,
sendEmailVerification
} from "firebase/auth";

import { auth, db } from "../firebase";

import { useNavigate } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";


function Login() {

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const navigate = useNavigate();


const handleLogin = async () => {

try {

const userCredential =

await signInWithEmailAndPassword(
auth,
email,
password
);


// تحديث بيانات المستخدم

await reload(userCredential.user);


// لو الحساب غير مفعل

if(!userCredential.user.emailVerified){

await sendEmailVerification(userCredential.user);

alert("Verification email sent again 📩");

return;

}


// التحقق من أنه Admin

const docRef = doc(
db,
"users",
userCredential.user.uid
);

const docSnap = await getDoc(docRef);


if(!docSnap.exists()){

alert("User data not found");

return;

}


if(docSnap.data().role !== "admin"){

alert("Access denied. Admin only.");

return;

}


// دخول لوحة التحكم

navigate("/admin");


} catch(error) {

console.log(error);

alert("Wrong email or password");

}

};


return(

<div className="h-screen flex justify-center items-center bg-gray-100">

<div className="bg-white p-8 rounded-xl shadow-lg w-96">

<h2 className="text-2xl font-bold mb-6 text-center">

Admin Login

</h2>


<input
placeholder="Email"
className="border p-2 w-full mb-4 rounded"
onChange={(e)=>setEmail(e.target.value)}
/>


<input
placeholder="Password"
type="password"
className="border p-2 w-full mb-4 rounded"
onChange={(e)=>setPassword(e.target.value)}
/>


<button
onClick={handleLogin}
className="bg-blue-900 hover:bg-blue-800 text-white w-full py-2 rounded transition"
>

Login

</button>

</div>

</div>

);

}

export default Login;