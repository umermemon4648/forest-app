import React, { Fragment, memo, useEffect, useState } from "react";
import _ from "lodash";
import TabOneIcon from "../../assets/images/earth-icon.svg";
import TabTwoIcon from "../../assets/images/star-icon.svg";
// import TabThreeIcon from "../../assets/images/level-icon.svg";
import TabThreeIcon from "../../assets/images/social-leaderboard-outline.svg";
import { Icon } from "@iconify/react";
import PlantationCoverageSection from "./sections/plantation-coverage.section";
import YourForestSection from "./sections/your-forest.section";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/userAction";
import BadgesSection from "./sections/badges.section";
import YourImpactSection from "./sections/your-impact.section";
import LeaderboardSection from "./sections/leaderboard.section";
import DefaultAvatar from "../../assets/images/default-avatar.png";
import { Dialog, Transition } from "@headlessui/react";
import { Spinner } from "../../element";
import { LogoutConfirmModal } from "../../component";

const UserDashboardNew = () => {
  const dispatch = useDispatch();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const token = localStorage.getItem("authToken");
  const userEmail = JSON.parse(localStorage.getItem("userEmailInfo"));

  const tabs = [
    { id: 1, name: "plantation coverage", icon: TabOneIcon },
    { id: 2, name: "impact and loyalty", icon: TabTwoIcon },
    { id: 3, name: "leaderboard", icon: TabThreeIcon },
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0].id);

  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  // USER
  const [user, setUser] = useState({});
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  // TOTAL TREES
  const [userTotalTrees, setUserTotalTrees] = useState([]);
  const [userTotalTreesLoading, setUserTotalTreesLoading] = useState(false);
  // ORDERS
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [userOrders, setUserOrders] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfileImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file from the input

    const fetchData = async () => {
      setModalError(null);
      setUser({ ...user, avatar: null });

      const formImage = new FormData();
      formImage.append("image", file);

      try {
        const { data } = await axios.post(
          `${apiBaseUrl}/api/v1/upload`,
          formImage,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUser({ ...user, avatar: data.media.path });
      } catch (error) {
        setModalError(error.response.data.message);
      }
    };

    fetchData();
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  async function getUserData() {
    setUserLoading(true);
    setUserError(null);

    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUserLoading(false);
      setUser(data.user);
      getUserTotalTreesData(data?.user?.email);
      getUserOrders(data?.user?.email);
    } catch (error) {
      console.error(error.response.data.message);
      setUserError(error.response.data.message);
      setUserLoading(false);
    }
  }

  async function updateUserData(e) {
    e.preventDefault();

    setModalLoading(true);
    setModalError(null);

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    };

    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/v1/me/update`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setModalLoading(false);
      setOpenModal(false);
      getUserData();
    } catch (error) {
      setModalError(error.response.data.message);
      setModalLoading(false);
    }
  }

  async function getUserTotalTreesData(email) {
    setUserTotalTreesLoading(true);

    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/v1/orders/combined`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const selectedUserTotalTreesData = await data?.combinedOrders.find(
        (e) => e?.email === email
      );
      setUserTotalTrees(selectedUserTotalTreesData);
      setUserTotalTreesLoading(false);
    } catch (error) {
      console.log(error.response.data.message);
      setUserTotalTrees([]);
      setUserTotalTreesLoading(false);
    }
  }

  async function getUserOrders(email) {
    setOrdersLoading(true);

    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/v1/orders-items/email/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUserOrders(data.orderItems);
      setOrdersLoading(false);
    } catch (error) {
      console.log(error.response.data.message);
      setUserOrders([]);
      setOrdersLoading(false);
    }
  }

  useEffect(() => {
    getUserData();
  }, [openModal]);

  return (
    <div>
      <div className="w-11/12 max-w-[1200px] m-auto py-20 space-y-10">
        {/* user and tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* user */}
          <div className="relative w-full md:w-max bg-colorFifth flex flex-col justify-center border border-colorPrimary rounded-lg shadow-lg px-4 py-2 space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-20 h-20 border border-colorSecondaryLight rounded-full p-1">
                <div
                  className="w-full h-full bg-colorPrimaryLight rounded-full bg-cover bg-no-repeat bg-center"
                  style={{
                    backgroundImage: `url(${
                      user?.avatar ? imageBaseUrl + user?.avatar : DefaultAvatar
                    })`,
                  }}
                ></div>
              </div>
              <div className="flex-1 pr-10">
                <h2 className="text-colorSecondary text-lg font-semibold capitalize">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-colorSecondaryLight text-sm font-light">
                  {user?.email}
                </p>
                {/* <div className="flex items-center space-x-0.5">
                                    {
                                        [...Array(4)].map(() => (
                                            <a className="w-5 h-auto text-colorPrimaryLight hover:text-colorPrimary cursor-pointer">
                                                <Icon icon="ic:baseline-facebook" className="w-full h-auto" />
                                            </a>
                                        ))
                                    }
                                </div> */}
              </div>
            </div>
            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
              <div
                onClick={() => setOpenLogoutModal(true)}
                className="text-colorPrimary text-sm underline hover:decoration-2 cursor-pointer"
              >
                Logout
              </div>
              <div
                onClick={() => setOpenModal(true)}
                className="w-4 h-auto text-colorSecondaryLight hover:text-colorSecondary cursor-pointer"
              >
                <Icon icon="bi:gear-fill" className="w-full h-auto" />
              </div>
            </div>
          </div>
          {/* tabs */}
          <div className="flex items-center justify-center md:justify-end space-x-4">
            {tabs.map((tab, index) => (
              <div
                onClick={() => setSelectedTab(tab.id)}
                key={index}
                className={`${
                  selectedTab === tab.id ? "border border-colorPrimary" : ""
                } bg-colorFifth p-8 rounded-lg cursor-pointer shadow-md group`}
              >
                <img
                  src={tab.icon}
                  alt={tab.name}
                  className={`${
                    selectedTab === tab.id
                      ? "opacity-100"
                      : "opacity-50 group-hover:opacity-100"
                  } w-12 h-12`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* plantation coverage */}
        {selectedTab === 1 && (
          <div className="space-y-6 ">
            <PlantationCoverageSection
              orders={userOrders}
              userTotalTrees={userTotalTrees}
              totalTreesLoading={userTotalTreesLoading}
            />
            <YourForestSection orders={userOrders} loading={ordersLoading} />
            <BadgesSection
              orders={userOrders}
              userTotalTrees={userTotalTrees}
            />
          </div>
        )}

        {/* impact and loyalty */}
        {selectedTab === 2 && (
          <div>
            <YourImpactSection
              name={user?.firstName + " " + user?.lastName}
              userTotalTrees={userTotalTrees}
              totalTreesLoading={userTotalTreesLoading}
            />
          </div>
        )}

        {/* leaderboard */}
        {selectedTab === 3 && (
          <div>
            <LeaderboardSection token={token} />
          </div>
        )}
      </div>

      {/* update profile modal */}
      {openModal && (
        <div>
          <Transition appear show={openModal} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-[60]"
              onClose={() => setOpenModal(false)}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <div className="w-11/12 max-w-xl bg-white rounded-lg p-6 text-left align-middle shadow-xl transition-all">
                      <form onSubmit={updateUserData}>
                        <Dialog.Title
                          as="h3"
                          className="text-xl font-medium leading-6 text-colorPrimary"
                        >
                          Update profile
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="space-y-5">
                            {/* first name */}
                            <div>
                              <label className="text-colorSecondaryLight text-sm">
                                First Name
                              </label>
                              <input
                                type="text"
                                name="firstName"
                                value={user?.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                              />
                            </div>
                            {/* last name */}
                            <div>
                              <label className="text-colorSecondaryLight text-sm">
                                last Name
                              </label>
                              <input
                                type="text"
                                name="lastName"
                                value={user?.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                              />
                            </div>
                            {/* email */}
                            <div>
                              <label className="text-colorSecondaryLight text-sm">
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                disabled
                                value={user?.email}
                                className="appearance-none w-full focus:outline-none bg-white border border-colorSecondary/20 focus:border-colorPrimary px-4 py-2 rounded-md"
                              />
                            </div>
                            {/* image */}
                            <div className="">
                              <div>
                                <label className="text-colorSecondaryLight text-sm">
                                  Avatar
                                </label>
                              </div>
                              {!user?.avatar && (
                                <input
                                  type="file"
                                  name="avatar"
                                  accept="image/*"
                                  onChange={updateProfileImageChange}
                                  required
                                  className="text-sm text-colorSecondaryLight"
                                />
                              )}
                              {user?.avatar && (
                                <div className="flex items-center space-x-5 mt-5">
                                  <div
                                    className="w-14 h-14 bg-cover bg-no-repeat bg-center rounded-lg bg-gray-100"
                                    style={{
                                      backgroundImage: `url(${
                                        imageBaseUrl + user?.avatar
                                      })`,
                                    }}
                                  ></div>
                                  <div
                                    onClick={() =>
                                      setUser({ ...user, avatar: null })
                                    }
                                    className="cursor-pointer"
                                  >
                                    <Icon icon="ep:close" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {modalError && (
                          <div className="text-sm text-center mt-5 w-full px-2 py-1 border border-red-600 text-red-600">
                            {modalError}
                          </div>
                        )}

                        <div className="flex items-center justify-end space-x-2 mt-4">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-colorPrimary/20 px-4 py-2 text-sm font-medium text-colorPrimary hover:bg-colorPrimary/30 focus:outline-none"
                            onClick={() => setOpenModal(false)}
                          >
                            Close
                          </button>
                          {modalLoading ? (
                            <div>
                              <Spinner />
                            </div>
                          ) : (
                            <input
                              type="submit"
                              value="Update"
                              className="inline-flex justify-center rounded-md border border-transparent bg-colorPrimary/80 hover:bg-colorPrimary px-4 py-2 text-sm font-medium text-white focus:outline-none"
                            />
                          )}
                        </div>
                      </form>
                    </div>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      )}

      {/* logout confirmation modal */}
      {openLogoutModal && (
        <LogoutConfirmModal
          isOpen={openLogoutModal}
          onClose={() => setOpenLogoutModal(false)}
          handleClick={logoutUser}
        />
      )}
    </div>
  );
};

export default memo(UserDashboardNew);
