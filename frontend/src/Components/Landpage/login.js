import React from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter} from "react-router-dom";
import { userlogin } from '../../actions'
import "./auth.css";



class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "", 
            password: "", 
            message: ""
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        let value = event.target.value;
        let name = event.target.name;
        this.setState({[name]: value});
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch("https://ricebookfan.herokuapp.com/login", {
            method: 'post',
            mode: 'cors',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: this.state.username, password: this.state.password})
        }).then(res => res.json()).then(res => {
            this.setState({message: res.result});
            if (res.result === "success") {
                this.props.userlogin(this.state.username);
            }
        })
    }

    render() {
        console.count("check loginstatus in login page " + this.props.userloginstatus);
        if (this.props.userloginstatus) {
            return <Redirect to = {"/main"}/>
        }
        return (
            <div>
            <form onSubmit = {this.handleSubmit}>
                <h4>Log In</h4>
                <input 
                placeholder="Username" 
                type = "text" 
                name = "username" 
                value = {this.state.username} 
                onChange={this.handleInputChange} 
                required/>

                <input 
                placeholder="Password" 
                type = "password" 
                name = "password" 
                value = {this.state.password} 
                onChange={this.handleInputChange} 
                required/>
                <input 
                type = "submit" 
                value = "Log In" class="btn"/>
            </form>
            <button id = "btn3" onClick={() => window.location.href = 
                            "https://ricebookfan.herokuapp.com/auth/google"}>
                            Google Log In
                        </button> 
                <span id="nouseralert">
                        {this.state.message}
                </span>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        emails: state.users.map(user => user.email),
        phones: state.users.map(user => user.phone),
        zipcodes: state.users.map(user => user.address.zipcode),
        ids: state.users.map(user => user.id),
        userloginstatus: state.userloginstatus
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        userlogin: (username, password) => dispatch(userlogin(username, password))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
