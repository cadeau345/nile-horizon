import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../firebase";


function AddTrip() {

  const [trips, setTrips] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");

  const [duration, setDuration] = useState("");

  const [price, setPrice] = useState("");

  const [description, setDescription] = useState("");

  const [image, setImage] = useState("");


  const fetchTrips = async () => {

    const snapshot = await getDocs(
      collection(db, "trips")
    );

    setTrips(

      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

    );

  };


  useEffect(() => {

    fetchTrips();

  }, []);


  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onloadend = () => {

      setImage(reader.result);

    };

    reader.readAsDataURL(file);

  };


  const handleSubmit = async () => {

    if (editingId) {

      await updateDoc(doc(db, "trips", editingId), {

        name,

        duration,

        price,

        description,

        image

      });

      setEditingId(null);

    } else {

      await addDoc(collection(db, "trips"), {

        name,

        duration,

        price,

        description,

        image

      });

    }


    fetchTrips();

  };


  const handleDelete = async (id) => {

    await deleteDoc(doc(db, "trips", id));

    fetchTrips();

  };


  const handleEdit = (trip) => {

    setEditingId(trip.id);

    setName(trip.name);

    setDuration(trip.duration);

    setPrice(trip.price);

    setDescription(trip.description);

    setImage(trip.image);

  };


  return (

    <div>

      <div className="bg-gray-100 p-6 rounded-xl mb-10">

        <h2 className="text-xl font-bold mb-4">

          {editingId ? "Edit Trip" : "Add Trip"}

        </h2>


        <input
          value={name}
          placeholder="Trip Name"
          className="border p-2 w-full mb-3"
          onChange={(e) => setName(e.target.value)}
        />


        <input
          value={duration}
          placeholder="Duration"
          className="border p-2 w-full mb-3"
          onChange={(e) => setDuration(e.target.value)}
        />


        <input
          value={price}
          placeholder="Price"
          className="border p-2 w-full mb-3"
          onChange={(e) => setPrice(e.target.value)}
        />


        <input
          type="file"
          className="border p-2 w-full mb-3"
          onChange={handleImageUpload}
        />


        <input
          value={description}
          placeholder="Description"
          className="border p-2 w-full mb-3"
          onChange={(e) => setDescription(e.target.value)}
        />


        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {editingId ? "Update Trip" : "Add Trip"}
        </button>

      </div>


      {trips.map(trip => (

        <div
          key={trip.id}
          className="flex justify-between items-center bg-white shadow p-4 mb-3 rounded"
        >

          <div>

            <h3 className="font-bold">

              {trip.name}

            </h3>


            <p className="text-gray-500">

              ${trip.price}

            </p>

          </div>


          <div className="flex gap-2">

            <button
              onClick={() => handleEdit(trip)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>


            <button
              onClick={() => handleDelete(trip.id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>

          </div>

        </div>

      ))}

    </div>

  );

}


export default AddTrip;