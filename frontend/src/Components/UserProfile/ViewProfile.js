import React, { Component } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Moment from "react-moment";
import styles from "../../CSS/Form.module.css";
import Navbar from "../HomePage/Sections/Navbar";
import Footer from "../Footer/Footer";

class ViewProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      loading: true,
    };
  }

  componentDidMount() {
    const profile = JSON.parse(localStorage.getItem("userProfile"));
    if (profile) {
      this.setState({ profile, loading: false });
    } else {
      this.setState({ loading: false });
    }
  }

  handleLogout = () => {
    localStorage.removeItem("userProfile");
    window.location.href = "/";
  };

  render() {
    const { t } = this.props;
    const { profile, loading } = this.state;

    if (loading) {
      return <div>{t("Loading...")}</div>;
    }

    if (!profile) {
      return (
        <div>
          <Navbar />
          <Container style={{ marginTop: "100px", marginBottom: "80px" }}>
            <div className={styles.CardTitle} style={{ textAlign: "center" }}>
              {t("No profile found. Please register first.")}
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link to="/user/register">
                <Button>{t("Register Profile")}</Button>
              </Link>
            </div>
          </Container>
          <Footer />
        </div>
      );
    }

    return (
      <div>
        <Navbar />
        <Container style={{ marginTop: "100px", marginBottom: "80px" }}>
          <Row>
            <Col md={8} lg={8}>
              <Card>
                <Card.Header style={{ backgroundColor: "#008dc8", color: "white" }}>
                  <h4>{t("Your Profile")}</h4>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col md={6}>
                      <h6 style={{ fontWeight: "bold" }}>{t("Username")}</h6>
                      <p>{profile.username}</p>
                    </Col>
                    <Col md={6}>
                      <h6 style={{ fontWeight: "bold" }}>{t("Phone Number")}</h6>
                      <p>{profile.phoneNumber}</p>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <h6 style={{ fontWeight: "bold" }}>{t("Aadhar Number")}</h6>
                      <p>{profile.aadharNumber}</p>
                    </Col>
                    <Col md={6}>
                      <h6 style={{ fontWeight: "bold" }}>{t("Category")}</h6>
                      <p>{t(profile.category)}</p>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <h6 style={{ fontWeight: "bold" }}>{t("Years of Experience")}</h6>
                      <p>{profile.YOE}</p>
                    </Col>
                    <Col md={6}>
                      <h6 style={{ fontWeight: "bold" }}>{t("Other Skills")}</h6>
                      <p>{profile.otherSkills || "-"}</p>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <h6 style={{ fontWeight: "bold" }}>{t("Current Location")}</h6>
                      <p>{profile.currentLocation}</p>
                    </Col>
                    <Col md={6}>
                      <h6 style={{ fontWeight: "bold" }}>{t("Date of Availability")}</h6>
                      <p>
                        <Moment format="YYYY/MM/DD">{profile.availability}</Moment>
                      </p>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={12}>
                      <h6 style={{ fontWeight: "bold" }}>{t("Message for Recruiter")}</h6>
                      <p>{profile.messageForRecruiter}</p>
                    </Col>
                  </Row>

                  <Row style={{ marginTop: "20px" }}>
                    <Col md={12}>
                      <Button
                        variant="danger"
                        onClick={this.handleLogout}
                        style={{ marginRight: "10px" }}
                      >
                        {t("Logout")}
                      </Button>
                      <Link to="/user/register">
                        <Button variant="primary">{t("Edit Profile")}</Button>
                      </Link>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default withTranslation()(ViewProfile);
