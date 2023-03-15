import React from 'react'
import { connect } from 'react-redux'
import { fetchUsers, setExpired, setUserAuthentication } from "./actions";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import MainPage from '././Components/Main/mainpage'
import Profile from '././Components/Profile/profile'
import Login from '././Components/Landpage/login'
import Signin from '././Components/Landpage/signin'
import Auth from '././Components/Landpage/auth'

class App extends React.Component {
  componentDidMount() {
    fetch("https://ricebookfan.herokuapp.com/headline", {
        method: 'get',
        mode: 'cors',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'}
    }).then(async (res) => {
        if (res.statusText === "Unauthorized" || res.statusText === "Bad Request") {
             this.props.setUserAuthentication(false);
        } else {
            this.props.setUserAuthentication(true);
        }
    });
    
  }

  render() {
    return (
      <Router>
        <div>
        <Switch>
                <Route exact path="/" render={
                    () => {
                      console.count(this.props.userloginstatus);
                        return (
                            this.props.userloginstatus ? <Redirect to="/main"/> : <Redirect to="/auth"/>
                        );
                    }
                }/>
                <Route exact path="/auth">
                    <Auth />
                </Route>
                <Route exact path="/main">
                    <MainPage />
                </Route>
                <Route exact path="/profile">
                    <Profile />
                </Route>
        </Switch>
        </div>
      </Router>
    )
  }

}

const mapStateToProps = (state) => {
  return {
      userloginstatus: state.userloginstatus,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
      fetchUsers: (users) => dispatch(fetchUsers(users)),
      setUserAuthentication: (userloginstatus) => dispatch(setUserAuthentication(userloginstatus))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);




//<Route exact path="/login">
//<Login/>
//</Route>
//<Route exact path="/register">
//<Signin/>
//</Route>