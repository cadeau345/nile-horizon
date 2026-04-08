import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";

import {
createUserWithEmailAndPassword,
sendEmailVerification
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";


export default function Register(){

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const navigate = useNavigate();


/*
إنشاء الحساب
*/

const registerUser = async(e)=>{

e.preventDefault();

try{

const userCredential =
await createUserWithEmailAndPassword(
auth,
email,
password
);


// حفظ المستخدم داخل Firestore

await setDoc(
doc(db,"users",userCredential.user.uid),
{
email: userCredential.user.email,
verified: userCredential.user.emailVerified,
createdAt: new Date()
}
);


// إرسال رسالة التفعيل

await sendEmailVerification(
userCredential.user
);


// رسالة نجاح

alert("Verification email sent. Please check your Gmail.");


// تحويل المستخدم لصفحة التفعيل

navigate("/verify-email");


}catch(error){

if(error.code === "auth/email-already-in-use"){

alert("This email is already registered");

}

else if(error.code === "auth/invalid-email"){

alert("Invalid email format");

}

else if(error.code === "auth/weak-password"){

alert("Password should be at least 6 characters");

}

else{

alert("Registration failed. Please try again");

}

}

};


return(

<div className="flex justify-center items-center h-screen">

<form
onSubmit={registerUser}
className="bg-white shadow-lg p-8 rounded-lg w-96"
>

<h2 className="text-2xl mb-6">

Create Account

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


<button
className="bg-green-500 text-white w-full p-2"
>

Register

</button>

</form>

</div>

);

}