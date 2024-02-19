import React, { memo, useEffect, useState } from "react";
import _ from 'lodash';
import axios from "axios";
import { Spinner } from "../../../../element";
import { Icon } from "@iconify/react";

const MY_PROFILE = ({token}) => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [edit, setEdit] = useState(false);

    const [user, setUser] = useState({});
    const [userOrders, setUserOrders] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingTotal, setLoadingTotal] = useState(false);
    const [error, setError] = useState(null);

    async function getUserOrders() {
        // if (_.isNull(userEmail) || _.isNil(userEmail) || _.isEmpty(userEmail) || _.isUndefined(userEmail)) return;

        setLoadingTotal(true);

        try {
            const { data } = await axios.get(`${apiBaseUrl}/api/v1/admin/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setUserOrders(data);
            setLoadingTotal(false);
        } catch (error) {
            console.error(error.response.data.message);
            setLoadingTotal(false);
        }
    };

    async function getUserData() {
        setLoading(true);

        try {
            const { data } = await axios.get(`${apiBaseUrl}/api/v1/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setUser(data.user);
            setLoading(false);
        } catch (error) {
            console.error(error.response.data.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserData();
        getUserOrders();
    }, []);

    // UPDATE USER INFO

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    async function updateUserData(e) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        const userData = {
            firstName: user.firstName,
            lastName: user.lastName
        };

        try {
            const response = await axios.put(`${apiBaseUrl}/api/v1/me/update`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setLoading(false);
            setEdit(false);
            getUserData();
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    return (
        <div className="bg-colorSeventh p-10">
            {/* simple view */}
            {
                !edit &&
                <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {/* total */}
                        <div className="relative">
                            <div className="w-14 h-8 absolute -left-0.5 -top-0.5 bg-colorPrimary rounded-tl-md"></div>
                            <div className="relative z-10 bg-colorSeventh flex items-center justify-center border border-colorSecondary shadow-md rounded-tl-md rounded-br-md space-x-2 xl:space-x-5 py-5 px-0.5">
                                <div className='w-9 h-9 flex items-center justify-center text-colorSecondary border border-colorSecondary rounded-full p-1.5'>
                                    <Icon icon="ph:currency-dollar" className="w-full h-auto" />
                                </div>
                                <div className="text-left space-y-2">
                                    <p className="tracking-wider">Total</p>
                                    {
                                        loadingTotal &&
                                        <Spinner rootClass='w-5 h-5' />
                                    }
                                    {
                                            !loadingTotal && (
                                                userOrders.totalAmount > 0 ? (
                                                    <p className="font-bold tracking-widest">${userOrders?.totalAmount?.toFixed(2)}</p>
                                                    ) : (
                                                        <p className="font-bold tracking-widest">$0</p>
                                                    )
                                            ) 
                                        }
                                </div>
                            </div>
                            <div className="w-14 h-8 absolute -right-0.5 -bottom-0.5 bg-colorPrimary rounded-br-md"></div>
                        </div>
                        {/* all orders */}
                        <div className="relative">
                            <div className="w-14 h-8 absolute -left-0.5 -top-0.5 bg-colorPrimary rounded-tl-md"></div>
                            <div className="relative z-10 bg-colorSeventh flex items-center justify-center border border-colorSecondary shadow-md rounded-tl-md rounded-br-md space-x-2 xl:space-x-5 py-5 px-0.5">
                                <div className='w-9 h-9 flex items-center justify-center text-colorSecondary border border-colorSecondary rounded-full p-1.5'>
                                    <Icon icon="game-icons:shopping-cart" className="w-full h-auto" />
                                </div>
                                <div className="text-left space-y-2">
                                    <p className="tracking-wider">Total orders</p>
                                    {
                                        loadingTotal &&
                                        <Spinner rootClass='w-5 h-5' />
                                    }
                                    {
                                                !loadingTotal && (
                                                    userOrders?.orders?.length > 0 ? (
                                                        <p className="font-bold tracking-widest">{userOrders?.orders?.length}</p>
                                                    ) : (
                                                        <p className="font-bold tracking-widest">0</p>
                                                    )
                                                )
                                            }
                                </div>
                            </div>
                            <div className="w-14 h-8 absolute -right-0.5 -bottom-0.5 bg-colorPrimary rounded-br-md"></div>
                        </div>
                        {/* address */}
                        <div className="relative">
                            <div className="w-14 h-8 absolute -left-0.5 -top-0.5 bg-colorPrimary rounded-tl-md"></div>
                            <div className="relative z-10 bg-colorSeventh flex items-center justify-center border border-colorSecondary shadow-md rounded-tl-md rounded-br-md space-x-2 xl:space-x-5 py-5 px-0.5">
                                <div className='w-9 h-9 flex items-center justify-center text-colorSecondary border border-colorSecondary rounded-full p-1.5'>
                                    <Icon icon="ph:map-pin-line-light" className="w-full h-auto" />
                                </div>
                                <div className="text-left space-y-2">
                                    <p className="tracking-wider">Address</p>
                                    <p className="font-bold tracking-widest">1</p>
                                </div>
                            </div>
                            <div className="w-14 h-8 absolute -right-0.5 -bottom-0.5 bg-colorPrimary rounded-br-md"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-20">
                        <h3 className="text-colorSecondary text-2xl sm:text-[42px] font-semibold font-sans capitalize text-left">My Profile</h3>
                        <div onClick={() => setEdit(true)} className="w-8 h-8 text-colorPrimary cursor-pointer">
                            <Icon icon="streamline:interface-edit-write-2-change-document-edit-modify-paper-pencil-write-writing" className="w-full h-auto" />
                        </div>
                    </div>
                    <div className="divide-y divide-colorSecondaryLight">
                        <div className="flex flex-col md:flex-row items-start md:items-center pt-5">
                            <p className="w-full md:max-w-[200px] text-left text-colorPrimaryLight md:text-lg font-bold">First Name</p>
                            {
                                loading &&
                                <Spinner rootClass='w-5 h-5' />
                            }
                            {
                                !loading && user.firstName &&
                                <p>{user.firstName}</p>
                            }
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center pt-5">
                            <p className="w-full md:max-w-[200px] text-left text-colorPrimaryLight md:text-lg font-bold">Last Name</p>
                            {
                                loading &&
                                <Spinner rootClass='w-5 h-5' />
                            }
                            {
                                !loading && user.lastName &&
                                <p>{user.lastName}</p>
                            }
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center pt-5">
                            <p className="w-full md:max-w-[200px] text-left text-colorPrimaryLight md:text-lg font-bold">Email</p>
                            {
                                loading &&
                                <Spinner rootClass='w-5 h-5' />
                            }
                            {
                                !loading && user.email &&
                                <p>{user.email}</p>
                            }
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center pt-5">
                            <p className="w-full md:max-w-[200px] text-left text-colorPrimaryLight md:text-lg font-bold">Email Subscription</p>
                            <p>No</p>
                        </div>
                    </div>
                </div>
            }

            {/* edit view */}
            {
                edit &&
                <div>
                    <h3 className="text-colorSecondary text-2xl sm:text-[42px] font-semibold font-sans capitalize text-left">Edit Profile</h3>
                    <form onSubmit={updateUserData}>
                        <div className="space-y-5">
                            {/* first name */}
                            <div className="space-y-2">
                                <p className="text-colorPrimaryLight text-left">First Name</p>
                                <input type="text" name="firstName" value={user.firstName} onChange={handleChange} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded px-4 py-2" />
                            </div>

                            {/* last name */}
                            <div className="space-y-2">
                                <p className="text-colorPrimaryLight text-left">Last Name</p>
                                <input type="text" name="lastName" value={user.lastName} onChange={handleChange} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded px-4 py-2" />
                            </div>

                            {/* email */}
                            <div className="space-y-2">
                                <p className="text-colorPrimaryLight text-left">Email</p>
                                <input type="email" name="email" disabled value={user.email} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded px-4 py-2" />
                            </div>

                            {/* checkbox and submit */}
                            <div className="space-y-2">
                                {/* checkbox */}
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" />
                                    <p className="text-colorPrimaryLight text-left">Subscribe to email marketing</p>
                                </div>

                                {/* submit & cancel */}
                                <div className="flex items-center justify-start space-x-2">
                                    {
                                        loading
                                            ? <div className="buttonTertiary">
                                                <Spinner rootClass='w-5 h-5' />
                                            </div>
                                            : <input type="submit" value='Submit' className="buttonTertiary" />
                                    }
                                    <button onClick={() => { setEdit(false); getUserData(); }} className="buttonFourth">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    {
                        error &&
                        <div className="mt-5 w-full p-2 border border-red-600 text-red-600">
                            {error}
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default memo(MY_PROFILE);