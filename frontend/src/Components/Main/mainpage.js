import React from 'react'
import { connect } from 'react-redux'
import Navigation from './navigation'
import { fetchUsers, getpostsbyid, updateheadline, followfriend, setUserAuthentication, setFollowedUsers, setFeed, sendnewpost, setAvatar } from '../../actions'
import Follower from './follow/follower'
import Share from './share/share'
import ArticleView from './addarticle/articleView'
import { Redirect, withRouter } from "react-router-dom"
import "./mainpage.css";

const mapStateToProps = (state) => {
    return {
        follows: state.follows,
        headline: state.headline,
        followremindmsg: state.followremindmsg,
        posts: state.posts,
        userloginstatus: state.userloginstatus,
        avatar: state.avatar,
        username: state.username
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsers: (users) => dispatch(fetchUsers(users)),
        getpostsbyid: (posts, id) => dispatch(getpostsbyid(posts, id)),
        updateheadline: (newinput) => dispatch(updateheadline(newinput)),
        followfriend: (followname) => dispatch(followfriend(followname)),
        setUserAuthentication: (userloginstatus) => dispatch(setUserAuthentication(userloginstatus)),
        setFollowedUsers: (input) => dispatch(setFollowedUsers(input)),
        setFeed: (posts) => dispatch(setFeed(posts)),
        sendnewpost: (postcont) => dispatch(sendnewpost(postcont)),
        setAvatar: (inputurl) =>  dispatch(setAvatar(inputurl))
    }
}

class AddArea extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            postcotent: "",
            message: "",
            file: ""
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    handleInputChange(event) {
        this.setState({postcotent: event.target.value});
    }

    handleImageChange(event) {
        this.setState({file: event.target.files[0]});
    }

    handleClick() {
        const fd = new FormData();
        fd.append("image", this.state.file);
        fd.append("text", this.state.postcotent);
        fetch("https://ricebookfan.herokuapp.com/article", {
            method: 'post',
            mode: 'cors',
            credentials: 'include',
            body: fd
        }).then(res => {
            if (res.statusText === "Bad Request") {
                this.setState({message: "Content cannot be empty!"});
                return;
            }
            fetch("https://ricebookfan.herokuapp.com/feed", {
                method: 'get',
                mode: 'cors',
                credentials: 'include',
            }).then(res => res.json()).then(res => {
                this.props.setFeed(res.articles);
            });
            this.setState({message: "Update success!"})
        });
    }


    render() {
        return (
            <div>
                <h4>You could post below</h4>
                <div>
                    <input placeholder={"You can post here."} 
                            value = {this.state.postcotent}
                            onChange = {this.handleInputChange}/>
                </div>
                <div>
                    <div>
                        <button type="button" onClick={this.handleClick}>Post</button>
                    </div>
                    <div>
                    <button type="button" onClick={() => this.setState({postcotent: ""})}>Clear</button>
                    <input type="file" accept={"image/*"} name={"image"} onChange={e => this.handleImageChange(e)}/><br/>
                    </div>
                    <div>
                        <span>{this.state.message}</span>
                    </div>
                </div>
            </div>
            
        )
    }
}


let AddAreaReact = connect(mapStateToProps, mapDispatchToProps)(AddArea);

class FollowArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            message: ""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleInputChange(event) {
        this.setState({username: event.target.value});
    }

    handleClick() {
        this.props.followfriend(this.state.username);
        fetch(`https://ricebookfan.herokuapp.com/following/${this.state.username}`, {
            method: 'put',
            mode: 'cors',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res.statusText === "Bad Request") {
                this.setState({message: "Username entered is either yourself or has been followed or doesn't exist!"});
                return;
            }
            return res.json();
        }).then(res => {
            if (res) {
                this.props.setFollowedUsers(res.following);
                this.setState({message: ""});
                fetch("https://ricebookfan.herokuapp.com/feed", {
                    method: 'get',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'}
                }).then(res => res.json()).then(res => {
                    this.props.setFeed(res.articles);
                });
            }
        });
    }

    render() {
        return (
            <div>
            <h4>
                Follow a new friend
            </h4>
            <input
            label="Username"
            onChange={this.handleInputChange}
            />
            <button onClick={this.handleClick}>Follow</button>
            <div>
                <span>{this.state.message}</span>
            </div>
            </div>
        );
    }
}

let FollowAreaReact = connect(mapStateToProps, mapDispatchToProps)(FollowArea);

class MainPage extends React.Component {
    componentDidMount() {
        fetch("https://ricebookfan.herokuapp.com/headline", {
            method: 'get',
            mode: 'cors',
            credentials: "include",
            headers: {'Content-Type': 'application/json'}
        }).then(async (res) => {
            if (res.statusText === "Unauthorized") {
                console.count("check login status " + this.props.userloginstatus);
                await this.props.setUserAuthentication(false);
                console.count("check login status " + this.props.userloginstatus);
                this.props.history.push('/auth');
                return;
            }
            return res.json();
        }).then((res) => {
            if (res) {
                this.props.setUserAuthentication(true);
                fetch("https://ricebookfan.herokuapp.com/following", {
                    method: 'get',
                    mode: 'cors',
                    credentials: 'include',
                }).then(res => res.json()).then(res => {
                    this.props.setFollowedUsers(res.following);
                });
                fetch("https://ricebookfan.herokuapp.com/avatar", {
                    method: 'get',
                    mode: 'cors',
                    credentials: 'include',
                }).then(res => res.json()).then(res => {
                    this.props.setAvatar(res.avatar);
                });
            }
        });
    }

    constructor(props) {
        super(props);
    }

    render() {
        console.count("check loginstatus in login page " + this.props.userloginstatus);
        if (! this.props.userloginstatus) {
            return <Redirect to = {"/auth"}/>
        }
        return (
            <div class='mainbackground'>
                <Navigation avatar = {this.props.avatar} username = {this.props.username} />
                <div class="godown">
                <Follower follows = {this.props.follows}/>
                <Share headline = {this.props.headline} updateheadline={(newinput) => this.props.updateheadline(newinput)}/>
                <FollowAreaReact />
                <AddAreaReact />
                <ArticleView />
                </div>
            </div>    
        )
    }


}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainPage));