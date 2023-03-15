import React from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter} from "react-router-dom";

class Share extends React.Component {
    componentDidMount() {
        fetch("https://ricebookfan.herokuapp.com/headline", {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        }).then(res => res.json()).then((res) => {
            console.count("check headline : " + res.headline);
            this.setState({headline: res.headline});
        });
    }
    constructor(props) {
        super(props)
        this.state = {
            headline: "",
            inputheadline: "",
            updateMsg: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({inputheadline: event.target.value});
    }

    handleSubmit() {
        if (this.state.inputheadline) {
            fetch("https://ricebookfan.herokuapp.com/headline", {
                method: 'put',
                mode: 'cors',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({headline: this.state.inputheadline})
            }).then(res => res.json()).then(res => {
                this.props.updateheadline(res.headline);
                this.setState({headline: res.headline, updateMsg: ""});
            });
        }
    }

    render() {
        return (
            <div>
                <div>
                    <input placeholder="Plz share your feeling today" onChange={this.handleChange}/>
                </div>

                <div>
                    <div>
                        <div>
                            <span>Photo</span>
                        </div>
                        <div>
                            <span>Feeling</span>
                        </div>
                    </div>
                    <button onClick={this.handleSubmit}>Post</button>
                </div>
                <div>
                    <span>
                        Feelings : {this.state.headline}
                    </span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        headline: state.headline
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Share));