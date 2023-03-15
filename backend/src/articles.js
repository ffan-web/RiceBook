const mongoose = require('mongoose');
const connecturl = "mongodb+srv://ricebook:ricebook@comp531.0zr68ak.mongodb.net/?retryWrites=true&w=majority";
const connector = mongoose.connect(connecturl);
const articleSchema = require('./model/articleSchema');
const Article = mongoose.model("article", articleSchema);
const profileSchema = require("./model/profileSchema");
const Profile = mongoose.model('profile', profileSchema);
const uploadImage = require('./uploadCloudinary');

function addAtricle(req, res) {
    if (!req.body.text) {
        res.sendStatus(400);
        return;
    }
    (async () => {
        let newarticle;
        let username = req.username;
        if(! username) {
            res.status(400).send("user do not login");
        }
        await connector.then(() => {
            if (!req.fileurl) {
                newarticle = new Article({
                    text: req.body["text"],
                    author: req.username,
                    date: new Date()
                })
            }
            else {
                newarticle = new Article({
                    text: req.body["text"],
                    author: req.username,
                    image: req.fileurl,
                    date: new Date()
                });
            }
        });
        newarticle.save().then(() => {
            Article.find({author: username}, (err, articles) => {
                if (err) {
                    res.send(err);
                } 
                else {
                    res.send({articles: articles});
                }
            })
        })
    })();

}

function getArticles(req, res) {
    connector.then(async () => {
        if(! req.params.id) {
            Article.find({author: req.username}, function (err, articles) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send({articles: articles});
                }
            });
        }
        else {
            Article.find({pid: req.params.id}, function (err, articles) {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                res.send({articles: articles});
            })
        }
    })
}

function updateArticle(req, res) {
    if(! req.body.text) {
        res.sendStatus(400);
        return;
    }
    connector.then(async () => {
        let originartcile;
        await Article.findOne({pid: req.params.id}).exec().then((article) => {
            originarticle = article;
        })
        if(! originarticle) {
            res.sendStatus(400);
            return;
        }
        if(req.body.commentId === undefined) {
            if(originarticle.author !== req.username) {
                res.sendStatus(403);
                return;
            }
            await Article.updateOne({pid: req.params.id}, {text: req.body.text});
            Article.find({author: req.username}, function (err, articles) {
                if (err) {
                    res.send(err);
                } else {
                    res.send({articles: articles});
                }
            });
        }
        else {
            //res.send("not into this step, sorry");
            let commentsarr = Array.from(originarticle.comments);
            let commentid = req.body.commentId;
            let username = req.username;
            if(commentid != -1) {
                //commentsarr = Array.from(originarticle.comments);
                const len = commentsarr.length;
                if(commentid - 1 >= len || commentid - 1 < 0) {
                    res.sendStatus(400);
                    return;
                }
                if(commentsarr[commentid - 1].author !== username) {
                    res.sendStatus(403);
                    return;
                }
                commentsarr[commentid - 1].text = req.body.text;
                await Article.updateOne({pid: req.params.id}, {comments: commentsarr});
                Article.find({}, function (err, articles) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send({articles: articles});
                    }
                });
            }
            else {
                //commentsarr = Array.from(originarticle.comments);
                let commenttext = req.body.text;
                commentsarr.push({text: commenttext, author: username});
                await Article.updateOne({pid: req.params.id}, {comments: commentsarr});
                Article.find({}, function (err, articles) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send({articles: articles});
                    }
                });
            }
        }
    });
}

function getFeed(req, res) {
    connector.then(() => {
        Profile.findOne({username: req.username}).exec().then(profile => {
            let usersToQuery = [req.username, ...profile.followedUsers];
            Article.aggregate([
                {$match: {author: {$in: usersToQuery}}},
                {$project: {author: 1, text: 1, date: 1, comments: 1, pid: 1, _v: 1, image: 1, _id: 1}},
                {$sort: {"date": -1}},
                {$limit: 10}
            ]).exec().then(articles => {
                res.send({articles: articles});
            })
        });
    });
}

module.exports = (app) => {
    app.post('/article', uploadImage('title'), addAtricle);
    app.get('/articles/:id?', getArticles);
    app.put('/articles/:id', updateArticle);
    app.get('/feed', getFeed);
}