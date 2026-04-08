import { useEffect } from "react";

import { auth } from "../firebase";

import { sendEmailVerification } from "firebase/auth";

import { useNavigate } from "react-router-dom";


function VerifyEmail(){

const navigate = useNavigate();


useEffect(()=>{

// لو المستخدم مش مسجل دخول

if(!auth.currentUser){

navigate("/customer-login");

return;

}


const interval = setInterval(async ()=>{

await auth.currentUser.reload();


if(auth.currentUser.emailVerified){

navigate("/profile");

}

},3000);


return ()=>clearInterval(interval);

},[]);


// إعادة إرسال رسالة التفعيل

const resendVerification = async ()=>{

if(auth.currentUser){

await sendEmailVerification(auth.currentUser);

alert("Verification email sent again");

}

};


return(

<div className="h-screen flex justify-center items-center">

<div className="text-center bg-white shadow-lg p-10 rounded-xl">

<h2 className="text-2xl font-bold mb-4">

Verify your email

</h2>


<p className="mb-6">

Check your Gmail and click verification link

</p>


<button
onClick={resendVerification}
className="bg-blue-600 text-white px-6 py-2 rounded"
>

Resend verification email

</button>

</div>

</div>

);

}


export default VerifyEmail;