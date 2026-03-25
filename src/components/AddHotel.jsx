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


function AddHotel() {

  const [hotels, setHotels] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");

  const [location, setLocation] = useState("");

  const [price, setPrice] = useState("");

  const [description, setDescription] = useState("");

  const [image, setImage] = useState("");


  const fetchHotels = async () => {

    const snapshot = await getDocs(
      collection(db, "hotels")
    );

    setHotels(

      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

    );

  };


  useEffect(() => {

    fetchHotels();

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

      await updateDoc(doc(db, "hotels", editingId), {

        name,

        location,

        price,

        description,

        image

      });

      setEditingId(null);

    } else {

      await addDoc(collection(db, "hotels"), {

        name,

        location,

        price,

        description,

        image

      });

    }


    fetchHotels();

  };


  const handleDelete = async (id) => {

    await deleteDoc(doc(db, "hotels", id));

    fetchHotels();

  };


  const handleEdit = (hotel) => {

    setEditingId(hotel.id);

    setName(hotel.name);

    setLocation(hotel.location);

    setPrice(hotel.price);

    setDescription(hotel.description);

    setImage(hotel.image);

  };


  return (

    <div>

      <div className="bg-gray-100 p-6 rounded-xl mb-10">

        <h2 className="text-xl font-bold mb-4">

          {editingId ? "Edit Hotel" : "Add Hotel"}

        </h2>


        <input
          value={name}
          placeholder="Hotel Name"
          className="border p-2 w-full mb-3"
          onChange={(e) => setName(e.target.value)}
        />


        <input
          value={location}
          placeholder="Location"
          className="border p-2 w-full mb-3"
          onChange={(e) => setLocation(e.target.value)}
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
          {editingId ? "Update Hotel" : "Add Hotel"}
        </button>

      </div>


      {hotels.map(hotel => (

        <div
          key={hotel.id}
          className="flex justify-between items-center bg-white shadow p-4 mb-3 rounded"
        >

          <div>

            <h3 className="font-bold">

              {hotel.name}

            </h3>


            <p className="text-gray-500">

              ${hotel.price}

            </p>

          </div>


          <div className="flex gap-2">

            <button
              onClick={() => handleEdit(hotel)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>


            <button
              onClick={() => handleDelete(hotel.id)}
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


export default AddHotel;