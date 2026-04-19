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

const [images, setImages] = useState([]);

const [previewImages, setPreviewImages] = useState([]);

const [isBestSeller, setIsBestSeller] = useState(false);

const [isOffer, setIsOffer] = useState(false);

const [discountPrice,setDiscountPrice]=useState("");


/*
============================
ضغط الصور تلقائيًا
============================
*/

const compressImage = (file) => {

return new Promise((resolve) => {

const reader = new FileReader();

reader.readAsDataURL(file);

reader.onload = (event) => {

const img = new Image();

img.src = event.target.result;

img.onload = () => {

const canvas = document.createElement("canvas");

const maxWidth = 800;

const scaleSize = maxWidth / img.width;

canvas.width = maxWidth;

canvas.height = img.height * scaleSize;

const ctx = canvas.getContext("2d");

ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

// ضغط الجودة
const compressedBase64 =
canvas.toDataURL("image/jpeg", 0.6);

resolve(compressedBase64);

};

};

});

};


/*
============================
جلب الفنادق
============================
*/

const fetchHotels = async () => {

const snapshot =
await getDocs(collection(db,"hotels"));

setHotels(

snapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}))

);

};


useEffect(()=>{

fetchHotels();

},[]);


/*
============================
رفع الصور
============================
*/

const handleImageUpload = async (e) => {

const files = Array.from(e.target.files);


// حد أقصى 10 صور

if(images.length + files.length > 10){

alert("Maximum 10 images allowed");

return;

}


const compressedImages = await Promise.all(

files.map(file => compressImage(file))

);


setImages(prev=>[...prev,...compressedImages]);

setPreviewImages(prev=>[...prev,...compressedImages]);

};


/*
============================
إضافة أو تعديل فندق
============================
*/

const handleSubmit = async () => {

if(!name || !location || !price){

alert("Please fill required fields");

return;

}


if(editingId){

await updateDoc(

doc(db,"hotels",editingId),

{
name,
location,
price,
discountPrice,
description,
images,
isBestSeller,
isOffer
}

);

setEditingId(null);

}

else{

await addDoc(

collection(db,"hotels"),

{
name,
location,
price,
discountPrice,
description,
images,
isBestSeller,
isOffer
}

);

}


setName("");

setLocation("");

setPrice("");

setDescription("");

setImages([]);

setPreviewImages([]);

setDiscountPrice("");

setIsBestSeller(false);

setIsOffer(false);


fetchHotels();

};


/*
============================
حذف فندق
============================
*/

const handleDelete = async (id) => {

await deleteDoc(doc(db,"hotels",id));

fetchHotels();

};


/*
============================
تعديل فندق
============================
*/

const handleEdit = (hotel) => {

setEditingId(hotel.id);

setName(hotel.name);

setLocation(hotel.location);

setPrice(hotel.price);

setDescription(hotel.description);

setImages(hotel.images || []);

setPreviewImages(hotel.images || []);

setDiscountPrice(hotel.discountPrice || "");

setIsBestSeller(hotel.isBestSeller || false);

setIsOffer(hotel.isOffer || false);

};


return(

<div>

<div className="bg-gray-100 p-6 rounded-xl mb-10">

<h2 className="text-xl font-bold mb-4">

{editingId ? "Edit Hotel" : "Add Hotel"}

</h2>


<input
value={name}
placeholder="Hotel Name"
className="border p-2 w-full mb-3"
onChange={(e)=>setName(e.target.value)}
/>


<input
value={location}
placeholder="Location"
className="border p-2 w-full mb-3"
onChange={(e)=>setLocation(e.target.value)}
/>


<input
value={price}
placeholder="Price"
className="border p-2 w-full mb-3"
onChange={(e)=>setPrice(e.target.value)}
/>


<input
value={discountPrice}
placeholder="Discount Price (optional)"
className="border p-2 w-full mb-3"
onChange={(e)=>setDiscountPrice(e.target.value)}
/>


<input
type="file"
multiple
accept="image/*"
className="border p-2 w-full mb-3"
onChange={handleImageUpload}
/>


<div className="flex gap-2 flex-wrap mb-4">

{previewImages.map((img,index)=>(

<img
key={index}
src={img}
alt="preview"
className="w-20 h-20 object-cover rounded"
/>

))}

</div>


<input
value={description}
placeholder="Description"
className="border p-2 w-full mb-3"
onChange={(e)=>setDescription(e.target.value)}
/>


<label className="flex gap-2 mb-2">

<input
type="checkbox"
checked={isBestSeller}
onChange={(e)=>
setIsBestSeller(e.target.checked)
}
/>

Best Seller

</label>


<label className="flex gap-2 mb-4">

<input
type="checkbox"
checked={isOffer}
onChange={(e)=>
setIsOffer(e.target.checked)
}
/>

Special Offer

</label>


<button
onClick={handleSubmit}
className="bg-green-600 text-white px-6 py-2 rounded"
>

{editingId ? "Update Hotel" : "Add Hotel"}

</button>

</div>


{hotels.map(hotel=>(

<div
key={hotel.id}
className="flex justify-between items-center bg-white shadow p-4 mb-3 rounded"
>

<div className="flex items-center gap-4">

{hotel.images?.length>0 &&(

<img
src={hotel.images[0]}
alt="hotel"
className="w-16 h-16 object-cover rounded"
/>

)}

<div>

<h3 className="font-bold">

{hotel.name}

</h3>

<p className="text-gray-500">

${hotel.price}

</p>

</div>

</div>


<div className="flex gap-2">

<button
onClick={()=>handleEdit(hotel)}
className="bg-yellow-500 text-white px-4 py-2 rounded"
>

Edit

</button>


<button
onClick={()=>handleDelete(hotel.id)}
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