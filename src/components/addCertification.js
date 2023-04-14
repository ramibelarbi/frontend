import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { CreateCertificate } from "../services/certificateService";
import { withRouter } from '../common/with-router';

const required = (value) => {
  if (!value) {
    return <div className="alert alert-danger" role="alert">This field is required!</div>;
  }
};

class AddCertificate extends Component {
  constructor(props) {
    super(props);
    this.handleAddCertificate = this.handleAddCertificate.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeExpirationDate = this.onChangeExpirationDate.bind(this);

    this.state = {
      name: "",
      description: "",
      expirationDate: ""
    };
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onChangeExpirationDate(e) {
    this.setState({
      expirationDate: e.target.value
    });
  }

  handleAddCertificate(e) {
    e.preventDefault();

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      CreateCertificate(
        this.state.name,
        this.state.description,
        this.state.expirationDate
      ).then(() => {
        this.setState({ successMessage: "Certificate created successfully!" });
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <h2 className="text-center mb-4">ADD CERTIFICATE</h2>
          <Form
            onSubmit={this.handleAddCertificate}
            ref={(c) => {
              this.form = c;
            }}
          >
            <div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <Input
                  type="text"
                  className="form-control"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChangeName}
                  validations={[required]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <Input
                  type="text"
                  className="form-control"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChangeDescription}
                  validations={[required]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="expirationDate">Expiration Date</label>
                <Input
                  type="date"
                  className="form-control"
                  name="expirationDate"
                  value={this.state.expirationDate}
                  onChange={this.onChangeExpirationDate}
                  validations={[required]}
                />
              </div>
              <div className="form-group">
                <button className="btn btn-primary btn-block">
                  Add Certificate
                </button>
                {this.state.successMessage && <div className="alert alert-success">{this.state.successMessage}</div>}
              </div>
            </div>
            <CheckButton
              style={{ display: "none" }}
              ref={(c) => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(AddCertificate);
