const md5 = require('md5');
const cookieKey = 'sid';
const mongoose = require("mongoose");
const connecturl = "mongodb+srv://ricebook:ricebook@comp531.0zr68ak.mongodb.net/?retryWrites=true&w=majority";
const connector = mongoose.connect(connecturl);
//const redis = require('redis').createClient('redis://:pf8a4351d01b485be6e0546f1dfff5ec78f8b5c804fae0cc6bfa5bd77a68ebb93@ec2-54-158-245-54.compute-1.amazonaws.com:7479');
const userSchema = require("./model/userSchema");
const User = mongoose.model('user', userSchema);
const profileSchema = require("./model/profileSchema");
const Profile = mongoose.model('profile', profileSchema);


const redis = new Map();

const createSalt = () => {
	const salt = 'kxe1410%^&03'
	return md5(salt + new Date().getTime()) ;
}

function register(req, res) {
    if (!req.body.username || !req.body.email || !req.body.dob || !req.body.zipcode || !req.body.password) {
        console.count("this step ?????__________")
        res.sendStatus(400);
        return;
    }

    (async () => {
        console.count("this step __________")
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const zipcode = req.body.zipcode;

        connector.then(async() => {
            await User.findOne({username: username}).exec().then((user) => {
                if(user) {
                    res.send({result: 'username used', username: username});
                    return;
                }
                const salt = createSalt();
                const hash = md5(salt + password);
                const userobject = new User({
                    username: username,
                    salt: salt,
                    hash: hash
                });
                userobject.save().then(() => console.count('success save user'));
                const profileobject = new Profile({
                    username: req.body.username,
                    email: email,
                    zipcode: zipcode,
                    dob: req.body.dob,
                })
                profileobject.save().then(() => console.count('success save profile information'));
                res.send({result: 'success', username: username});
            })
        })
    })();
}

function isLoggedIn(req, res, next) {
    if (!req.cookies) {
        return res.sendStatus(401);
    }
    let sid = req.cookies[cookieKey];
    console.count("check the sid : " + sid);
    if (!sid) {
        return res.sendStatus(401);
    }
    connector.then(async () => {
        if(redis.has(sid)) {
            req.username = redis.get(sid);
            next();
        }
        else {
            return res.sendStatus(401);
        }
    });
}

function login(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.sendStatus(400);
    }
    else {
        let message;
        connector.then(function () {
            User.findOne({username: username}, function (err, user) {
                if(err) {
                    message = err;
                }
                else if(user == null) {
                    message = {username: username, result: "user do not exist"};''
                }
                else {
                    let hash = md5(user.salt + password);
                    if (user.hash === hash) {
                        let sessionKey = md5("ricebook" + new Date().getTime() + user.username);
                        redis.set(sessionKey, username);
                        console.count("sessionkey is : " + sessionKey);
                        console.count("username is : " + username);
                        console.count("recheck the username " + redis.get(sessionKey));
                        message = {username: username, result: 'success'};
                        //res.cookie(cookieKey, sessionKey, {maxAge: 3600 * 1000, httpOnly: true});
                        //res.cookie(cookieKey, sessionKey, {maxAge: 3600 * 1000, httpOnly: true});
                        res.cookie(cookieKey, sessionKey, {maxAge: 3600 * 1000, httpOnly: true, sameSite: 'None', secure: true});
                    }
                    else {
                        message = {username: username, result: 'password do not match'};
                    }
                }
                res.send(message);
            });
        });
    }
}

function logout(req, res) {
    (async() => {
        await connector;
        console.count("connect to mongodb success");
        let username = req.username;
        console.count("find username : " + username);
        redis.delete(username);
        console.count("check redis update : " + redis.has(username));
        res.cookie(cookieKey, "", -1);
        res.clearCookie(cookieKey);
        res.sendStatus(200);
    })();
}

function updatepassword(req, res) {
    connector.then(async function () {
        let userobj;
        let username = req.username;
        await User.findOne({username: username}).exec().then(user => userobj = user);
        const newpassword = req.body.password;
        let newhash = md5(userobj.salt + newpassword);
        if(newhash == userobj.hash) {
            res.status(400).send({username : username, result: 'please do not update same password'});
            return;
        }
        userobj.hash = newhash;
        userobj.save().then(() => {
            res.send({username : username, result: 'update password success'});
        })
    })
}

module.exports = (app) => {
    app.post('/register', register);
    app.post('/login', login);
    app.use(isLoggedIn);
    app.put('/logout', logout);
    app.put('/password', updatepassword);
}


