function FloatingWhatsApp() {

  const phoneNumber = "201034022992"; // حط رقم صاحب الموقع هنا

  const message = "Hello, I want to ask about booking in Aswan.";

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;


  return (

    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >

      <div className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition">

        📲 WhatsApp

      </div>

    </a>

  );

}

export default FloatingWhatsApp;