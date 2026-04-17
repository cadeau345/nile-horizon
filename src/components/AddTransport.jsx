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


function AddTransport() {

  const [transport, setTransport] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [company, setCompany] = useState("");

  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  const [type, setType] = useState("");

  const [price, setPrice] = useState("");

  const [image, setImage] = useState("");

  const [images, setImages] = useState([]); // جديد

  const [isBestSeller,setIsBestSeller]=useState(false);

  const [isOffer,setIsOffer]=useState(false);


  const fetchTransport = async () => {

    const snapshot = await getDocs(
      collection(db, "transport")
    );

    setTransport(

      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

    );

  };


  useEffect(() => {

    fetchTransport();

  }, []);


  // رفع صور متعددة

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

          setImage(readers[0]); // توافق مع القديم

        }

      };

      reader.readAsDataURL(file);

    });

  };


  const handleSubmit = async () => {

    if (editingId) {

      await updateDoc(doc(db, "transport", editingId), {

        company,

        from,

        to,

        type,

        price,

        image,

        images,

        isBestSeller,

        isOffer

      });

      setEditingId(null);

    } else {

 await addDoc(collection(db, "transport"), {
  company,
  price,
  image,
  images,
  from,
  to,
  type,
  isBestSeller,
  isOffer
});

    }


    // Reset form

    setCompany("");
    setFrom("");
    setTo("");
    setType("");
    setPrice("");
    setImage("");
    setImages([]);
    setIsBestSeller(false);
    setIsOffer(false);


    fetchTransport();

  };


  const handleDelete = async (id) => {

    await deleteDoc(doc(db, "transport", id));

    fetchTransport();

  };


  const handleEdit = (item) => {

    setEditingId(item.id);

    setCompany(item.company);

    setFrom(item.from);

    setTo(item.to);

    setType(item.type);

    setPrice(item.price);

    setImage(item.image);

    setImages(item.images || []);

    setIsBestSeller(item.isBestSeller || false);

    setIsOffer(item.isOffer || false);

  };


  return (

    <div>

      <div className="bg-gray-100 p-6 rounded-xl mb-10">

        <h2 className="text-xl font-bold mb-4">

          {editingId ? "Edit Transport" : "Add Transport"}

        </h2>


        <input
          value={company}
          placeholder="Company Name"
          className="border p-2 w-full mb-3"
          onChange={(e) => setCompany(e.target.value)}
        />


        <input
          value={from}
          placeholder="From"
          className="border p-2 w-full mb-3"
          onChange={(e) => setFrom(e.target.value)}
        />


        <input
          value={to}
          placeholder="To"
          className="border p-2 w-full mb-3"
          onChange={(e) => setTo(e.target.value)}
        />


        <input
          value={type}
          placeholder="Type (Bus / Train / Car)"
          className="border p-2 w-full mb-3"
          onChange={(e) => setType(e.target.value)}
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
          {editingId ? "Update Transport" : "Add Transport"}
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


      {transport.map(item => (

        <div
          key={item.id}
          className="flex justify-between items-center bg-white shadow p-4 mb-3 rounded"
        >

          <div>

            <h3 className="font-bold">

              {item.company}

            </h3>


            <p className="text-gray-500">

              {item.type} — ${item.price}

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

export default AddTransport;