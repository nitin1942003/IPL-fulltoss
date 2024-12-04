import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL; // Replace with your backend URL

// Get the team assigned to the user
export const getAssignedTeam = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/${userId}/team`);
    return response.data.team; // Assuming the API returns a team object
  } catch (error) {
    console.error("Error fetching team:", error);
    throw error;
  }
};
