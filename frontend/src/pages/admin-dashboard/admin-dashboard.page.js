import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, logout } from '../../actions/userAction';
import { Icon } from "@iconify/react";
import { CATEGORIES, COUNTRIES, MY_PROFILE, ORDERS, USERS, CHANGE_PASSWORD, PRODUCTS, ADDRESS } from './sections';
import axios from "axios";
import { LogoutConfirmModal } from "../../component";

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    // Retrieve the token from localStorage
    const token = localStorage.getItem("authToken");
    const userEmail = JSON.parse(localStorage.getItem("userEmailInfo"));

    // const { loading, isAuthenticated, user } = useSelector((state) => state.user);
    const [user, setUser] = useState({});
    const [openLogoutModal, setOpenLogoutModal] = useState(false);

    async function getUserData() {
        try {
            const { data } = await axios.get(`${apiBaseUrl}/api/v1/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setUser(data.user);
        } catch (error) {
            console.error(error.response.data.message);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    const logoutUser = () => {
        dispatch(logout());
    }

    const sidebarNav = [
        {
            label: 'My Profile',
            icon: 'solar:user-linear',
        },
        {
            label: 'Orders',
            icon: 'game-icons:shopping-cart',
        },
        {
            label: 'Users',
            icon: 'ph:users-three',
        },
        {
            label: 'Products',
            icon: 'fluent-mdl2:product',
        },
        {
            label: 'Categories',
            icon: 'iconamoon:category-thin',
        },
        {
            label: 'Countries',
            icon: 'solar:city-broken',
        },
        {
            label: 'Addresses',
            icon: 'ph:map-pin-line-light',
        },
        {
            label: 'Change Password',
            icon: 'akar-icons:arrow-cycle',
        },
        {
            label: 'Logout',
            icon: 'quill:off',
            action: () => setOpenLogoutModal(true)
        },
    ];

    const [selectedView, setSelectedView] = useState(0);

    return (
        <div>
            <div className="w-full lg:w-11/12 max-w-[1200px] m-auto py-20 text-center">
                <div className="flex flex-col lg:flex-row items-start lg:space-x-10">
                    {/* sidebar */}
                    <div className="w-full lg:max-w-[300px]">
                        <div className="bg-colorSeventh divide-y divide-colorSecondaryLight border-b lg:border-b-0 border-colorSecondary">
                            {/* profile name */}
                            <div className="flex items-center justify-start space-x-4 p-5 md:px-10 md:py-8">
                                <div>
                                    <div className="w-10 h-10 border border-colorSecondary text-colorSecondary text-2xl flex items-center justify-center rounded-full uppercase">{user?.firstName?.charAt(0)}</div>
                                </div>
                                <h2 className="text-colorSecondary text-[40px] font-medium capitalize">{user?.firstName}</h2>
                            </div>
                            {/* nav */}
                            <div className="overflow-auto">
                                <div className="w-max lg:w-full flex flex-row lg:flex-col divide-x lg:divide-x-0 lg:divide-y divide-colorSecondaryLight">
                                    {
                                        sidebarNav.map((item, index) => (
                                            <div key={index} onClick={item.action ? item.action : () => setSelectedView(index)} className={`${selectedView === index ? 'bg-colorPrimary text-white' : 'hover:bg-colorPrimary text-colorSecondary hover:text-white'} flex items-center space-x-4 px-5 py-2 md:px-10 md:py-3 cursor-pointer group transition-all ease-in-out duration-150`}>
                                                <div className={`${selectedView === index ? 'border-white' : 'border-colorSecondary group-hover:border-white'} w-8 h-8 flex items-center justify-center border rounded-full p-1.5`}>
                                                    <Icon icon={item.icon} className="w-full h-auto" />
                                                </div>
                                                <p className="text-base md:text-lg capitalize">{item.label}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* content */}
                    <div className="w-full lg:flex-1">
                        {/* My Profile */}
                        {
                            selectedView === 0 &&
                            <MY_PROFILE token={token} userEmail={userEmail} />
                        }

                        {/* Orders */}
                        {
                            selectedView === 1 &&
                            <ORDERS token={token} />
                        }

                        {/* users */}
                        {
                            selectedView === 2 &&
                            <USERS token={token} userEmail={userEmail} />
                        }

                        {/* Addresses */}
                        {
                            selectedView === 3 &&
                            <PRODUCTS token={token} user={user} />
                        }

                        {
                            selectedView === 4 &&
                            <CATEGORIES token={token} />
                        }

                        {
                            selectedView === 5 &&
                            <COUNTRIES token={token} />
                        }

{
                            selectedView === 6 && user?.email &&
                            <ADDRESS token={token} email={user?.email} />
                        }

                        {/* Change password */}
                        {
                            selectedView === 7 &&
                            <CHANGE_PASSWORD token={token} />
                        }
                    </div>
                </div>
            </div>

            {/* logout confirmation modal */}
            {
                openLogoutModal &&
                <LogoutConfirmModal
                    isOpen={openLogoutModal}
                    onClose={() => setOpenLogoutModal(false)}
                    handleClick={logoutUser}
                    // loading={modalLoading}
                    // error={modalError}
                />
            }
        </div>
    );
};

export default memo(AdminDashboard);