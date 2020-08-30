import React from "react";
import axios from 'axios';

export class LoginPage extends React.Component {
    constructor(props) {
        super(props);
    
    this.state = {
        username: "",
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
        const {username, password} = this.state;
        axios.post(
            "/userSubmit", //this name is tentative
            {
                user: {
                    username: username,
                    password: password
                }
            }, {withCredentials: true}
        ).then(response => {
            if (response.data.logged_in) {
                this.props.handleSuccesAuth(response.data);
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
                        name="username"
                        placeholder="Name"
                        value={this.state.username}
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
                        <button type="submit">Login</button>
                    </form>
                </div>
            );
        }

}
