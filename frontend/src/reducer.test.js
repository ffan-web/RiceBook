import { Reducer } from "./reducers";
import { fetchUsers, userlogin, userlogout, getpostsbyid, getpostsbykeyword, followfriend, removefollow } from "./actions"
const users = require("./users.json");
const posts = require("./posts.json");


test("test user fetch ", () => {
    let tempstate;
    tempstate = Reducer(undefined, fetchUsers(users));
    let len = tempstate.usernames.length;
    expect(len).toEqual(10);
});


test("should log in a previously registered user ", () => {
    let tempstate;
    tempstate = Reducer(undefined, fetchUsers(users));
    tempstate = Reducer(tempstate, userlogin("Bret", "Kulas Light"))
    expect(tempstate).toEqual({
        ...tempstate,
        userloginstatus: true,
        username: "Bret",
        email: "Sincere@april.biz",
        phone: "1-770-736-8031 x56442",
        zipcode: "92998-3874",
        password: "Kulas Light",
        id: 1,
    });
});

test("should not log in an invalid user", () => {
    let tempstate;
    tempstate = Reducer(undefined, fetchUsers(users));
    tempstate = Reducer(tempstate, userlogin("Chris", "COMP543Prof"));
    expect(tempstate).toEqual({
        ...tempstate,
        userloginstatus: false,
        username: null,
        email: null,
        phone: null,
        zipcode: null,
        password: null,
        id: null
    });
});

test("should log out a user", () => {
    let tempstate;
    tempstate =  Reducer(undefined, fetchUsers(users));
    tempstate = Reducer(tempstate, userlogin("Bret", "Kulas Light"));
    tempstate = Reducer(tempstate, userlogout());
    expect(tempstate).toEqual({
        ...tempstate,
        userloginstatus: false
    });
});

test("should fetch all articles for current logged in user", () => {
    let tempstate;
    tempstate = Reducer(undefined, fetchUsers(users));
    tempstate = Reducer(tempstate, userlogin("Bret", "Kulas Light"));
    tempstate = Reducer(tempstate, getpostsbyid(posts, localStorage.getItem("id")));
    let len = tempstate.requireedposts.length;
    expect(len).toEqual(40);
});

test("should fetch subset of articles for current logged in user given search keyword", () => {
    let tempstate;
    tempstate = Reducer(undefined, fetchUsers(users));
    tempstate = Reducer(tempstate, userlogin("Bret", "Kulas Light"));
    tempstate = Reducer(tempstate, getpostsbyid(posts, localStorage.getItem("id")));
    tempstate = Reducer(tempstate, getpostsbykeyword("dignissimos"));
    let len = tempstate.requireedposts.length;
    expect(len).toEqual(3);
});

test("should add articles when adding a follower", () => {
    let tempstate;
    tempstate = Reducer(undefined, fetchUsers(users));
    tempstate = Reducer(tempstate, userlogin("Bret", "Kulas Light"));
    tempstate = Reducer(tempstate, getpostsbyid(posts, localStorage.getItem("id")));
    tempstate = Reducer(tempstate, followfriend("Leopoldo_Corkery"));
    let len = tempstate.requireedposts.length;
    expect(len).toEqual(50);
});

test("should add articles when removing a follower", () => {
    let tempstate;
    tempstate = Reducer(undefined, fetchUsers(users));
    tempstate = Reducer(tempstate, userlogin("Bret", "Kulas Light"));
    tempstate = Reducer(tempstate, getpostsbyid(posts, localStorage.getItem("id")));
    tempstate = Reducer(tempstate, removefollow("Antonette"));
    let len = tempstate.requireedposts.length;
    expect(len).toEqual(30);
});

test("should fetch the logged in user's profile username", () => {
    let tempstate;
    tempstate = Reducer(undefined, fetchUsers(users));
    tempstate = Reducer(tempstate, userlogin("Bret", "Kulas Light"));
    expect(tempstate.username).toEqual("Bret");
});