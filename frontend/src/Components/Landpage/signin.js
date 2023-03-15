import React from 'react'
import { connect } from 'react-redux'
import { register } from '../../actions'
import { withRouter} from "react-router-dom";
import "./auth.css";


class Signin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            accountName: "",
            displayName: "",
            email: "",
            phone: "",
            birthday: "",
            zipcode: "",
            password: "",
            pswConfirm: "",
            timestamp: Date.now(),
            passwordmessage: "",
			agemessage: "",
			successmessage: "",
            pswMatch: true,
            underage: true
        }
		this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInputChange(event) {
		let value = event.target.value;
        let name = event.target.name;
		this.setState({[name]: value});
		let error = "";
		if(name === "birthday") {
			let millisec = Date.now() - Date.parse(this.state.birthday);
			if (Math.floor(millisec / 31556952000) < 18) {
				error = "The user age is lower than 18"
				this.setState({agemessage: error, underage: false});
			}
			else {
				this.setState({agemessage: "age is good", underage: true});
			}
		}
		if(name === "passwordconfirm") {
			let password = document.getElementById("psw").value;
			let passwordconfirm = document.getElementById("pswConfirm").value;
			if (password !== passwordconfirm) {
				error = "The password do not match";
				this.setState({passwordmessage: error, pswMatch: false});
			}
			else {
				this.setState({passwordmessage: "password match", pswMatch: true});
			}
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		if(! this.state.pswMatch || ! this.state.underage) {
			return;
		}
		let msg;
        let userInfo = {
            username: this.state.accountName,
            email: this.state.email,
            dob: this.state.birthday,
            zipcode: this.state.zipcode,
            password: this.state.password
        };
		fetch("https://ricebookfan.herokuapp.com/register", {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
			mode: 'cors',
            body: JSON.stringify(userInfo)
            }).then((res) => res.json()).then((res) => {
                msg = res.result;
                this.setState({successmessage: msg});
            });
	}

	render() {
		return(
					<div>
							<form  onSubmit={this.handleSubmit} >
							<h4>Register</h4>
							<input placeholder="Username" type = "text"
                            name="accountName"
                            onChange={this.handleInputChange}  
                            required />
                        	<input placeholder="Display Name (optional)" type = "text"
                            onChange={this.handleInputChange}  
                            name="displayName"/>
                        	<input placeholder="Email" type = "email"
                            onChange={this.handleInputChange}  
                            name="email"
                            required />
                       	 	<input placeholder="Phone Number 123-123-1234" type = "tel"
                            pattern="^\d{3}-\d{3}-\d{4}$"
                            onChange={this.handleInputChange}  
                            name="phone"
                            required />
                        	<input placeholder="Birthday" type = "date"
                            onChange={this.handleInputChange}  
                            name="birthday"
                            required />
                        	<input placeholder="Zipcode" type = "text"
                            pattern = "\d{5}"
                            onChange={this.handleInputChange}  
                            name="zipcode"
                            required />
                        	<input placeholder="Password" type = "password" id = "psw"
                            onChange={this.handleInputChange}  
                            name="password"
                            required />
                        	<input placeholder="Password Comfirmation" type = "password" id = "pswConfirm"
                            onChange={this.handleInputChange}  
                            name="passwordconfirm"
                            required />
                        	<input type="submit" value = "Sign Up" id="btn2"/>
						</form>

					
				
			<div>
			<span id="signinalert">
				{this.state.passwordmessage}
			</span>
			</div>
			<div>
			<span id="signinalert">
				{this.state.agemessage}
			</span>
			</div>
			<div>
			<span id="signinalert">
				{this.state.successmessage}
			</span>
			</div>
		</div>
		)
	}

}

const mapStateToProps = (state) => {
	return {
		usernames: state.usernames
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		register: (username, email, phone, zipcode, password, id) => dispatch(register(username, email, phone, zipcode, password, id))
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signin))