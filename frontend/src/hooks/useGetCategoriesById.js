import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetCategoriesByIds = (categoryIds) => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an Axios GET request to the /api/v1/categories endpoint
        const response = await axios.get(`${apiBaseUrl}/api/v1/categories`);

        // Check if the response status is successful (status code 200)
        if (response.status === 200) {
          // Filter categories by matching IDs from the input array
          const filteredCategories = response.data.categories.filter((category) =>
            categoryIds.includes(category._id)
          );

          setCategories(filteredCategories);
          setLoading(false);
          setError(null);
        } else {
          setLoading(false);
          setError(new Error(`Failed to fetch categories data. Status: ${response.status}`));
        }
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    };

    fetchData();
  }, [categoryIds]);

  return { categories, loading, error };
};

export default useGetCategoriesByIds;