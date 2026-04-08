import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";


function Profile(){

const { user } = useContext(AuthContext);

return(

<div className="p-10">

<h1 className="text-3xl font-bold">

Welcome {user?.email}

</h1>

</div>

);

}


export default Profile;