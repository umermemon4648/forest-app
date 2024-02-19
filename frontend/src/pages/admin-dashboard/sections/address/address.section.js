import React, { memo, useEffect, useState } from "react";
import _ from "lodash";
import { Icon } from "@iconify/react";
import axios from "axios";
import { Spinner } from "../../../../element";

const ADDRESS = (props) => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

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
            const { data } = await axios.get(`${apiBaseUrl}/api/v1/customer/email/${props.email}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`,
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
            email: props.email,
            shippingInfo: formData
        };

        if(update) {
            try {
                const response = await axios.put(`${apiBaseUrl}/api/v1/customer/email/${props.email}`, addressFormData, {
                    headers: {
                        Authorization: `Bearer ${props.token}`,
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
                        Authorization: `Bearer ${props.token}`,
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

export default memo(ADDRESS);