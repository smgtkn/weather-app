const sqlite3 = require('sqlite3').verbose();
const express = require('express');

const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10 //required by bcrypt
const port = 5000;
const privateKey="myKey"
const app = express();
const cors = require('cors');
app.use(express.json());

app.use(cors());
 
//db
const db = new sqlite3.Database('users.db');
// Parse form data in request body
app.use(bodyParser.urlencoded({ extended: false }));

function verifyToken (req,res, next){
    req.user = {username:null, verified:false}
    console.log(req.headers.authorization)
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader!=='undefined') {
      const bearerToken = bearerHeader.split(' ')[1]
      jwt.verify(bearerToken, privateKey, function (err,data){
        if(! (err && typeof data=== 'undefined')) {
          req.user = {username:data.username, verified:true}
          next()}
      })
    }
    else{
    res.status(400).json({ message: 'Unauthorized' });
    }
   }



// Authenticate user on login form submission
app.post('/login', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  // Find the user with the given username and password
  db.get('SELECT id FROM users WHERE username = ? AND password = ?', [username, password],async (err, row) => {
    if (err || !row) {
      // Authentication failed
      res.status(401).json({message:'Invalid username or password'});
    } else {
      // Authentication succeeded
      token =  jwt.sign({ username:username }, privateKey,{ expiresIn: '1h'})
     
    
        
      console.log("loginnn",req.session)
      if(token){
        console.log(token)
      res.status(201).json({token:token, username:username, success: true });
      }
      else{
      res.status(401).json({message:'Invalid username or password'});
      }
    }
  });


});


// Log out user and destroy session

app.get('/logout', (req, res) => {
 
  const bearerHeader = req.headers['authorization']
  if(typeof bearerHeader!=='undefined'){
    const bearerToken = bearerHeader.split(' ')[1]
    //add bearerToken to blacklist
  }
  res.set('Authorization', '');
  res.status(200).json({ success: true });
});

//add city
app.post('/cities', verifyToken, (req, res) => {
    
    const city = req.body.city;
  
    if (!city) {
      return res.status(400).json({ message: 'City name is required.' });
    }
  
    const sqlSelect = `SELECT name FROM cities WHERE LOWER(name) = LOWER(?)`;
    db.get(sqlSelect, [city], (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'An error occurred while checking if the city was already added.' });
      }
    
      if (row) {
        console.log(`${city} already exists in the cities database.`);
        return res.status(400).json({ message: 'City already exists.' });
      }
    
      // insert the city into the database
      const sqlInsert = `INSERT INTO cities(name) VALUES(?)`;
      db.run(sqlInsert, [city], (err) => {
        if (err) {
          
          return res.status(500).json({ message: 'An error occurred while adding the city.' });
        }
        console.log(`Added ${city} to the cities database.`);
        return res.status(201).json({ message: 'City added successfully.' });
      });
    });
  });

//get cities
app.get('/cities', (req, res) => {
    
    db.all('SELECT * FROM cities', (err, rows) => {
      if (err) {
        
        res.status(500).json({message:'Internal Server Error'});
      } else {
        res.status(201).json(rows);
      }
    });
  });

// delete city by name
app.delete('/cities/:name', verifyToken, (req, res) => {
    const name = req.params.name;
  
    if (!name) {
      return res.status(400).json({ message: 'City name is required.' });
    }
  
    const sqlDelete = `DELETE FROM cities WHERE LOWER(name) = LOWER(?)`;
  
    db.run(sqlDelete, [name], (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'An error occurred while deleting the city.' });
      }
  
      console.log(`Deleted ${name} from the cities database.`);
      return res.status(200).json({ message: 'City deleted successfully.' });
    });
  });
// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});