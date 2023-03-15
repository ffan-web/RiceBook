import React from 'react';
import { connect } from 'react-redux';
import { navtomainpage, userlogin, setUserAuthentication} from '../../actions';
import {withRouter} from "react-router-dom";
import "./profile.css";

const mapStateToProps = (state) => {
    return {
        isUserAuthenticated: state.isUserAuthenticated,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUserAuthentication: input => dispatch(setUserAuthentication(input)),
    };
}


function AlertArea(props) {
    return (
        <div>
            {props.message.split("\n").map((line, i) => <p key={i}>{line}</p>)}
        </div>
    );
}

class profileUpdate extends React.Component {
	componentDidMount() {
        fetch("https://ricebookfan.herokuapp.com/profile", {
            method: 'get',
            mode: 'cors',
            credentials: "include"
        }).then(async (res) => {
            if (res.statusText === "Unauthorized") {
                await this.props.setUserAuthentication(false);
                this.props.history.push('/auth');
                return;
            }
            return res.json();
        }).then((res) => {
            if (!res) {
                return;
            }
            this.props.setUserAuthentication(true);
            this.setState({
                oldAvatar: res.avatar,
                oldEmail: res.email,
                oldZipcode: res.zipcode,
                oldUsername: res.username,
                oldAvatar: res.avatar,
                username: res.username
            });
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            zipcode: "",
            password: "",
            pswConfirm: "",
            message: "",
            oldUsername: "",
            oldAvatar: "",
            oldEmail: "",
            oldZipcode: "",
            file: "",
            username: ""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.uploadAvatar = this.uploadAvatar.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    handleImageChange(event) {
        this.setState({file: event.target.files[0]});
    }


    uploadAvatar() {
        const fd = new FormData();
        fd.append("title", this.state.username);
        fd.append("image", this.state.file);
        fetch("https://ricebookfan.herokuapp.com/avatar", {
            method: 'put',
            mode: 'cors',
            credentials: 'include',
            body: fd
        }).then(res => res.json()).then(res => {
            this.setState({oldAvatar: res.avatar});
        });
    }

	handleInputChange(event) {
        let value = event.target.value;
        let name = event.target.name;
        this.setState({[name]: value});
    }

	encryptPsw(input) {
        let encrypted_pwd = "";
        for (let i = 0; i < input.length; ++i) {
            encrypted_pwd += "*";
        }
        return encrypted_pwd;
    }

	async handleSubmit(event) {
        let message = "";
        if (this.state.email) {
            if (this.state.oldEmail === this.state.email) {
                message += "> Your entry for email address is the same as the old value! \n";
            }
			else {
                let old = this.state.oldEmail;
                await fetch("https://ricebookfan.herokuapp.com/email", {
                    method: "put",
                    mode: 'cors',
                    credentials: "include",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({email: this.state.email})
                }).then(res => res.json()).then(res => {
                    this.setState({oldEmail: res.email});
					message += "> Email address updated successfully from " + old + " to " + this.state.email + "! \n";
                })
            }
        }
        if (this.state.zipcode) {
            if (this.state.oldZipcode === this.state.zipcode) {
                message += "> Your entry for zipcode is the same as the old value! \n";
            }
			else {
                let old = this.state.oldZipcode;
                await fetch("https://ricebookfan.herokuapp.com/zipcode", {
                    method: "put",
                    mode: 'cors',
                    credentials: "include",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({zipcode: this.state.zipcode})
                }).then(res => res.json()).then(res => {
                    this.setState({oldZipcode: res.zipcode});
                    message += "> Zipcode updated successfully from " + old + " to " + this.state.zipcode + "! \n";
                })
            }
        }
        if (this.state.password || this.state.pswConfirm) {
            if (this.state.password !== this.state.pswConfirm) {
                message += "> Two entries for password update should be the same! \n";
            }
            else {
                await fetch("https://ricebookfan.herokuapp.com/password", {
                    method: "put",
                    mode: 'cors',
                    credentials: "include",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({password: this.state.password})
                }).then(res => res.json()).then(res => {
                    if (!res) {
                        return;
                    }
                    if (res.result === "update password success") {
                        message += message += "> Password updated successfully to " + this.encryptPsw(this.state.password) + "! \n";
                    } else {
                        message += "> Your entry for password is the same as the old value! \n";
                    }
                })
            }
        }
		this.setState({
			message: message ? message : "> Nothing to update! \n",
			email: "",
			zipcode: "",
			password: "",
			pswConfirm: "",
            username: ""
		});
	}

		render() {
			return (
				<div class = "profile">
					<h2>
						Update your profile
					</h2>

                    <div class = "user-profile">
                    <div class="user-avatar"><img src={this.state.oldAvatar} alt="missing" width="128" height="128"></img></div>
                    <input type="file" accept={"image/*"} name={"image"} onChange={e => this.handleImageChange(e)}/><br/>
                    <button onClick={this.uploadAvatar}>UPDATE AVATAR</button><br/>
                    </div>

                    <div class = "user-profile">
                        <div class = "userName"> 
                            <span>Account Name: </span><span id={"username"}>{localStorage.getItem("username")}</span>
                        </div><br/>
                        
                        <div class = "DOB"> 
                            <span>DoB: </span><span>01-01-2000</span> 
                        </div><br/>

                        <div class = "Email"> 
                            <span>Email Address: </span><span>{this.state.oldEmail}</span> 
                        </div><br/>
                    </div>
					
	
					<span>New email address:</span>
					<input value={this.state.email} onChange={this.handleInputChange} name="email" type="email"
						   placeholder="Make it blank if you do not intend to make a change"/><br/>
	
	
					<span>Zipcode: </span><span>{this.state.oldZipcode}</span><br/>
	
					<span>New zipcode:</span>
					<input value={this.state.zipcode} onChange={this.handleInputChange} name="zipcode" type="text"
						   placeholder="Make it blank if you do not intend to make a change"/><br/>
	
					<span>Password: </span><span>********</span><br/>
	
					<span>New password:</span>
					<input value={this.state.password} onChange={this.handleInputChange} name="password" type="password"
						   placeholder="Make it blank if you do not intend to make a change"/><br/>
	
					<span>Enter again:</span>
					<input value={this.state.pswConfirm} onChange={this.handleInputChange} name="pswConfirm" type="password"
						   placeholder="Make it blank if you do not intend to make a change"/><br/>
	
					<button variant={"outlined"} onClick={this.handleSubmit}>UPDATE ALL</button>
					<AlertArea message={this.state.message}/>
				</div>
			);
		}
	}

	let UpdateWithConnect = withRouter(connect(mapStateToProps, mapDispatchToProps)(profileUpdate));


	class Profile extends React.Component {
		render() {
			return (
				<div>
					<UpdateWithConnect/>
				</div>
			);
		}
	}
	
	export default Profile;