import React, { memo, useEffect, useState } from "react";
import { HeadingTertiary, InputField, Spinner, TextPrimary } from "../../element";
import { Link } from "react-router-dom";
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../actions/userAction";

const ForgotPassword = () => {
    const dispatch = useDispatch();

    const { error, message, loading } = useSelector(
        (state) => state.forgotPassword
    );

    const [confirm, setConfirm] = useState(false);

    const [email, setEmail] = useState('');

    const forgotPasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = {
            email: email
        };

        dispatch(forgotPassword(myForm));
    };

    useEffect(() => {
        if (message) {
            setConfirm(true);
        }
    }, [dispatch, error, message]);

    return (
        <div>
            <div className="w-10/12 max-w-md m-auto py-10 text-center space-y-10">
                <div className="space-y-4">
                    {/* heading */}
                    <HeadingTertiary rootClass='text-colorSecondary !leading-tight' text={'Reset your password'} />

                    {/* text */}
                    <TextPrimary rootClass='text-colorSecondary' text={'We will send you an email to reset your password'} />
                </div>

                {/* form */}
                {
                    !confirm &&
                    <form onSubmit={forgotPasswordSubmit}>
                        <div className="space-y-14">
                            {/* email */}
                            <div>
                                <InputField
                                    type='email'
                                    name='email'
                                    placeholder='Email'
                                    required
                                    value={email}
                                    disabled={loading}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                {
                                    error &&
                                    <div className="flex items-center justify-start space-x-2 mt-2">
                                        <div>
                                            <Icon icon="material-symbols:error" className='text-red-600' />
                                        </div>
                                        <p className="text-colorSecondary text-sm">{error}</p>
                                    </div>
                                }
                            </div>

                            <div className="flex flex-col items-center space-y-4">
                                {/* sign in button */}
                                {/* <ButtonPrimary label='Submit' handleClick={() => alert('clicked')} /> */}
                                {
                                    loading
                                        ? <Spinner />
                                        : <input
                                            type="submit"
                                            value='Submit'
                                            className="buttonPrimary"
                                        />
                                }

                                {/* back to login page */}
                                <div>
                                    <Link to='/login' style={{ pointerEvents: loading && "none" }}>
                                        <p className="w-max text-colorSecondary text-sm tracking-wider underline underline-offset-2 hover:decoration-2 cursor-pointer">Cancel</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                }

                {
                    confirm &&
                    <div className='space-y-4'>
                        <h4 className="text-colorSecondary text-xl font-bold kalam">{message}</h4>
                        {/* <button className="buttonPrimary" onClick={() => setConfirm(false)}>Resend</button> */}
                    </div>
                }
            </div>
        </div>
    );
};

export default memo(ForgotPassword);