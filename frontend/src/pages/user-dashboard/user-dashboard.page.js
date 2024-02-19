import React, { memo, useEffect, useState } from "react";
import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../actions/userAction';
import { Icon } from "@iconify/react";
import axios from "axios";
import { Spinner } from "../../element";
import { LogoutConfirmModal } from "../../component";

const UserDashboard = () => {
    const dispatch = useDispatch();

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    // Retrieve the token from localStorage
    const token = localStorage.getItem("authToken");
    const userEmail = JSON.parse(localStorage.getItem("userEmailInfo"));
    const [userData, setUserData] = useState({});
    const [openLogoutModal, setOpenLogoutModal] = useState(false);

    async function GetUserData() {
        try {
            const { data } = await axios.get(`${apiBaseUrl}/api/v1/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setUserData(data.user);
        } catch (error) {
            console.error(error.response.data.message);
        }
    }

    useEffect(() => {
        GetUserData();
    }, []);

    const logoutUser = () => {
        dispatch(logout());
    };

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

    const MY_PROFILE = () => {
        const [edit, setEdit] = useState(false);

        const [user, setUser] = useState({});
        const [userOrders, setUserOrders] = useState({});
        const [loading, setLoading] = useState(false);
        const [loadingTotal, setLoadingTotal] = useState(false);
        const [error, setError] = useState(null);

        async function getUserOrders() {
            if (_.isNull(userEmail) || _.isNil(userEmail) || _.isEmpty(userEmail) || _.isUndefined(userEmail)) return;

            setLoadingTotal(true);

            try {
                const { data } = await axios.get(`${apiBaseUrl}/api/v1/orders/email/${userEmail.email}`, {
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
            }

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
                GetUserData();
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
                            {/* total spent */}
                            <div className="relative">
                                <div className="w-14 h-8 absolute -left-0.5 -top-0.5 bg-colorPrimary rounded-tl-md"></div>
                                <div className="relative z-10 bg-colorSeventh flex items-center justify-center border border-colorSecondary shadow-md rounded-tl-md rounded-br-md space-x-2 xl:space-x-5 py-5 px-0.5">
                                    <div className='w-9 h-9 flex items-center justify-center text-colorSecondary border border-colorSecondary rounded-full p-1.5'>
                                        <Icon icon="ph:currency-dollar" className="w-full h-auto" />
                                    </div>
                                    <div className="text-left space-y-2">
                                        <p className="tracking-wider">Total Spent</p>
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
                                        <p className="tracking-wider">All orders</p>
                                        {
                                            loadingTotal &&
                                            <Spinner rootClass='w-5 h-5' />
                                        }
                                        {
                                            !loadingTotal && (
                                                userOrders.orderCount > 0 ? (
                                                    <p className="font-bold tracking-widest">{userOrders.orderCount}</p>
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

    const ORDERS = () => {
        const [loading, setLoading] = useState(false);
        const [userOrders, setUserOrders] = useState({ orders: [] })
        const [error, setError] = useState(null);

        async function getUserOrders() {
            if (_.isNull(userEmail) || _.isNil(userEmail) || _.isEmpty(userEmail) || _.isUndefined(userEmail)) return;

            setLoading(true);

            try {
                const { data } = await axios.get(`${apiBaseUrl}/api/v1/orders/email/${userEmail.email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setUserOrders(data);
                setLoading(false);
            } catch (error) {
                setError(error.response.data.message);
                setLoading(false);
            }
        };

        useEffect(() => {
            getUserOrders();
        }, []);

        return (
            <div className="bg-colorSeventh p-10">
                <h3 className="text-colorSecondary text-2xl sm:text-[42px] font-semibold font-sans capitalize text-left">Orders</h3>
                {/* loader */}
                {
                    loading &&
                    <div className="flex items-center justify-center mt-5">
                        <Spinner rootClass='w-8 h-8' />
                    </div>
                }

                {
                    !loading && userOrders.orders && userOrders.orders.length > 0 ? (
                        <div className="mt-5 space-y-5">
                            <p className="text-colorSecondaryLight text-left text-lg">Order history</p>
                            <table className="min-w-full">
                                <thead>
                                    <tr className="font-bold text-sm sm:text-base">
                                        <td>Order</td>
                                        <td>Date</td>
                                        <td>Payment status</td>
                                        <td>Total</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        userOrders.orders.map((order) => (
                                            <tr key={order._id} className="text-sm sm:text-base">
                                                <td className="text-yellow-600">#{order.orderNumber}</td>
                                                <td>{order.createdAt}</td>
                                                {
                                                    order.paymentInfo.status === 'succeeded'
                                                        ? <td className="text-colorPrimary">Paid</td>
                                                        : <td className="text-red-600">Un-paid</td>
                                                }
                                                <td>${order.totalPrice.toFixed(2)}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-colorSecondaryLight text-left text-lg mt-5">You have not placed any orders yet</p>
                    )
                }

                {/* error */}
                {
                    error &&
                    <div className="mt-5 w-full p-2 border border-red-600 text-red-600">
                        {error}
                    </div>
                }
            </div>
        );
    };

    const ADDRESS = () => {
        const [edit, setEdit] = useState(false);

        const [formData, setFormData] = useState({});
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const [success, setSuccess] = useState(false);
        const [update, setUpdate] = useState(false);

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        async function getAddress() {

            try {
                const { data } = await axios.get(`${apiBaseUrl}/api/v1/customer/email/${userData?.email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setFormData(data.customer.shippingInfo);
                setUpdate(true);
            } catch (error) {
                console.log(error.response.data.message);
                setUpdate(false);
            }
        };

        async function handleSubmit(e) {
            e.preventDefault();

            setLoading(true);
            setError(null);

            const addressFormData = {
                email: userData?.email,
                shippingInfo: formData
            };

            if (update) {
                try {
                    const response = await axios.put(`${apiBaseUrl}/api/v1/customer/email/${userData?.email}`, addressFormData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    setLoading(false);
                    setSuccess(true);
                    setEdit(false);
                    getAddress();
                } catch (error) {
                    setError(error.response.data.message);
                    setLoading(false);
                }
            } else {
                try {
                    const response = await axios.post(`${apiBaseUrl}/api/v1/customer`, addressFormData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    setLoading(false);
                    setSuccess(true);
                    setEdit(false);
                    getAddress();
                } catch (error) {
                    setError(error.response.data.message);
                    setLoading(false);
                }
            }
        };

        useEffect(() => {
            setTimeout(() => {
                setSuccess(false)
            }, 2000);
            getAddress();
        }, [success]);

        return (
            <div className="bg-colorSeventh p-10">
                {/* simple view */}
                {
                    !edit &&
                    <div>
                        <h3 className="text-colorSecondary text-2xl sm:text-[42px] font-semibold font-sans capitalize text-left">Address</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                            <div className="aspect-square relative">
                                <div className="w-14 h-8 absolute -left-0.5 -top-0.5 bg-colorPrimary rounded-tl-md"></div>
                                <div className="w-full h-full relative z-10 bg-colorSeventh flex flex-col items-center justify-center border border-colorSecondary shadow-md rounded-tl-md rounded-br-md space-y-5 p-5">
                                    <div className="w-8 h-8">
                                        <Icon icon="ph:map-pin-line-light" className="w-full h-auto" />
                                    </div>
                                    <p className="text-colorSecondary">{formData?.firstName} {formData?.lastName}</p>
                                    <div onClick={() => setEdit(true)} className="w-8 h-8 text-colorPrimary cursor-pointer">
                                        <Icon icon="streamline:interface-edit-write-2-change-document-edit-modify-paper-pencil-write-writing" className="w-full h-auto" />
                                    </div>
                                    {
                                        success &&
                                        <div className="bg-colorPrimary text-colorFifth px-4 py-1 rounded-full">Success</div>
                                    }
                                </div>
                                <div className="w-14 h-8 absolute -right-0.5 -bottom-0.5 bg-colorPrimary rounded-br-md"></div>
                            </div>
                        </div>
                    </div>
                }

                {/* edit view */}
                {
                    edit &&
                    <div>
                        <h3 className="text-colorSecondary text-2xl sm:text-[42px] font-semibold font-sans capitalize text-left">Add new address</h3>
                        <form className="mt-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-6 ">
                                {/* first name */}
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <p className="text-colorPrimaryLight text-left">First Name</p>
                                    <input type="text" name="firstName" onChange={handleChange} value={formData.firstName} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded px-4 py-2" />
                                </div>
                                {/* last name */}
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <p className="text-colorPrimaryLight text-left">Last Name</p>
                                    <input type="text" name="lastName" required onChange={handleChange} value={formData.lastName} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded px-4 py-2" />
                                </div>
                                {/* company */}
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <p className="text-colorPrimaryLight text-left">Company</p>
                                    <input type="text" name="company" onChange={handleChange} value={formData.company} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded px-4 py-2" />
                                </div>
                                {/* phone */}
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <p className="text-colorPrimaryLight text-left">Phone</p>
                                    <input type="text" name="phoneNo" onChange={handleChange} value={formData.phoneNo} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded px-4 py-2" />
                                </div>
                                {/* address */}
                                <div className="col-span-2 space-y-2">
                                    <p className="text-colorPrimaryLight text-left">Address</p>
                                    <input type="text" name="address" required onChange={handleChange} value={formData.address} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded px-4 py-2" />
                                </div>
                                {/* Apartment, suite, etc. */}
                                <div className="col-span-2 space-y-2">
                                    <p className="text-colorPrimaryLight text-left">Apartment, suite, etc.</p>
                                    <input type="text" name="apartment" onChange={handleChange} value={formData.apartment} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded px-4 py-2" />
                                </div>
                                {/* country */}
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <p className="text-colorPrimaryLight text-left">Country</p>
                                    <input type="text" name="country" required onChange={handleChange} value={formData.country} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded px-4 py-2" />
                                </div>
                                {/* city */}
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <p className="text-colorPrimaryLight text-left">City</p>
                                    <input type="text" name="city" required onChange={handleChange} value={formData.city} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded px-4 py-2" />
                                </div>
                                {/* zip code */}
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <p className="text-colorPrimaryLight text-left">Zip code</p>
                                    <input type="text" name="pinCode" onChange={handleChange} value={formData.pinCode} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded px-4 py-2" />
                                </div>

                                {
                                    error &&
                                    <div className="col-span-2 mt-5 w-full p-2 border border-red-600 text-red-600">
                                        {error}
                                    </div>
                                }

                                {/* submit & cancel */}
                                <div className="col-span-2 flex items-center justify-start space-x-2">
                                    {
                                        loading
                                            ? <div className="buttonTertiary">
                                                <Spinner rootClass='w-5 h-5' />
                                            </div>
                                            : <input type="submit" value='Submit' className="buttonTertiary" />
                                    }
                                    {/* <input type="submit" value='Submit' className="buttonTertiary" /> */}
                                    <button onClick={() => setEdit(false)} className="buttonFourth">Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                }
            </div>
        );
    };

    const CHANGE_PASSWORD = () => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        const [passwords, setPasswords] = useState({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });

        const [showPasswords, setShowPasswords] = useState({
            oldPassword: false,
            newPassword: false,
            confirmPassword: false
        });

        const handleChange = (e) => {
            setPasswords({ ...passwords, [e.target.name]: e.target.value });
        };

        const toggleShowPassword = (name) => {
            setShowPasswords({
                ...showPasswords,
                [name]: !showPasswords[name],
            });
        };

        async function updatePassword(e) {
            e.preventDefault();

            setLoading(true);
            setError(null);

            // Validate the password against the strong password regular expression
            if (!strongPasswordRegex.test(passwords.newPassword)) {
                setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
                setLoading(false);
                return;
            };

            try {
                const response = await axios.put(`${apiBaseUrl}/api/v1/password/update`, passwords, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setLoading(false);
                logoutUser();
            } catch (error) {
                setError(error.response.data.message);
                setLoading(false);
            }
        };

        return (
            <div className="bg-colorSeventh p-10">
                <h3 className="text-colorSecondary text-2xl sm:text-[42px] font-semibold font-sans capitalize text-left">Change password</h3>
                <form className="mt-5" onSubmit={updatePassword}>
                    <div className="space-y-5">
                        {/* old password */}
                        <div className="space-y-2">
                            <p className="text-colorPrimaryLight text-left">Old password</p>
                            <div className="w-full h-auto relative">
                                <input type={showPasswords.oldPassword ? 'text' : 'password'} name="oldPassword" value={passwords.oldPassword} onChange={handleChange} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded pl-4 pr-10 py-2" />
                                {
                                    passwords.oldPassword !== '' &&
                                    <div onClick={() => toggleShowPassword('oldPassword')} className="w-5 h-5 absolute inset-y-0 right-4 my-auto text-colorSecondaryLight cursor-pointer">
                                        {
                                            showPasswords.oldPassword
                                                ? <Icon icon="clarity:eye-hide-line" className='w-full h-auto' />
                                                : <Icon icon="clarity:eye-show-line" className='w-full h-auto' />
                                        }
                                    </div>
                                }
                            </div>
                        </div>

                        {/* new password */}
                        <div className="space-y-2">
                            <p className="text-colorPrimaryLight text-left">New password</p>
                            <div className="w-full h-auto relative">
                                <input type={showPasswords.newPassword ? 'text' : 'password'} name="newPassword" value={passwords.newPassword} onChange={handleChange} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded pl-4 pr-10 py-2" />
                                {
                                    passwords.newPassword !== '' &&
                                    <div onClick={() => toggleShowPassword('newPassword')} className="w-5 h-5 absolute inset-y-0 right-4 my-auto text-colorSecondaryLight cursor-pointer">
                                        {
                                            showPasswords.newPassword
                                                ? <Icon icon="clarity:eye-hide-line" className='w-full h-auto' />
                                                : <Icon icon="clarity:eye-show-line" className='w-full h-auto' />
                                        }
                                    </div>
                                }
                            </div>
                        </div>

                        {/* confirm new password */}
                        <div className="space-y-2">
                            <p className="text-colorPrimaryLight text-left">Confirm new password</p>
                            <div className="w-full h-auto relative">
                                <input type={showPasswords.confirmPassword ? 'text' : 'password'} name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} className="appearance-none w-full text-colorSecondary text-lg bg-gray-100 border border-gray-300 rounded pl-4 pr-10 py-2" />
                                {
                                    passwords.confirmPassword !== '' &&
                                    <div onClick={() => toggleShowPassword('confirmPassword')} className="w-5 h-5 absolute inset-y-0 right-4 my-auto text-colorSecondaryLight cursor-pointer">
                                        {
                                            showPasswords.confirmPassword
                                                ? <Icon icon="clarity:eye-hide-line" className='w-full h-auto' />
                                                : <Icon icon="clarity:eye-show-line" className='w-full h-auto' />
                                        }
                                    </div>
                                }
                            </div>
                        </div>

                        {/* submit button */}
                        <div className="flex items-center justify-start pt-2">
                            {
                                loading
                                    ? <div className="buttonTertiary">
                                        <Spinner rootClass='w-5 h-5' />
                                    </div>
                                    : <input type="submit" value='Submit' className="buttonTertiary" />
                            }
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
        );
    };

    return (
        <div>
            <div className="w-full lg:w-11/12 max-w-[1200px] m-auto py-20 text-center">
                <div className="flex flex-col lg:flex-row items-start lg:space-x-10">
                    {/* sidebar */}
                    <div className="w-full lg:max-w-[300px]">
                        <div className="bg-colorSeventh divide-y divide-colorSecondaryLight border-b lg:border-b-0 border-colorSecondary">
                            {/* profile name */}
                            <div className="flex items-center justify-start space-x-4 p-5 md:px-10 md:py-8">
                                <div className="w-10 h-10 border border-colorSecondary text-colorSecondary text-2xl flex items-center justify-center rounded-full uppercase">{userData?.firstName?.charAt(0)}</div>
                                <h2 className="text-colorSecondary text-[40px] font-medium capitalize">{userData?.firstName}</h2>
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
                            <MY_PROFILE />
                        }

                        {/* Orders */}
                        {
                            selectedView === 1 &&
                            <ORDERS />
                        }

                        {/* Addresses */}
                        {
                            selectedView === 2 &&
                            <ADDRESS />
                        }

                        {/* Change password */}
                        {
                            selectedView === 3 &&
                            <CHANGE_PASSWORD />
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
                />
            }
        </div>
    );
};

export default memo(UserDashboard)