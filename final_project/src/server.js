

const express = require('express');
const app = express();

const firebase = require('firebase');
const port = 3000;
const hostname = "localhost";
app.use(express.json());


const config = {
    apiKey: "AIzaSyD1KuT744S0uB27hGWm35J638_-O5fYW08",
    authDomain: "fir-9fcf5.firebaseapp.com",
    databaseURL: "https://fir-9fcf5.firebaseio.com/",
    projectId: "fir-9fcf5",
    storageBucket: "fir-9fcf5.appspot.com",
    messagingSenderId: "935434602441",
    appId: "1:935434602441:web:a57456a42b9237ee600a18",
    measurementId: "G-G0QD9N03RC"

};

firebase.initializeApp(config);
//all will return json objects
//app.post("/newUser"
// node modules crypto to create unique ids
// app.get("/getUser", function(req,res) {
// query string
// return names of already existing grocuery lists
// app.get("/retrieveGroceryList", 
// query string
// return specific grocery list based on name
// app.post("/createGroceryList", 
// body of fetch
// app.get("/checkAvail"
// query string
// app.delete("/deleteList
// query string
// app.put?(updateList)
// fetch body 
// use date stamp to keep track of grocery list

var ref =  firebase.database().ref();
ref.once("value").then( function(snapshot) {
    let name = snapshot.child("hey").val();
    console.log(name);
});



app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});




