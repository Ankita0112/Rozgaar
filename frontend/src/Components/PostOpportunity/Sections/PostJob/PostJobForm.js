import React, { Component } from "react";
import axios from "axios";
import API_BASE_URL from "../../../../config";
import { Button, Form } from "react-bootstrap";
import styles from "../../../../CSS/Form.module.css";
import { withTranslation } from "react-i18next";

class PostJobForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      recruiterEmailId: "",
      recruiterPhoneNumber: "",
      category: "",
      description: "",
      location: "",
      offeredSalary: "",
      numberOfPositions: "",
      errors: {},
    };
  }

  handleChange = (event) => {
    let itemValue = event.target.value;
    let itemName = event.target.name;
    this.setState({
      [event.target.name]: itemValue,
    });
    // Inline validation per-field
    this.setState((prev) => {
      const errors = { ...prev.errors };
      if (itemName === "recruiterPhoneNumber") {
        if (!/^\d{0,10}$/.test(itemValue) || itemValue.length > 10) {
          errors.recruiterPhoneNumber = "Enter only digits (max 10)";
        } else if (itemValue.length > 0 && itemValue.length < 10) {
          errors.recruiterPhoneNumber = "Enter a 10 digit number";
        } else {
          delete errors.recruiterPhoneNumber;
        }
      }
      if (itemName === "offeredSalary") {
        if (itemValue !== "" && isNaN(Number(itemValue))) errors.offeredSalary = "Enter a valid number";
        else delete errors.offeredSalary;
      }
      if (itemName === "numberOfPositions") {
        if (itemValue !== "" && (!/^\d+$/.test(itemValue) || Number(itemValue) < 1)) errors.numberOfPositions = "Enter a positive integer";
        else delete errors.numberOfPositions;
      }
      if (itemName === "title") {
        if (itemValue.trim().length > 0 && itemValue.trim().length < 5) errors.title = "Must be at least 5 characters";
        else delete errors.title;
      }
      if (itemName === "location") {
        if (itemValue.trim().length > 0 && itemValue.trim().length < 2) errors.location = "Must be at least 2 characters";
        else delete errors.location;
      }
      return { errors };
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
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
    
    // client-side validation before sending
    const { title, recruiterEmailId, recruiterPhoneNumber, category, location, offeredSalary, numberOfPositions } = this.state;
    const errors = {};
    if (!title || title.trim().length < 5) errors.title = "Title must be at least 5 characters";
    if (!recruiterEmailId || recruiterEmailId.trim().length === 0) errors.recruiterEmailId = "Email is required";
    if (!recruiterPhoneNumber || !/^\d{10}$/.test(recruiterPhoneNumber)) errors.recruiterPhoneNumber = "Enter a valid 10 digit phone number";
    if (!category || category === "Choose Category" || category.trim().length === 0) errors.category = "Please select a category";
    if (!location || location.trim().length < 2) errors.location = "Location must be at least 2 characters";
    if (offeredSalary !== "" && isNaN(Number(offeredSalary))) errors.offeredSalary = "Offered salary must be a number";
    if (numberOfPositions !== "" && (!/^\d+$/.test(numberOfPositions) || Number(numberOfPositions) < 1)) errors.numberOfPositions = "Number of positions must be a positive integer";

    if (Object.keys(errors).length) {
      this.setState({ errors });
      alert("Please fix the following errors:\n\n" + Object.values(errors).join("\n"));
      return;
    }

    axios
      .post(`${API_BASE_URL}/jobs`, {
        title: this.state.title,
        recruiterEmailId: this.state.recruiterEmailId,
        recruiterPhoneNumber: this.state.recruiterPhoneNumber,
        category: englishCategory,
        description: this.state.description,
        location: this.state.location,
        offeredSalary: this.state.offeredSalary,
        numberOfPositions: this.state.numberOfPositions,
      })
      .then((response) => {
        console.log("Job posted successfully:", response);
        const data = response.data;
        this.setState({ data, errors: {} });
        alert("Job Posted Successfully!");

        this.setState({
          title: "",
          recruiterEmailId: "",
          recruiterPhoneNumber: "",
          category: "",
          description: "",
          location: "",
          offeredSalary: "",
          numberOfPositions: "",
        });
        
        // Redirect to home after 1 second
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      })
      .catch((error) => {
        console.error("Error posting job:", error);
        // map backend validation errors (array) to state.errors for display
        if (error.response && error.response.data) {
          const resp = error.response.data;
          const newErrors = {};
          if (Array.isArray(resp.errors)) {
            resp.errors.forEach((e) => {
              if (e.field) newErrors[e.field] = e.message;
            });
          } else if (resp.errors && typeof resp.errors === "object") {
            // mongoose error object
            Object.keys(resp.errors).forEach((k) => {
              newErrors[k] = resp.errors[k].message || resp.errors[k].reason || String(resp.errors[k]);
            });
          } else if (resp.error) {
            newErrors.general = resp.error;
          }
          this.setState({ errors: newErrors });
          // Show alert with error message
          const errorMessages = Object.values(newErrors);
          if (errorMessages.length > 0) {
            alert("Error posting job:\n\n" + errorMessages.join("\n"));
          }
        } else {
          alert("An error occurred while posting the job. Please try again.");
        }
      });

    // setTimeout(() => {
    //   window.location.href = `/jobs/${role.toLowerCase()}`;
    // }, 1000);
  };

  render() {
    const { t } = this.props;
    const {
      title,
      recruiterEmailId,
      recruiterPhoneNumber,
      category,
      description,
      location,
      offeredSalary,
      numberOfPositions,
      errors,
    } = this.state;

    return (
      <div style={{ marginBottom: "80px" }}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Label className={styles.CardTitle}>
            {t("Let job seekers know you need them")}
          </Form.Label>

          <Form.Group>
            <Form.Control
              className={styles.Input}
              type="text"
              name="title"
              value={title}
              placeholder={t("Your Name / Company Name")}
              style={{ marginLeft: "40px", marginTop: "30px" }}
              onChange={this.handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Control
              className={styles.Input}
              type="email"
              name="recruiterEmailId"
              value={recruiterEmailId}
              placeholder={t("Email")}
              style={{ marginLeft: "40px", marginTop: "30px" }}
              onChange={this.handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Control
              className={styles.Input}
              type="text"
              name="recruiterPhoneNumber"
              value={recruiterPhoneNumber}
              placeholder={t("Contact Number")}
              maxLength="10"
              style={{ marginLeft: "40px", marginTop: "30px" }}
              onChange={this.handleChange}
              required
            />
          </Form.Group>
          {errors && errors.recruiterPhoneNumber && (
            <p className={styles.ErrorMessage}>{errors.recruiterPhoneNumber}</p>
          )}

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
            {errors && errors.category && (
              <p className={styles.ErrorMessage}>{errors.category}</p>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={description}
              placeholder={t("Short Description")}
              style={{ marginTop: "35px", marginLeft: "40px" }}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Control
              className={styles.Input}
              type="text"
              name="location"
              value={location}
              placeholder={t("Location")}
              style={{ marginLeft: "40px", marginTop: "30px" }}
              onChange={this.handleChange}
              required
            />
            {errors && errors.location && (
              <p className={styles.ErrorMessage}>{errors.location}</p>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Control
              className={styles.Input}
              type="text"
              name="offeredSalary"
              value={offeredSalary}
              placeholder={t("Offered Salary (Per Month)")}
              style={{ marginLeft: "40px", marginTop: "30px" }}
              onChange={this.handleChange}
              required
            />
            {errors && errors.offeredSalary && (
              <p className={styles.ErrorMessage}>{errors.offeredSalary}</p>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Control
              className={styles.Input}
              type="text"
              name="numberOfPositions"
              value={numberOfPositions}
              placeholder={t("No. of Positions")}
              style={{ marginLeft: "40px", marginTop: "30px" }}
              onChange={this.handleChange}
              required
            />
            {errors && errors.numberOfPositions && (
              <p className={styles.ErrorMessage}>{errors.numberOfPositions}</p>
            )}
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

export default withTranslation()(PostJobForm);
