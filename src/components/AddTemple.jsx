import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";


function AddTemple() {

  const [temples, setTemples] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");

  const [location, setLocation] = useState("");

  const [price, setPrice] = useState("");

  const [description, setDescription] = useState("");

  const [image, setImage] = useState("");

  const [isBestSeller, setIsBestSeller] = useState(false);

  const [isOffer, setIsOffer] = useState(false);


  // تحميل المعابد من Firebase
  const fetchTemples = async () => {

    const snapshot = await getDocs(
      collection(db, "temples")
    );

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTemples(data);
  };


  useEffect(() => {

    fetchTemples();

  }, []);


  // رفع الصورة
  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {

      setImage(reader.result);

    };

    reader.readAsDataURL(file);

  };


  // إضافة أو تعديل
  const handleSubmit = async () => {

    if (!name || !location || !price) {

      alert("Please fill all required fields");

      return;

    }


    if (editingId) {

      await updateDoc(doc(db, "temples", editingId), {

        name,
        location,
        price: Number(price),
        description,
        image,
        isBestSeller,
        isOffer,

      });

      setEditingId(null);

    } else {

      await addDoc(collection(db, "temples"), {

        name,
        location,
        price: Number(price),
        description,
        image,
        isBestSeller,
        isOffer,

      });

    }


    // Reset form
    setName("");
    setLocation("");
    setPrice("");
    setDescription("");
    setImage("");
    setIsBestSeller(false);
    setIsOffer(false);


    fetchTemples();

  };


  // حذف
  const handleDelete = async (id) => {

    await deleteDoc(doc(db, "temples", id));

    fetchTemples();

  };


  // تعديل
  const handleEdit = (temple) => {

    setEditingId(temple.id);

    setName(temple.name);

    setLocation(temple.location);

    setPrice(temple.price);

    setDescription(temple.description);

    setImage(temple.image);

    setIsBestSeller(temple.isBestSeller || false);

    setIsOffer(temple.isOffer || false);

  };


  return (

    <div className="p-10">

      <div className="bg-gray-100 p-6 rounded-xl mb-10">

        <h2 className="text-xl font-bold mb-4">

          {editingId ? "Edit Temple" : "Add Temple"}

        </h2>


        <input
          value={name}
          placeholder="Temple Name"
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
          placeholder="Ticket Price"
          className="border p-2 w-full mb-3"
          onChange={(e) => setPrice(e.target.value)}
        />


        <input
          type="file"
          className="border p-2 w-full mb-3"
          onChange={handleImageUpload}
        />


        <textarea
          value={description}
          placeholder="Description"
          className="border p-2 w-full mb-3"
          onChange={(e) => setDescription(e.target.value)}
        />


        <label className="flex gap-2 mb-2">

          <input
            type="checkbox"
            checked={isBestSeller}
            onChange={(e) => setIsBestSeller(e.target.checked)}
          />

          Best Seller

        </label>


        <label className="flex gap-2 mb-4">

          <input
            type="checkbox"
            checked={isOffer}
            onChange={(e) => setIsOffer(e.target.checked)}
          />

          Special Offer

        </label>


        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >

          {editingId ? "Update Temple" : "Add Temple"}

        </button>

      </div>


      {/* عرض المعابد */}

      {temples.map((temple) => (

        <div
          key={temple.id}
          className="flex justify-between items-center bg-white shadow p-4 mb-3 rounded"
        >

          <div>

            <h3 className="font-bold">

              {temple.name}

            </h3>


            <p className="text-gray-500">

              ${temple.price}

            </p>

          </div>


          <div className="flex gap-2">

            <button
              onClick={() => handleEdit(temple)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >

              Edit

            </button>


            <button
              onClick={() => handleDelete(temple.id)}
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


export default AddTemple;