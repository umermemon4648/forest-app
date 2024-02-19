import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetCountriesByIds = (countryIds) => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an Axios GET request to the /api/v1/countries endpoint
        const response = await axios.get(`${apiBaseUrl}/api/v1/countries`);

        // Check if the response status is successful (status code 200)
        if (response.status === 200) {
          // Filter countries by matching IDs from the input array
          const filteredCountries = response.data.countries.filter((country) =>
            countryIds.includes(country._id)
          );

          setCountries(filteredCountries);
          setLoading(false);
          setError(null);
        } else {
          setLoading(false);
          setError(new Error(`Failed to fetch countries data. Status: ${response.status}`));
        }
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    };

    fetchData();
  }, [countryIds]);

  return { countries, loading, error };
};

export default useGetCountriesByIds;
