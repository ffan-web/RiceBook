const mongoose = require('mongoose');
const connecturl = "mongodb+srv://ricebook:ricebook@comp531.0zr68ak.mongodb.net/?retryWrites=true&w=majority";
const connector = mongoose.connect(connecturl);
const profileSchema = require("./model/profileSchema");
const Profile = mongoose.model('profile', profileSchema);
const uploadImage = require('./uploadCloudinary');

function getProfile(req, res) {
    connector.then(() => {
        Profile.findOne({username: req.username}).exec().then(profile => {
            res.send({
                username: profile.username,
                headline: profile.headline,
                email: profile.email,
                zipcode: profile.zipcode,
                dob: profile.dob,
                avatar: profile.avatar
            });
        })
    })
}

function getHeadline(req, res) {
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
            res.send({ username: profile.username, headline: profile.headline});
        })
    });
}

function updateHeadline(req, res) {
    if(! req.body.headline) {
        res.sendStatus(400);
        return;
    }
    (async () => {
        await connector;
        await Profile.updateOne({username: req.username}, {headline: req.body.headline});
        res.send({
            username: req.username,
            headline: req.body.headline
        });
    })();
}

function getEmail(req, res) {
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
            res.send({ username: profile.username, email: profile.email});
        })
    });
}

function updateEmail(req, res) {
    if(! req.body.email) {
        res.sendStatus(400);
        return;
    }
    (async () => {
        await connector;
        await Profile.updateOne({username: req.username}, {email: req.body.email});
        res.send({
            username: req.username,
            email: req.body.email
        });
    })();
}

function getBirthday(req, res) {
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
            res.send({ username: profile.username, dob: profile.dob});
        })
    });
}

function getZipcode(req, res) {
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
            res.send({ username: profile.username, zipcode: profile.zipcode});
        })
    });
}

function updateZipcode(req, res) {
    if(! req.body.zipcode) {
        res.sendStatus(400);
        return;
    }
    (async () => {
        await connector;
        await Profile.updateOne({username: req.username}, {zipcode: req.body.zipcode});
        res.send({
            username: req.username,
            zipcode: req.body.zipcode
        });
    })();
}

function getAvatar(req, res) {
    connector.then(() => {
        let username = req.params.user ? req.params.user : req.username;
        Profile.findOne({username: username}).exec().then(profile => {
            if (!profile) {
                res.sendStatus(400);
            }
            else {
                res.send({username: profile.username, avatar: profile.avatar});
            }
        });
    })
}

function updateAvatar(req, res) {
    connector.then(() => {
        Profile.findOneAndUpdate({username: req.username}, {avatar: req.fileurl}, {returnDocument: 'after'}).exec().then(profile => {
            res.send({username: req.username, avatar: profile.avatar});
        });
    });
}

module.exports = (app) => {
    app.get('/profile', getProfile);
    app.get('/headline/:user?', getHeadline);
    app.put('/headline', updateHeadline);
    app.get('/email/:user?', getEmail);
    app.put('/email', updateEmail);
    app.get('/dob/:user?', getBirthday);
    app.get('/zipcode/:user?', getZipcode);
    app.put('/zipcode', updateZipcode);
    app.get("/avatar/:user?", getAvatar);
    app.put('/avatar', uploadImage('title'), updateAvatar);
} 