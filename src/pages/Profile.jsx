import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { FaUserCircle } from "react-icons/fa";

function Profile(){

const { user } = useContext(AuthContext);

const navigate = useNavigate();

const logoutUser = async ()=>{

await signOut(auth);

navigate("/customer-login");

};

if(!user){

return(

<div className="h-screen flex justify-center items-center">

<p>Please login first</p>

</div>

);

}

return(

<div className="h-screen flex justify-center items-center bg-gray-100">

<div className="bg-white shadow-xl rounded-xl p-10 text-center w-[420px]">

<FaUserCircle className="text-7xl text-blue-900 mx-auto mb-4" />

<h2 className="text-2xl font-bold mb-2">

Your Profile

</h2>

<p className="text-gray-600 mb-2">

{user.email}

</p>

<p className={`mb-6 font-semibold ${
user.emailVerified
? "text-green-600"
: "text-red-500"
}`}>

{user.emailVerified ? "Email Verified ✅" : "Email Not Verified ❌"}

</p>

<button
onClick={()=>navigate("/my-bookings")}
className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full mb-3"
>

My Bookings

</button>

<button
onClick={logoutUser}
className="bg-red-500 text-white px-6 py-2 rounded-lg w-full"
>

Logout

</button>

</div>

</div>

);

}

export default Profile;