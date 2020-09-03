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

const firebase = require('firebase');
const port = 3000;
const hostname = 'localhost';
app.use(express.json());

const config = {
    apiKey: 'AIzaSyD1KuT744S0uB27hGWm35J638_-O5fYW08',
    authDomain: 'fir-9fcf5.firebaseapp.com',
    databaseURL: 'https://fir-9fcf5.firebaseio.com/',
    projectId: 'fir-9fcf5',
    storageBucket: 'fir-9fcf5.appspot.com',
    messagingSenderId: '935434602441',
    appId: '1:935434602441:web:a57456a42b9237ee600a18',
    measurementId: 'G-G0QD9N03RC',
};

firebase.initializeApp(config);
// all will return json objects
// authentication? extra, possible at the end
// Normal JSON Object =  json object client sends server is { product : quantity} ({key:value})
// node modules crypto to create unique ids
// ROUTE: /newUser?user=xxx

app.post('/register', (req, res) => {
    const email = req.body.user.email;
    const password = req.body.user.password;
    const passwordConfirmation = req.body.user['password_confirmation'];
    let alreadyExists = false;
    if (!email || !password) {
        return res.status(400).send('No Email or Password Provided');
    }
    if (password !== passwordConfirmation) {
        return res.status(400).send('Password Does Not Match');
    }
    if (email.split('.').length > 2) {
        return res.status(400).send('Email has more than one period');
    }
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            let emailParsed = email.split('.')[0];
            let userRef = firebase.database().ref('users/' + emailParsed);
            userRef.transaction(
                (currentData) => {
                    if (currentData == null) {
                        //return { "logged_in": false, "lists": "placeHolderGroceryList" };
                        return 'placeHolderGroceryList';
                    } else {
                        alreadyExists = true;
                    }
                },
                (error) => {
                    if (error) {
                        return res.status(500).send(error.message);
                    }
                }
            );

            console.log(emailParsed);
            if (alreadyExists) {
                return res
                    .status(401)
                    .send('Email Account already exists in database!');
            }
            res.json({ status: 'created' });
        })
        .then(() => {
            let currentUser = firebase.auth().currentUser;
            firebase
                .auth()
                .signOut()
                .then(() => {
                    console.log(currentUser.email, 'has been signed out');
                });
        })
        .catch((error) => {
            return res.status(501).send(error.message);
        });
});

app.post('/userSubmit', (req, res) => {
    const email = req.body.user.email;
    const password = req.body.user.password;
    if (!email || !password) {
        return res.status(400).send('No Email or Password Provided');
    }
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            let email = firebase.auth().currentUser;
            res.json({ logged_in: true, email });
        })
        .catch((error) => {
            res.status(401).send(error.message);
        });
});
 

app.post('/passwordReset', (req, res) => {
    const email = req.body.user.email;
    firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
            res.json({"reset": true});
        })
        .catch((error) => {
            res.status(401).send(error.message);
        });
    
});

firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
        console.log(firebaseUser.email, 'is user logged in ');
    } else {
        console.log('not logged in');
    }
});

app.get('/logged_in', (req, res) => {
    let email = req.query.email;
    email = email.split(".")[0];
    let currentUser = firebase.auth().currentUser;
    if (currentUser) {
        let email = currentUser.email;
        email = email.split(".")[0];
        console.log('current user is:', email);
        res.json({ logged_in: true, email });
    } else {
        console.log('no user is logged in');
        res.json({ logged_in: false, email});
    }
});

app.delete('/logout', (req, res) => {
    let currentUser = firebase.auth().currentUser;
    if (currentUser) {
        firebase
            .auth()
            .signOut()
            .then(() => {
                console.log(currentUser.email, 'has been signed out');
                res.send();
            });
    } else {
        console.log('no user needs to be logged out');
        res.status(400).send();
    }
});
//
// app.get("/getUserLists?user=xxx", function(req,res) {
    // return stalet tus
// return names of already existing grocery lists


app.get('/getUserLists', function (req, res) {
    let username = req.query.user.split(".");

    if(!username) {
        res.status(400);
        res.json({ error: 'No username provided' });
        return
    }
    let userRef = firebase.database().ref('users');
    userRef.once('value', (snapshot) => {
        //checks user exists
        if (snapshot.child(username).exists()) {
            let groceryListSnapshot = snapshot.child(username);
            res.json(groceryListSnapshot.val());
        } else {
            res.status(501).json({
                error: `User, ${username} does not exist`,
            });
        }
    });
});

// app.get("/retrieveGroceryList?user=xxx&groceryList=yyy",
// return specific grocery list based on name and user
// returns Normal JSON Object

app.get('/retrieveGroceryList', (req, res) => {
    let username = req.query.user;
    let groceryListName = req.query.groceryList;

    let listOfParams = [username, groceryListName];
    let listOfParamsString = ['User Name', 'Grocery List Name'];
    for (let i = 0; i < listOfParams.length; i++) {
        if (!checkParameter(listOfParams[i], listOfParamsString[i], res))
            return;
    }
    let userRef = firebase.database().ref('users');
    userRef.once('value', (snapshot) => {
        //checks user exists

        if (snapshot.child(username).exists()) {
            let groceryListSnapshot = snapshot
                .child(username)
                .child(groceryListName);

            if (groceryListSnapshot.exists()) {
                res.json(groceryListSnapshot.val());
            } else {
                res.status(501).json({
                    error: `Grocery List ${groceryListName}, does not exist`,
                });
            }
        } else {
            res.status(501).json({
                error: `User, ${username}, does not exist`,
            });
        }
    });
});

//
//
//
//
// ROUTE: "/createGroceryList?user=xxx&groceryList=yyy"
// body of fetch send Normal JSON Object
// send status for server res

app.post('/createGroceryList', (req, res) => {
    let username = req.query.user;
    let groceryListName = req.query.groceryList;
    let groceryListContents = req.body;
    let listOfParams = [username, groceryListName, groceryListContents];
    let listOfParamsString = [
        'User Name',
        'Grocery List Name',
        'Grocery List Contents',
    ];
    for (let i = 0; i < listOfParams.length; i++) {
        if (!checkParameter(listOfParams[i], listOfParamsString[i], res))
            return;
    }

    let userRef = firebase.database().ref('users');
    userRef.once('value', (snapshot) => {
        //checks user exists
        if (snapshot.child(username).exists()) {
            let groceryListNameRef = userRef
                .child(username)
                .child(groceryListName);

            groceryListNameRef.transaction(
                (currentData) => {
                    if (currentData == null) {
                        return groceryListContents;
                    } else {
                        //make sure that new grocery list isn't overwriting old grocery list
                        console.log(
                            `grocery list ${groceryListName} already exists`
                        );
                        return;
                    }
                },
                (error, committed) => {
                    if (error) {
                        res.status(500).json({
                            error: 'Unknown Internal Server Error',
                        });
                    } else if (!committed) {
                        res.status(501).json({
                            error: `grocery list ${groceryListName} already exists`,
                        });
                    } else {
                        console.log(groceryListName + ' was added!');
                        res.send();
                    }
                }
            );
        } else {
            res.status(501).json({ error: 'User does not exist' });
        }
    });
});

function checkParameter(param, paramString, res) {
    if (!param || Object.keys(param).length === 0) {
        console.log('No ' + paramString + ' provided');
        res.status(400).json({ error: `No ${paramString} provided` });
        return false;
    } else return true;
}
//
// app.get("/checkAvail?user=xxx&groceryList=yyy"
// return json object {product:[ true/false, numAvailableInGroceryStore]} based on availability
// maybe how much is in store?
//
app.get("/checkAvail", (req, res) =>{
    let username = req.query.user;
    let groceryListName = req.query.groceryList;

    let listOfParams = [username, groceryListName];
    let listOfParamsString = ['User Name', 'Grocery List Name'];
    for (let i = 0; i < listOfParams.length; i++) {
        if (!checkParameter(listOfParams[i], listOfParamsString[i], res))
            return;
    }
    let userRef = firebase.database().ref('users');
    let groceryStoreRef = firebase.database().ref('groceryStore');
    
    userRef.once('value', (snapshot) => {
        //checks user exists
        if (snapshot.child(username).exists()) {
            let groceryListSnapshot = snapshot
                .child(username)
                .child(groceryListName);
            if (groceryListSnapshot.exists()) {
                let groceryListContents = groceryListSnapshot.val();
                groceryStoreRef.once('value', (groceryStoreSnapshot) => {
                    let groceryStoreContents = groceryStoreSnapshot.val();
                    let availGroceryItems = {};
                    for (groceryItem in groceryListContents){
                        if (!(groceryItem in groceryStoreContents))
                            availGroceryItems[groceryItem] = [false, -1];
                        else if(groceryListContents[groceryItem] > groceryStoreContents[groceryItem]){
                            availGroceryItems[groceryItem] = [false, (groceryListContents[groceryItem] - groceryStoreContents[groceryItem])];
                        } else {
                            availGroceryItems[groceryItem] = [true, 0];
                        }
                    }
                return res.json(availGroceryItems);
                })
            } else {
                return res.status(501).json({
                    error: 'Grocery List, ' + groceryListName + ', does not exist',
                });
            }
        } else {
            return res.status(501).json({ error: 'User, ' + username + ', does not exist' });
        }
    });
});
//
// app.delete("/deleteList?user=xxx&groceryList=yyy"
// send status back
// PROBLEM: IF A USER HAS 1 GROCERY LIST, THE USER WILL BE DELETED AS WELL
app.delete('/deleteList', (req, res) => {
    let username = req.query.user;
    let groceryListName = req.query.groceryList;
    let listOfParams = [username, groceryListName];
    console.log(username, groceryListName);
    let listOfParamsString = ['User Name', 'Grocery List Name'];
    for (let i = 0; i < listOfParams.length; i++) {
        if (!checkParameter(listOfParams[i], listOfParamsString[i], res))
            return;
    }
    let userRef = firebase.database().ref('users');
    userRef.once('value', (snapshot) => {
        //checks user exists

        if (!snapshot.child(username).exists()) {
            res.status(501).json({ error: `User, ${username} does not exist` });
            return;
        }

        let groceryListSnapshot = snapshot
            .child(username)
            .child(groceryListName);

        if (!groceryListSnapshot.exists()) {
            return res.status(501).json({
                error: `Grocery List, ${groceryListName}, does not exist`,
            });
        }

        let userNameRef = userRef.child(username);
        let listRef = userNameRef.child(groceryListName);
        listRef
            .remove()
            .then(() => {
                console.log('Sucessfully removed');
                userNameRef.once('value').then((snapshot) => {
                    if (!snapshot.val())
                        //this feels really hacky, maybe Fee can come up with a better way
                        userNameRef.set('PlaceHolderList');
                });
                res.send();
            })
            .catch((error) => {
                console.log('Remove failed: ' + error.message);
                res.json(error.message);
            });
    });
});

//
// app.put("/updateList?user=xxx&groceryList=yyy")
// fetch body Normal JSON Object
// send status back
//
// use date stamp to keep track of grocery list


// app.get("/getGroceryItems")
// send back all items in grocery store
app.get('/getGroceryItems', function (req, res) {
    let groceryStoreRef = firebase.database().ref('groceryStore');
    groceryStoreRef.once('value', function (snapshot) {
        if (snapshot.exists()) {
            res.json(snapshot.val());
        } else {
            res.sendStatus(500);
        }
    });
});

/*
app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
*/

exports.app = functions.https.onRequest(app);
