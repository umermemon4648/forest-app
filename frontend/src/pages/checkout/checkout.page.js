import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.webp";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo, saveUserEmailInfo } from "../../actions/cartAction";
import { Icon } from "@iconify/react";
import { PaymentSection } from "../../component";
import { logout } from "../../actions/userAction";

const Checkout = () => {
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.user);

  const { buyNowItem, cartItems, shippingInfo, userEmailInfo } = useSelector(
    (state) => state.cart
  );

  const steps = ["cart", "information", "shipping", "payment"];
  const [step, setStep] = useState("information");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const shippingCharges = 19.44;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + tax + shippingCharges;

  const [email, setEmail] = useState(
    isAuthenticated
      ? user?.email
      : userEmailInfo?.email
      ? userEmailInfo?.email
      : ""
  );
  const [emailOffers, setEmailOffers] = useState(
    userEmailInfo.emailOffers ? userEmailInfo.emailOffers : false
  );
  const [country, setCountry] = useState(
    shippingInfo.country ? shippingInfo.country : ""
  );
  const [firstName, setFirstName] = useState(
    shippingInfo.firstName ? shippingInfo.firstName : ""
  );
  const [lastName, setLastName] = useState(
    shippingInfo.lastName ? shippingInfo.lastName : ""
  );
  const [company, setCompany] = useState(
    shippingInfo.company ? shippingInfo.company : ""
  );
  const [address, setAddress] = useState(
    shippingInfo.address ? shippingInfo.address : ""
  );
  const [appartment, setAppartment] = useState(
    shippingInfo.appartment ? shippingInfo.appartment : ""
  );
  const [pinCode, setPinCode] = useState(
    shippingInfo.pinCode ? shippingInfo.pinCode : ""
  );
  const [city, setCity] = useState(shippingInfo.city ? shippingInfo.city : "");
  const [saveUserShippingInfo, setSaveUserShippingInfo] = useState(
    shippingInfo.save ? shippingInfo.save : false
  );
  const [postalCodeError, setPostalCodeError] = useState("");

  const informationSubmit = (e) => {
    e.preventDefault();
    //validation
    const postalCodePattern = /^\d{5}$/; // Adjust the pattern based on your postal code format

    if (!postalCodePattern.test(pinCode)) {
      // Postal code is invalid
      setPostalCodeError("Please enter a valid postal code.");
      return;
    }

    // Clear any previous error
    setPostalCodeError("");
    const shippingData = {
      country,
      firstName,
      lastName,
      company,
      address,
      appartment,
      pinCode,
      city,
      saveUserShippingInfo,
    };
    const userEmailData = {
      email,
      emailOffers,
    };

    dispatch(saveShippingInfo(shippingData));

    dispatch(saveUserEmailInfo(userEmailData));

    setStep("shipping");
  };

  const shippingSubmit = (e) => {
    e.preventDefault();

    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    setStep("payment");
  };

  const logoutUser = (e) => {
    e.preventDefault();
    dispatch(logout());
  };
  const subscriptionItems = cartItems.filter(
    (item) => item.productType === "subscription"
  );
  const nonSubscriptionItems = cartItems.filter(
    (item) => item.productType !== "subscription"
  );

  const CONTACT_AND_SHIPTO = () => (
    <div className="w-full px-4 border border-colorSecondary/20 divide-y divide-colorSecondary/20 rounded-md">
      <div className="flex items-center justify-between py-3">
        <p className="w-full max-w-[100px] text-colorSecondary text-sm">
          Contact
        </p>
        <p className="flex-1 text-sm">{userEmailInfo.email}</p>
        <p
          onClick={() => setStep("information")}
          className="text-colorSecondaryLight text-xs underline cursor-pointer"
        >
          Change
        </p>
      </div>
      <div className="flex items-center justify-between py-3">
        <p className="w-full max-w-[100px] text-colorSecondary text-sm">
          Ship to
        </p>
        <p className="flex-1 text-sm">
          {shippingInfo.address} {shippingInfo.city} {shippingInfo.country}{" "}
          {shippingInfo.pinCode}
        </p>
        <p
          onClick={() => setStep("information")}
          className="text-colorSecondaryLight text-xs underline cursor-pointer"
        >
          Change
        </p>
      </div>
      {step === "payment" && (
        <div className="flex items-center justify-between py-3">
          <p className="w-full max-w-[100px] text-colorSecondary text-sm">
            Shipping method
          </p>
          <p className="flex-1 text-sm">
            Standard · <span className="font-bold">${shippingCharges}</span>
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* hero section */}
      <div
        className="w-full h-52 bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(${"https://cdn.shopify.com/s/files/1/0759/5681/4127/files/20190816_Mahajunga_0029_2000x.jpg?v=1688218634"})`,
        }}
      >
        <div className="w-full h-full flex justify-center items-end p-4">
          <Link to="/">
            <img
              src={Logo}
              alt="Our Forest Logo"
              className="w-full max-w-[150px]"
            />
          </Link>
        </div>
      </div>

      {/* checkout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-x divide-colorSecondary/20">
        {/* left */}
        <div className="order-2 lg:order-1 lg:col-span-7 bg-white py-8 px-5 sm:pl-10 xl:pl-40 sm:pr-10">
          {/* breadcrump */}
          <div className="mb-6">
            <ul className="flex items-center space-x-2 text-colorSecondary">
              {steps.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-2 cursor-default"
                >
                  <p
                    className={`${
                      item === step ? "font-medium" : ""
                    } text-xs font-sans capitalize`}
                  >
                    {item}
                  </p>
                  <Icon icon="ci:chevron-right" className="text-sm" />
                </li>
              ))}
            </ul>
          </div>

          {/* step information - information form fields */}
          {step === "information" && (
            <form className="space-y-8" onSubmit={informationSubmit}>
              {/* contact */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Contact</h3>
                  {isAuthenticated ? (
                    <div
                      onClick={logoutUser}
                      className="text-colorSecondary underline cursor-pointer"
                    >
                      Logout
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-sm">
                      <p>Have an account?</p>
                      <Link to="/login">
                        <p className="text-colorSecondary underline">Log in</p>
                      </Link>
                    </div>
                  )}
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isAuthenticated}
                  className="w-full appearance-none border border-colorSecondary/20 rounded-md p-3"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={emailOffers}
                    onChange={(e) => setEmailOffers(e.target.checked)}
                  />
                  <label className="text-colorSecondary text-sm">
                    Email me with news and offers
                  </label>
                </div>
              </div>

              {/* shipping */}
              <div className="space-y-3">
                <h3 className="font-bold">Shipping address</h3>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    name="countryCode"
                    id={country}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                    className="col-span-2 w-full border border-colorSecondary/20 rounded-md p-3"
                  >
                    <option value="">Select country</option>
                    <option value="AU">Australia</option>
                    <option value="AT">Austria</option>
                    <option value="BE">Belgium</option>
                    <option value="CA">Canada</option>
                    <option value="CZ">Czechia</option>
                    <option value="DK">Denmark</option>
                    <option value="FI">Finland</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                    <option value="HK">Hong Kong SAR</option>
                    <option value="IE">Ireland</option>
                    <option value="IL">Israel</option>
                    <option value="IT">Italy</option>
                    <option value="JP">Japan</option>
                    <option value="MY">Malaysia</option>
                    <option value="NL">Netherlands</option>
                    <option value="NZ">New Zealand</option>
                    <option value="NO">Norway</option>
                    <option value="PL">Poland</option>
                    <option value="PT">Portugal</option>
                    <option value="SG">Singapore</option>
                    <option value="ZA">South Africa</option>
                    <option value="KR">South Korea</option>
                    <option value="ES">Spain</option>
                    <option value="SE">Sweden</option>
                    <option value="CH">Switzerland</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="GB">United Kingdom</option>
                    <option value="US">United States</option>
                  </select>
                  <input
                    type="text"
                    placeholder="First name (optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="col-span-2 md:col-span-1 w-full appearance-none border border-colorSecondary/20 rounded-md p-3"
                  />
                  <input
                    type="text"
                    placeholder="last name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="col-span-2 md:col-span-1 w-full appearance-none border border-colorSecondary/20 rounded-md p-3"
                  />
                  <input
                    type="text"
                    placeholder="Company (optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="col-span-2 w-full appearance-none border border-colorSecondary/20 rounded-md p-3"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="col-span-2 w-full appearance-none border border-colorSecondary/20 rounded-md p-3"
                  />
                  <input
                    type="text"
                    placeholder="Appartment, suite, etc (optional)"
                    value={appartment}
                    onChange={(e) => setAppartment(e.target.value)}
                    className="col-span-2 w-full appearance-none border border-colorSecondary/20 rounded-md p-3"
                  />
                  <span>
                    <input
                      type="text"
                      placeholder="Postal code (optional)"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="col-span-2 md:col-span-1 w-full appearance-none border border-colorSecondary/20 rounded-md p-3"
                    />

                    {postalCodeError && (
                      <p className="text-red-500">{postalCodeError}</p>
                    )}
                  </span>
                  <span>
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="col-span-2 md:col-span-1 w-full appearance-none border border-colorSecondary/20 rounded-md p-3"
                    />
                  </span>
                  <div className="col-span-2 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={saveUserShippingInfo}
                      onChange={(e) =>
                        setSaveUserShippingInfo(e.target.checked)
                      }
                    />
                    <label className="text-colorSecondary text-sm">
                      Save this information for next time
                    </label>
                  </div>
                </div>
              </div>

              {/* Continue to shipping */}
              <div className="flex items-center justify-end">
                <input
                  type="submit"
                  value="Continue to shipping"
                  className="bg-colorPrimary text-white text-sm font-semibold tracking-wider rounded-md p-5 cursor-pointer transition-all ease-in-out duration-150"
                />
              </div>
            </form>
          )}

          {step === "shipping" && (
            <div className="space-y-8">
              {/* contact and ship to */}
              <CONTACT_AND_SHIPTO />
              {/* shipping standard */}
              <div className="space-y-3">
                <h3 className="font-bold">Shipping method</h3>
                <div className="w-full flex items-center justify-between bg-[#F8F7EA] border border-colorSecondaryLight rounded-md p-4">
                  <p className="text-sm">Standard</p>
                  <p className="text-sm font-bold">${shippingCharges}</p>
                </div>
              </div>
              {/* continue button and back button */}
              <div className="flex items-center justify-between">
                <div
                  onClick={() => setStep("information")}
                  className="flex items-center space-x-2 text-colorSecondaryLight cursor-pointer"
                >
                  <Icon icon="ci:chevron-left" />
                  <p>Return to information</p>
                </div>
                <button
                  onClick={shippingSubmit}
                  className="bg-colorPrimary text-white text-sm font-semibold tracking-wider rounded-md p-5 cursor-pointer transition-all ease-in-out duration-150"
                >
                  Continue to payment
                </button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-8">
              {/* contact and ship to */}
              <CONTACT_AND_SHIPTO />
              {/* payment sec */}
              <PaymentSection handleBack={() => setStep("shipping")} />
            </div>
          )}
        </div>

        {/* right */}
        <div className="order-1 lg:order-2 lg:col-span-5 bg-colorSeventh py-8 px-5 sm:pl-10 sm:pr-10 xl:pr-40 space-y-8">
          <div className="space-y-4">
            {/* cards */}
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="w-full flex items-center justify-center space-x-4"
              >
                <div className="flex-1 flex items-center space-x-4">
                  <div className="relative">
                    <div
                      className="w-16 h-16 bg-cover bg-no-repeat bg-center border border-colorSecondary/20 rounded-xl overflow-hidden"
                      style={{
                        backgroundImage: `url(${imageBaseUrl + item.image})`,
                      }}
                    ></div>
                    <div className="w-5 h-5 absolute -top-2 -right-2 flex items-center justify-center bg-colorSecondary text-white text-xs font-bold rounded-full">
                      {item.quantity}
                    </div>
                  </div>
                  <h4 className="font-bold">{item.name}</h4>
                </div>
                <p className="text-colorSecondary">
                  ${item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* discount code */}
          <form>
            <div className="w-full h-full flex items-center space-x-4">
              <input
                type="text"
                placeholder="Discount code"
                className="flex-1 appearance-none bg-white border border-colorSecondary/20 rounded-md p-3"
              />
              <input
                type="submit"
                value="Apply"
                className="w-max h-full text-colorSecondary font-bold bg-[rgb(249,242,228)] border border-[rgb(229,218,194)] rounded-md cursor-pointer px-4 py-3"
              />
            </div>
          </form>

          {/* pricing */}
          <div className="space-y-1">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <p>Subtotal</p>
              <p className="font-bold">${subtotal}</p>
            </div>
            {/* Shipping */}
            <div className="flex items-center justify-between">
              <p>Shipping</p>
              {step === "information" ? (
                <p className="text-sm text-colorSecondaryLight">
                  Calculated at next step
                </p>
              ) : (
                <p className="font-bold">{shippingCharges}</p>
              )}
            </div>
            {/* total */}
            <div className="flex items-center justify-between">
              <p className="font-bold">Total</p>
              {step === "information" ? (
                <p className="text-sm text-colorSecondaryLight">
                  Calculated at next step
                </p>
              ) : (
                <p className="text-sm text-colorSecondaryLight">
                  USD{" "}
                  <span className="font-bold text-black text-base">
                    ${totalPrice.toFixed(2)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Checkout);
