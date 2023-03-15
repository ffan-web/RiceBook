import React from "react";
import Registration from "./signin";
import {connect} from "react-redux";
import SignIn from "./login";
import Button from "@mui/material/Button";
import { Redirect, withRouter} from "react-router-dom";
import "./auth.css";

class Auth extends React.Component {
    render() {
        return (
            <div>
                    <div class="box">
                        <SignIn />
                    </div> 
                    <div style={{height: "40px"}}></div>
                    <div class="box">
                        <Registration/>
                    </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userloginstatus: state.userloginstatus
    };
}

const mapDispatchToProps = (dispatch) => {
    return {};
}


export default connect(mapStateToProps, mapDispatchToProps)(Auth);
