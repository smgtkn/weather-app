

import Weather from './Weather';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login.js';
import Admin from './Admin';

function App() {
  const [user, setUser] = useState({ auth:false, username:'',token:""})
  return (
  
  <>
       <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/login" element={< Login  setUser={setUser} />} />
          <Route path="/forecast" element={< Weather/>} />
          <Route path="/admin" element={<Admin user={user}/> }/>
       </Routes>
    </>

  );
}

export default App;
