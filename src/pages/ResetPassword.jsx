import { useState } from "react";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword(){

const [password,setPassword]=useState("");

const [searchParams]=useSearchParams();

const navigate = useNavigate();

const oobCode = searchParams.get("oobCode");


const resetPassword = async()=>{

try{

await confirmPasswordReset(
auth,
oobCode,
password
);

alert("Password updated successfully ✅");

navigate("/login");

}catch(error){

console.log(error);

alert("Invalid or expired reset link");

}

};


return(

<div className="h-screen flex justify-center items-center bg-gray-100">

<div className="bg-white shadow-lg p-8 rounded-lg w-96">

<h2 className="text-xl font-semibold mb-4 text-center">

Reset Password

</h2>

<input
type="password"
placeholder="Enter new password"
className="border p-2 w-full mb-4"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={resetPassword}
className="bg-blue-600 text-white w-full py-2 rounded"
>

Update Password

</button>

</div>

</div>

);

}