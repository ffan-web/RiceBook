import React from 'react'
import { connect } from 'react-redux'
import { sendnewpost } from '../../../actions'
import Button from "@mui/material/Button"



class AddArticle extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            postcotent: "",
            message: ""
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState({postcotent: event.target.value});
    }

    handleClick() {
        fetch("https://ricebookfan.herokuapp.com/article", {
            method: 'post',
            mode: 'cors',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: this.state.postcotent})
        }).then(res => {
            if (res.statusText === "Bad Request") {
                this.setState({message: "Content cannot be empty!"});
                return;
            }
            this.setState({message: "Update success!"})
        });
    }


    render() {
        return (
            <div>
                <h4>You could post below</h4>
                <div>
                    <input placeholder={"Post some articles, " + localStorage.getItem("username") + "?"} 
                            value = {this.state.postcotent}
                            onChange = {this.handleInputChange}/>
                </div>
                <div>
                    <div>
                        <Button type="button" onClick={this.handleClick}>Post</Button>
                    </div>
                    <div>
                    <button type="button" onClick={() => this.setState({postcotent: ""})}>Clear</button>
                    </div>
                    <div>
                        <span>{this.state.message}</span>
                    </div>
                </div>
            </div>
            
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        sendnewpost: (postcont) => dispatch(sendnewpost(postcont))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddArticle);