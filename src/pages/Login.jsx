import { useState } from "react";

import {
signInWithEmailAndPassword,
GoogleAuthProvider,
signInWithPopup,
sendPasswordResetEmail,
reload
} from "firebase/auth";

import { auth, db } from "../firebase";

import { useNavigate } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";


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


// CHECK EMAIL VERIFIED

if(!userCredential.user.emailVerified){

alert("Please verify your email first 📩");

return;

}


// CHECK ADMIN ROLE

const docRef = doc(db,"users",userCredential.user.uid);

const docSnap = await getDoc(docRef);


if(docSnap.exists() && docSnap.data().role === "admin"){

navigate("/admin");

}else{

navigate("/");

}

}catch(error){

alert("Wrong email or password");

}

};


// LOGIN WITH GOOGLE

const loginWithGoogle = async () => {

try{

const result = await signInWithPopup(auth,provider);

const docRef = doc(db,"users",result.user.uid);

const docSnap = await getDoc(docRef);


if(docSnap.exists() && docSnap.data().role === "admin"){

navigate("/admin");

}else{

navigate("/");

}

}catch(error){

console.log(error);

}

};


// FORGOT PASSWORD

const forgotPassword = async () => {

if(!email){

alert("Enter your email first");

return;

}

await sendPasswordResetEmail(auth,email);

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