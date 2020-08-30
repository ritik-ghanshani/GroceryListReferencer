import React, { Component } from "react";
import axios from 'axios';

export class Login extends Component {
    constructor(props) {
        super(props);
    this.state = {
        email: "",
        password: "",
        loginErrors:""
    };
    this.validateSubmit = this.validateSubmit.bind(this);
    this.validateChange = this.validateChange.bind(this);
    }

    validateChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    validateSubmit(event){
        const {email, password} = this.state;
        axios.post(
            "/userSubmit", //this name is tentative
            {
                user: {
                    email: email,
                    password: password
                }
            }, {withCredentials: true}
        ).then(response => {
            if (response.data.logged_in) {
                this.props.validateSuccesAuth(response.data);
            }
        })
        .catch(error => {
            console.log(`login error ${error}`);
        });
        event.preventDefault();
    }
    
    

    render() {
            return (
                <div>
                <h1>Login Page</h1>           
                    <form>
                        <input type="text" 
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.validateChange}
                        required 
                        autoFocus
                        />
                        <br/>
                        <input type="password" 
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.validateChange}
                        required
                        />
                        <br/>
                        <button type="submit" >Login</button>
                    </form>
                </div>
            );
        }

}
