import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthenticationService";
import UserService from "../services/UserService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
const API_URL = process.env.REACT_APP_API_URL;

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { email: "" },
      certificates: [],
      documents: [],
      photo: null
    };    
    this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
  }

  async componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
      this.setState({ redirect: "/home" });
      return;
    }

    try {
      const [certificates, documents, photo] = await Promise.all([  
        UserService.getUserCertificates(),  
        UserService.getUserDocuments(),  
        UserService.getUserPhoto(currentUser.email)]);
        this.setState({
          certificates: certificates.data,
          documents: documents.data,
          photo: URL.createObjectURL(new Blob([photo]))
        });

    } catch (error) {
      console.error(error);
      this.setState({ redirect: "/home" });
    }

    this.setState({ currentUser: currentUser, userReady: true });
  }
  handleAdd = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf, .png , .jpg , .jpeg";
    fileInput.addEventListener("change", async (event) => {
      if (!event.target.files[0]) {
        return;
      }
  
      const file = event.target.files[0];
  
      const document = {
        name: file.name,
        data: await file.arrayBuffer(),
      };
  
      try {
        // Call the addDocument API with the document object
        await UserService.addDocument(document);
  
        // Update the state with the new document
        this.setState((prevState) => ({
          documents: [...prevState.documents, document]
        }));
  
      } catch (error) {
        console.error(error);
      }
    });
  
    // Click the input to open the file picker dialog
    fileInput.click();
  };
  
  async handleDeleteDocument(documentId) {
    try {
      await UserService.deleteDocument(documentId);
      this.setState(prevState => ({
        documents: prevState.documents.filter(doc => doc.id !== documentId)
      }));
    } catch (error) {
      console.error(error);
    }
  }
  
  

  render() {
    const { redirect, userReady, currentUser, certificates, photo } = this.state;

    if (redirect) {
      return <Navigate to={redirect} />;
    }

    return (
      <div className="col-md-12">
  {userReady && (
    <div className="card card-container1">
      <div className="text-center">
      {photo && 
        <div className="rounded-circle-container">
          <img src={photo} alt="Profile" className="rounded-circle" />
        </div>
      }
    </div>

      <header className="jumbotron" style={{ backgroundColor: "#00396b" ,fontFamily: "Montserrat" }}>
        <h3 style={{ color: "white",textAlign: "center" }}>Profile of Mr/Miss {currentUser.firstname} {currentUser.lastname}</h3>
      </header>
      <div style={{ fontFamily: "Montserrat" }}>
      <h3>Infomations:</h3>
        <ul>
      <li><h5><strong>First Name:</strong> {currentUser.firstname}</h5> </li>
      <li><h5><strong>Email:</strong> {currentUser.email}</h5></li>
      <li><h5><strong>Authorities:</strong> {currentUser.role}</h5></li>
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
      <span className="span1"><h3>Documents:</h3>
        <button className="boutton1" onClick={this.handleAdd}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </span>
      <ul>
        {this.state.documents && this.state.documents.map(document => (
          <li key={document.id}>
            <div>
              <a href={API_URL + `/user/${currentUser.email}/documents/${document.id}`} target="_blank" rel="noopener noreferrer">{document.name}  :  </a>
              <button className="boutton1" onClick={() => this.handleDeleteDocument(document.id)}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  )}
</div>
    );
  }
}
