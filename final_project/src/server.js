

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
// all will return json objects
// Normal JSON Object =  json object client sends server is { product : quantity} ({key:value})
// node modules crypto to create unique ids
//
// app.post("/newUser?user=xxx"
// return status
//
// app.get("/getUserLists?user=xxx", function(req,res) {
// return status
// return names of already existing grocery lists
//
// app.get("/retrieveGroceryList?user=xxx&groceryList=yyy", 
// return specific grocery list based on name and user
// returns Normal JSON Object
//
//
// app.post("/createGroceryList?user=xxx&groceryList=yyy", 
// body of fetch send Normal JSON Object
// send status for server res
//
// app.get("/checkAvail?user=xxx&groceryList=yyy"
// return json object {product: true/false} based on availability
//
//
// app.delete("/deleteList?user=xxx&groceryList=yyy"
// send status back
//
// app.put("/updateList?user=xxx&groceryList=yyy")
// fetch body Normal JSON Object
// send status back 
//
// use date stamp to keep track of grocery list

var ref =  firebase.database().ref();
ref.once("value").then( function(snapshot) {
    let name = snapshot.child("hey").val();
    console.log(name);
});



app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});




