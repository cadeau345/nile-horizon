import { useState } from "react";

import {
signInWithEmailAndPassword,
GoogleAuthProvider,
signInWithPopup,
sendPasswordResetEmail,
reload,
sendEmailVerification
} from "firebase/auth";

import { auth, db } from "../firebase";

import { useNavigate } from "react-router-dom";

import {
doc,
getDoc,
setDoc
} from "firebase/firestore";


function Login() {

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const navigate = useNavigate();

const provider = new GoogleAuthProvider();


// LOGIN EMAIL + PASSWORD

const handleLogin = async () => {

try {

const userCredential = await signInWithEmailAndPassword(
auth,
email,
password
);

await reload(userCredential.user);


// لو الحساب غير مفعل

if(!userCredential.user.emailVerified){

await sendEmailVerification(
userCredential.user,
{
url: window.location.origin + "/#/verify-email"
}
);

alert("Verification email sent again 📩");

return;

}


// CHECK ADMIN ROLE

const docRef = doc(
db,
"users",
userCredential.user.uid
);

const docSnap = await getDoc(docRef);


if(docSnap.exists() && docSnap.data().role === "admin"){

navigate("/admin");

}else{

navigate("/");

}

}catch(error){

console.log(error);

alert("Wrong email or password");

}

};


// LOGIN WITH GOOGLE

const loginWithGoogle = async () => {

try{

const result = await signInWithPopup(
auth,
provider
);


// تأكد إن المستخدم موجود في Firestore

const docRef = doc(
db,
"users",
result.user.uid
);

const docSnap = await getDoc(docRef);


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


// CHECK ROLE

if(docSnap.exists() && docSnap.data().role === "admin"){

navigate("/admin");

}else{

navigate("/");

}

}catch(error){

console.log(error);

alert("Google login failed");

}

};


// FORGOT PASSWORD

const forgotPassword = async () => {

if(!email){

alert("Enter your email first");

return;

}


await sendPasswordResetEmail(
auth,
email,
{
url: window.location.origin + "/#/reset-password"
}
);


alert("Password reset email sent 📩");

};


return(

<div className="h-screen flex justify-center items-center bg-gray-100">

<div className="bg-white p-8 rounded-xl shadow-lg w-96">

<h2 className="text-2xl font-bold mb-6 text-center">

Login

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
className="bg-blue-900 text-white w-full py-2 rounded mb-3"
>

Login

</button>


<button
onClick={loginWithGoogle}
className="bg-red-500 text-white w-full py-2 rounded mb-3"
>

Login with Google

</button>


<button
onClick={forgotPassword}
className="text-blue-600 underline text-sm"
>

Forgot Password?

</button>


</div>

</div>

);

}

export default Login;