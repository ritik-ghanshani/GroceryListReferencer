import React from 'react';
import './App.css';
import { NavBar } from './components/NavBar';
import { Login } from './components/Login';
//import {BrowserRouter, Route, Switch} from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <NavBar />
            <Login />
        </div>
    );
}

export default App;
