import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { auth } from "../firebase";

import { signOut } from "firebase/auth";

import AddHotel from "../components/AddHotel";

import AddTransport from "../components/AddTransport";

import AddTrip from "../components/AddTrip";

import AddPackage from "../components/AddPackage";

import ViewBookings from "../components/ViewBookings";


function Admin() {

  const [tab, setTab] = useState("hotel");

  const navigate = useNavigate();


  // حماية الصفحة

  useEffect(() => {

    const user = auth.currentUser;

    if (!user) {

      navigate("/login");

    }

  }, []);


  // Logout function

  const handleLogout = async () => {

    await signOut(auth);

    navigate("/login");

  };


  return (

    <div className="p-10">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">

          Admin Dashboard

        </h1>


        <button

          onClick={handleLogout}

          className="bg-red-600 text-white px-4 py-2 rounded"

        >

          Logout

        </button>

      </div>


      <div className="flex gap-4 mb-8 flex-wrap">

        <button
          onClick={() => setTab("hotel")}
          className="bg-blue-900 text-white px-4 py-2 rounded"
        >
          Add Hotel
        </button>


        <button
          onClick={() => setTab("transport")}
          className="bg-blue-900 text-white px-4 py-2 rounded"
        >
          Add Transport
        </button>


        <button
          onClick={() => setTab("trip")}
          className="bg-blue-900 text-white px-4 py-2 rounded"
        >
          Add Trip
        </button>


        <button
          onClick={() => setTab("package")}
          className="bg-blue-900 text-white px-4 py-2 rounded"
        >
          Add Package
        </button>


        <button
          onClick={() => setTab("bookings")}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          View Bookings
        </button>

      </div>


      {tab === "hotel" && <AddHotel />}

      {tab === "transport" && <AddTransport />}

      {tab === "trip" && <AddTrip />}

      {tab === "package" && <AddPackage />}

      {tab === "bookings" && <ViewBookings />}

    </div>

  );

}

export default Admin;