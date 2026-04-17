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

  const [images, setImages] = useState([]); // جديد

  const [isBestSeller, setIsBestSeller] = useState(false);

  const [isOffer, setIsOffer] = useState(false);


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


  // دعم رفع صور متعددة

  const handleImageUpload = (e) => {

    const files = Array.from(e.target.files);

    if (!files.length) return;

    const readers = [];

    files.forEach((file) => {

      const reader = new FileReader();

      reader.onloadend = () => {

        readers.push(reader.result);

        if (readers.length === files.length) {

          setImages(readers);

          setImage(readers[0]); // توافق مع النظام القديم

        }

      };

      reader.readAsDataURL(file);

    });

  };


  const handleSubmit = async () => {

    if (editingId) {

      await updateDoc(doc(db, "trips", editingId), {

        name,

        duration,

        price,

        description,

        image,

        images,

        isBestSeller,

        isOffer

      });

      setEditingId(null);

    } else {

      await addDoc(collection(db,"trips"),{

        name,
        duration,
        price,
        description,
        image,
        images,
        isBestSeller,
        isOffer

      });

    }


    // Reset form

    setName("");
    setDuration("");
    setPrice("");
    setDescription("");
    setImage("");
    setImages([]);
    setIsBestSeller(false);
    setIsOffer(false);


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

    setImages(trip.images || []);

    setIsBestSeller(trip.isBestSeller || false);

    setIsOffer(trip.isOffer || false);

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
          multiple
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


      <label className="flex gap-2 mb-2">

<input
type="checkbox"
checked={isBestSeller}
onChange={(e)=>setIsBestSeller(e.target.checked)}
/>

Best Seller

</label>


<label className="flex gap-2 mb-4">

<input
type="checkbox"
checked={isOffer}
onChange={(e)=>setIsOffer(e.target.checked)}
/>

Special Offer

</label>


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