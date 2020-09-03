import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { Home } from './components/Home';
import { Register } from './components/Register';
import NotFound from './components/NotFound';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';
import { About } from './components/About';
import { Contact } from './components/Contact';

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

const routes = (
    <Router>
        <div>
            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/home" component={Home} />
                <Route path="/register" component={Register} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                <Route component={NotFound} />
            </Switch>
        </div>
    </Router>
);

ReactDOM.render(routes, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
