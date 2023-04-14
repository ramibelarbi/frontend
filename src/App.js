import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthService from "./services/AuthenticationService";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardAdmin from "./components/board-admin.component";
import ForgotPassword from "./components/forgot-password";
import AddUser from "./components/addUser";
import AddCertificateForm from "./components/addCertification";
import SearchBar from "./components/search";
import SearchProfile from "./components/SearchProfil";
import imageSrc from './images/LOGO_0003_WHITE-&-ORANGE.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
  
    if (user && user.role) {
      this.setState({
        currentUser: user,
        showAdminBoard: user.role.includes("ADMIN"),
      });
    }
  }
  logOut() {
    AuthService.logout();
    this.setState({
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showAdminBoard} = this.state;
  
    return (
      <div>
        <nav className="navbar navbar-expand ">
          <Link to={"/"} className="navbar-brand">
            <img src={imageSrc} alt="OneTech BS " style={{ width: '100%', height: '50px' }} />
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link" style={{ color: "#f08700" }}>
                Home
              </Link>
            </li>
            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  User Management
                </Link>
              </li>
            )}
            {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  Certificate
                </Link>
              </li>
            )}
          </div>
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <Link to={"/search-profile?email=${searchText}"} className="nav-link">
                  Search 
                </Link>
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.firstname} {currentUser.lastname}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  Logout
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>
  
              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>
  
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Forgot-Password" element={<ForgotPassword />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/admin" element={<BoardAdmin />} />
            <Route path="/adduser" element={<AddUser />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/addCertification" element={<AddCertificateForm />} />
            <Route path="/search-profile" element={<SearchProfile/>} />
          </Routes>
        </div>
      </div>
    );
  }
}  
export default App;