import axios from 'axios';

const API_URL = 'http://localhost:8081';

export const CreateCertificate = async (name, description, expirationDate) => {
    const userString = localStorage.getItem('user');
    const token = JSON.parse(userString).token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
  };

  const certificate = {
    name,
    description,
    expirationDate
  };

  const response = await axios.post(`${API_URL}/certificates`, certificate, config);
    return response.data;
};
