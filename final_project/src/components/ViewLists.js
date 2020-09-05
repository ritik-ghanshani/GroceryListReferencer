import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';
import { Link } from 'react-router-dom';

export class ViewLists extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: '',
            lists: {},
            listName: '',
        };

        this.fetchLists = this.fetchLists.bind(this);
        this.sendName = this.sendName.bind(this);
        this.fetchLists(this.props.email);
    }

    fetchLists = (user) => {
        axios
            .get(`/getUserLists?user=${user}`)
            .then((response) => {
                this.setState({ lists: response.data });
            })
            .catch((error) => {
                this.setState({ errors: error.response.data });
            });
    };

    sendName = (name) => {
        if(name === "No lists yet."){
            return;
        }
        this.props.history.push("/modify", {listName : name});
    }

    render() {
        let nameArray = [];
        if(Object.getPrototypeOf( this.state.lists ) === Object.prototype){
            nameArray = Object.keys(this.state.lists);
        }else{
            nameArray = ["No lists yet."];
        }
        return (
            <div id="parentGrid">
                <div id="parentLists">
                    <div id="listsTable">
                        {nameArray.map((name) => (
                            <div className = "listRow" onClick={() => this.sendName(name)} >{name}</div>
                        ))}
                    </div>
                </div>

                <div id="parentButton">
                    <div id="addButton">
                    <Link to="/addlist">ADD</Link></div>
                </div>
            </div>
        );
    }
}
