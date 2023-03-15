import React from 'react'
import { connect } from 'react-redux'
import { removefollow, setFollowedUsers, setFeed } from '../../../actions';

const mapStateToProps = (state) => {
    return {
		
	};
}

const mapDispatchToProps = (dispatch) => {
    return {
        removefollow: (followname) => dispatch(removefollow(followname)),
		setFollowedUsers: (input) => dispatch(setFollowedUsers(input)),
        setFeed: (input) => dispatch(setFeed(input))
    }
}

class Follow extends React.Component {
    componentDidMount() {
        fetch(`https://ricebookfan.herokuapp.com/headline/${this.props.username}`, {
            method: 'get',
            mode: 'cors',
            credentials: "include"
        }).then(res => res.json()).then(res => {
            this.setState({headline: res.headline});
        });
        fetch(`https://ricebookfan.herokuapp.com/avatar/${this.props.username}`, {
            method: 'get',
            mode: 'cors',
            credentials: "include"
        }).then(res => res.json()).then(res => {
            this.setState({avatar: res.avatar});
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            headline: "",
            avatar: ""
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        fetch(`https://ricebookfan.herokuapp.com/following/${this.props.username}`, {
            method: 'delete',
            mode: 'cors',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        }).then(res => res.json()).then(res => {
            this.props.setFollowedUsers(res.following);
            fetch("https://ricebookfan.herokuapp.com/feed", {
                method: 'get',
                mode: 'cors',
                credentials: 'include',
            }).then(res => res.json()).then(res => {
                this.props.setFeed(res.articles);
            });
        });
    }

    render() {
        return (
			<div>
				<li >
					<div >
						<a >{this.props.username}</a>
					</div>
				</li>
				<div>
					<a >{this.state.headline}</a>
				</div>
                <div>
                    <img src={this.state.avatar} alt="missing" width="128" height="128"></img>
                </div>
				<div>
					<button onClick={this.handleClick}>Unfollow</button>
				</div>
        	</div>
        );
    }
}

let FollowReact = connect(mapStateToProps, mapDispatchToProps)(Follow);

function Follower(props) {
	return (
		<div>
			<div>
				<snap>There is your follows below: </snap>
			</div>
			<ul>
				{
					props.follows.map((username, i) => {
						return <FollowReact key = {i} username = {username} />
					})
				}
			</ul>
		</div>
	)
}

export default Follower;