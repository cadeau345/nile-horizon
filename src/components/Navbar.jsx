import { Link } from "react-router-dom";

function Navbar() {

  return (

    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-bold text-blue-900">

        Nile Horizon

      </h1>


      <div className="space-x-6">

        <Link to="/">Home</Link>

        <Link to="/hotels">Hotels</Link>

        <Link to="/transport">Transport</Link>

        <Link to="/offers">Offers</Link>
          <Link to="/trips">Trips</Link>
          <Link to="/about">About Aswan</Link>
          <Link to="/contact">Contact</Link>

      </div>

    </nav>

  );

}

export default Navbar;