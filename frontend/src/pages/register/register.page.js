import React, { memo, useState } from "react";
import { HeadingTertiary, InputField, Spinner } from "../../element";
import { Icon } from '@iconify/react';
import axios from "axios";

const RegisterUser = () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const confirmEmail = localStorage.getItem("confirmEmail");

    // for register screen
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(null);
    const [confirm, setConfirm] = useState(confirmEmail ? true : false);

    // for confirm screen
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [showConfirmError, setShowConfirmError] = useState(null);
    const [message, setMessage] = useState('Confirmation email sent.');

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const { firstName, lastName, email, password } = userData;

    // register api
    async function registerSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setShowError(null);

        // Validate the password against the strong password regular expression
        if (!strongPasswordRegex.test(password)) {
            setShowError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
            setLoading(false);
            return;
        }

        const myForm = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        };

        try {
            const response = await axios.post(`${apiBaseUrl}/api/v1/register`, myForm, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setLoading(false);
            setConfirm(true);
            localStorage.setItem("confirmEmail", userData.email);
        } catch (error) {
            setShowError(error.response.data.message);
            setLoading(false);
        }
    };

    // confirm registeration api
    async function confirmUserSubmit(e) {
        e.preventDefault();

        setLoadingConfirm(true);
        setShowConfirmError(null);

        try {
            const response = await axios.post(`${apiBaseUrl}/api/v1/resendConfirmation`, { email: confirmEmail }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setLoadingConfirm(false);
            setMessage(response.data.message);
        } catch (error) {
            setShowConfirmError(error.response.data.message);
            setLoadingConfirm(false);
        }
    };

    const registerDataChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            {
                !confirm &&
                <div className="w-10/12 max-w-md m-auto py-10 text-center space-y-14">
                    {/* heading */}
                    <HeadingTertiary rootClass='text-colorSecondary' text={'Create account'} />

                    {/* error state */}
                    {
                        showError &&
                        <div className="flex items-start space-x-2">
                            <div>
                                <Icon icon="material-symbols:error" className='text-red-600 mt-1' />
                            </div>
                            <h3 className="text-colorSecondary kalam text-base md:text-xl font-bold tracking-wider">{showError}</h3>
                        </div>
                    }

                    {/* form */}
                    <form onSubmit={registerSubmit}>
                        <div className="space-y-14">
                            <div className="space-y-5">
                                {/* first name */}
                                <InputField
                                    type='text'
                                    name='firstName'
                                    placeholder='First name'
                                    required
                                    value={firstName}
                                    disabled={loading}
                                    onChange={registerDataChange}
                                />

                                {/* last name */}
                                <InputField
                                    type='text'
                                    name='lastName'
                                    placeholder='Last name'
                                    required
                                    value={lastName}
                                    disabled={loading}
                                    onChange={registerDataChange}
                                />

                                {/* email */}
                                <InputField
                                    type='email'
                                    name='email'
                                    placeholder='Email'
                                    required
                                    value={email}
                                    disabled={loading}
                                    onChange={registerDataChange}
                                />

                                {/* password */}
                                <div className="relative">
                                    <InputField
                                        type={showPassword ? 'text' : 'password'}
                                        name='password'
                                        placeholder='Password'
                                        required
                                        value={password}
                                        disabled={loading}
                                        onChange={registerDataChange}
                                        icon={true}
                                    />
                                    {
                                        userData.password !== '' &&
                                        <div onClick={() => setShowPassword(!showPassword)} className="w-5 h-5 absolute inset-y-0 right-4 my-auto text-colorSecondaryLight cursor-pointer">
                                            {
                                                showPassword
                                                    ? <Icon icon="clarity:eye-hide-line" className='w-full h-auto' />
                                                    : <Icon icon="clarity:eye-show-line" className='w-full h-auto' />
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                {/* create button */}
                                {
                                    loading
                                        ? <Spinner />
                                        : <input
                                            type="submit"
                                            value='Create'
                                            className="buttonPrimary"
                                        />
                                }
                            </div>
                        </div>
                    </form>
                </div>
            }

            {
                confirm &&
                <div className="w-10/12 max-w-md m-auto py-10 text-center space-y-14">
                    {/* heading */}
                    <HeadingTertiary rootClass='text-colorSecondary' text={'Confirm account'} />

                    {/* message */}
                    {
                        loadingConfirm
                            ? <h3 className="text-colorSecondary kalam text-3xl font-bold tracking-wider">Sending please wait</h3>
                            : <h3 className="text-colorSecondary kalam text-3xl font-bold tracking-wider">{message}</h3>
                    }

                    <div className="flex items-center justify-center space-x-2">
                        <h4 className="text-colorSecondary kalam text-xl font-bold tracking-wider">Email:</h4>
                        <p>{confirmEmail ? confirmEmail : userData.email}</p>
                    </div>

                    <div className="flex items-center justify-center">
                        {
                            loadingConfirm
                                ? <Spinner />
                                : <button className="buttonPrimary" onClick={confirmUserSubmit}>Resend</button>
                        }
                    </div>
                </div>
            }
        </div>
    );
};

export default memo(RegisterUser);