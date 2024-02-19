import "./App.css";
import { Footer, HeaderNew } from "./component";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import {
  About,
  AdminDashboard,
  Cart,
  Checkout,
  Community,
  ConfirmAccount,
  Contact,
  Ethiopia,
  FAQS,
  FailAccount,
  ForBusiness,
  ForgotPassword,
  Home,
  HowWeDoIt,
  Login,
  Mozambique,
  OrderSuccess,
  Plant,
  PrivacyPolicy,
  ProductDetail,
  ProjectsAndCountries,
  RegisterUser,
  ResendConfirmation,
  ResetPassword,
  SouthAfrica,
  UserDashboardNew,
  Zimbabwe,
} from "./pages";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadUser } from "./actions/userAction";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import useGetRoleById from "./hooks/useGetRoleById";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem("authToken");
  const { role } = useGetRoleById(user?.role, token);

  const [stripeKey, setStripeKey] = useState("");

  async function getStripeApiKey() {
    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/v1/stripeapikey`);
      setStripeKey(data.stripeApiKey);
    } catch (error) {
      console.error("Error fetching Stripe API key:", error);
    }
  }

  const stripePromise = loadStripe(stripeKey);

  useEffect(() => {
    dispatch(loadUser());
    getStripeApiKey();
  }, []);

  useEffect(() => {
    setIsAdmin(role?.name === "admin");
  }, [role]);

  useEffect(() => {
    // Check if the current route is '/confirm/success'
    // if (location.pathname === '/confirm/success') {
    //   localStorage.removeItem('confirmEmail');
    // }
    localStorage.removeItem("confirmEmail");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="w-full overflow-hidden">
      {/* bg fixed gradient */}
      <div className="bgGradient" />

      <div className="App">
        {/* header */}
        <HeaderNew />
        {/* <Header /> */}

        {/* main */}
        <div>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/about" element={<Navigate to="/about-us" />} />
            <Route
              path="/projects-and-countries"
              element={<ProjectsAndCountries />}
            />
            <Route path="/south-africa" element={<SouthAfrica />} />
            <Route path="/zimbabwe" element={<Zimbabwe />} />
            <Route path="/mozambique" element={<Mozambique />} />
            <Route path="/ethiopia" element={<Ethiopia />} />
            <Route path="/how-we-do-it" element={<HowWeDoIt />} />
            <Route path="/community" element={<Community />} />
            <Route path="/for-business" element={<ForBusiness />} />
            <Route path="/faqs" element={<FAQS />} />
            <Route path="/contact" element={<Contact />} />

            {/* PRODUCTS ROUTES */}

            <Route path="/collections/all" element={<Plant />} />
            <Route path="/collections/:id" element={<Plant />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route exact path="/cart" element={<Cart />} />
            <Route path="/success" element={<OrderSuccess />} />

            {/* AUTH ROUTES */}

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/confirm/success" element={<ConfirmAccount />} />
            <Route path="/confirm/failure" element={<FailAccount />} />
            {/* <Route path="/account/confirm" element={<ConfirmAccount />} /> */}
            <Route
              path="/resend-confirmation"
              element={<ResendConfirmation />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/password/reset/:id" element={<ResetPassword />} />

            {/* PROTECTED ROUTES */}

            {isAuthenticated && isAdmin && location.pathname === "/account" ? (
              <Route path="/account" element={<AdminDashboard />} />
            ) : isAuthenticated &&
              !isAdmin &&
              location.pathname === "/account" ? (
              // ? <Route path="/account" element={<UserDashboard />} />
              // <Route path="/account" element={<UserDashboardNew />} />
              <Route
                path="/account"
                element={
                  <Elements stripe={stripePromise}>
                    <UserDashboardNew />
                  </Elements>
                }
              />
            ) : (
              <Route path="/account" element={<Navigate to="/login" />} />
            )}

            {stripeKey !== "" &&
            cartItems.length !== 0 &&
            location.pathname === "/checkout" ? (
              <Route
                exact
                path="/checkout"
                element={
                  <Elements stripe={stripePromise}>
                    <Checkout />
                  </Elements>
                }
              />
            ) : (
              <Route path="/checkout" element={<Navigate to="/" />} />
            )}

            {/* POLICIES ROUTES */}

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>

        {/* footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
