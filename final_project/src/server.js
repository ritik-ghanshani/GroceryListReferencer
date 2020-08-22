

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

app.post("/newUser", function(req,res) {
    let username = req.query.user;
    if (!username) {
        console.log("no username provided");
        res.status(400);
        res.json({ "error" : "No username provided" });
        return;
    }
    var userRef = firebase.database().ref('users/' + username);
    userRef.transaction( function(currentData) {
       if (currentData == null) {
            return  "placeHolderGroceryList";
       }
       else  {
           console.log("User already exists!")
           return;
       }
    }, function(error,committed,snapshot) {
        if (error) {
           res.status(500);
           res.json({"error" : "Unknown Internal Server Error"});
        }
        else if ( !committed ) {
           res.status(501)
           res.json({"error" : "Username already taken"});
        }
        else {
            console.log(username + " was added!");
            res.send();
        }
    })
    console.log(username)
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
                userNameRef = userRef.child(username);
                listRef = userNameRef.child(groceryListName);
                listRef.remove()
                    .then( function() {
                        console.log("Sucessfully removed");
                        res.send();
                    })
                    .catch( function(error) {
                        console.log("Remove failed: " + error.message);
                        res.json(error.message);
                    })
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


app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});

//exports.widgets = functions.https.onRequest(app);


