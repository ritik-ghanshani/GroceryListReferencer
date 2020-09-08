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

const appAuth = express();

const firebase = require('firebase');
const firebaseEnvFile = require('./.env.json');
appAuth.use(express.json());
appAuth.use(cors({ origin: true }));

const config = {
    apiKey: firebaseEnvFile['API_KEY'],
    authDomain: firebaseEnvFile['AUTH_DOMAIN'],
    databaseURL: firebaseEnvFile['DATABASE_URL'],
    projectId: firebaseEnvFile['PROJECT_ID'],
    storageBucket: firebaseEnvFile['STORAGE_BUCKET'],
    messagingSenderId: firebaseEnvFile['MESSAGING_SENDER_ID'],
    appId: firebaseEnvFile['APP_ID'],
    measurementId: firebaseEnvFile['MEASUREMENT_ID'],
};

firebase.initializeApp(config);

appAuth.post('/register', (req, res) => {
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
                    if (!currentData) {
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
            return res.json({ status: 'created' });
        })
        .then(() => {
            let currentUser = firebase.auth().currentUser;
            firebase
                .auth()
                .signOut()
                .then(() => {
                    console.log(currentUser.email, 'has been signed out');
                    return;
                })
                .catch((error) => {
                    return;
                });
            return;
        })
        .catch((error) => {
            return res.status(501).send(error.message);
        });
});

appAuth.post('/userSubmit', (req, res) => {
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
            return res.json({ logged_in: true, email });
        })
        .catch((error) => {
            return res.status(401).send(error.message);
        });
});

appAuth.post('/passwordReset', (req, res) => {
    const email = req.body.user.email;
    firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
            res.json({ reset: true });
            return;
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

appAuth.get('/logged_in', (req, res) => {
    let email = req.query.email;
    let currentUser = firebase.auth().currentUser;
    if (currentUser) {
        email = currentUser.email;
        email = email.split('.')[0];
        console.log('current user is:', email);
        res.json({ logged_in: true, email });
    } else {
        console.log('no user is logged in');
        res.json({ logged_in: false, email });
    }
});

appAuth.delete('/logout', (req, res) => {
    let currentUser = firebase.auth().currentUser;
    if (currentUser) {
        firebase
            .auth()
            .signOut()
            .then(() => {
                console.log(currentUser.email, 'has been signed out');
                res.send();
                return;
            })
            .catch((error) => {
                return;
            });
    } else {
        console.log('no user needs to be logged out');
        res.status(400).send();
    }
});
exports.auth = functions.https.onRequest(appAuth);
