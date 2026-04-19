import { useEffect, useState } from "react";

import {
auth,
db
} from "../firebase";

import {
applyActionCode,
sendEmailVerification
} from "firebase/auth";

import {
doc,
updateDoc
} from "firebase/firestore";

import {
useNavigate,
useSearchParams
} from "react-router-dom";


function VerifyEmail(){

const navigate = useNavigate();

const [searchParams] = useSearchParams();

const [seconds,setSeconds] = useState(30);

const [canResend,setCanResend] = useState(false);

const [status,setStatus] = useState("verifying");


// استخراج كود Firebase من الرابط

const oobCode = searchParams.get("oobCode");


// تنفيذ عملية التفعيل من الرابط مباشرة

useEffect(()=>{

const verifyEmail = async()=>{

if(!oobCode){

setStatus("invalid");

return;

}

try{

await applyActionCode(
auth,
oobCode
);

setStatus("success");


// تحديث Firestore بعد التفعيل

if(auth.currentUser){

await updateDoc(
doc(db,"users",auth.currentUser.uid),
{
verified: true
}
);

}


// تحويل المستخدم

setTimeout(()=>{

navigate("/profile");

},2000);


}catch(error){

console.log(error);

setStatus("error");

}

};

verifyEmail();

},[oobCode,navigate]);


// Countdown إعادة الإرسال

useEffect(()=>{

if(seconds === 0){

setCanResend(true);

return;

}

const timer = setTimeout(()=>{

setSeconds(seconds - 1);

},1000);

return ()=>clearTimeout(timer);

},[seconds]);


// إعادة إرسال رسالة التفعيل

const resendEmail = async()=>{

if(!auth.currentUser) return;

try{

await sendEmailVerification(
auth.currentUser,
{
url: window.location.origin + "/#/verify-email"
}
);

alert("Verification email sent successfully 📩");

setSeconds(60);

setCanResend(false);

}catch(error){

if(error.code === "auth/too-many-requests"){

alert("Too many requests. Please wait");

}else{

alert("Failed to resend email");

}

}

};


return(

<div className="h-screen flex justify-center items-center bg-gray-100">

<div className="bg-white shadow-xl rounded-xl p-10 text-center w-[400px]">


<h2 className="text-2xl font-bold mb-4">

Verify your email

</h2>


{status === "verifying" && (

<p className="text-gray-600">

Verifying your email...

</p>

)}


{status === "success" && (

<p className="text-green-600 font-semibold">

Email verified successfully ✅

</p>

)}


{status === "error" && (

<p className="text-red-600 font-semibold">

Verification link invalid or expired ❌

</p>

)}


{status !== "success" && (

<>

{

canResend ?

<button
onClick={resendEmail}
className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-6"
>

Resend verification email

</button>

:

<p className="text-gray-500 mt-6">

You can resend email in {seconds}s

</p>

}


<p className="mt-6 text-sm text-gray-400">

After verification you will be redirected automatically

</p>

</>

)}

</div>

</div>

);

}


export default VerifyEmail;