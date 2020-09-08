const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));
const auth = require('./auth');

const firebase = require('firebase');
const firebaseEnvFile = require('./.env.json');

app.use(express.json());

// all will return json objects
// authentication? extra, possible at the end
// Normal JSON Object =  json object client sends server is { product : quantity} ({key:value})
// node modules crypto to create unique ids
/// ROUTE: /newUser?user=xxx

//
// app.get("/getUserLists?user=xxx", function(req,res) {
// return stalet tus
// return names of already existing grocery lists

app.get('/getUserLists', function (req, res) {
    let username = req.query.user.split('.');

    if (!username) {
        res.status(400);
        res.json({ error: 'No username provided' });
        return;
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
                    if (!currentData) {
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

//
// app.get("/checkAvail?user=xxx&groceryList=yyy"
// return json object {product:[ true/false, numAvailableInGroceryStore]} based on availability
// maybe how much is in store?
//
app.get('/checkAvail', (req, res) => {
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
                    for (groceryItem in groceryListContents) {
                        if (!(groceryItem in groceryStoreContents))
                            availGroceryItems[groceryItem] = [false, -1];
                        else if (
                            groceryListContents[groceryItem] >
                            groceryStoreContents[groceryItem]
                        ) {
                            availGroceryItems[groceryItem] = [
                                false,
                                groceryStoreContents[groceryItem],
                            ];
                        } else {
                            availGroceryItems[groceryItem] = [
                                true,
                                groceryStoreContents[groceryItem],
                            ];
                        }
                    }
                    return res.json(availGroceryItems);
                });
            } else {
                return res.status(501).json({
                    error:
                        'Grocery List, ' + groceryListName + ', does not exist',
                });
            }
        } else {
            return res
                .status(501)
                .json({ error: 'User, ' + username + ', does not exist' });
        }
    });
});

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
                userNameRef
                    .once('value')
                    .then((snapshot) => {
                        if (!snapshot.val()) userNameRef.set('PlaceHolderList');
                        return;
                    })
                    .catch((error) => {
                        console.log(error);
                        return;
                    });
                res.send();
                return;
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

app.put('/updateList', (req, res) => {
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

            groceryListNameRef.update(groceryListContents, (error) => {
                if (error) {
                    res.status(500).json({
                        error: 'Unknown Internal Server Error',
                    });
                } else {
                    console.log(groceryListName + ' was updated!');
                    res.send();
                }
            });
        } else {
            res.status(501).json({ error: 'User does not exist' });
        }
    });
});

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

function checkParameter(param, paramString, res) {
    if (!param || Object.keys(param).length === 0) {
        console.log('No ' + paramString + ' provided');
        res.status(400).json({ error: `No ${paramString} provided` });
        return false;
    } else return true;
}

exports.server = functions.https.onRequest(app);
exports.auth = auth.auth;
