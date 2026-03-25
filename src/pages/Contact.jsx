import { useState } from "react";
import { Helmet } from "react-helmet-async";

function Contact() {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");


  const handleSubmit = () => {

    alert("Message sent successfully");

  };


  return (

    <div className="p-10 max-w-6xl mx-auto">
          <Helmet>

        <title>
          Contact Nile Horizon | Aswan Travel Support
        </title>

        <meta
          name="description"
          content="Contact Nile Horizon travel team for hotel bookings, trips and transport services in Aswan."
        />

      </Helmet>

      <h1 className="text-4xl font-bold text-blue-900 mb-6">

        Contact Us

      </h1>


      <div className="grid md:grid-cols-2 gap-10">


        {/* Contact Info */}

        <div>

          <h2 className="text-2xl font-bold mb-4">

            Get in Touch

          </h2>


          <p className="text-gray-700 mb-3">

            📍 Aswan, Egypt

          </p>


          <p className="text-gray-700 mb-3">

            📞 +20 1115299916

          </p>


          <p className="text-gray-700 mb-3">
          📧 cadeau200510@gmail.com

          </p>


          <a
            href="https://wa.me/201034022992"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-green-600 px-5 py-2 rounded text-white hover:bg-green-700"
          >

            Chat on WhatsApp

          </a>


          {/* Google Map */}

          <iframe
            title="Aswan Map"
            src="https://www.google.com/maps?q=Aswan,Egypt&output=embed"
            width="100%"
            height="250"
            className="mt-6 rounded-lg"
            loading="lazy"
          ></iframe>

        </div>


        {/* Contact Form */}

        <div className="bg-gray-100 p-6 rounded-xl">

          <h2 className="text-2xl font-bold mb-4">

            Send us a Message

          </h2>


          <input
            placeholder="Your Name"
            className="border p-2 rounded w-full mb-3"
            onChange={(e) => setName(e.target.value)}
          />


          <input
            placeholder="Your Email"
            className="border p-2 rounded w-full mb-3"
            onChange={(e) => setEmail(e.target.value)}
          />


          <textarea
            placeholder="Your Message"
            className="border p-2 rounded w-full mb-3"
            rows="5"
            onChange={(e) => setMessage(e.target.value)}
          />


          <button
            onClick={handleSubmit}
            className="bg-blue-900 text-white px-6 py-2 rounded w-full"
          >

            Send Message

          </button>

        </div>

      </div>

    </div>

  );

}

export default Contact;