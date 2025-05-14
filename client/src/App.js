import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Addinvoice from "./Invoce/Addinvoice";
import Login from "./Components/Login";
import Register from "./Components/Rgister";
import Contact from "./Components/Contect";
import Homepage from "./Components/Homepage";
import AboutSection from "./Components/AboutSection";
import Userdasbordhomepage from "./Components/User/Userdasbordhomepage";
import Userprofile from "./Components/User/Userprofile";
import Dashboard from "./Components/Admin/Dashboard";
import Invoicelist from "./Invoce/Invoicelist";
import Userlist from "./Components/User/Userlist";


const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};


const Layout = ({ children }) => {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/user-dashboard",
    "/dashboard",
    // "/login",
    // "/register",
    "/userlist",
    "/invoice-list",
    "/addinvoice",
  ];


  const showNavbar = !hideNavbarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Invoice */}
          <Route path="/addinvoice" element={<Addinvoice />} />


          {/* User Routes */}
          <Route path="/user-dashboard" element={<Userdasbordhomepage />} />
          <Route path="/user-profile" element={<Userprofile />} />
          <Route path="/invoice-list" element={<Invoicelist />} />
          

          {/* Admin */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/userlist" element={<Userlist/>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

