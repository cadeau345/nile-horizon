import { useState } from "react";

import {
signInWithEmailAndPassword,
reload
} from "firebase/auth";

import { auth } from "../firebase";

import { useNavigate } from "react-router-dom";


function Login() {

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const navigate = useNavigate();


const handleLogin = async () => {

try {

const userCredential =

await signInWithEmailAndPassword(
auth,
email,
password
);


// تحديث بيانات المستخدم

await reload(userCredential.user);


// التحقق من تفعيل الإيميل

if(!userCredential.user.emailVerified){

alert("Please verify your email first 📩");

return;

}


// تحويل الأدمن فقط إلى لوحة التحكم

navigate("/admin");


} catch(error) {

console.log(error);

alert("Wrong email or password");

}

};


return(

<div className="h-screen flex justify-center items-center bg-gray-100">

<div className="bg-white p-8 rounded-xl shadow-lg w-96">

<h2 className="text-2xl font-bold mb-6 text-center">

Admin Login

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
className="bg-blue-900 hover:bg-blue-800 text-white w-full py-2 rounded transition"
>

Login

</button>

</div>

</div>

);

}

export default Login;