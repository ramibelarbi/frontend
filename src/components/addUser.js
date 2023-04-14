import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { withRouter } from '../common/with-router';


import AuthService from "../services/AuthenticationService";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The firstname must be between 3 and 20 characters.
      </div>
    );
  }
};

const lastname = value => {
    if (value.length < 3 || value.length > 20) {
      return (
        <div className="alert alert-danger" role="alert">
          The lastname must be between 3 and 20 characters.
        </div>
      );
    }
  };

const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};
const phone_number= value => {
    if (value.length !== 8) {
      return (
        <div className="alert alert-danger" role="alert">
          The phone number is incorrect.
        </div>
      );
    }
  };



class AddUser extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeLastname= this.onChangeLastname.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this);
    this.onChangeRole = this.onChangeRole.bind(this);
    this.onChangeDepartment = this.onChangeDepartment.bind(this);
    this.onChangeBirthday = this.onChangeBirthday.bind(this);
    this.onChangePhoto = this.onChangePhoto.bind(this);

    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      phone_number:"",
      role : "USER",
      departement: "",
      birthday:"",
      photo: null,
      successful: false,
      message: ""
    };
  }

  onChangeUsername(e) {
    this.setState({
      firstname: e.target.value
    });
  }

  onChangeLastname(e) {
    this.setState({
      lastname: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }
  onChangePhoneNumber(e) {
    this.setState({
      phone_number: e.target.value
    });
  }
  onChangeRole(e) {
    this.setState({
      role: e.target.value
        });
    }
  
  onChangeDepartment(e) {
    this.setState({
      departement: e.target.value
        });
    }
    
    onChangeBirthday(e) {
        const birthday = e.target.value;
        this.setState({
          birthday: birthday
        });
      }
      onChangePhoto = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.setState({
            photo: reader.result
          });
        };
      }
  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      console.log(this.state);
      AuthService.register(
        this.state.firstname,
        this.state.lastname,
        this.state.email,
        this.state.password,
        this.state.phone_number,
        this.state.role,
        this.state.departement,
        this.state.birthday,
        this.state.photo
      ).then(response => {
        if (response.data) {
          this.setState({
            message: response.data.message,
            successful: true,
          });
        } else {
          this.setState({
            successful: false,
            message: "An error occurred. Please try again later.",
          });
        }
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }
  
  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleRegister}
            ref={c => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="username">Firstname</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    validations={[required, vusername]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastname">lastname</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="lastname"
                    value={this.state.lastname}
                    onChange={this.onChangeLastname}
                    validations={[required, lastname]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    validations={[required, email]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required, vpassword]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone_number">phone_number</label>
                  <Input
                    type="tel"
                    className="form-control"
                    name="phone_number"
                    value={this.state.phone_number}
                    onChange={this.onChangePhoneNumber}
                    validations={[required, phone_number]}
                  />
                </div>
                <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <select name="department" value={this.state.departement} onChange={this.onChangeDepartment}>
                    <option value="">Select a department...</option>
                    <option value="reseau">Réseau</option>
                    <option value="systeme">Système</option>
                    <option value="voieIp">Voie IP</option>
                    <option value="securite">Sécurité</option>
                    <option value="Developer">Developer</option>
                    <option value="Sales"> Sales</option>
                    <option value="Pre_sales"> Pre_sales</option>
                </select>

                </div>
                <div className="form-group">
                  <label htmlFor="iring date">Hiring Date</label>
                  <Input
                    type="date"
                    className="form-control"
                    name="birthday"
                    value={this.state.birthday}
                    onChange={this.onChangeBirthday}
                    validations={[required]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="photo">Photo</label>
                  <Input
                  type="file"
                  className="form-control"
                  name="photo"
                  onChange={this.onChangePhoto}
                  accept=".jpg,.jpeg,.png,.bmp"
                  />
                  </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block">AddUser</button>
                </div>
              </div>
            )}

            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}
export default withRouter(AddUser);