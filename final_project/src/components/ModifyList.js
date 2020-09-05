import React, { Component } from 'react';
import { NavBar } from './NavBar';
import axios from 'axios';

export class ModifyList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            currentGroceryList: {},
            userInputList: [],
            error: '',
        };

        this.getData = this.getData.bind(this);
        this.mergeData = this.mergeData.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.delete= this.delete.bind(this);
        this.getData();
    }

    
    getData() {
        axios
            .get('/getGroceryItems')
            .then((response) => {
                this.setState({ data: response.data }, () => console.log("Synced All Items"));
            })
            .catch((err) => {
                this.setState({ error: err.response });
            });
        axios
            .get(`/retrieveGroceryList?user=${this.props.email}&&groceryList=${ this.props.location.state.listName}`)
            .then((response) => {
                this.setState({ currentGroceryList: response.data }, this.mergeData);
            })
            .catch((err) => {
                //this.setState({error : })
                this.setState({ error: err.response });
            });
    }


    delete(){
        axios.delete(`/deleteList?user=${this.props.email}&&groceryList=${this.props.location.state.listName}`).then(()=>{
            this.props.history.push('/home');
        }).catch((error) =>{
            console.log('delete error', error);
        })};

    mergeData(){
        let arr = Object.keys(this.state.data);
        let arr2 = [];
        for (let i = 0; i < arr.length; i++) {
            if(this.state.currentGroceryList[arr[i]]){
                 arr2.push({
                index: i,
                product: arr[i],
                quantity: this.state.currentGroceryList[arr[i]],
            });
        }}
        this.setState({ userInputList: arr2 }, () => console.log(this.state.userInputList) );
    }

    handleName(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleChange(index, element, event) {
        let userInputs = [...this.state.userInputList];
        const quantity = parseInt(event.target.value);
        const exists = userInputs.findIndex((x) => x.index === index);
        if (exists.length > 1) {
            console.log('bad code');
        }
        if (exists !== -1 && quantity !== 0) {
            userInputs[exists].quantity = quantity;
        } else if (exists !== -1 && quantity === 0) {
            userInputs.splice(exists, 1);
        } else if (exists === -1 && quantity !== 0) {
            userInputs.push({ index, product: element, quantity });
        }
        this.setState({ userInputList: userInputs });
    }

    handleSubmit(event) {
        let body = {};
        this.state.userInputList.forEach((x) => {
            body[x.product] = x.quantity;
        });
        axios
            .put(
                `/updateList?user=${this.props.email}&&groceryList=${this.props.location.state.listName}`,
                body
            )
            .then(() => {
                this.props.history.push('/home');
            })
            .catch((err) => {
                console.log(err.response);
                this.setState({ error: err.response.data.error });
            });
        event.preventDefault();
    }

    render() {
        const nameArray = Object.keys(this.state.data);
        return (
            <div>
                <NavBar {...this.props} />
                <h1 className="header">Modify List</h1>
                <div className="box">
                    <form onSubmit={this.handleSubmit}>
                        <span className="grid-header">
                            <div className="grid-item">
                                <label style={{ marginRight: '10px' }}>
                                    List Name:
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={this.props.location.state.listName}
                                    onChange={this.handleName}
                                    required
                                    autoFocus
                                />

                                
                            </div>
                        </span>
                        {nameArray.map((x, index) => (
                            <div key={index} className="grid-container">
                                <div className="grid-item">{x}</div>
                                <div className="grid-item">
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        min="0"
                                        defaultValue={ 
                                            this.state.userInputList.find(
                                                (element) =>
                                                    element.index === index
                                            ) || 0
                                        }
                                        onChange={(event) =>
                                            this.handleChange(index, x, event)
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                        <button type="submit">Update List</button>
                    </form><button onClick={this.delete}>X</button>
                    <p className="p-error">{this.state.error}</p>
                </div>
            </div>
        );
    }
}
