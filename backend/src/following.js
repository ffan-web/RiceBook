const mongoose = require('mongoose');
const connecturl = "mongodb+srv://ricebook:ricebook@comp531.0zr68ak.mongodb.net/?retryWrites=true&w=majority";
const connector = mongoose.connect(connecturl);
const profileSchema = require("./model/profileSchema");
const Profile = mongoose.model('profile', profileSchema);
const userSchema = require("./model/userSchema");
const User = mongoose.model('user', userSchema);

function getFollowed(req, res) {
    let username;
    if(! req.params.user) {
        username = req.username;
    }
    else {
        username = req.params.user;
    }
    console.count("username is " + username);
    connector.then(() => {
        Profile.findOne({username: username}, function (err, profile) {
            if (err) {
                return res.send(err);
            }
            if (!profile) {
                return res.sendStatus(400);
            }
            res.send({ username: profile.username, following: profile.followedUsers});
        })
    });
}

function followNew(req, res) {
    connector.then(async () => {
        let findprofile;
        let username;
        if(! req.username) {
            res.sendStatus(400);
            return;
        }
        username = req.usernmae;
        await Profile.findOne({username: req.username}).exec().then((profile) => {
            if (!profile) {
                res.sendStatus(400);
                return;
            }
            findprofile = profile;
        });
        User.findOne({username: req.params.user}, function (err, user) {
            if(err) {
                res.send(err);
            }
            if(! user) {
                res.sendStatus(400);
                return;
            }
            if(user.username === req.username) {
                res.sendStatus(400);
                return;
            }
            if(findprofile.followedUsers.find(name => name === user.username)) {
                res.sendStatus(400);
                return;
            }
            findprofile.followedUsers.push(user.username);
            findprofile.save().then(() => {
                res.send({username: req.username, following: findprofile.followedUsers})
            })
        });
    });
}

function removeFollower(req, res) {
    connector.then(async () => {
        let findprofile;
        let username;
        if(! req.username) {
            res.sendStatus(400);
            return;
        }
        username = req.usernmae;
        await Profile.findOne({username: req.username}).exec().then((profile) => {
            if (!profile) {
                res.sendStatus(400);
                return;
            }
            findprofile = profile;
        });
        User.findOne({username: req.params.user}, function (err, user) {
            if(err) {
                res.send(err);
            }
            if(! user) {
                res.sendStatus(400);
                return;
            }
            if(user.username === req.username) {
                res.sendStatus(400);
                return;
            }
            let index = findprofile.followedUsers.indexOf(req.params.user);
            if(index === -1) {
                res.sendStatus(400);
                return;
            }
            findprofile.followedUsers.splice(index, 1);
            findprofile.save().then(() => {
                res.send({username: req.username, following: findprofile.followedUsers})
            })
        });
    });
}

module.exports = (app) => {
    app.get('/following/:user?', getFollowed);
    app.put('/following/:user', followNew);
    app.delete('/following/:user', removeFollower);
}