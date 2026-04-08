import { useEffect, useState } from "react";

import { auth, db } from "../firebase";

import { sendEmailVerification } from "firebase/auth";

import { doc, updateDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";


function VerifyEmail(){

const navigate = useNavigate();

const [seconds,setSeconds]=useState(30);

const [canResend,setCanResend]=useState(false);


/*
تحقق تلقائي هل المستخدم فعل الإيميل
*/

useEffect(()=>{

if(!auth.currentUser){

navigate("/customer-login");

return;

}


const verifyInterval = setInterval(async ()=>{

await auth.currentUser.reload();


if(auth.currentUser.emailVerified){

// تحديث Firestore بعد التفعيل

await updateDoc(
doc(db,"users",auth.currentUser.uid),
{
verified: true
}
);


// تحويل المستخدم إلى Profile

navigate("/profile");

}

},3000);


return ()=>clearInterval(verifyInterval);

},[]);


/*
Countdown إعادة الإرسال
*/

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


/*
إعادة إرسال رسالة التفعيل
*/

const resendEmail = async () => {

if(!auth.currentUser) return;

try{

await sendEmailVerification(auth.currentUser);

alert("Verification email sent successfully");

setSeconds(60); // بدل 30 نخليها دقيقة

setCanResend(false);

}catch(error){

if(error.code === "auth/too-many-requests"){

alert("Too many requests. Please wait before trying again");

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


<p className="text-gray-600 mb-6">

Check your Gmail and click the verification link

</p>


{

canResend ?

<button
onClick={resendEmail}
className="bg-blue-600 text-white px-6 py-2 rounded-lg"
>

Resend verification email

</button>

:

<p className="text-gray-500">

You can resend email in {seconds}s

</p>

}


<p className="mt-6 text-sm text-gray-400">

After verification you will be redirected automatically

</p>

</div>

</div>

);

}


export default VerifyEmail;