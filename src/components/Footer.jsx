import { Link } from "react-router-dom";

function Footer() {

  return (

    <footer className="bg-blue-900 text-white mt-16">

      <div className="max-w-7xl mx-auto px-8 py-10 grid md:grid-cols-3 gap-8">


        {/* About */}

        <div>

          <h2 className="text-xl font-bold mb-3">

            Nile Horizon

          </h2>

          <p className="text-gray-200">

            Discover the beauty of Aswan with our best hotels,
            transport services, trips, and exclusive packages.

          </p>

        </div>


        {/* Quick Links */}

        <div>

          <h2 className="text-xl font-bold mb-3">

            Quick Links

          </h2>

          <ul className="space-y-2 text-gray-200">

            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/hotels">Hotels</Link>
            </li>

            <li>
              <Link to="/transport">Transport</Link>
            </li>

            <li>
              <Link to="/trips">Trips</Link>
            </li>

            <li>
              <Link to="/offers">Offers</Link>
            </li>

          </ul>

        </div>


        {/* Contact */}

        <div>

          <h2 className="text-xl font-bold mb-3">

            Contact Us

          </h2>

          <p className="text-gray-200">

            📍 Aswan, Egypt

          </p>

          <p className="text-gray-200">

            📞 +20 1115299916

          </p>

          <p className="text-gray-200">

            📧 cadeau200510@gmail.com

          </p>


          <a
            href="https://wa.me/201034022992"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >

            Chat on WhatsApp

          </a>

        </div>

      </div>


      {/* Bottom Bar */}

      <div className="text-center border-t border-blue-700 py-4 text-gray-300">

        © {new Date().getFullYear()} Nile Horizon — All rights reserved

      </div>

    </footer>

  );

}

export default Footer;