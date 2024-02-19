import React, { memo, useEffect, useState } from "react";
import { HeadingTertiary, InputField, Spinner, TextPrimary } from "../../element";
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../actions/userAction";

const ResetPassword = () => {
    let { id: paramId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const { error, success, loading } = useSelector(
        (state) => state.forgotPassword
    );

    const [unMatch, setUnMatch] = useState(0);
    const [showError, setShowError] = useState(null);
    const [message, setMessage] = useState(null);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPasswords, setShowPasswords] = useState({
        password: false,
        confirmPassword: false
    });

    const toggleShowPassword = (name) => {
        setShowPasswords({
            ...showPasswords,
            [name]: !showPasswords[name],
        });
    };

    useEffect(() => {
        if (confirmPassword === '') {
            setUnMatch(0);
        } else if (password === confirmPassword) {
            setUnMatch(1);
        } else {
            setUnMatch(2);
        }
    }, [confirmPassword]);

    const resetPasswordSubmit = (e) => {
        e.preventDefault();

        setShowError(null);

        // Validate the password against the strong password regular expression
        if (!strongPasswordRegex.test(password)) {
            setShowError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
            return;
        }

        const myForm = {
            newPassword: password,
            confirmPassword: confirmPassword
        };

        dispatch(resetPassword(paramId, myForm));
    };

    useEffect(() => {
        if (error) {
            setShowError(error);
        }

        if (success) {
            setMessage('Password Updated Successfully');
        }
    }, [dispatch, error, navigate, success]);

    return (
        <div>
            <div className="w-10/12 max-w-md m-auto py-10 text-center space-y-10">
                {
                    message ? (
                        <div className="flex flex-col items-center justify-center">
                            <HeadingTertiary rootClass='text-colorSecondary !leading-tight' text={message} />
                            <Link to='/login' style={{ pointerEvents: loading && "none" }}>
                                <p className="w-max text-colorSecondary text-sm tracking-wider underline underline-offset-2 hover:decoration-2 cursor-pointer">Login now</p>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {/* heading */}
                                <HeadingTertiary rootClass='text-colorSecondary !leading-tight' text={'Reset your password'} />

                                {/* text */}
                                <TextPrimary rootClass='text-colorSecondary' text={'Enter a new password'} />
                            </div>

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
                            <form onSubmit={resetPasswordSubmit}>
                                <div className="space-y-14">

                                    <div>
                                        <div className="space-y-5">
                                            {/* password */}
                                            <div className="relative">
                                                <InputField
                                                    type={showPasswords.password ? 'text' : 'password'}
                                                    name='password'
                                                    placeholder='Password'
                                                    required
                                                    value={password}
                                                    disabled={loading}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    icon={true}
                                                />
                                                {
                                                    password !== '' &&
                                                    <div onClick={() => toggleShowPassword("password")} className="w-5 h-5 absolute inset-y-0 right-4 my-auto text-colorSecondaryLight cursor-pointer">
                                                        {
                                                            showPasswords.password
                                                                ? <Icon icon="clarity:eye-hide-line" className='w-full h-auto' />
                                                                : <Icon icon="clarity:eye-show-line" className='w-full h-auto' />
                                                        }
                                                    </div>
                                                }
                                            </div>

                                            {/* confirm password */}
                                            <div className="relative">
                                                <InputField
                                                    type={showPasswords.confirmPassword ? 'text' : 'password'}
                                                    name='confirmPassword'
                                                    placeholder='Confirm Password'
                                                    required
                                                    value={confirmPassword}
                                                    disabled={loading}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    icon={true}
                                                />
                                                {
                                                    confirmPassword !== '' &&
                                                    <div onClick={() => toggleShowPassword("confirmPassword")} className="w-5 h-5 absolute inset-y-0 right-4 my-auto text-colorSecondaryLight cursor-pointer">
                                                        {
                                                            showPasswords.confirmPassword
                                                                ? <Icon icon="clarity:eye-hide-line" className='w-full h-auto' />
                                                                : <Icon icon="clarity:eye-show-line" className='w-full h-auto' />
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-start space-x-2 mt-2">
                                            {
                                                unMatch === 1 &&
                                                <>
                                                    <Icon icon="teenyicons:tick-circle-solid" className='text-green-600' />
                                                    <p className="text-colorSecondary text-sm">Match</p>
                                                </>
                                            }
                                            {
                                                unMatch === 2 &&
                                                <>
                                                    <Icon icon="material-symbols:error" className='text-red-600' />
                                                    <p className="text-colorSecondary text-sm">Confirm password not match</p>
                                                </>
                                            }
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        {/* reset button */}
                                        {
                                            loading
                                                ? <Spinner />
                                                : <input
                                                    type="submit"
                                                    value='Reset'
                                                    className="buttonPrimary"
                                                />
                                        }
                                    </div>
                                </div>
                            </form>
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default memo(ResetPassword);