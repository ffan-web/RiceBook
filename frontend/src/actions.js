export const UserSignin = 'UserSignin'
export const UserLogin = 'UserLogin'
export const Registion = 'Registion'
export const NavtoLanding = 'NavtoLanding'
export const update_Text = 'update_Text'
export const add_Articles = 'add_Articles'
export const ADD_FOLLOWER = 'ADD_FOLLOWER'
export const REMOVE_FOLLOWER = 'REMOVE_FOLLOWER'
export const ADD_ARTICLE = 'ADD_ARTICLE'
export const NavtoProfile = 'NavtoProfile'
export const NavtoMain = 'NavtoMain'
export const Fetch_Users = "Fetch_Users"
export const UserLogout = "UserLogout"
export const GetPostsbyId = "GetPostsbyId"
export const GetPostsbyKeyword = "GetPostsbyKeyword"
export const FollowFriend = "FollowFriend"
export const RemoveFollow = "RemoveFollow"
export const UpdateHeadline = 'UpdateHeadline'
export const SendNewPost = 'SendNewPost'
export const SET_USER_AUTHENTICATION = "SET_USER_AUTHENTICATION";
export const SET_EXPIRED = "SET_EXPIRED";
export const SET_FOLLOWED_USERS = "SET_FOLLOWED_USERS";
export const SETFEED = "SETFEED";
export const SET_AVATAR = "SET_AVATAR";

export function fetchUsers(users) {
    return {
        type: 'Fetch_Users', 
        users: users
    }
}

export function setAvatar(url) {
    return {
        type: SET_AVATAR, 
        url
    };
}

export const nvatolanding = () => {
    return{
        type: 'NavtoLanding'
    }
}

export const userlogin = (accountName, password) => {
    return{ 
        type: 'UserLogin',
        username : accountName,
        password : password
    }
}

export const userlogout = () => {
    return{
        type: 'UserLogout'
    }
}


export const register = (username, email, phone, zipcode, password, id) => {
    console.count("press signin button")
    return { 
        type: 'Registion',
        username: username,
        email: email,
        phone: phone,
        zipcode: zipcode,
        password: password,
        id: id
    }
}

export const getpostsbyid = (posts, id) => {
    return {
        type: 'GetPostsbyId',
        posts: posts,
        id: id
    }
}

export const getpostsbykeyword = (keyword) => {
    return {
        type: "GetPostsbyKeyword",
        keyword: keyword
    }
}

export const followfriend = (friendname) => {
    return {
        type: "FollowFriend",
        friendname: friendname
    }
}

export const removefollow = (followname) => {
    return {
        type: "RemoveFollow",
        targetname: followname
    }
}

export const updateText = (hl) => {
    return{
        type: 'update_Text',
        text: hl
    }
}

export const addarticle = (text) => {
    return {
        type: 'ADD_ARTICLE',
        date:text.time,
        title:text.title,
        text:text.comment
    }
}

export const nvatoprofile = () => {
    console.count('this part works')
    return{
        type: 'NavtoProfile'
    }
}

export const navtomainpage = (newname) => {
    return{
        type: 'NavtoMain',
        newname: newname
    }
}

export const updateheadline = (newinput) => {
    return{
        type: 'UpdateHeadline',
        newinput: newinput
    }
}

export const sendnewpost = (postcotent) => {
    return {
        type: 'SendNewPost',
        postcotent: postcotent
    }
}

export function setExpired(input) {
    return {
        type: SET_EXPIRED, 
        input
    };
}

export function setUserAuthentication(userloginstatus) {
    return {
        type: SET_USER_AUTHENTICATION,
        userloginstatus: userloginstatus
    };
}

export function setFollowedUsers(followedUsers) {
    return {
        type: SET_FOLLOWED_USERS, 
        followedUsers: followedUsers
    };
}

export function setFeed(posts) {
    console.count("set articles by action");
    console.count("check posts length in action " + posts.length);
    return {
        type: SETFEED, 
        posts
    };
}
