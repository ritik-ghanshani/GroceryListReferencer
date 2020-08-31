const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const express = require('express');
const app = express();
//const cors = require('cors');
//const functions = require('firebase-functions');

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
// authentication? extra, possible at the end
// Normal JSON Object =  json object client sends server is { product : quantity} ({key:value})
// node modules crypto to create unique ids
// ROUTE: /newUser?user=xxx

app.post("/userSubmit", function(req,res) {
    const email = req.body.user.email;
    const password = req.body.user.password;
    if (!email || !password) {
        console.log("no email or password provided");
        res.status(400);
        res.json({ "error" : "No email or password provided" });
        return;
    }
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function() {
        let emailParsed = email.split(".")[0];
        let userRef = firebase.database().ref('users/' + emailParsed);
        userRef.transaction( function(currentData) {
            if (currentData == null) {
                    return  "placeHolderGroceryList";
            }
            else  {
                console.log("Email Account already exists in database!")
                return;
            }
            }, function(error,committed,snapshot) {
                if (error) {
                    res.status(500);
                    res.json({"error" : "Unknown Internal Server Error"});
                }
                /*
                else if ( !committed ) {
                    res.status(501)
                    res.json({"error" : "Email already taken"});
                }
                */
                else {
                    console.log(emailParsed + " was added!");
                    res.send();
                }
            })
            console.log(emailParsed);
            res.json( { "data" : { "logged_in" : true } } );

    }).catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        res.send( errorMessage );
        console.log(errorCode);
        console.log(errorMessage)
    });
});

//
// app.get("/getUserLists?user=xxx", function(req,res) {
// return status
// return names of already existing grocery lists
//
// app.get("/retrieveGroceryList?user=xxx&groceryList=yyy", 
// return specific grocery list based on name and user
// returns Normal JSON Object

app.get("/retrieveGroceryList", function(req,res) {
    let username = req.query.user;
    let groceryListName = req.query.groceryList;
    let listOfParams = [username,groceryListName];
    let listOfParamsString = ["User Name","Grocery List Name"];
    for (let i=0; i<listOfParams.length; i++) {
        if (!checkParameter(listOfParams[i], listOfParamsString[i], res))
            return;
    }
    var userRef = firebase.database().ref("users");
    userRef.once("value", function(snapshot) { //checks user exists

        if (snapshot.child(username).exists()) {
            let groceryListSnapshot = snapshot.child(username).child(groceryListName);

            if (groceryListSnapshot.exists()) {
                res.json(groceryListSnapshot.val());
            } 
            else {
                res.status(501);
                res.json({"error" : "Grocery List, " + groceryListName + ", does not exist"})
            }
        }
        else {
            res.status(501);
            res.json({"error" : "User, " + username + ", does not exist"})
        }
    })
})

//
//
//
//
// ROUTE: "/createGroceryList?user=xxx&groceryList=yyy"
// body of fetch send Normal JSON Object
// send status for server res

app.post("/createGroceryList", function(req,res) {
    let username = req.query.user;
    let groceryListName = req.query.groceryList;
    let groceryListContents = req.body;
    let listOfParams = [username,groceryListName, groceryListContents];
    let listOfParamsString = ["User Name","Grocery List Name", "Grocery List Contents" ];
    for (let i=0; i<listOfParams.length; i++) {
        if (!checkParameter(listOfParams[i], listOfParamsString[i], res))
            return;
    }

    var userRef = firebase.database().ref("users");
    userRef.once("value", function(snapshot) { //checks user exists
        if (snapshot.child(username).exists()) {
            let groceryListNameRef = userRef.child(username).child(groceryListName);

            groceryListNameRef.transaction( function(currentData) {  
                if (currentData == null) {
                    return groceryListContents
                }
                else { //make sure that new grocery list isn't overwriting old grocery list
                    console.log("grocery list, " + groceryListName + " already exists");
                    return;
                }
            }, function(error,committed,snapshot) {
                if (error) {
                res.status(500);
                res.json({"error" : "Unknown Internal Server Error"});
                }
                else if ( !committed ) {
                res.status(501)
                res.json({"error" : "grocery list '" + groceryListName + "' already exists"});
                }
                else {
                    console.log(groceryListName + " was added!");
                    res.send();
                }
            })
        }
        else {
            res.status(501);
            res.json({"error" : "User does not exist"});
        }
    });
})

function checkParameter(param, paramString, res) {
    if( !param || Object.keys(param).length === 0 ) {
        console.log("No " + paramString + " provided");
        res.status(400);
        res.json({ "error": "No " + paramString + " provided" });
        return false
    } 
    else
        return true;
}
//
// app.get("/checkAvail?user=xxx&groceryList=yyy"
// return json object {product:[ true/false, numAvailableInGroceryStore]} based on availability
// maybe how much is in store?
//
//
//
// app.delete("/deleteList?user=xxx&groceryList=yyy"
// send status back
// PROBLEM: IF A USER HAS 1 GROCERY LIST, THE USER WILL BE DELETED AS WELL
app.delete("/deleteList", function (req,res) {
    let username = req.query.user;
    let groceryListName = req.query.groceryList;
    let listOfParams = [username,groceryListName];
    console.log(username , groceryListName);
    let listOfParamsString = ["User Name","Grocery List Name"];
    for (let i=0; i<listOfParams.length; i++) {
        if (!checkParameter(listOfParams[i], listOfParamsString[i], res))
            return;
    }
    var userRef = firebase.database().ref("users");
    userRef.once("value", function(snapshot) { //checks user exists

        if (!snapshot.child(username).exists()) {
            res.status(501);
            res.json({"error" : "User, " + username + ", does not exist"})
            return;
        }

        let groceryListSnapshot = snapshot.child(username).child(groceryListName);

        if (!groceryListSnapshot.exists()) {
            res.status(501);
            res.json({"error" : "Grocery List, " + groceryListName + ", does not exist"});
            return;
        }

        let userNameRef = userRef.child(username);
        let listRef = userNameRef.child(groceryListName);
        listRef.remove()
            .then( function() {
                console.log("Sucessfully removed");
                userNameRef.once('value').then(function(snapshot) {
                    if (!snapshot.val())   //this feels really hacky, maybe Fee can come up with a better way
                         userNameRef.set("PlaceHolderList");
                     
                })
                res.send();
            })
            .catch( function(error) {
                console.log("Remove failed: " + error.message);
                res.json(error.message);
            })
      
            
        
    })
});

//
// app.put("/updateList?user=xxx&groceryList=yyy")
// fetch body Normal JSON Object
// send status back 
//
// use date stamp to keep track of grocery list

/*
var ref =  firebase.database().ref();
ref.once("value").then( function(snapshot) {
    let name = snapshot.child("hey").val();
    console.log(name);
});
*/

/*
app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
*/

exports.app = functions.https.onRequest(app);

