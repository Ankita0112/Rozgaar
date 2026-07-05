import React, { Component } from "react";
import axios from "axios";
import API_BASE_URL from "../../../../config";
import { Button, Form } from "react-bootstrap";
import styles from "../../../../CSS/Form.module.css";
import { withTranslation } from "react-i18next";
class UserProfileForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      phoneNumber: "",
      aadharNumber: "",
      category: "",
      YOE: "",
      otherSkills: "",
      currentLocation: "",
      availability: "",
      messageForRecruiter: "",
    };
  }

  handleChange = (event) => {
    let itemValue = event.target.value;
    let itemName = event.target.name;
    this.setState({
      [event.target.name]: itemValue,
    });

    if(itemName === "phoneNumber" && itemValue.length < 10) {
      document.getElementById('phoneNumber').style.display = "block";
    } else {
      document.getElementById('phoneNumber').style.display = "none";
    }
    if(itemName === "aadharNumber" && itemValue.length < 12) {
      document.getElementById('aadharNumber').style.display = "block";
    } else {
      document.getElementById('aadharNumber').style.display = "none";
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();

    // Client-side validation
    const errors = [];
    
    if (!this.state.username || this.state.username.trim().length === 0) {
      errors.push("Username is required");
    }
    
    if (!this.state.phoneNumber || this.state.phoneNumber.length !== 10 || !/^\d{10}$/.test(this.state.phoneNumber)) {
      errors.push("Phone number must be 10 digits");
    }
    
    if (!this.state.aadharNumber || this.state.aadharNumber.length !== 12 || !/^\d{12}$/.test(this.state.aadharNumber)) {
      errors.push("Aadhar number must be 12 digits");
    }
    
    if (!this.state.category || this.state.category === "Choose Category") {
      errors.push("Please select a category");
    }
    
    if (!this.state.YOE || this.state.YOE.trim().length === 0) {
      errors.push("Years of experience is required");
    }
    
    if (!this.state.currentLocation || this.state.currentLocation.trim().length === 0) {
      errors.push("Current location is required");
    }
    
    if (!this.state.availability || this.state.availability.trim().length === 0) {
      errors.push("Date of availability is required");
    }
    
    if (errors.length > 0) {
      alert("Please fix the following errors:\n\n" + errors.join("\n"));
      return;
    }

    let englishCategory = "OTHERS";
    if (this.state.category === "बिजली कारीगर") englishCategory = "ELECTRICIAN";
    else if (this.state.category === "नलकार") englishCategory = "PLUMBER";
    else if (this.state.category === "क्रियाविधि") englishCategory = "MECHANIC";
    else if (this.state.category === "बावरची") englishCategory = "COOK";
    else if (this.state.category === "चपरासी") englishCategory = "PEON";
    else if (this.state.category === "चालक") englishCategory = "DRIVER";
    else if (this.state.category === "नौकरानी") englishCategory = "MAID";
    else if (this.state.category === "श्रम") englishCategory = "LABOUR";
    else if (this.state.category === "सुरक्षा गार्ड") englishCategory = "SECURITY GUARD";
    else englishCategory = this.state.category;

    axios
      .post(`${API_BASE_URL}/user/register`, {
        username: this.state.username,
        phoneNumber: this.state.phoneNumber,
        aadharNumber: this.state.aadharNumber,
        category: englishCategory,
        YOE: this.state.YOE,
        otherSkills: this.state.otherSkills,
        currentLocation: this.state.currentLocation,
        availability: this.state.availability,
        messageForRecruiter: this.state.messageForRecruiter,
      })
      .then((response) => {
        console.log("SUBMITTTING USER PROFILE", response);
        const data = response.data;
        this.setState({ data });
        
        // Save profile to localStorage
        localStorage.setItem("userProfile", JSON.stringify({
          ...this.state,
          category: englishCategory,
          _id: data._id
        }));
        
        alert("Your profile is now visible to Recruiters");

        this.setState({
          username: "",
          phoneNumber: "",
          aadharNumber: "",
          category: "",
          YOE: "",
          otherSkills: "",
          currentLocation: "",
          availability: "",
          messageForRecruiter: "",
        });
        
        // Redirect to home page after 1 second
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 409) {
          alert("This Aadhar number is already registered. Please use a different Aadhar number.");
        } else if (error.response && error.response.data && error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors).map((err) => err.message || err);
          alert("Registration failed:\n\n" + errorMessages.join("\n"));
        } else if (error.response && error.response.data && error.response.data.message) {
          alert("Registration failed: " + error.response.data.message);
        } else {
          alert("An error occurred during registration. Please try again.");
        }
      });
  };

  render() {
    const { t } = this.props;
    const {
      username,
      phoneNumber,
      aadharNumber,
      category,
      YOE,
      otherSkills,
      currentLocation,
      availability,
      messageForRecruiter,
    } = this.state;

    return (
      <div style={{ marginBottom: "80px" }}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Label className={styles.CardTitle}>
            {t("Add your profile to get hired")}
          </Form.Label>

          <Form.Group>
            <Form.Control
              className={styles.Input}
              type="text"
              name="username"
              value={username}
              placeholder={t("Username")}
              style={{ marginLeft: "40px", marginTop: "30px" }}
              onChange={this.handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Control
              className={styles.Input}
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              placeholder={t("Phone Number")}
              maxLength="10"
              style={{ marginLeft: "40px", marginTop: "30px" }}
              onChange={this.handleChange}
              required
            />
          </Form.Group>
          <p id="phoneNumber" className={styles.ErrorMessage}>* Enter a 10 digit number</p>

          <Form.Group>
            <Form.Control
              className={styles.Input}
              type="text"
              name="aadharNumber"
              value={aadharNumber}
              placeholder={t("Aadhar Number")}
              maxLength="12"
              style={{ marginLeft: "40px", marginTop: "30px" }}
              onChange={this.handleChange}
              required
            />
          </Form.Group>
          <p id="aadharNumber" className={styles.ErrorMessage}>* Enter a 12 digit number</p>

          <Form.Group>
            <Form.Control
              as="select"
              className={styles.Input}
              name="category"
              value={category}
              defaultValue="Choose Category"
              style={{ marginTop: "30px", marginLeft: "40px" }}
              onChange={this.handleChange}
              required
            >
              <option> {t("Choose Category")} </option>
              <option> {t("ELECTRICIAN")} </option>
              <option> {t("PLUMBER")} </option>
              <option> {t("MECHANIC")} </option>
              <option> {t("COOK")} </option>
              <option> {t("PEON")} </option>
              <option> {t("DRIVER")} </option>
              <option> {t("MAID")} </option>
              <option> {t("LABOUR")} </option>
              <option> {t("SECURITY GUARD")} </option>
              <option> {t("OTHERS")} </option>
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Control
              className={styles.Input}
              type="text"
              name="YOE"
              value={YOE}
              placeholder={t("Years of Experience")}
              style={{ marginLeft: "40px", marginTop: "30px" }}
              onChange={this.handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Control
              className={styles.Input}
              type="text"
              name="otherSkills"
              value={otherSkills}
              placeholder={t("Any Other Skill?")}
              style={{ marginLeft: "40px", marginTop: "30px" }}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Control
              className={styles.Input}
              type="text"
              name="currentLocation"
              value={currentLocation}
              placeholder={t("Current Location")}
              style={{ marginLeft: "40px", marginTop: "30px" }}
              onChange={this.handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Control
              className={styles.Input}
              type="text"
              name="availability"
              value={availability}
              placeholder={t("Date of Availability (YYYY/MM/DD)")}
              style={{ marginLeft: "40px", marginTop: "30px" }}
              onChange={this.handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Control
              as="textarea"
              rows={4}
              name="messageForRecruiter"
              value={messageForRecruiter}
              placeholder={t(
                "Anything you want to share with the recruiter..."
              )}
              style={{ marginTop: "35px", marginLeft: "40px" }}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Button className={styles.Button} type="submit">
              {t("Submit")}
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default withTranslation()(UserProfileForm);
