import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";

import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";

import Transport from "./pages/Transport";
import TransportDetails from "./pages/TransportDetails";

import Offers from "./pages/Offers";
import PackageDetails from "./pages/PackageDetails";

import Trips from "./pages/Trips";
import TripDetails from "./pages/TripDetails";

import Admin from "./pages/Admin";
import Login from "./pages/Login";

import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Footer from "./components/Footer";
import MobileBottomNav from "./components/MobileBottomNav";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/cart";

import Bookings from "./components/Bookings";

import AswanTours from "./pages/AswanTours";
import AbuSimbelTour from "./pages/AbuSimbelTour";
import LuxorFromAswan from "./pages/LuxorFromAswan";
import NileCruise from "./pages/NileCruise";

import { CurrencyProvider } from "./context/CurrencyContext";


function App() {

  return (

    <CurrencyProvider>

      <Router>

        <Navbar />

        <Routes>

          {/* HOME */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* HOTELS */}

          <Route
            path="/hotels"
            element={<Hotels />}
          />

          <Route
            path="/hotel/:id"
            element={<HotelDetails />}
          />


          {/* TRANSPORT */}

          <Route
            path="/transport"
            element={<Transport />}
          />

          <Route
            path="/transport/:id"
            element={<TransportDetails />}
          />


          {/* OFFERS */}

          <Route
            path="/offers"
            element={<Offers />}
          />

          <Route
            path="/offer/:id"
            element={<PackageDetails />}
          />


          {/* TRIPS */}

          <Route
            path="/trips"
            element={<Trips />}
          />

          <Route
            path="/trip/:id"
            element={<TripDetails />}
          />


          {/* ADMIN */}

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />


          {/* ADMIN LOGIN */}

          <Route
            path="/login"
            element={<Login />}
          />


          {/* ABOUT */}

          <Route
            path="/about"
            element={<About />}
          />


          {/* CONTACT */}

          <Route
            path="/contact"
            element={<Contact />}
          />


          {/* BOOKING CART */}

          <Route
            path="/cart"
            element={<Cart />}
          />


          {/* BOOKINGS */}

          <Route
            path="/bookings"
            element={
              <AdminRoute>
                <Bookings />
              </AdminRoute>
            }
          />


          {/* ASWAN TOURS */}

          <Route
            path="/aswan-tours"
            element={<AswanTours />}
          />


          {/* ABU SIMBEL */}

          <Route
            path="/abu-simbel-tour"
            element={<AbuSimbelTour />}
          />


          {/* LUXOR */}

          <Route
            path="/luxor-tour-from-aswan"
            element={<LuxorFromAswan />}
          />


          {/* NILE CRUISE */}

          <Route
            path="/nile-cruise-egypt"
            element={<NileCruise />}
          />

        </Routes>


        <FloatingWhatsApp />

        <Footer />

        <MobileBottomNav />

      </Router>

    </CurrencyProvider>

  );

}


export default App;