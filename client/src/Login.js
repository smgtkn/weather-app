import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
const api = axios.create({
 
  baseURL: process.env.REACT_APP_API_URL,
});

const backgrounds = [
  "https://mdbgo.io/ascensus/mdb-advanced/img/snow.gif",
  "https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif",
  "https://mdbgo.io/ascensus/mdb-advanced/img/thunderstorm.gif",
  "https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif",
];

function Login({ setUser }) {
  const navigate = useNavigate();
  const [backgroundUrl, setBackgroundUrl] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    setBackgroundUrl(backgrounds[randomIndex]);
  }, []);

  const handleLogin = () => {
    console.log(`${process.env.REACT_APP_API_URL}/login`);
    api
      .post(`/login`, {
        username: username,
        password: password,
      })
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          console.log(response);
          axios.defaults.headers.common["Authorization"] =
            "Bearer" + response.data.token;
          setUser({ auth: true, username: response.data.username ,token: response.data.token});
          navigate("/admin");
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.message);
      });
  };

  return (
    <MDBContainer
      fluid
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol col="12">
          <MDBCard
            className="bg-dark text-white my-5 mx-auto"
            style={{ borderRadius: "1rem", maxWidth: "400px" }}
          >
            <MDBCardBody className="p-5 pt-md-4 d-flex flex-column align-items-center mx-auto w-100">
              <h2 className="fw-bold mb-2 text-uppercase">Weather App</h2>
              <MDBBtn
                outline
                className="mx-auto ml-auto d-flex align-items-center"
                color="white"
                size="lg"
                onClick={() => navigate("/forecast")}
              >
                Visit Website <MDBIcon icon="arrow-right" className="ms-2" />
              </MDBBtn>

              <div
                className="d-flex flex-column justify-content-center align-items-center mt-auto mb-5 p-4"
                style={{ borderColor: "white", borderRadius: "1rem" }}
              >
                <p className="text-white-50 fw-bold mb-2 text-uppercase">
                  Admin Login
                </p>
                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="Username"
                  id="formControlLg"
                  type="username"
                  size="lg"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="Password"
                  id="formControlLg"
                  type="password"
                  size="lg"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <MDBBtn
                  outline
                  className="mx-2 px-5"
                  color="white"
                  size="lg"
                  onClick={handleLogin}
                >
                  Login
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
