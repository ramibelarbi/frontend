import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import './table.css';
import AddUser from './addUser';
import { BrowserRouter as Router } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactDOM from 'react-dom/client';

const loadUsers = async () => {
  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);
  const token = user.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  try {
    const result = await axios.get(process.env.REACT_APP_API_URL +"/user", config);
    return result.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const isAdminUser = () => {
  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);
  const token = user.token;
  const decodedToken = jwt_decode(token);
  return decodedToken && decodedToken.role.includes('ADMIN');
}

function UserTable() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  //const [editedPassword, setEditedPassword] = useState('');
  const [editedPhoneNumber, setEditedPhoneNumber] = useState('');
  const [editedRole, setEditedRole] = useState('');
  const [editedDepartment, setEditedDepartment] = useState('');
  const [editedBirthday, setEditedBirthday] = useState('');

  useEffect(() => {
    if (isAdminUser()) {
      loadUsers().then(data => {
        setUsers(data);
        if (searchTerm) {
          setFilteredUsers(data.filter(user => user.email.toLowerCase().startsWith(searchTerm.toLowerCase())));
        } else {
          setFilteredUsers(data);
        }
      }).catch(error => {
        console.log(error);
      });
    }
  }, [searchTerm]);

  if (!isAdminUser()) {
    return <div>You are not authorized to access this page.</div>
  }
  const handleAddUser = () => {
    const wrapper = document.createElement('div');
    const reactRoot = ReactDOM.createRoot(wrapper);
  
    Swal.fire({
      html: wrapper,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      width :'32%',
      heigh : "30%",
      didOpen: () => {
        reactRoot.render(
          <Router>
            <AddUser/>
          </Router>
        );
      },
      willClose: () => {
        reactRoot.unmount();
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Form submitted!');
        window.location.reload();
      }
    });
  }
  
    const handleEditUser = (user) => {
      setSelectedUser(user);
      setEditedFirstName(user.firstname);
      setEditedLastName(user.lastname);
      setEditedEmail(user.email);
      //setEditedPassword(user.password);
      setEditedPhoneNumber(user.phone_number);
      setEditedRole(user.role);
      setEditedDepartment(user.department);
      setEditedBirthday(user.birthday);
    }


    const handleSaveUser = async (user) => {
      const userString = localStorage.getItem('user');
      const token = JSON.parse(userString).token;
      const config = {
        headers: { Authorization: `Bearer ${token}`,  }
      };
      const newUser = {
        id: user.id,
        firstname: editedFirstName,
        lastname: editedLastName,
        email: editedEmail,
        //password: editedPassword,
        phone_number: editedPhoneNumber,
        role: editedRole,
        department: editedDepartment,
        birthday: editedBirthday
      };
    
      try {
        const result = await axios.put(process.env.REACT_APP_API_URL +`/user/${user.id}`, newUser, config);
        window.location.reload()
      } catch (error) {
        console.log(error);
      }
      
    }

  const handleCancelEdit = () => {
    setSelectedUser(null);
  }

  const handleDeleteUser = async (user) => {
    const userString = localStorage.getItem('user');
    const token = JSON.parse(userString).token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    try {
      await axios.delete(process.env.REACT_APP_API_URL +`/user/${user.id}`, { ...config, data: user });
      const index = users.findIndex(u => u.id === user.id);
      users.splice(index, 1);
      setUsers([...users]);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
    <div className="table-controls">
      <button className="boutton add-button" onClick={handleAddUser}>Add User</button>
      <input
  className="search"
  type="text"
  placeholder="Search by email"
  onChange={(e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    if (searchTerm === '') {
      setUsers(users);
    } else {
      const filteredUsers = users.filter(user => user.email.toLowerCase().startsWith(searchTerm));
      setUsers(filteredUsers);
    }
  }}
/>

    </div>
      
      <table className="user-table">
        <thead>
          <tr>
            <th style={{ color: "#f08700" }}>ID</th>
            <th> First Name</th>
            <th> Last Name</th>
            <th> Email</th>
            <th> Phone Number</th>
            <th> Role</th>
            <th> Department</th>
            <th> Hiring Date</th>
            <th> Actions</th>
          </tr>
        </thead>
        <tbody>
  {users.map(user => (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>
        {selectedUser && selectedUser.id === user.id ? (
          <input type="text" value={editedFirstName} onChange={(e) => setEditedFirstName(e.target.value)} />
        ) : (
          user.firstname
        )}
      </td>
      <td>
        {selectedUser && selectedUser.id === user.id ? (
          <input type="text" value={editedLastName} onChange={(e) => setEditedLastName(e.target.value)} />
        ) : (
          user.lastname
        )}
      </td>
      <td>
        {selectedUser && selectedUser.id === user.id ? (
          <input type="text" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} />
        ) : (
          user.email
        )}
      </td>
      <td>
        {selectedUser && selectedUser.id === user.id ? (
          <input type="text" value={editedPhoneNumber} onChange={(e) => setEditedPhoneNumber(e.target.value)} />
        ) : (
          user.phone_number
        )}
      </td>
      <td>
          {user.role}
      </td>
      <td>
        {selectedUser && selectedUser.id === user.id ? (
          <input type="text" value={editedDepartment} onChange={(e) => setEditedDepartment(e.target.value)} />
        ) : (
          user.department
        )}
      </td>
      <td>
        {selectedUser && selectedUser.id === user.id ? (
          <input type="Date" value={editedBirthday} onChange={(e) => setEditedBirthday(e.target.value)} />
        ) : (
          user.birthday
        )}
      </td>
      
              <td>
                <div style={{ display: 'flex' }}> 
                  {selectedUser && selectedUser.id === user.id ? (
                    <>
                      <button className="boutton " onClick={() => handleSaveUser(selectedUser)}>Save</button>
                      <button className="boutton " onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="boutton " onClick={() => handleEditUser(user)} >Edit</button>
                      <button className="boutton " onClick={() => handleDeleteUser(user)} style={{ backgroundColor: '#dc3545' }}>Delete</button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}  

export default UserTable;
