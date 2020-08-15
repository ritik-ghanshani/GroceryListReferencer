import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/
class App extends Component {

    constructor() {
        super();
        this.state = {
            hey: "hello"
        };
    }

    componentDidMount() {
        const rootRef = firebase.database().ref();
        const heyRef = rootRef.child('hey');
        heyRef.on('value', snap => {
            this.setState( {
                hey: snap.val()
            });
        });
    }

    render() {
        return (
            <div className="App">
                <h1>{this.state.hey}</h1>
            </div>
        );
    }
}
export default App;
