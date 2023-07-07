import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import UserService from "../services/UserService";
import SearchBar from "./search";
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
function SearchProfile() {
  const [searchText, setSearchText] = useState("");
  const [redirect, setRedirect] = useState("");
  const [userReady, setUserReady] = useState(false);
  const [searchuser, setsearchuser] = useState({});
  const [certificates, setCertificates] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [photo, setPhoto] = useState("");
  const [showTable, setShowTable] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [UserList , setUserList] = useState([]);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    try {
      setUserList([]);
      let response;
      if (searchType === "email") {
        response = await UserService.getUserProfile(searchText);
        const user = response.data;
        const userdocuments = user.documents || [];
        setsearchuser(user);
        setCertificates(user.certificates);
        setDocuments(userdocuments)
        setUserReady(true);
        setShowTable(false);
        setPhoto(user.photo);
      } else if (searchType === "certificate") {
        response = await UserService.getUsersByCertificate(searchText);
        const users = response;
        const emails = users.map(user => user);
        setUserList(emails);
        setShowTable(false);
        setUserReady(false);
        setsearchuser(null);
        setCertificates(null);
        setDocuments(null);
      }
    } catch (error) {
      console.error(error);
      setRedirect(null);
      setShowTable(true);
    }
  };
  
  const loadUsers = async () => {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    try {
      const result = await axios.get(API_URL + `/user`, config);
      setUsers(result.data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  useEffect(() => {
    loadUsers();
  }, []);


  useEffect(() => {
    if (searchText) {
      handleSearch(searchText);
    }
    else {
      setShowTable(true);
    }
  }, [searchText,searchType]);

  useEffect(() => {
    async function fetchData() {
      if (searchuser) {
        const photoData = await UserService.getUserPhoto(searchuser.email);
        const photoUrl = URL.createObjectURL(photoData);
        setPhotoUrl(photoUrl);
      }
    }
    fetchData();
  }, [searchuser]);
  useEffect(() => {
    if (searchuser && !Object.keys(searchuser).length) {
      setSearchPerformed(true);
    }
  }, [searchuser]);
    

  const renderUserList = () => {
    if (UserList.length === 0 && searchPerformed) {
      return (
        <div className="no-users-found">
        <h2>No Users Found</h2>
        <p>We couldn't find any users with this certificate.</p>
        <p>Please double-check the certificate information and try again.</p>
      </div>
      );
    } else if (UserList.length > 0) {
      return (
        <table className="centered-table ">
          <thead>
            <tr>
              <th style={{ color: "#f08700" }}>ID</th>
              <th>Email</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Experience</th>
              <th>ExpirationDate</th>
            </tr>
          </thead>
          <tbody>
            {UserList.map((userData, index) => {
              const [email, firstname, lastname,experience,expirationDate] = userData.split(", ");
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{email}</td>
                  <td>{firstname}</td>
                  <td>{lastname}</td>
                  <td>{experience}</td>
                  <td>{expirationDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    } else {
      return null;
    }
  };  

  const renderTable = () => {
    if (!showTable) {
      return null;
    }
    const sortedUsers = users.sort((a, b) => b.certificates.length - a.certificates.length);
  
    return (
      <table className="centered-table">
        <thead>
          <tr>
            <th style={{ color: "#f08700" }}>Email</th>
            <th>Number of Certificates</th>
          </tr>
        </thead>
        <tbody>
        {sortedUsers.map((user, index) => (
          <tr key={user.email + "-" + index}>
            <td>{user.email}</td>
            <td>{user.certificates.length}</td>
          </tr>
        ))}
        </tbody>
      </table>
    );
  };
  
  const renderProfile = () => {
    if (redirect) {
      return <Navigate to={redirect} />;
    }
    if (!searchuser && searchPerformed) {
      return (
        <div className="no-users-found">
          <h2>No User Found</h2>
          <p>We couldn't find a user with that information.</p>
          <p>Please double-check and try again.</p>
        </div>
      );
    }    
    return (
      <div className="col-md-12">
        {userReady && (
          <div className="card card-container1">
            <div className="text-center">
              {photoUrl && 
                <div className="rounded-circle-container">
                  <img src={photoUrl} alt="Profile" className="rounded-circle" />
                </div>
              }
            </div>
    
          <header className="jumbotron" style={{ backgroundColor: "#00396b" ,fontFamily: "Montserrat" }}>
            <h3 style={{ color: "white",textAlign: "center" }}>Profile of Mr/Miss {searchuser.firstname} {searchuser.lastname}</h3>
          </header>
          <div style={{ fontFamily: "Montserrat" }}>
          <h3>Infomations:</h3>
            <ul>
          <li><h5><strong>First Name:</strong> {searchuser.firstname}</h5> </li>
          <li><h5><strong>Email:</strong> {searchuser.email}</h5></li>
          <li><h5><strong>Authorities:</strong> {searchuser.role}</h5></li>
          </ul>
          </div>
          <hr />
          <div style={{ fontFamily: "Montserrat" }}>
            <h3>Certificates:</h3>
            <ul>
              {certificates.map(certificate => (
                <li key={certificate.id}>
                  {certificate.name} - {certificate.description} - {certificate.expirationDate}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ fontFamily: "Montserrat" }}>
            <h3>Documents:</h3>
              <ul>
                {documents.map(document => (
                  <li key={document.id}>
                    <a href={API_URL + `/user/${searchuser.email}/documents/${document.id}`} target="_blank" rel="noopener noreferrer">{document.name}</a>
                  </li>
                ))}
              </ul>
          </div>
        </div>
      )}
    </div>
    );
};

  return (
    <div>
      <SearchBar onSearch={setSearchText} searchType={searchType} onSearchTypeChange={handleSearchTypeChange}/>
      {renderTable()}
      {searchType === "email" &&  searchPerformed && renderProfile()}
      {searchType === "certificate" &&  searchPerformed  && renderUserList()}
    </div>
    
  );
}

export default SearchProfile;