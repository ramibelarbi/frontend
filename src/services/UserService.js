import axios from 'axios';
import AuthHeader from './AuthHeader';
import authService from './AuthenticationService';

const API_URL = process.env.REACT_APP_API_URL;

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + { headers: AuthHeader() });
  }
  getAdminBoard() {
    return axios.get(API_URL +  { headers: AuthHeader() });
  }

  async addUser(firstname, lastname, email, password, phone_number, role, department, birthday) {
    const response = await axios.post( API_URL + "/user", {
      firstname,
      lastname,
      email,
      password,
      phone_number,
      role,
      department,
      birthday
    });
    console.log(response);
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }
  getUserCertificates() {
    const currentUser = authService.getCurrentUser();
    const token = currentUser.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    return axios.get(API_URL + "/user/certificates", config);
  }

  async getUserPhoto(email) {
    const currentUser = authService.getCurrentUser();
    const token = currentUser.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'image/jpeg'
      },
      responseType: 'blob'
    };
    const response = await axios.get(API_URL +`/user/${email}/photo`, config);
    return response.data;
  }
  getUserProfile(email) {
    return axios.get(API_URL + `/user/${email}/profile`);
  }

  async getUsersByCertificate(certificate) {
    const currentUser = authService.getCurrentUser();
    const token = currentUser.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await axios.get(API_URL + `/user/search?certificate=` + certificate, config);
    console.log(response);
    if (response.status !== 200) {
      throw new Error(`Failed to get users by certificate: ${response.statusText}`);
    }
    const users = response.data;
    return users;
  }
  async addDocument(document) {
    const currentUser = authService.getCurrentUser();
    const token = currentUser.token;
    const blob = new Blob([document.data], { type: 'application/pdf' });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' 
      }
    };
    const formData = new FormData();
    formData.append('file', blob, document.name); 
    const response = await axios.post(API_URL + `/user/${currentUser.email}/documents`, formData, config);
    console.log(response);
    return response.data;
  }
  
  async deleteDocument(documentId) {
    const currentUser = authService.getCurrentUser();
    const token = currentUser.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await axios.delete(API_URL + `/user/${currentUser.email}/documents/${documentId}`, config);
    console.log(response);
    return response.data;
  }
  getUserDocuments() {
    const currentUser = authService.getCurrentUser();
    const token = currentUser.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    return axios.get(API_URL + "/user/documents", config);
  }

  
}

const userService = new UserService();

export default userService;
