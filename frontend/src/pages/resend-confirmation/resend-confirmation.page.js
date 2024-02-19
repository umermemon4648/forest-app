import React, { memo, useState } from "react";
import { HeadingSecondary, InputField, Spinner } from "../../element";
import axios from "axios";

const ResendConfirmation = () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    async function confirmUserSubmit(e) {
        e.preventDefault();

        if (email === '') return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${apiBaseUrl}/api/v1/resendConfirmation`, { email: email }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setLoading(false);
            setMessage(response.data.message);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="w-11/12 max-w-[500px] m-auto flex flex-col items-center justify-center space-y-5 py-10">
                {/* <Icon icon="material-symbols:sms-failed" className="w-16 h-16 text-red-600" /> */}

                <HeadingSecondary rootClass='text-colorSecondary text-center' text={'Get Your Confirmation Link Again'} />

                <div className="w-full">
                    <form onSubmit={confirmUserSubmit}>
                        <div className="w-full flex flex-col items-center space-y-4">
                            {/* email */}
                            <InputField
                                type='email'
                                name='email'
                                placeholder='Enter email'
                                required
                                value={email}
                                disabled={loading}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            {/* create button */}
                            {
                                loading
                                    ? <Spinner />
                                    : <input
                                        type="submit"
                                        value='Get confirmaton link'
                                        className="buttonPrimary"
                                    />
                            }
                        </div>
                    </form>
                    {
                        message &&
                        <div className="text-center mt-5">
                            <h3 className="text-colorSecondary kalam text-base md:text-xl font-bold tracking-wider">{message}</h3>
                        </div>
                    }
                    {
                        error &&
                        <div className="text-center mt-5">
                            <h3 className="text-colorSecondary kalam text-base md:text-xl font-bold tracking-wider">{error}</h3>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default memo(ResendConfirmation);