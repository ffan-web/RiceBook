import * as Actions from './actions'


const initialState = {
    location: 'Landingpage',
    text: 'Hello word',
    share: 'Waiting for a ft offer',
    avatar:"https://www.instyle.com/thmb/e7V4_Nal9UPCLHA56dJfPewAXoM=/2250x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/blackpink-lisa-outfits-lead-2000-6d92434bc7a94f3bab4ddd34e18b95cf.jpg",
    message: "Welcome to RiceBook",

    error: false,

    userloginstatus: false,
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    phone: localStorage.getItem("phone"),
    zipcode: localStorage.getItem("zipcode"),
    password: localStorage.getItem("password"),
    id: localStorage.getItem("id"),
    headline: localStorage.getItem(localStorage.getItem("username")),
    avatar: "",

    users: [],
    usernames: [],
    posts: [],
    requireedposts: [],
    follows: [],
    allposts: [],
    headlines: [],

    followremindmsg: ""

}
export function Reducer(state = initialState, action)  {
    let userid;
    let res = [];
    switch (action.type) {
        case Actions.Fetch_Users:
            return {...state, users: action.users, usernames: action.users.map(user => user.username), headlines: action.users.map(user => user.company.catchPhrase)};
        case Actions.SETFEED:
            console.count("I am here to set posts");
            console.count("wo cao ni ma ???");
            return {...state, posts: action.posts, requireedposts: action.posts};
        case Actions.UserSignin:
            return {...state, location: 'Signinpage'}
        case Actions.UserLogin:
            localStorage.setItem("userloginstatus", true);
            localStorage.setItem("username", action.username);
            return {...state, userloginstatus: true, username: action.username};
        case Actions.UserLogout:
            return {...state, userloginstatus: false}
        case Actions.Registion:
            localStorage.setItem("userloginstatus", "true");
            localStorage.setItem("username", action.username);
            localStorage.setItem("email", action.email);
            localStorage.setItem("phone", action.phone);
            localStorage.setItem("zipcode", action.zipcode);
            localStorage.setItem("password", action.password);
            localStorage.setItem("id", action.id);
            return {...state, userloginstatus: true, username: action.username, email: action.email, phone: action.phone, zipcode: action.zipcode, password: action.password, id: action.id, headline: localStorage.getItem(action.username)};
        case Actions.SET_FOLLOWED_USERS:
            return {...state, follows: action.followedUsers};
        case Actions.GetPostsbyId:
            let followidset = new Set();
            let followid = [];
            userid = parseInt(action.id) === -1 ? 0 : parseInt(action.id);
            followidset.add((userid % 10) + 1)
            followidset.add(((userid + 1) % 10) + 1)
            followidset.add(((userid + 2) % 10) + 1)
            followid.push((userid % 10) + 1)
            followid.push(((userid + 1) % 10) + 1)
            followid.push(((userid + 2) % 10) + 1)
            action.posts.forEach(post => {
                if (followidset.has(post.userId) || post.userId === userid) {
                    res.push({username: state.usernames[post.userId - 1], body: post.body, timestamp: (new Date(Math.random() * 1635117946027)).toString()});
                }
            })
            res.sort((p1, p2) => {
                let date1 = new Date(p1.timestamp)
                let date2 = new Date(p2.timestamp)
                return date2 - date1;
            });
            let follows = followid.map((id, i) => {
                return {username: state.usernames[id - 1], headline: state.headlines[id - 1]};
            })
            let headline = state.headlines[action.id - 1];
            localStorage.setItem(localStorage.getItem("username"), headline);
            return {...state, requireedposts: res, posts: res, follows: follows, allposts: action.posts, headline: headline}
        case Actions.GetPostsbyKeyword:
            res = state.posts.filter((post, i) => {
                return post.username.includes(action.keyword) || post.body.includes(action.keyword);
            });
            res.sort((p1, p2) => {
                let date1 = new Date(p1.timestamp)
                let date2 = new Date(p2.timestamp)
                return date2 - date1;
            });
            return {...state, requireedposts: res};
        case Actions.FollowFriend:
            if (action.friendname === localStorage.getItem("username")) {
                return {...state, followremindmsg: "Plz do not follow yourself"};
            }
            if (state.follows.map(user => user.username).find(name => name === action.friendname)) {
                return {...state, followremindmsg: "Plz do not follow the friend you already followed"};
            }
            let usernamearr = Array.from(state.usernames);
            let followsarr = Array.from(state.follows);
            let adduserindex = -1;
            for(let i = 0; i < usernamearr.length; i ++) {
                let username = usernamearr[i];
                if(username === action.friendname) {
                    adduserindex = i;
                    break;
                }
            }
            if (adduserindex !== -1) {
                followsarr.push({username: action.friendname, headline: state.headlines[adduserindex]});
                // username, body, timestamp
                let postsBeforeFilter = [...state.posts];
                let postsAfterFilter = [...state.requireedposts];
                state.allposts.forEach((post, i) => {
                    if (post.userId === adduserindex + 1) {
                        postsBeforeFilter.push({username: state.usernames[post.userId - 1], body: post.body, timestamp: (new Date(Math.random() * 1635117946027)).toString()});
                        postsAfterFilter.push({username: state.usernames[post.userId - 1], body: post.body, timestamp: (new Date(Math.random() * 1635117946027)).toString()});
                    }
                });
                postsAfterFilter.sort((p1, p2) => {
                    let date1 = new Date(p1.timestamp)
                    let date2 = new Date(p2.timestamp)
                    return date2 - date1;
                });
                return {...state, posts: postsBeforeFilter, requireedposts: postsAfterFilter, follows: followsarr, adduserindex :adduserindex};
            }
            else {
                return {...state, followremindmsg: "Plz follow a user in JSON holder file"};
            }
        case Actions.RemoveFollow:
            res = state.follows.filter((user, i) => user.username !== action.targetname);
            let postsBeforeFilter = state.posts.filter(post => post.username !== action.targetname);
            let postsAfterFilter = state.requireedposts.filter(post => post.username !== action.targetname);
            return {...state, follows: res, posts: postsBeforeFilter, requireedposts: postsAfterFilter};
        case Actions.NavtoLanding:
            return {...state, location: 'login'}
        case Actions.update_Text:
            return {... state, share: action.text.value}
        case Actions.ADD_FOLLOWER:
            return {...state, nextFollowerId: state.nextFollowerId + 1,
                followers: [...state.followers,
                {id: state.nextFollowerId, name: action.name, avatar: action.avatar, headline: action.headline}
                ]}
        case Actions.REMOVE_FOLLOWER:
            return {...state, followers: state.followers.filter((f) => {return f.id != action.id})}
        case Actions.ADD_ARTICLE:
            return {...state,
                nextid:state.nextid+1,
                articles:[
                    ...state.articles,
                    {title:action.title,
                    text:action.text,
                    date:action.time,
                    id:state.nextid,
                    img:"https://upload.wikimedia.org/wikipedia/en/d/d4/Mickey_Mouse.png"
                    }
                ]
            }
        case Actions.NavtoProfile:
            return {...state, location: 'Profile'}
        case Actions.NavtoMain:
            return {...state, location: 'Mainpage', accountName: action.newname}
        case Actions.UpdateHeadline:
            return {...state, headline: action.newinput};
        case Actions.SendNewPost:
            res = [...state.requireedposts];
            res.push({username: localStorage.getItem("username"), body: action.postcotent, timestamp: (new Date()).toString()});
            res.sort((p1, p2) => {
                let date1 = new Date(p1.timestamp)
                let date2 = new Date(p2.timestamp)
                return date2 - date1;
            });
            return{...state, requireedposts: res};
        case Actions.SET_USER_AUTHENTICATION:
            return {...state, userloginstatus: action.userloginstatus};
        case Actions.SET_AVATAR:
            return {...state, avatar: action.url};
        default:
            return state
    }
}

export default Reducer