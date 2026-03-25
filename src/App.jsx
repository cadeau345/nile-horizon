import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";

import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Transport from "./pages/Transport";
import Offers from "./pages/Offers";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Trips from "./pages/Trips";
import TripDetails from "./pages/TripDetails";
import PackageDetails from "./pages/PackageDetails";
import TransportDetails from "./pages/TransportDetails";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotel/:id" element={<HotelDetails />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trip/:id" element={<TripDetails />} />
        <Route path="/offer/:id" element={<PackageDetails />} />
        <Route path="/transport/:id" element={<TransportDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
<FloatingWhatsApp />
<Footer />
    </BrowserRouter>

  );

}

export default App;