import React, { Fragment, memo, useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.webp";
import { Icon } from "@iconify/react";
import { Menu, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Spinner } from "../../element";

const Header = () => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  const location = useLocation();

  const { cartItems } = useSelector((state) => state.cart);
  const getCartDrop = JSON.parse(localStorage.getItem("cartDrop"));
  const [cartDrop, setCartDrop] = useState(null);
  const cartDropRef = useRef(null);

  const CloseCartDrop = () => {
    localStorage.removeItem("cartDrop");
    setCartDrop(null);
  };

  const handleDocumentClick = (event) => {
    // Check if the click occurred outside the cart drop
    if (cartDropRef.current && !cartDropRef.current.contains(event.target)) {
      CloseCartDrop();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    if (cartDrop === null) {
      setCartDrop(getCartDrop);
    }
  }, [getCartDrop]);

  useEffect(() => {
    CloseCartDrop();
  }, [location]);

  const [openSidebar, _openSidebar] = useState(false);
  const [openAboutSidebar, _openAboutSidebar] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState({ products: [] });

  const [error, setError] = useState(null);

  const data = [
    { label: "Plant", link: "/collections/all" },
    {
      label: "About",
      dropdown: true,
      list: [
        { label: "About us", link: "/about-us" },
        { label: "Projects and countries", link: "/projects-and-countries" },
        { label: "How we do it", link: "/how-we-do-it" },
        { label: "Community", link: "/community" },
      ],
    },
    { label: "Business", link: "/for-business" },
    { label: "FAQ", link: "/faqs" },
    { label: "Contact", link: "/contact" },
  ];

  async function getAllProducts() {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/v1/products?keyword=${searchInput}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setAllProducts(data);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  }

  // test

  const DropdownMenu = (props) => (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="inline-flex w-full focus:outline-none">
              <div
                className={`${
                  props.data.list.some(
                    (item) => location.pathname === item.link
                  ) && "underline underline-offset-4"
                } flex items-center justify-center space-x-1`}
              >
                <p>{props.data.label}</p>
                <Icon
                  icon="iconamoon:arrow-down-2-thin"
                  className={`${
                    open ? "rotate-180" : "rotate-0"
                  } text-lg transition-all ease-in-out duration-150`}
                  aria-hidden="true"
                />
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute -left-2 mt-2 w-max origin-top-right rounded-3xl bg-colorTertiary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
              <div className="w-full h-auto border-t border-colorPrimary bg-gradient-to-t from-colorPrimary/80 from-1% to-colorTertiary to-25% p-7 space-y-3">
                {props.data.list.map((menu, index) => (
                  <Menu.Item key={index}>
                    <div>
                      <NavLink
                        to={menu.link}
                        className={({ isActive }) =>
                          `${
                            isActive
                              ? "text-colorSecondary underline underline-offset-4"
                              : "text-colorSecondaryLight"
                          }`
                        }
                      >
                        <div>{menu.label}</div>
                      </NavLink>
                    </div>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );

  return (
    <div className="relative z-50">
      {/* desktop view */}
      <div className="relative z-20 bg-colorTertiary">
        <div className="relative w-11/12 max-w-[1100px] grid grid-cols-3 lg:flex items-center justify-between space-x-2 m-auto py-2">
          {/* hamburger */}
          <div
            onClick={() => {
              _openSidebar(!openSidebar);
              _openAboutSidebar(false);
            }}
            className="lg:hidden w-8 h-8 cursor-pointer"
          >
            <Icon
              icon={openSidebar ? "system-uicons:cross" : "iconoir:menu"}
              className="text-colorSecondaryLight w-full h-auto"
            />
          </div>

          {/* logo & menu */}
          <div className="lg:flex-1 flex items-center justify-center lg:justify-start space-x-12">
            {/* logo */}
            <Link to="/">
              <img
                src={Logo}
                alt="Our Forest Logo"
                className="w-full max-w-[200px]"
                onClick={() => _openSidebar(false)}
              />
            </Link>

            {/* menu */}
            <nav className="hidden lg:block">
              <ul className="flex items-center justify-start text-colorSecondaryLight text-[15px] space-x-6">
                {data.map((item, index) => (
                  <>
                    {item.dropdown ? (
                      <li key={index}>
                        <DropdownMenu data={item} />
                      </li>
                    ) : (
                      <li key={index}>
                        <NavLink
                          to={item.link}
                          className={({ isActive }) =>
                            `${
                              isActive
                                ? "text-colorSecondary underline underline-offset-4"
                                : "text-colorSecondaryLight"
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    )}
                  </>
                ))}
              </ul>
            </nav>
          </div>

          {/* actions */}
          <div
            onClick={() => _openSidebar(false)}
            className="flex items-center justify-end space-x-4"
          >
            {/* usd */}
            <p className="hidden lg:block text-colorSecondary/75 text-base">
              USD $
            </p>
            {/* search */}
            <div
              className="cursor-pointer"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Icon
                icon="fluent:search-28-regular"
                className="text-colorSecondary/75 text-2xl"
              />
            </div>
            {/* user */}
            <Link to="/login">
              <Icon
                icon="heroicons:user"
                className="text-colorSecondary/75 text-2xl"
              />
            </Link>
            {/* cart */}
            <Link to="/cart">
              <div className="relative">
                <Icon
                  icon="ion:bag-handle-outline"
                  className="text-colorSecondary/75 w-7 h-auto"
                />
                {cartItems.length > 0 && (
                  <div className="absolute -bottom-1 -right-1 min-w-[16px] h-4 bg-colorPrimary text-white text-[10px] flex items-center justify-center rounded-full px-1">
                    {cartItems.length}
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* cart drop */}
          {/* set cart dropdown */}
          {cartDrop && (
            <div
              className="absolute top-full right-0 w-96 border-t border-colorPrimary bg-colorTertiary rounded-b-2xl overflow-hidden shadow-lg"
              ref={cartDropRef}
            >
              <div className="bg-gradient-to-t from-colorPrimary/80 from-1% to-colorTertiary to-15% px-8 py-8">
                <div className="text-colorSecondary text-sm flex items-center space-x-4">
                  <Icon icon="iconamoon:check-light" className="w-4 h-auto" />
                  <p>item added to your cart</p>
                </div>
                <div className="flex space-x-4 mt-5">
                  <div
                    className="w-20 h-20 bg-cover bg-center bg-no-repeat rounded-2xl"
                    style={{
                      backgroundImage: `url(${imageBaseUrl + cartDrop?.image})`,
                    }}
                  ></div>
                  <h3 className="kalam text-colorSecondary text-lg font-bold">
                    {cartDrop?.name}
                  </h3>
                </div>
                <div className="space-y-2 mt-6">
                  <Link to="/cart">
                    <div
                      onClick={CloseCartDrop}
                      className="buttonSecondary !w-full text-center"
                    >
                      View cart ({cartItems.length})
                    </div>
                  </Link>
                  {/* <button className="buttonPrimary !w-full">Checkout</button> */}
                </div>
                <Link to="/collections/all">
                  <p
                    onClick={CloseCartDrop}
                    className="w-max text-colorSecondary tracking-wider underline underline-offset-4 text-center m-auto mt-3"
                  >
                    Continue shopping
                  </p>
                </Link>
              </div>
              <div
                onClick={CloseCartDrop}
                className="absolute top-2 right-2 cursor-pointer"
              >
                <Icon
                  icon="system-uicons:cross"
                  className="w-8 h-8 text-colorSecondaryLight"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* mobile menu sidebar */}
      <div
        className={`${
          openSidebar ? "translate-x-0" : "-translate-x-full"
        } absolute top-0 left-0 z-10 w-full h-screen bg-colorSecondary/20 transition-all ease-in-out duration-150`}
      >
        <div className="relative w-full max-w-md h-full bg-gradient-to-t from-colorPrimary from-1% to-colorTertiary to-30% pt-40 pb-14 overflow-hidden">
          <div className="w-full h-full flex flex-col">
            {/* menus */}
            <div className="flex-1">
              <nav>
                <ul className="text-lg space-y-2">
                  {data.map((item, index) => (
                    <>
                      {item.dropdown ? (
                        <li key={index}>
                          <div
                            onClick={() => _openAboutSidebar(true)}
                            className="px-10 py-2 flex items-center justify-between text-colorSecondaryLight hover:bg-colorSecondary/5 cursor-pointer transition-all ease-in-out duration-150"
                          >
                            <p
                              className={`${
                                item.list.some(
                                  (item) => location.pathname === item.link
                                ) &&
                                "text-colorSecondary underline underline-offset-4"
                              }`}
                            >
                              {item.label}
                            </p>
                            <Icon icon="solar:arrow-right-linear" />
                          </div>
                        </li>
                      ) : (
                        <li key={index} onClick={() => _openSidebar(false)}>
                          <NavLink
                            to={item.link}
                            className={({ isActive }) =>
                              `${
                                isActive
                                  ? "text-colorSecondary underline underline-offset-4"
                                  : "text-colorSecondaryLight"
                              }`
                            }
                          >
                            <div className="px-10 py-2 hover:bg-colorSecondary/5 transition-all ease-in-out duration-150">
                              {item.label}
                            </div>
                          </NavLink>
                        </li>
                      )}
                    </>
                  ))}
                </ul>
              </nav>
            </div>
            {/* usd */}
            <div className="px-10">
              <p>USD $</p>
            </div>
          </div>

          {/* about sidebar */}
          {
            <div
              className={`${
                openAboutSidebar ? "translate-x-0" : "translate-x-full"
              } absolute inset-0 w-full h-full bg-colorTertiary transition-all ease-in-out duration-150 pt-40 pb-14 space-y-2`}
            >
              {/* back button */}
              <div
                onClick={() => _openAboutSidebar(false)}
                className="flex items-center space-x-2 text-colorSecondaryLight bg-colorSecondary/5 py-2 px-10 cursor-pointer"
              >
                <Icon icon="solar:arrow-left-linear" />
                <p className="text-sm">About</p>
              </div>
              {/* dropdown menu */}
              <nav>
                <ul className="text-lg space-y-2">
                  {data.map(
                    (menu) =>
                      menu.dropdown &&
                      menu.list.map((item, index) => (
                        <li key={index} onClick={() => _openSidebar(false)}>
                          <NavLink
                            to={item.link}
                            className={({ isActive }) =>
                              `${
                                isActive
                                  ? "text-colorSecondary underline underline-offset-4"
                                  : "text-colorSecondaryLight"
                              }`
                            }
                          >
                            <div className="px-10 py-2 hover:bg-colorSecondary/5 transition-all ease-in-out duration-150">
                              {item.label}
                            </div>
                          </NavLink>
                        </li>
                      ))
                  )}
                </ul>
              </nav>
            </div>
          }
        </div>
      </div>

      {/* search */}
      {
        // searchOpen &&
        <div
          className={`${
            searchOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          } absolute inset-0 w-full min-h-screen bg-colorPrimary/20 z-30 transition-all ease-in-out duration-0 `}
        >
          <div
            className={`${
              searchOpen ? "translate-y-0" : "-translate-y-full"
            } w-full h-32 flex flex-col items-center justify-center bg-gradient-to-t from-colorPrimary/50 from-1% to-colorTertiary to-30% transition-all ease-in-out duration-300`}
          >
            <div className="w-11/12 flex items-center justify-center space-x-3">
              <div className="w-full max-w-[700px] flex items-center space-x-2 bg-colorSeventh border border-colorSecondaryLight focus-within:border-2 px-4 py-2.5 rounded-xl">
                <input
                  type="text"
                  name="search"
                  placeholder="Search"
                  autoFocus={searchOpen}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    getAllProducts();
                  }}
                  value={searchInput}
                  className="appearance-none w-full flex-1 bg-transparent focus:outline-none text-colorSecondary"
                />
                {searchInput !== "" && (
                  <div
                    onClick={() => setSearchInput("")}
                    className="w-4 h-4 p-0.5 rounded-full border border-colorSecondary/20 cursor-pointer"
                  >
                    <Icon
                      icon="ic:round-close"
                      className="text-colorSecondaryLight w-full h-auto"
                    />
                  </div>
                )}
                <Icon
                  icon="carbon:search"
                  className="w-5 h-5 text-colorSecondaryLight"
                />
              </div>
              {/* close */}
              <div
                onClick={() => {
                  setSearchOpen(false);
                  setSearchInput("");
                }}
              >
                <Icon
                  icon="ei:close"
                  className="w-8 h-8 text-colorSecondaryLight cursor-pointer"
                />
              </div>
            </div>

            {/* search content */}
            {searchInput !== "" && (
              <div className="absolute top-[89px] w-11/12 flex items-center justify-center -ml-11">
                <div className="w-full max-w-[700px] bg-colorSeventh rounded-b-3xl">
                  <div className="border-b border-colorSecondary/10 p-3 pb-1">
                    <p className="text-colorSecondary/60 font-light tracking-wider text-xs">
                      PRODUCTS
                    </p>
                  </div>
                  <div className="space-y-3 p-3 max-h-96 overflow-auto">
                    {loading && (
                      <div className="flex items-center justify-center">
                        <Spinner />
                      </div>
                    )}
                    {!loading &&
                      allProducts.products &&
                      allProducts.products.length > 0 &&
                      allProducts.products.map((product) => (
                        <Link key={product._id} to={`/product/${product._id}`}>
                          <div
                            className="flex items-center space-x-4"
                            onClick={() => setSearchOpen(false)}
                          >
                            {product.images && (
                              <div
                                className="w-12 h-12 bg-cover bg-no-repeat bg-center"
                                style={{
                                  backgroundImage: `url(${
                                    imageBaseUrl + product.images[0]
                                  })`,
                                }}
                              ></div>
                            )}
                            <div>
                              <h3 className="text-lg text-colorSecondary font-bold kalam">
                                {product.name}
                              </h3>
                              {product.price && (
                                <p className="text-colorSecondaryLight text-xs font-light">
                                  $ {product.price} USD
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    {!loading &&
                      allProducts.products &&
                      allProducts.products.length === 0 && (
                        <p className="text-colorSecondaryLight text-center">
                          No product found!
                        </p>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
};

export default Header;
