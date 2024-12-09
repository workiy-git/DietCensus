import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/Ellipse 4.png";
import logo1 from "../../assets/Frame 1.png";
import logo2 from "../../assets/Group 4.png";
import logo3 from "../../assets/Group 5.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/login.css";

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        phoneNumber,
        password,
      });
      const { token } = response.data;
      
      // Save token to local storage for future requests
      localStorage.setItem("token", token);

      // Validate token and navigate to the admin dashboard
      const adminResponse = await axios.get(
        "http://localhost:5000/api/auth/admin-dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (adminResponse.status === 200) {
        navigate("/download");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Invalid login credentials"
      );
    }
  };


  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left Section */}
        <div className="col-lg-6 col-md-12 bg-light d-flex flex-column justify-content-center align-items-center p-4">
          <div className="text-center">
            <div className="images">
              <img src={logo} alt="Diet Census" className="logo mb-3" />
              <div>
                <img src={logo1} alt="doctor" className="logo1" />
                <div>
                  <img src={logo2} alt="img" className="logo2" />
                </div>
                <img src={logo3} alt="img1" className="logo3" />
              </div>
            </div>
            <h3 className="fw-bold">Effortless Diet Tracking and Reporting.</h3>
            <p className="text-muted">
              Alternatively, you can use: “Simplify Your Ward’s Diet Census
              Management.”
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-lg-6 col-md-12 d-flex justify-content-center align-items-center bg-white p-4">
          <div className="form-container w-100" style={{ maxWidth: "400px" }}>
            <h3 className="mb-5 fw-bold" style={{ marginTop: "-15rem" }}>
              Login
            </h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="loginId" className="form-label">
                  Login ID
                </label>
                <input
                  type="text"
                  id="loginId"
                  placeholder="Enter your Mobile Number"
                  className="form-control"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="position-relative">
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your Password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                </div>
              </div>
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
              <button type="submit" className="btn btn-success w-100">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
