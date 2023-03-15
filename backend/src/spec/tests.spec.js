require('es6-promise').polyfill();
require('isomorphic-fetch');
const url = path => `http://localhost:3000${path}`;
const mongoose = require("mongoose");
const connecturl = "mongodb+srv://ricebook:ricebook@comp531.0zr68ak.mongodb.net/?retryWrites=true&w=majority";
const connector = mongoose.connect(connecturl);
//const redis = require('redis').createClient('redis://:pf8a4351d01b485be6e0546f1dfff5ec78f8b5c804fae0cc6bfa5bd77a68ebb93@ec2-54-158-245-54.compute-1.amazonaws.com:7479');
const userSchema = require("../model/userSchema");
const User = mongoose.model('user', userSchema);
const profileSchema = require("../model/profileSchema");
const Profile = mongoose.model('profile', profileSchema);
const articleSchema = require('../model/articleSchema');
const Article = mongoose.model("article", articleSchema);


function deletetestUser(deleteusernmae) {
    connector.then(async() => {
        await User.deleteOne({username: deleteusernmae}).exec().then((user) => {
            if(user) {
                console.count("delete test user " + deleteusernmae);
            }
        })
    });
}

function deletetestProfile(deleteusernmae) {
    connector.then(async() => {
        await Profile.deleteOne({username: deleteusernmae}).exec().then((profile) => {
            if(profile) {
                console.count("delete profile " + deleteusernmae);
            }
        })
    });
}


describe('Backend: Unit test', () => {
    let cookie;
    let articleslen;
    it('Backend: Unit test to validate POST /register', (done) => {
        let post = {
            username : "testUser",
            password : "123",
            email : "testuser@gmail.com",
            dob : "2000-01-01",
            zipcode : 77191
        }
        deletetestUser("testUser");
        deletetestProfile("testUser");
        fetch(url('/register'), {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(post)
        }).then(res => res.json()).then(res => {
            expect(res.result).toEqual("success");
            expect(res.username).toEqual("testUser");
        }).then(done).catch(done);
    }, 2000);

    it('Backend: Unit test to validate POST /login', (done) => {
        let post = {
            username : "testUser",
            password : "123",
        }
        fetch(url('/login'), {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(post)
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            return res.json();
        }).then(res => {
            expect(res.result).toEqual("success");
            expect(res.username).toEqual("testUser");
        }).then(done).catch(done);
    }, 2000);

    it('Backend: Unit test to validate GET /headline', (done) => {
        fetch(url('/headline'), {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'cookie': cookie
            }
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual("testUser");
            expect(res.headline).toEqual("default headline");
        }).then(done).catch(done);
    }, 2000);

    it('Backend: Unit test to validate PUT /headline', (done) => {
        let post = {
            headline : "update headline"
        }
        fetch(url('/headline'), {
            method: 'PUT',
            headers:{
                'Content-Type':'application/json',
                'cookie': cookie
            },
            body: JSON.stringify(post)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual("testUser");
            expect(res.headline).toEqual("update headline");
        }).then(done).catch(done);
    }, 2000);

    it('Backend: Unit test to validate GET /articles', (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'cookie': cookie
            }
        }).then(res => res.json()).then(res => {
            articleslen = res.articles.length;
            expect(res.articles.length).toEqual(articleslen);
        }).then(done).catch(done);
    }, 2000);

    it('Backend: Unit test to validate POST /article', (done) => {
        let post = {
            text: "to test user post article function"
        }
        fetch(url('/article'), {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'cookie': cookie
            },
            body: JSON.stringify(post)
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(articleslen + 1);
            expect(res.articles[articleslen].text).toEqual("to test user post article function");
        }).then(done).catch(done);
    }, 2000);

    it('Backend: Unit test to validate GET /articles/id', (done) => {
        fetch(url('/articles/8'), {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'cookie': cookie
            }
        }).then(res => res.json()).then(res => {
            expect(res.articles[0].text).toEqual("to test user post article function");
        }).then(done).catch(done);
    }, 2000);

    it('Backend: Unit test to validate PUT /logout', (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers:{
                'Content-Type':'application/json',
                'cookie': cookie
            }
        }).then(res => {
            expect(res.status).toEqual(200);
        }).then(done).catch(done);
    }, 2000);
});
