import { useState, useEffect } from "react";

import {
confirmPasswordReset,
verifyPasswordResetCode
} from "firebase/auth";

import { auth } from "../firebase";

import {
useSearchParams,
useNavigate
} from "react-router-dom";


export default function ResetPassword(){

const [password,setPassword]=useState("");

const [searchParams]=useSearchParams();

const navigate = useNavigate();

const [status,setStatus]=useState("checking");


// استخراج بيانات الرابط

const oobCode = searchParams.get("oobCode");

const mode = searchParams.get("mode");


// التحقق من صحة الرابط أولاً

useEffect(()=>{

const checkCode = async()=>{

if(!oobCode || mode !== "resetPassword"){

setStatus("invalid");

return;

}

try{

await verifyPasswordResetCode(
auth,
oobCode
);

setStatus("valid");

}catch(error){

console.log(error);

setStatus("invalid");

}

};

checkCode();

},[oobCode,mode]);


// تنفيذ تغيير كلمة السر

const resetPassword = async()=>{

if(password.length < 6){

alert("Password must be at least 6 characters");

return;

}

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

alert("Reset link expired or invalid");

}

};


return(

<div className="h-screen flex justify-center items-center bg-gray-100">

<div className="bg-white shadow-lg p-8 rounded-lg w-96">

<h2 className="text-xl font-semibold mb-4 text-center">

Reset Password

</h2>


{status === "checking" && (

<p className="text-gray-500 text-center">

Checking reset link...

</p>

)}


{status === "invalid" && (

<p className="text-red-500 text-center">

Invalid or expired reset link ❌

</p>

)}


{status === "valid" && (

<>

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

</>

)}

</div>

</div>

);

}