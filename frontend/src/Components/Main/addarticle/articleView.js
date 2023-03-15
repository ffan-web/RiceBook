import React from 'react'
import { connect } from 'react-redux'
import follower from '../follow/follower'
import Button from "@mui/material/Button";
import {Alert, TextField} from "@mui/material"
import { setFeed } from '../../../actions'
import BasicModal from './comments';


class Article extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            message: ""
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        this.setState({content: event.target.value});
    }

    handleSubmit() {
        fetch(`https://ricebookfan.herokuapp.com/articles/${this.props.pid}`, {
            method: 'put',
            mode: 'cors',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: this.state.content})
        }).then(res => {
            if (res.statusText === "Bad Request") {
                this.setState({message: "Updated post cannot be empty!"});
                return;
            }
            if (res.statusText === "Forbidden") {
                this.setState({message: "You cannot modify others' posts!"});
                return;
            }
            fetch("https://ricebookfan.herokuapp.com/feed", {
                method: 'get',
                mode: 'cors',
                credentials: 'include',
            }).then(res => res.json()).then(res => {
                this.props.setFeed(res.articles);
                this.setState({message: ""});
            });
        });
    }

    render() {
        return (
            <tr>
                <tr>Author: {this.props.author}</tr>
                <tr>
                    <p>Text : {this.props.text}</p>
                    {this.props.image &&
                    <img src={this.props.image} alt={"Missing"}/>
                    }
                    <br/>
                    Time Posted: {this.props.date} <br/>
                    <TextField
                        onChange={this.handleInputChange}
                    />
                    <Button onClick={this.handleSubmit}>Edit</Button><br/>
                    <span>
                        {this.state.message}
                    </span>
                    <BasicModal comments={this.props.comments} pid={this.props.pid} setFeed={(input) => this.props.setFeed(input)}/><br/>
                    -------------------------------------------------------------
                </tr>
            </tr>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        requireedposts: state.requireedposts,
        posts: state.posts
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setFeed: (input) => dispatch(setFeed(input))
    }
}

let PostWithConnect = connect(mapStateToProps, mapDispatchToProps)(Article);

class ArticleView extends React.Component {
    componentDidMount() {
        fetch("https://ricebookfan.herokuapp.com/feed", {
            method: 'get',
            mode: 'cors',
            credentials: "include"
        }).then(res => res.json()).then(async (res) => {
            await this.props.setFeed(res.articles);
            console.count("this is articles length" + res.articles.length);
            console.count("this is props length" + this.props.posts.length);
        })
    }
    

    render() {
        return (
            <div>
                {this.props.requireedposts.map((post, i) => <PostWithConnect key={i} text={post.text} author={post.author}
                                                                     date={post.date} comments={post.comments} image={post.image} pid={post.pid} setFeed={(input) => this.props.setFeed(input)} />)}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleView);
