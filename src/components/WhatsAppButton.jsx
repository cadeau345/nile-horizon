function WhatsAppButton({ serviceName }) {

  const phoneNumber = "201034022992"; // ضع رقم صاحب الموقع هنا

  const message = `Hello, I want to book: ${serviceName}`;

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;


  return (

    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >

      <button className="mt-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl w-full">

        Book via WhatsApp

      </button>

    </a>

  );

}

export default WhatsAppButton;