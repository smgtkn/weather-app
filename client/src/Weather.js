import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
const api = axios.create({
    
    baseURL:process.env.REACT_APP_API_URL
  });
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);
const Weather = () => {
  const [city, setCity] = useState("ankara");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyForecastData, setHourlyForecastData] = useState(null);
  const [cities, setCities] = useState([]);
  const fetchCurrentWeather = () => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`
      )
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const fetchHourlyWeather = () => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`
      )
      .then((response) => {
        setHourlyForecastData(response.data);
        console.log(response.data.list.slice(0, 8));
        console.log(response.data.list.filter((v, i) => i % 8 === 0));
      })
      .catch((error) => {
        console.error(error);
        console.error("hourly");
      });
  };

  const fetchCities = () => {
    api
      .get(`/cities`)
      .then((response) => {
        const cities = response.data.map((data) => data.name);
        setCities([...cities]);
      })
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(() => {
    delete axios.defaults.headers.common["Authorization"];
    fetchCurrentWeather();
    fetchHourlyWeather();
    fetchCities();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setWeatherData(null);
    if (city) {
      console.log(city, process.env.REACT_APP_OPENWEATHERMAP_API_KEY);
      fetchCurrentWeather();
      fetchHourlyWeather();
    }
  };
  if (!weatherData || !hourlyForecastData) {
    return <div>Loading...</div>;
  }

  let fiveDaysForecast = hourlyForecastData.list.filter((v, i) => i % 8 === 0);
  const forecastHourlyTemps = hourlyForecastData.list
    .slice(0, 8)
    .map((data) => (data.main.temp - 273.15).toFixed(2));
  const forecastTemps = fiveDaysForecast.map((data) => data.main.temp - 273.15);
  const forecastIcons = fiveDaysForecast.map((data) => data.weather[0].icon);
 
  let weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const forecastLabels = hourlyForecastData.list
    .slice(0, 8)
    .map((data) => data.dt_txt.split(" ")[1].substr(0, 5));

  const forecastTempsCards = forecastTemps.map((data, index) => (
    <Col md="2" key={index} className="mx-0">
      <Card style={{ alignItems: "center" }}>
        <Card.Body>
          <Card.Title style={{ display: "block", margin: "0 auto" }}>
            {weekday[(new Date().getDay() + index) % 7]}
          </Card.Title>
          <Card.Subtitle className=" text-muted">
            {data.toFixed(2)} °C
          </Card.Subtitle>
          <img
            style={{ display: "block", margin: "0 auto" }}
            src={`http://openweathermap.org/img/w/${forecastIcons[index]}.png`
            }
            alt="loading..."
          />
        </Card.Body>
      </Card>
    </Col>
  ));

  const data = {
    labels: forecastLabels,
    datasets: [
      {
        label: "Temperature",
        data: forecastHourlyTemps,
        fill: false,
        backgroundColor: "#007bff",
        borderColor: "#007bff",
      },
    ],
  };
  const options = {
    plugins: {
      legend: true,
    },
  };
  const CurrentWeatherTable = (
    <div style={{ alignItems: "center" }}>
      <h2>
        {weatherData.name} {(weatherData.main.temp - 273.15).toFixed(2)} °C
      </h2>
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td>Feels Like</td>
            <td>{(weatherData.main.feels_like - 273.15).toFixed(2)} °C</td>
          </tr>
          <tr>
            <td>Humidity</td>
            <td>{weatherData.main.humidity}%</td>
          </tr>
          <tr>
            <td>Description</td>
            <td>{weatherData.weather[0].description}</td>
          </tr>
          <tr>
            <td>Wind</td>
            <td>{weatherData.wind.speed} m/s</td>
          </tr>
          <tr>
            <td>Pressure</td>
            <td>{weatherData.main.pressure} hpa</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );

  const cityOptions = cities.map((data, index) => (
    <option key={index} value={data}>{data}</option>
  ));
  return (
    <div className="d-flex flex-column">
  <div className="bg-dark flex-shrink-0">
    <nav className="nav flex-column">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white">Weather APP</h3>
      </div>
      <a className="nav-link text-light" href="/login">
        Login Page
      </a>
      <a className="nav-link text-light" href="https://openweathermap.org/">
        OpenWeather API
      </a>
    </nav>
  </div>
  <div className="flex-grow-1">
    <Container  style={{ justifyContent: "center"}} >
      <Row className="mt-3">
        <Col>
          <h1 className="text-center mb-4">Weather Forecast</h1>
        </Col>
      </Row>
      <Row  style={{ justifyContent: "center"}}>
        <Col>
          <Form.Group controlId="city">
            <Form.Label>Select City</Form.Label>
            <Form.Control
              as="select"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            >
              <option value={city}>{city}</option>
              {cityOptions}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleSubmit} block>
            Get Forecast
          </Button>
        </Col>
      
      </Row>
      <Row>
        <Col>{CurrentWeatherTable}</Col>
      </Row>
      <Row >
        <Col>
          <Line data={data} options={options}></Line>
        </Col>
      </Row>
      <Row className="justify-content-center">
        {forecastTempsCards}
      </Row>
      <Row className="mt-5">
        <Col>
          <iframe
            title="OpenWeatherMap"
            width="100%"
            height="300px"
           
            src={`https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=0&lon=0&zoom=2`}
          ></iframe>
        </Col>
      </Row>

    </Container>
  </div>
</div>

  );
};

export default Weather;
