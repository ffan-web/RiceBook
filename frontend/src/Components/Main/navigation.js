import React from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter} from "react-router-dom";
import { getpostsbykeyword, setUserAuthentication } from '../../actions';
import "./navigation.css";


class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.handlelogout = this.handlelogout.bind(this);
    }

    handlelogout() {
        fetch("https://ricebookfan.herokuapp.com/logout", {
            method: "put",
            mode: 'cors',
            credentials: "include",
            headers: {'Content-Type': 'application/json'}
        }).then(async (res) => {
            console.count("check logout button " + res.statusText);
            if (res.statusText === "OK") {
                await this.props.setUserAuthentication(false);
                console.count("check loginstatus " + this.props.userloginstatus);
                this.props.history.push("/auth");
            }
            else {
                await this.props.setUserAuthentication(false);
                console.count("check loginstatus " + this.props.userloginstatus);
                this.props.history.push("/auth");
            }
        })
    }

    render() {
        return (
            <div>
                <div id ="Header">
                    <h2>RiceBook</h2>
                </div>
                <div class="navbar">
                    <div class="avatar">
                        <img class="image" src = {this.props.avatar} alt="missing" width="128" height="128"></img>
                    </div>
                    <div class="prolog">
                        <ul>
                            <button class="navbutton" onClick={() => this.props.history.push("/profile")}>Profile</button>
                            <button class="navbutton" onClick={this.handlelogout}>Logout</button>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        userloginstatus: state.userloginstatus
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getpostsbykeyword: (keyword) => dispatch(getpostsbykeyword(keyword)),
        setUserAuthentication: (input) => dispatch(setUserAuthentication(input))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation));