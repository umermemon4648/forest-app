import React, { memo, useEffect, useState } from "react";
import { HeadingTertiary, InputField, Spinner } from "../../element";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from '../../actions/userAction';
import { Icon } from '@iconify/react';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { error, loading, isAuthenticated } = useSelector(
        (state) => state.user
    );

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [showError, setShowError] = useState(null);

    const loginSubmit = (e) => {
        e.preventDefault();
        setShowError(null);
        
        dispatch(login(loginEmail, loginPassword));
    };

    const redirect = location.search ? location.search.split("=")[1] : "/account";

    useEffect(() => {
        if (error) {
            // Handle errors here, display them to the user if needed
            // console.error("Login error:", error);
            setShowError(error !== 'No token found' && error !== "Cannot read properties of null (reading 'id')" && error);
        }
    }, [error]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect);
        }
    }, [isAuthenticated, navigate, redirect]);

    return (
        <div>
            <div className="w-10/12 max-w-md m-auto py-10 text-center space-y-14">
                {/* heading */}
                <HeadingTertiary rootClass='text-colorSecondary' text={'Login'} />

                {/* error state */}
                {
                    showError &&
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <div>
                                <Icon icon="material-symbols:error" className='text-red-600' />
                            </div>
                            <h3 className="text-colorSecondary kalam text-base md:text-xl font-bold tracking-wider">{showError}</h3>
                        </div>
                        {
                            showError === 'Please confirm your email address first' &&
                            <div onClick={() => navigate('/resend-confirmation')} className="w-max text-colorPrimary font-semibold text-left underline cursor-pointer">Resend confirmation</div>
                        }
                    </div>
                }

                {/* form */}
                <form onSubmit={loginSubmit}>
                    <div className="space-y-14">
                        <div className="space-y-5">
                            {/* email */}
                            <InputField
                                type='email'
                                name='email'
                                placeholder='Email'
                                required
                                value={loginEmail}
                                disabled={loading}
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />

                            <div className="space-y-3">
                                {/* password */}
                                <div className="relative">
                                <InputField
                                    type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    placeholder='Password'
                                    value={loginPassword}
                                    disabled={loading}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    icon={true}
                                />
                                {
                                        loginPassword !== '' &&
                                        <div onClick={() => setShowPassword(!showPassword)} className="w-5 h-5 absolute inset-y-0 right-4 my-auto text-colorSecondaryLight cursor-pointer">
                                            {
                                                showPassword
                                                    ? <Icon icon="clarity:eye-hide-line" className='w-full h-auto' />
                                                    : <Icon icon="clarity:eye-show-line" className='w-full h-auto' />
                                            }
                                        </div>
                                    }
                                    </div>

                                {/* forgot password */}
                                <div className="w-max">
                                    <Link to='/forgot-password' style={{pointerEvents: loading && "none"}}>
                                        <p className="w-max text-colorSecondary text-sm tracking-wider underline underline-offset-2 hover:decoration-2 cursor-pointer">Forgot your password?</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            {/* sign in button */}
                            {
                                loading
                                    ? <Spinner />
                                    : <input
                                        type="submit"
                                        value='Sign in'
                                        className="buttonPrimary"
                                    />
                            }

                            {/* create account */}
                            <div>
                                <Link to='/register' style={{pointerEvents: loading && "none"}}>
                                    <p className="w-max text-colorSecondary text-sm tracking-wider underline underline-offset-2 hover:decoration-2 cursor-pointer">Create account</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default memo(Login);