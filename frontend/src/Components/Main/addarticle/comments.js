import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Alert, TextField} from "@mui/material";

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newComment: "",
            message: ""
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        this.setState({newComment: event.target.value});
    }

    handleSubmit() {
        fetch(`https://ricebookfan.herokuapp.com/articles/${this.props.pid}`, {
            method: 'put',
            mode: 'cors',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: this.state.newComment, commentId: this.props.idx})
        }).then(res => {
            if (res.statusText === "Forbidden" || res.statusText === "Bad Request") {
                this.setState({message: "Not allowed to make comment"});
                return;
            }
            fetch("https://ricebookfan.herokuapp.com/feed", {
                method: 'get',
                mode: 'cors',
                credentials: 'include',
            }).then(res => res.json()).then(res => {
                this.props.setFeed(res.articles);
            });
        })
    }

    render() {
        return (
            <React.Fragment>
                <li>
                    {this.props.comment.text}      created by {this.props.comment.author} <br/>
                    <TextField
                        label="Comment"
                        id="outlined-size-small"
                        size="small"
                        onChange={this.handleInputChange}
                    />
                    <Button variant="outlined" onClick={this.handleSubmit}>Update</Button>
                    {this.state.message &&
                    <Alert variant="outlined" severity="error">
                        {this.state.message}
                    </Alert>
                    }
                </li>
            </React.Fragment>
        );
    }
}


class BasicModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            comment: "",
            message: ""
        }
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        this.setState({comment: event.target.value});
    }

    handleSubmit() {
        fetch(`https://ricebookfan.herokuapp.com/articles/${this.props.pid}`, {
            method: 'put',
            mode: 'cors',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: this.state.comment, commentId: -1})
        }).then(res => {
            fetch("https://ricebookfan.herokuapp.com/feed", {
                method: 'get',
                mode: 'cors',
                credentials: 'include',
            }).then(res => res.json()).then(res => {
                this.props.setFeed(res.articles);
            });
        })
    }

    handleOpen() {
        this.setState({open: true});
    }
    handleClose() {
        this.setState({open: false});
    }

    render() {
        return (
            <React.Fragment>
                <Button onClick={this.handleOpen}>View Comments</Button>
                <Modal
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',width: 400,bgcolor: 'background.paper',border: '2px solid #000',boxShadow: 24,p: 4}}>
                        <Typography>
                            All comments:
                        </Typography>
                        <ol>
                            {this.props.comments.map((comment, i) => <Comment key={i} idx={i + 1} comment={comment} pid={this.props.pid} setFeed={(input) => this.props.setFeed(input)}/>)}
                        </ol>
                        <TextField
                            onChange={this.handleInputChange}
                        />
                        <Button onClick={this.handleSubmit}>Comment here</Button><br/>
                    </Box>


                </Modal>
            </React.Fragment>
        );
    }
}

export default BasicModal;