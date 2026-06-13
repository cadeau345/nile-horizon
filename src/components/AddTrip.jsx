import { useEffect, useState } from "react";
import axios from "axios";
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
collection(db,"tours")
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

doc(db,"tours",editingId),

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

const syncToursFromAPI = async () => {
  try {
    alert("Fetching Egypt tours...");

    const cities = [
      {
        name: "Cairo",
        geoId: 294201,
      },
      {
        name: "Luxor",
        geoId: 294205,
      },
      {
        name: "Aswan",
        geoId: 294204,
      },
      {
        name: "Hurghada",
        geoId: 297549,
      },
      {
        name: "Sharm El Sheikh",
        geoId: 297555,
      },
      {
        name: "Dahab",
        geoId: 297546,
      },
      {
        name: "Marsa Alam",
        geoId: 297548,
      },
    ];

    let addedCount = 0;

    for (const city of cities) {
      try {
        console.log(
          `Fetching ${city.name}...`
        );

        const response =
          await axios.post(
            "https://travel-advisor.p.rapidapi.com/attraction-products/v2/list?currency=USD&units=km&lang=en_US",
            {
              geoId:
                city.geoId,

              startDate:
                "2026-07-01",

              endDate:
                "2026-07-10",

              pax: [
                {
                  ageBand:
                    "ADULT",
                  count: 1,
                },
              ],

              sort:
                "TRAVELER_FAVORITE_V2",

              sortOrder:
                "desc",

              updateToken:
                "",
            },
            {
              headers: {
                "Content-Type":
                  "application/json",

                "x-rapidapi-key":
                  "c1250ddc30msh756e3f241204ba0p100fb8jsna436fe9c0f91",

                "x-rapidapi-host":
                  "travel-advisor.p.rapidapi.com",
              },
            }
          );

        const sections =
          response?.data
            ?.data
            ?.AppPresentation_queryAppListV2?.[0]
            ?.sections ||
          [];

        console.log(
          `${city.name}:`,
          sections.length
        );

        for (const section of sections) {
          try {
            const card =
              section?.listSingleCardContent;

            if (!card)
              continue;

            const title =
              card?.cardTitle
                ?.string ||
              card
                ?.primaryInfo
                ?.text ||
              "Unknown Tour";

            const image =
              card?.cardPhoto
                ?.sizes
                ?.urlTemplate
                ?.replace(
                  "{width}",
                  "800"
                )
                ?.replace(
                  "{height}",
                  "600"
                ) || "";

            const description =
              card
                ?.secondaryInfo
                ?.text ||
              card
                ?.descriptiveText
                ?.htmlString ||
              "No description available";

            const rating =
              Number(
                card
                  ?.bubbleRating
                  ?.rating ||
                  0
              );

            const reviews =
              card
                ?.bubbleRating
                ?.reviewCount ||
              0;

    let price = 0;

const apiPriceText =
  card?.commerceButtons?.[0]
    ?.price?.displayPrice ||
  card?.merchandisingText
    ?.htmlString ||
  "";

const match =
  apiPriceText.match(
    /[\d,.]+/
  );

if (match) {
  price = parseFloat(
    match[0].replace(
      /,/g,
      ""
    )
  );
}

// تنظيف الأسعار المبالغ فيها
if (
  price > 500 ||
  !price ||
  isNaN(price)
) {
  if (
    city.name ===
      "Hurghada" ||
    city.name ===
      "Sharm El Sheikh" ||
    city.name ===
      "Dahab" ||
    city.name ===
      "Marsa Alam"
  ) {
    // مدن البحر
    price =
      Math.floor(
        Math.random() *
          (250 - 35) +
          35
      );
  } else {
    // القاهرة والأقصر وأسوان
    price =
      Math.floor(
        Math.random() *
          (150 - 20) +
          20
      );
  }
}

            await addDoc(
              collection(
                db,
                "tours"
              ),
              {
                title,
                city:
                  city.name,
                category:
                  "Tour",
                description,
                image,
                rating,
                reviews,
                duration:
                  "Full Day",
                price,
                isBestSeller:
                  false,
                isOffer:
                  false,
                discountPrice:
                  "",
                createdAt:
                  new Date(),
              }
            );

            addedCount++;

            console.log(
              `Added ${addedCount}: ${title}`
            );
          } catch (err) {
            console.log(
              "Skipped:",
              err
            );
          }
        }
      } catch (err) {
        console.log(
          `Error in ${city.name}`,
          err
        );
      }
    }

    alert(
      `Done! Added ${addedCount} tours ✅`
    );
  } catch (error) {
    console.error(
      error
    );

    alert("Error ❌");
  }
};
const handleDelete=async(id)=>{

await deleteDoc(doc(db,"tours",id));

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
<button
  onClick={syncToursFromAPI}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  Sync Egypt Tours
</button>

</div>



{/* عرض الرحلات */}

{trips.map(trip=>(

<div
key={trip.id}
className="flex justify-between items-center bg-white shadow p-4 mb-3 rounded"
>

<div className="flex items-center gap-4">

<img
src={
  trip.images?.[0] ||
  trip.image ||
  "/placeholder.jpg"
}
className="w-16 h-16 object-cover rounded"
alt=""
/>

<div>

<h3 className="font-bold">
  {trip.title || trip.name}
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