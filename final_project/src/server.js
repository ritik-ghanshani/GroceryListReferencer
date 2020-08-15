

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

// app.get("/newUser", function(req,res) {
// app.get("/retrieveGroceryList", 
// app.post("/createGroceryList", 
// app.get("/checkAvail"

var ref =  firebase.database().ref();
ref.once("value").then( function(snapshot) {
    let name = snapshot.child("hey").val();
    console.log(name);
});



app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});




