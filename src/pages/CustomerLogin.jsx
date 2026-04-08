import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import { auth } from "../firebase";

import {
signInWithEmailAndPassword,
GoogleAuthProvider,
signInWithPopup
} from "firebase/auth";


export default function CustomerLogin() {

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const navigate = useNavigate();


/*
Login باستخدام Email + Password
*/

const loginUser = async(e)=>{

e.preventDefault();

try{

const userCredential = await signInWithEmailAndPassword(
auth,
email,
password
);


// تحديث بيانات المستخدم من Firebase

await userCredential.user.reload();


// التأكد من تفعيل الإيميل

if(!userCredential.user.emailVerified){

alert("Please verify your email first");

navigate("/verify-email");

return;

}


navigate("/profile");


}catch(error){

alert(error.message);

}

};


/*
Login باستخدام Google
*/

const provider = new GoogleAuthProvider();

const loginWithGoogle = async ()=>{

try{

await signInWithPopup(auth,provider);


// حساب Google يعتبر verified تلقائيًا

navigate("/profile");


}catch(error){

alert(error.message);

}

};


return(

<div className="flex justify-center items-center h-screen">

<form
onSubmit={loginUser}
className="bg-white shadow-lg p-8 rounded-lg w-96"
>

<h2 className="text-2xl mb-6">

Customer Login

</h2>


<input
type="email"
placeholder="Email"
className="border p-2 w-full mb-4"
onChange={(e)=>setEmail(e.target.value)}
required
/>


<input
type="password"
placeholder="Password"
className="border p-2 w-full mb-4"
onChange={(e)=>setPassword(e.target.value)}
required
/>


<div className="text-right mb-4">

<Link
to="/forgot-password"
className="text-blue-600 text-sm"
>

Forgot password?

</Link>

</div>


<button
className="bg-blue-500 text-white w-full p-2"
>

Login

</button>


<button
type="button"
onClick={loginWithGoogle}
className="bg-red-500 text-white w-full p-2 mt-3"
>

Continue with Google

</button>


</form>

</div>

);

}