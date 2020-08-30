import React, {useState} from 'react';
import './App.css';
import { NavBar } from './components/NavBar';
import {Login} from './components/Login';
//import {BrowserRouter, Route, Switch} from 'react-router-dom';

function App() {
    const [isLoggedIn, setLogIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    return (
        //<div><NavBar /></div>
        <div><Login name={userName} pass={password}/></div>
        

    );
}

export default App;
