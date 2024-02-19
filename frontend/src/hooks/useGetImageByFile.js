import React, { useEffect, useState } from "react";
import axios from "axios";

const useGetImageByFile = (file) => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const token = localStorage.getItem("authToken");

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setError(null);

            const formImage = new FormData();
            formImage.append("image", file);

            try {
                const { data } = await axios.post(`${apiBaseUrl}/api/v1/upload`, formImage, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                setImage(data.media.path);
                setLoading(false);
            } catch (error) {
                setError(error.response.data.message);
                setLoading(false);
            };
        };

        fetchData();
    }, [file]);

    return { loading, error, image };
};

export default useGetImageByFile;