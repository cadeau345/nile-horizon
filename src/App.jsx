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

import Temples from "./pages/Temples";
import TempleDetails from "./pages/TempleDetails";
import AddTemple from "./components/AddTemple";

import Bookings from "./components/Bookings";

import AswanTours from "./pages/AswanTours";
import AbuSimbelTour from "./pages/AbuSimbelTour";
import LuxorFromAswan from "./pages/LuxorFromAswan";
import NileCruise from "./pages/NileCruise";

import CustomerLogin from "./pages/CustomerLogin";
import Register from "./pages/Register";

import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";

import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";

import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

import Flights from "./pages/Flights";
import ResetPassword from "./pages/ResetPassword";


function App() {

return (

<Router>

<Navbar />

<Routes>

<Route path="/" element={<Home />} />

<Route path="/hotels" element={<Hotels />} />
<Route path="/hotel/:id" element={<HotelDetails />} />

<Route path="/transport" element={<Transport />} />
<Route path="/transport/:id" element={<TransportDetails />} />

<Route path="/offers" element={<Offers />} />
<Route path="/offer/:id" element={<PackageDetails />} />

<Route path="/trips" element={<Trips />} />
<Route path="/trip/:id" element={<TripDetails />} />


{/* ADMIN ROUTE PROTECTED */}

<Route
path="/admin"
element={
<AdminRoute>

<Admin />

</AdminRoute>
}
/>


<Route path="/login" element={<Login />} />

<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />

<Route path="/cart" element={<Cart />} />

<Route path="/temples" element={<Temples />} />
<Route path="/temple/:id" element={<TempleDetails />} />

<Route path="/add-temple" element={<AddTemple />} />

<Route path="/bookings" element={<Bookings />} />

<Route path="/aswan-tours" element={<AswanTours />} />
<Route path="/abu-simbel-tour" element={<AbuSimbelTour />} />
<Route path="/luxor-tour-from-aswan" element={<LuxorFromAswan />} />
<Route path="/nile-cruise-egypt" element={<NileCruise />} />

<Route path="/customer-login" element={<CustomerLogin />} />

<Route path="/register" element={<Register />} />

<Route path="/my-bookings" element={<MyBookings />} />

<Route path="/profile" element={<Profile />} />

<Route path="/verify-email" element={<VerifyEmail />} />

<Route path="/forgot-password" element={<ForgotPassword />} />

<Route path="/payment-success" element={<PaymentSuccess />} />

<Route path="/payment-cancel" element={<PaymentCancel />} />

<Route path="/flights" element={<Flights />} />
<Route path="/reset-password" element={<ResetPassword />} />

</Routes>

<FloatingWhatsApp />
<Footer />
<MobileBottomNav />

</Router>

);

}

export default App;