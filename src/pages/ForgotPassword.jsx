import { useState } from "react";

import { auth } from "../firebase";

import { sendPasswordResetEmail } from "firebase/auth";


function ForgotPassword(){

const [email,setEmail]=useState("");


const resetPassword = async(e)=>{

e.preventDefault();

try{

await sendPasswordResetEmail(auth,email);

alert("Password reset link sent to your email");

}catch(error){

alert(error.message);

}

};


return(

<div className="h-screen flex justify-center items-center">

<form
onSubmit={resetPassword}
className="bg-white shadow-lg p-8 rounded-lg w-96"
>

<h2 className="text-2xl mb-6">

Forgot Password

</h2>


<input
type="email"
placeholder="Enter your email"
className="border p-2 w-full mb-4"
onChange={(e)=>setEmail(e.target.value)}
required
/>


<button
className="bg-blue-500 text-white w-full p-2"
>

Send Reset Link

</button>

</form>

</div>

);

}


export default ForgotPassword;