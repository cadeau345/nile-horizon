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

const [trips,setTrips]=useState([]);

const [editingId,setEditingId]=useState(null);

const [name,setName]=useState("");

const [duration,setDuration]=useState("");

const [price,setPrice]=useState("");

const [description,setDescription]=useState("");

const [image,setImage]=useState("");

const [images,setImages]=useState([]);

const [previewImages,setPreviewImages]=useState([]);

const [isBestSeller,setIsBestSeller]=useState(false);

const [isOffer,setIsOffer]=useState(false);



/*
============================
ضغط الصور تلقائيًا
============================
*/

const compressImage=(file)=>{

return new Promise((resolve)=>{

const reader=new FileReader();

reader.readAsDataURL(file);

reader.onload=(event)=>{

const img=new Image();

img.src=event.target.result;

img.onload=()=>{

const canvas=document.createElement("canvas");

const maxWidth=800;

const scale=maxWidth/img.width;

canvas.width=maxWidth;

canvas.height=img.height*scale;

const ctx=canvas.getContext("2d");

ctx.drawImage(img,0,0,canvas.width,canvas.height);

const compressed=canvas.toDataURL("image/jpeg",0.6);

resolve(compressed);

};

};

});

};



/*
============================
تحميل البيانات
============================
*/

const fetchTrips=async()=>{

const snapshot=await getDocs(
collection(db,"trips")
);

setTrips(

snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}))

);

};


useEffect(()=>{

fetchTrips();

},[]);



/*
============================
رفع الصور
============================
*/

const handleImageUpload=async(e)=>{

const files=Array.from(e.target.files);


// حد أقصى 10 صور

if(images.length+files.length>10){

alert("Maximum 10 images allowed");

return;

}


const compressedImages=await Promise.all(

files.map(file=>compressImage(file))

);


setImages(prev=>[...prev,...compressedImages]);

setPreviewImages(prev=>[...prev,...compressedImages]);

setImage(compressedImages[0]||image);

};



/*
============================
إضافة / تعديل
============================
*/

const handleSubmit=async()=>{

if(!name||!duration||!price){

alert("Please fill required fields");

return;

}


if(editingId){

await updateDoc(

doc(db,"trips",editingId),

{
name,
duration,
price,
description,
image,
images,
isBestSeller,
isOffer
}

);

setEditingId(null);

}

else{

await addDoc(

collection(db,"trips"),

{
name,
duration,
price,
description,
image,
images,
isBestSeller,
isOffer
}

);

}


// reset form

setName("");

setDuration("");

setPrice("");

setDescription("");

setImage("");

setImages([]);

setPreviewImages([]);

setIsBestSeller(false);

setIsOffer(false);


fetchTrips();

};



/*
============================
حذف
============================
*/

const handleDelete=async(id)=>{

await deleteDoc(doc(db,"trips",id));

fetchTrips();

};



/*
============================
تعديل
============================
*/

const handleEdit=(trip)=>{

setEditingId(trip.id);

setName(trip.name);

setDuration(trip.duration);

setPrice(trip.price);

setDescription(trip.description);

setImage(trip.image||"");

setImages(trip.images||[]);

setPreviewImages(trip.images||[]);

setIsBestSeller(trip.isBestSeller||false);

setIsOffer(trip.isOffer||false);

};



return(

<div>

<div className="bg-gray-100 p-6 rounded-xl mb-10">

<h2 className="text-xl font-bold mb-4">

{editingId?"Edit Trip":"Add Trip"}

</h2>


<input
value={name}
placeholder="Trip Name"
className="border p-2 w-full mb-3"
onChange={(e)=>setName(e.target.value)}
/>


<input
value={duration}
placeholder="Duration"
className="border p-2 w-full mb-3"
onChange={(e)=>setDuration(e.target.value)}
/>


<input
value={price}
placeholder="Price"
className="border p-2 w-full mb-3"
onChange={(e)=>setPrice(e.target.value)}
/>


<input
type="file"
multiple
accept="image/*"
className="border p-2 w-full mb-3"
onChange={handleImageUpload}
/>


{/* preview */}

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


<button
onClick={handleSubmit}
className="bg-green-600 text-white px-6 py-2 rounded"
>

{editingId?"Update Trip":"Add Trip"}

</button>

</div>



{/* عرض الرحلات */}

{trips.map(trip=>(

<div
key={trip.id}
className="flex justify-between items-center bg-white shadow p-4 mb-3 rounded"
>

<div className="flex items-center gap-4">

{trip.images?.length>0&&(

<img
src={trip.images[0]}
className="w-16 h-16 object-cover rounded"
alt=""
/>

)}

<div>

<h3 className="font-bold">

{trip.name}

</h3>

<p className="text-gray-500">

${trip.price}

</p>

</div>

</div>


<div className="flex gap-2">

<button
onClick={()=>handleEdit(trip)}
className="bg-yellow-500 text-white px-4 py-2 rounded"
>

Edit

</button>


<button
onClick={()=>handleDelete(trip.id)}
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