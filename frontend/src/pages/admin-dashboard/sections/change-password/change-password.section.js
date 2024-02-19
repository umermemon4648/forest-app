import axios from "axios";
import React, { memo, useState } from "react";
import { Spinner } from "../../../../element";
import { useDispatch } from "react-redux";
import { logout } from "../../../../actions/userAction";
import { Icon } from "@iconify/react";

const CHANGE_PASSWORD = (props) => {
    const dispatch = useDispatch();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

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

    const logoutUser = () => {
        dispatch(logout());
    };

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    }

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
                    Authorization: `Bearer ${props.token}`,
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

export default memo(CHANGE_PASSWORD);