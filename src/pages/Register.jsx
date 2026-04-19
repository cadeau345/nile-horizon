import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";

import {
createUserWithEmailAndPassword,
sendEmailVerification,
GoogleAuthProvider,
signInWithPopup
} from "firebase/auth";

import {
doc,
setDoc,
getDoc
} from "firebase/firestore";


export default function Register(){

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const navigate = useNavigate();

const provider = new GoogleAuthProvider();


// REGISTER EMAIL + PASSWORD

const registerUser = async(e)=>{

e.preventDefault();

try{

const userCredential =
await createUserWithEmailAndPassword(
auth,
email,
password
);


// إعداد رابط التفعيل (مهم جدًا مع HashRouter)

const actionCodeSettings = {

url: window.location.origin + "/#/verify-email",

handleCodeInApp: true

};


// إرسال رسالة التفعيل

await sendEmailVerification(
userCredential.user,
actionCodeSettings
);


// حفظ المستخدم داخل Firestore

await setDoc(
doc(db,"users",userCredential.user.uid),
{

email: userCredential.user.email,
role: "user",
verified: false,
createdAt: new Date()

}
);


alert("Verification email sent. Check your Gmail 📩");

navigate("/verify-email");


}catch(error){

console.log(error);

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

alert("Registration failed. Try again");

}

}

};


// REGISTER WITH GOOGLE

const registerWithGoogle = async()=>{

try{

const result = await signInWithPopup(
auth,
provider
);


// التأكد هل المستخدم موجود بالفعل

const docRef = doc(
db,
"users",
result.user.uid
);

const docSnap = await getDoc(docRef);


// لو أول مرة يسجل

if(!docSnap.exists()){

await setDoc(
docRef,
{

email: result.user.email,
role: "user",
verified: true,
createdAt: new Date()

}
);

}


navigate("/");


}catch(error){

console.log(error);

alert("Google sign up failed");

}

};


return(

<div className="flex justify-center items-center h-screen bg-gray-100">

<form
onSubmit={registerUser}
className="bg-white shadow-lg p-8 rounded-lg w-96"
>

<h2 className="text-2xl mb-6 font-semibold text-center">

Create Account

</h2>


<input
type="email"
placeholder="Email"
className="border p-2 w-full mb-4 rounded"
onChange={(e)=>setEmail(e.target.value)}
required
/>


<input
type="password"
placeholder="Password"
className="border p-2 w-full mb-4 rounded"
onChange={(e)=>setPassword(e.target.value)}
required
/>


<button
className="bg-green-500 hover:bg-green-600 text-white w-full p-2 rounded transition"
>

Register

</button>


<button
type="button"
onClick={registerWithGoogle}
className="bg-red-500 hover:bg-red-600 text-white w-full p-2 rounded transition mt-3"
>

Register with Google

</button>


</form>

</div>

);

}