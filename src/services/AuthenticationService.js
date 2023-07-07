import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL + "/auth/";

class AuthenticationService {
    async login(email, password) {
      console.log("1"); // Log to indicate that login function has been called
      try {
        console.log("2"); // Log to indicate that the try block has been entered
        console.log("email: ", email); // Log the value of email
        console.log("password: ", password); // Log the value of password
        const response = await axios.post(API_URL + "login", {
          email,
          password,
        });
        console.log("3"); // Log to indicate that the API request has been sent and we are waiting for response
        console.log("response: ", response); // Log the entire response object
        console.log("response.data: ", response.data); // Log the data received in response
        if (response.data.token) {
          console.log(response.data.token); // Log the token if it exists
          const user = {
            firstname: response.data.firstname,
            lastname : response.data.lastname,
            email: response.data.email,
            token: response.data.token,
            role: response.data.role}
          localStorage.setItem("user", JSON.stringify(user));
        }
        console.log("4"); // Log to indicate that the login was successful
        return response.data;
      } catch (error) {
        console.log("5"); // Log to indicate that an error occurred
        console.log("error: ", error); // Log the entire error object
        console.log("error.response: ", error.response); // Log the response received with the error
        throw error;
      }
  }

  logout() {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  }
  
    async register(firstname, lastname, email, password, phone_number, role, department, birthday, photo) {
      const response = await axios.post(API_URL + "register", {
        firstname,
        lastname,
        email,
        password,
        phone_number,
        role,
        department,
        birthday,
        photo
      });
      console.log(response);
      return response.data;
    }
    async sendVerificationCode(email) {
      console.log("Sending verification code for email:", email); 
      try {
        const response = await axios.post(API_URL + "send-email?email=" + email);
        console.log("Verification code sent to " + email);
        return response.data;
      } catch (error) {
        console.log("An error occurred while sending the verification code.");
        console.log(error);
        throw error;
      }
    }
    async verifyCode(email, code) {
      console.log("Verifying code for email:", email, "with code:", code); 
      try {
        const response = await axios.post(API_URL + "verify-code?email=" + email + "&code=" + code);
        console.log("Code verified for email:", email);
        return response.data;
      } catch (error) {
        console.log("An error occurred while verifying the code.");
        console.log(error);
        throw error;
      }
    }
    async resetPassword(email, newPassword, confirmPassword) {
      console.log("Resetting password for email:", email);
      try {
        const response = await axios.post(API_URL + "reset-password?email=" + email + "&newPassword=" + newPassword +"&confirmPassword=" + confirmPassword);
        console.log("Password reset for email:", email);
        return response.data;
      } catch (error) {
        console.log("An error occurred while resetting the password.");
        console.log(error);
        throw error;
      }
    }

    getCurrentUser() {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return {
          firstname: parsedUser.firstname,
          lastname: parsedUser.lastname,
          email: parsedUser.email,
          token: parsedUser.token,
          role: parsedUser.role

        };
      }
      return null;
    }
}
const authService = new AuthenticationService();

export default authService;