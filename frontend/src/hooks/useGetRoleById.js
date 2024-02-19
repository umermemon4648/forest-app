import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetRoleById = (roleId, token) => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an Axios GET request to the /api/v1/admin/roles endpoint
        const response = await axios.get(`${apiBaseUrl}/api/v1/admin/roles`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        });

        // Check if the response status is successful (status code 200)
        if (response.status === 200) {
          // Find the specific role by ID
          const foundRole = response.data.roles.find((c) => c._id === roleId);

          if (foundRole) {
            setRole(foundRole);
            setLoading(false);
            setError(null);
          } else {
            setLoading(false);
            setError(new Error(`Role with ID ${roleId} not found`));
          }
        } else {
          setLoading(false);
          setError(new Error(`Failed to fetch roles data. Status: ${response.status}`));
        }
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    };

    fetchData();
  }, [roleId]);

  return { role, loading, error };
};

export default useGetRoleById;
