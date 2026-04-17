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


function AddPackage() {

  const [offers, setOffers] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");

  const [duration, setDuration] = useState("");

  const [hotel, setHotel] = useState("");

  const [transport, setTransport] = useState("");

  const [trips, setTrips] = useState("");

  const [food, setFood] = useState("");

  const [price, setPrice] = useState("");

 const [images, setImages] = useState([]);


  const fetchOffers = async () => {

    const snapshot = await getDocs(
      collection(db, "offers")
    );

    setOffers(

      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

    );

  };


  useEffect(() => {

    fetchOffers();

  }, []);


  const handleImageUpload = (e) => {

const files = Array.from(e.target.files);

Promise.all(

files.map(file => {

return new Promise(resolve => {

const reader = new FileReader();

reader.onloadend = () => resolve(reader.result);

reader.readAsDataURL(file);

});

})

).then(results => {

setImages(results);

});

};

  const handleSubmit = async () => {

    if (editingId) {

      await updateDoc(doc(db, "offers", editingId), {

        title,

        duration,

        hotel,

        transport,

        trips,

        food,

        price,

        images

      });

      setEditingId(null);

    } else {

      await addDoc(collection(db, "offers"), {

        title,

        duration,

        hotel,

        transport,

        trips,

        food,

        price,

        image

      });

    }


    fetchOffers();

  };


  const handleDelete = async (id) => {

    await deleteDoc(doc(db, "offers", id));

    fetchOffers();

  };


  const handleEdit = (item) => {

    setEditingId(item.id);

    setTitle(item.title);

    setDuration(item.duration);

    setHotel(item.hotel);

    setTransport(item.transport);

    setTrips(item.trips);

    setFood(item.food);

    setPrice(item.price);

    setImage(item.image);

  };


  return (

    <div>

      <div className="bg-gray-100 p-6 rounded-xl mb-10">

        <h2 className="text-xl font-bold mb-4">

          {editingId ? "Edit Package" : "Add Package"}

        </h2>


        <input
          value={title}
          placeholder="Package Title"
          className="border p-2 w-full mb-3"
          onChange={(e) => setTitle(e.target.value)}
        />


        <input
          value={duration}
          placeholder="Duration"
          className="border p-2 w-full mb-3"
          onChange={(e) => setDuration(e.target.value)}
        />


        <input
          value={hotel}
          placeholder="Hotel Name"
          className="border p-2 w-full mb-3"
          onChange={(e) => setHotel(e.target.value)}
        />


        <input
          value={transport}
          placeholder="Transport Details"
          className="border p-2 w-full mb-3"
          onChange={(e) => setTransport(e.target.value)}
        />


        <input
          value={trips}
          placeholder="Trips Included"
          className="border p-2 w-full mb-3"
          onChange={(e) => setTrips(e.target.value)}
        />


        <input
          value={food}
          placeholder="Food Included"
          className="border p-2 w-full mb-3"
          onChange={(e) => setFood(e.target.value)}
        />


        <input
          value={price}
          placeholder="Price"
          className="border p-2 w-full mb-3"
          onChange={(e) => setPrice(e.target.value)}
        />


    <input
type="file"
multiple
className="border p-2 w-full mb-3"
onChange={handleImageUpload}
/>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {editingId ? "Update Package" : "Add Package"}
        </button>

      </div>


      {offers.map(item => (

        <div
          key={item.id}
          className="flex justify-between items-center bg-white shadow p-4 mb-3 rounded"
        >

          <div>

            <h3 className="font-bold">

              {item.title}

            </h3>


            <p className="text-gray-500">

              ${item.price}

            </p>

          </div>


          <div className="flex gap-2">

            <button
              onClick={() => handleEdit(item)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>


            <button
              onClick={() => handleDelete(item.id)}
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


export default AddPackage;