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
import axios from "axios";

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


// ✅ rooms states الجديدة

const [rooms,setRooms]=useState([]);

const [roomName,setRoomName]=useState("");

const [roomGuests,setRoomGuests]=useState("");

const [roomPrice,setRoomPrice]=useState("");

const [roomFeatures,setRoomFeatures]=useState("");
const [locationMap,setLocationMap]=useState("");



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
إضافة غرفة
============================
*/

const handleAddRoom=()=>{

if(!roomName || !roomGuests || !roomPrice){

alert("Fill room data");

return;

}

setRooms(prev=>[

...prev,

{
name:roomName,
guests:Number(roomGuests),
price:Number(roomPrice),
features:roomFeatures.split(",")
}

]);

setRoomName("");

setRoomGuests("");

setRoomPrice("");

setRoomFeatures("");

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
isOffer,
rooms
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
isOffer,
rooms
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

setRooms([]);


fetchHotels();

};



/*
============================
حذف فندق
============================
*/

const syncHotelsFromAPI = async () => {
  try {
    alert("Fetching Egypt hotels...");

    const egyptCities = [
      { name: "Cairo", id: "-290692" },
      { name: "Giza", id: "-290029" },
      { name: "Alexandria", id: "-290263" },
      { name: "Sharm El Sheikh", id: "-302053" },
      { name: "Hurghada", id: "-290900" },
      { name: "Luxor", id: "-290340" },
      { name: "Aswan", id: "-290157" },
      { name: "Marsa Alam", id: "-293825" },
      { name: "Dahab", id: "-290757" },
      { name: "El Gouna", id: "-291822" },
    ];

    // Delay function
    const sleep = (ms) =>
      new Promise((resolve) =>
        setTimeout(resolve, ms)
      );

    const existingHotels = new Set();

    const existingSnapshot =
      await getDocs(
        collection(db, "hotels")
      );

    existingSnapshot.forEach((doc) => {
      existingHotels.add(
        doc.data().name
      );
    });

    for (const city of egyptCities) {

      console.log(
        `Starting ${city.name}`
      );

      // قللتها لـ 8 صفحات علشان الـ free plan
      for (let page = 1; page <= 8; page++) {

        console.log(
          `Fetching ${city.name} page ${page}`
        );

        try {

          const response =
            await axios.get(
              "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels",
              {
                params: {
                  dest_id: city.id,
                  search_type: "CITY",
                  arrival_date:
                    "2026-06-15",
                  departure_date:
                    "2026-06-18",
                  adults: "2",
                  room_qty: "1",
                  page_number:
                    page.toString(),
                  currency_code:
                    "EGP",
                  languagecode:
                    "en-us",
                },

                headers: {
                  "x-rapidapi-key":
                    "fb51683203mshf0c81a04e5359adp14a1c8jsn67caa812920d",

                  "x-rapidapi-host":
                    "booking-com15.p.rapidapi.com",
                },
              }
            );

          const hotels =
            response.data?.data
              ?.hotels || [];

          if (!hotels.length) {
            console.log(
              `No hotels in ${city.name} page ${page}`
            );
            break;
          }

          for (const hotel of hotels) {

            const hotelName =
              hotel.property?.name;

            if (
              !hotelName ||
              existingHotels.has(
                hotelName
              )
            ) {
              continue;
            }

            await addDoc(
              collection(
                db,
                "hotels"
              ),
              {
                name:
                  hotelName ||
                  "Unknown Hotel",

                location:
                  city.name,

                price:
                  Math.round(
                    Number(
                      hotel.property
                        ?.priceBreakdown
                        ?.grossPrice
                        ?.value || 0
                    )
                  ),

                description:
                  hotel.accessibilityLabel ||
                  "",

                images:
                  hotel.property
                    ?.photoUrls ||
                  [],

                rating:
                  hotel.property
                    ?.reviewScore ||
                  0,

                isBestSeller:
                  false,

                isOffer:
                  false,

                discountPrice:
                  "",

                rooms: [],
              }
            );

            existingHotels.add(
              hotelName
            );
          }

          // Delay 2 sec
          await sleep(2000);

        } catch (error) {

          // لو API وقفك
          if (
            error.response?.status ===
            429
          ) {
            console.log(
              "Too many requests. Waiting 20 seconds..."
            );

            await sleep(
              20000
            );

            page--; // يعيد نفس الصفحة
            continue;
          }

          console.error(
            `Error in ${city.name} page ${page}`,
            error
          );
        }
      }
    }

    alert(
      "Thousands of Egypt hotels added ✅"
    );

    fetchHotels();

  } catch (error) {

    console.error(error);

    alert(
      "Error fetching hotels ❌"
    );
  }
};
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

setRooms(hotel.rooms || []);

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
value={locationMap}
placeholder="Google Map Embed URL"
className="border p-2 w-full mb-3"
onChange={(e)=>setLocationMap(e.target.value)}
/>

<input
value={discountPrice}
placeholder="Discount Price (optional)"
className="border p-2 w-full mb-3"
onChange={(e)=>setDiscountPrice(e.target.value)}
/>



{/* إضافة غرفة */}


<div className="bg-white p-4 rounded mb-4">

<h3 className="font-bold mb-2">

Add Room Type

</h3>


<input
placeholder="Room Name"
value={roomName}
className="border p-2 w-full mb-2"
onChange={(e)=>setRoomName(e.target.value)}
/>


<input
placeholder="Guests"
value={roomGuests}
className="border p-2 w-full mb-2"
onChange={(e)=>setRoomGuests(e.target.value)}
/>


<input
placeholder="Room Price"
value={roomPrice}
className="border p-2 w-full mb-2"
onChange={(e)=>setRoomPrice(e.target.value)}
/>


<input
placeholder="Features (comma separated)"
value={roomFeatures}
className="border p-2 w-full mb-2"
onChange={(e)=>setRoomFeatures(e.target.value)}
/>


<button
onClick={handleAddRoom}
className="bg-blue-600 text-white px-4 py-2 rounded"
>

Add Room

</button>
<button
  onClick={syncHotelsFromAPI}
  className="bg-blue-600 text-white px-6 py-2 rounded ml-3"
>
  Sync Hotels From API
</button>


{rooms.map((room,index)=>(

<p key={index}>

{room.name} — ${room.price}

</p>

))}

</div>



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