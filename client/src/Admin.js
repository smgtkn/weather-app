import { useEffect, useState } from "react";

import { MDBIcon } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {BsFillTrashFill}  from "react-icons/bs" ; 
const api = axios.create({
   
     baseURL:process.env.REACT_APP_API_URL
   });
function Admin({user}) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [cities, setCities] = useState([]);

  useEffect(() => {
   
   
    fetchCities();
  }, []);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };


  const handleLogout = (navroute) => {
    api
      .get(`/logout`)
      .then((response) => {
        navigate(navroute);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.message);
      });
  };

  

  const handleAddCity = (event) => {
    event.preventDefault();
    const city = event.target.elements.city.value.trim();
    if (city !== "") {
      api
        .post(`/cities`, {
          city: city,
        },{  headers: { "Authorization": `Bearer ${user.token}` }})
        .then((response) => {
          console.log(response);
          fetchCities();
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    }
  };
 
  const handleDeleteCity = (index,city) => {
    api
      .delete(`/cities/${city}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        console.log(response);
        fetchCities();
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  const fetchCities = () => {
    api
      .get(`/cities`)
      .then((response) => {
        console.log(response)
        const cities = response.data.map((data) => data.name);
        setCities([...cities]);
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (<>
    {user.auth?
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Side panel */}
      <nav className="bg-dark p-3" style={{ minWidth: "250px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-white">Admin Panel</h3>
          <button className="btn btn-link text-white" onClick={toggleMenu}>
            <MDBIcon
              icon={showMenu ? "angle-double-left" : "angle-double-right"}
            />
          </button>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
          <button className="btn btn-link text-white" onClick={()=>{handleLogout("/forecast")}}>
              Website
            </button>
          </li>
          <li>
            <button className="btn btn-link text-white" onClick={()=>{handleLogout("/login")}}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <div className="flex-grow-1 p-3">
        <form onSubmit={handleAddCity}>
          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              Add City
            </label>
            <input type="text" className="form-control" id="city" name="city" />
          </div>
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
        <h3>Cities</h3>
        {cities.length > 0 && (
            <ul className="mt-3">
                {cities.map((city, index) => (
                  <li
                    key={index}
                    
                  > 
                    {city}
                    <BsFillTrashFill onClick={() => {
                      handleDeleteCity(index,city);
                    }}/>
                  </li>
                ))}
              </ul>
        )}
      </div>
    </div> : <h1>Invalid Authentication</h1>
    
}</>);
}

export default Admin;
