import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import userService from '../services/UserService';
import './table.css';
import Swal from 'sweetalert2';
import AddCertificate from './addCertification';
import { BrowserRouter as Router } from 'react-router-dom';

const CertificateTable = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedCertif, setSelectedCertif] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCertif, setFilteredCertif] = useState([]);
  const [editedName, setEditedName] = useState('');
  const [editedDesc, setEditedDesc] = useState('');
  const [editedExpiration, setEditedExpiration] = useState('');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await userService.getUserCertificates();
        setCertificates(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCertificates();
  }, []);

  const handleAddCertif = () => {
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
            <AddCertificate />
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
  };
  
  
  const handleEditCertif = (certif) => {
    setSelectedCertif(certif);
    setEditedName(certif.name);
    setEditedDesc(certif.description);
    setEditedExpiration(certif.expirationDate);
  }

  const handleSaveCertif = async (certif) => { 
    const userString = localStorage.getItem('user');
    const token = JSON.parse(userString).token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const newCertif = {
      id: certif.id,
      name: editedName,
      description: editedDesc,
      expirationDate: editedExpiration
    };
  
    try {
      const result = await axios.put(process.env.REACT_APP_API_URL + `/certificates/${certif.id}`, newCertif, config);
      console.log("1");
      const response = result.data;
      window.location.reload()
    } catch (error) {
      console.log(error);
    }
    
  }

  const handleCancelEdit = () => {
    setSelectedCertif(null);
  }

  const handleDeleteCertif = async (certif) => {
    const confirmDelete = window.confirm('Warning: You are deleting a certificat. Do you want to proceed?');

  if (!confirmDelete) {
    // If the user clicks "Cancel," do nothing
    return;
  }
    const userString = localStorage.getItem('user');
    const token = JSON.parse(userString).token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    try {
      await axios.delete(process.env.REACT_APP_API_URL +`/certificates/${certif.id}`, config); 
      const index = certificates.findIndex(c => c.id === certif.id); 
      certificates.splice(index, 1);
      setCertificates([...certificates]);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
  <div className="table-container">
    <table className="centered-table">
      <thead>
        <tr>
          <th style={{ color: "#f08700" }}>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Expiration Date</th>
          <th>  Actions</th>
        </tr>
      </thead>
      <tbody>
        {certificates.map((certificate) => (
          <tr key={certificate.id}>
            <td>{certificate.id}</td>
            <td>{selectedCertif && selectedCertif.id === certificate.id ? (
              <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
            ) : (
              certificate.name
            )}
            </td>
            <td>{selectedCertif && selectedCertif.id === certificate.id ? (
              <input type="text" value={editedDesc} onChange={(e) => setEditedDesc(e.target.value)} />
            ) : (
              certificate.description
            )}</td>
            <td>{selectedCertif && selectedCertif.id === certificate.id ? (
              <input type="Date" value={editedExpiration} onChange={(e) => setEditedExpiration(e.target.value)} />
            ) : (
              certificate.expirationDate
            )}</td>
            <td>
              <div style={{ display: 'flex' }}>
                {selectedCertif && selectedCertif.id === certificate.id ? (
                  <>
                    <button className='boutton' onClick={() => handleSaveCertif(selectedCertif)}>Save</button>
                    <button className="boutton" onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="boutton" onClick={() => handleEditCertif(certificate)}>Edit</button>
                    <button className="boutton" onClick={() => handleDeleteCertif(certificate)} style={{ backgroundColor: '#dc3545' }}>Delete</button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="button-container">
  <button className="boutton " onClick={handleAddCertif}>Add Certificate</button>
</div>
  </div>
</div>

  );
};

export default CertificateTable;
