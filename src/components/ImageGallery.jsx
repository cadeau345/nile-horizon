import { useState, useEffect } from "react";

function ImageGallery({ images = [], fallback }) {

const galleryImages =
images && images.length > 0
? images
: fallback
? [fallback]
: [];

const [index, setIndex] = useState(0);

const [fullscreen, setFullscreen] = useState(false);


// auto slide

useEffect(() => {

if (galleryImages.length <= 1) return;

const interval = setInterval(() => {

setIndex(prev => (prev + 1) % galleryImages.length);

}, 4000);

return () => clearInterval(interval);

}, [galleryImages.length]);


// keyboard navigation

useEffect(() => {

const handleKey = (e) => {

if (!fullscreen) return;

if (e.key === "ArrowRight")
setIndex((index + 1) % galleryImages.length);

if (e.key === "ArrowLeft")
setIndex(
(index - 1 + galleryImages.length) %
galleryImages.length
);

if (e.key === "Escape")
setFullscreen(false);

};

window.addEventListener("keydown", handleKey);

return () =>
window.removeEventListener("keydown", handleKey);

}, [fullscreen, index, galleryImages.length]);


// next

const next = () => {

setIndex((index + 1) % galleryImages.length);

};


// prev

const prev = () => {

setIndex(
(index - 1 + galleryImages.length) %
galleryImages.length
);

};


// swipe support

let touchStartX = 0;

const handleTouchStart = (e) => {

touchStartX = e.touches[0].clientX;

};

const handleTouchEnd = (e) => {

const diff =
touchStartX - e.changedTouches[0].clientX;

if (diff > 50) next();

if (diff < -50) prev();

};


return (

<>

{/* main image */}

<div className="relative">

<img
src={galleryImages[index]}
alt=""
className="w-full h-[400px] object-cover rounded-xl cursor-pointer"
onClick={() => setFullscreen(true)}
onTouchStart={handleTouchStart}
onTouchEnd={handleTouchEnd}
/>


{/* arrows */}

{galleryImages.length > 1 && (

<>

<button
onClick={prev}
className="absolute left-2 top-1/2 bg-black text-white px-3 py-1 rounded"
>
‹
</button>


<button
onClick={next}
className="absolute right-2 top-1/2 bg-black text-white px-3 py-1 rounded"
>
›
</button>

</>

)}


{/* thumbnails */}

{galleryImages.length > 1 && (

<div className="flex gap-2 mt-4 overflow-x-auto">

{galleryImages.map((img, i) => (

<img
key={i}
src={img}
onClick={() => setIndex(i)}
className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
index === i
? "border-blue-600"
: "border-transparent"
}`}
/>

))}

</div>

)}

</div>


{/* fullscreen lightbox */}

{fullscreen && (

<div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">

<button
onClick={() => setFullscreen(false)}
className="absolute top-6 right-6 text-white text-3xl"
>
✕
</button>


<img
src={galleryImages[index]}
alt=""
className="max-h-[80vh] max-w-[90vw]"
onTouchStart={handleTouchStart}
onTouchEnd={handleTouchEnd}
/>


{/* arrows fullscreen */}

{galleryImages.length > 1 && (

<>

<button
onClick={prev}
className="absolute left-10 text-white text-4xl"
>
‹
</button>


<button
onClick={next}
className="absolute right-10 text-white text-4xl"
>
›
</button>

</>

)}


{/* thumbnails fullscreen */}

<div className="flex gap-2 mt-6 overflow-x-auto">

{galleryImages.map((img, i) => (

<img
key={i}
src={img}
onClick={() => setIndex(i)}
className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
index === i
? "border-blue-500"
: "border-transparent"
}`}
/>

))}

</div>

</div>

)}

</>

);

}

export default ImageGallery;