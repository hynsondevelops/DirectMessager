module.exports=function(e){var t={};function r(n){if(t[n])return t[n].exports;var s=t[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)r.d(n,s,function(t){return e[t]}.bind(null,s));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=8)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.authJwt=t.authLocal=t.myPassport=void 0;var n=u(r(3)),s=u(r(4)),o=r(9),i=u(r(5));function u(e){return e&&e.__esModule?e:{default:e}}const a=new s.default({usernameField:"email",passReqToCallback:!0},async(e,t,r,n)=>{try{const e=await i.default.findOne({email:t});return e?e.authenticateUser(r)?n(null,e):n(null,!1,{message:"Wrong password."}):n(null,!1,{message:"User does not exist!"})}catch(e){return n(e,!1)}}),d={jwtFromRequest:o.ExtractJwt.fromAuthHeaderAsBearerToken(),secretOrKey:"SecretKey"},l=new o.Strategy(d,async(e,t)=>{try{const r=await i.default.findById(e._id);return t(null,r?r:!1)}catch(e){return t(e,!1)}});n.default.use(a),n.default.use(l);t.myPassport=n.default,t.authLocal=n.default.authenticate("local",{session:!1},function(e,t,r){}),t.authJwt=n.default.authenticate("jwt",{session:!1})},function(e,t){e.exports=require("mongoose")},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("passport")},function(e,t){e.exports=require("passport-local")},function(e,t,r){"use strict";var n=a(r(1)),s=a(r(10)),o=a(r(11)),i=r(6),u=a(r(12));function a(e){return e&&e.__esModule?e:{default:e}}let d=new n.default.Schema({email:{type:String,unique:!0,required:[!0,"Email address required!"],validate:{validator:e=>s.default.isEmail(e)},message:"{VALUE} is not a valid email."},name:{type:String,required:!0,max:100},password:{type:String},conversations:{type:[String]},friends:{type:[String]}});d.plugin(o.default,{message:"{VALUE} already taken!"}),d.pre("save",function(e){return this.isModified("password")&&(this.password=this._hashPassword(this.password)),e()}),d.methods={_hashPassword:e=>(0,i.hashSync)(e),authenticateUser(e){return(0,i.compareSync)(e,this.password)},createToken(){return u.default.sign({_id:this._id},"SecretKey")},toJSON(){return{_id:this._id,name:this.name,token:`JWT ${this.createToken()}`,email:this.email,friends:this.friends,conversations:this.conversations}}},e.exports=n.default.model("User",d)},function(e,t){e.exports=require("bcrypt-nodejs")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.registerUser=async function(e,t,r){try{const n=await s.create(e.body);return n?t.status(201).json(n):t.status(400).json(e.user.email+" is taken")}catch(e){return r(e)}},t.loginUser=function(e,t,r){n.myPassport.authenticate("local",function(e,n,s){return e?r(e):n?void t.send(n.toJSON()):t.status(500).json(s.message)})(e,t,r)},t.addFriend=function(e,t){let r=i(e.body.loggedInUser._id),n=i(e.body.newFriend._id);s.findOneAndUpdate({_id:r},{$addToSet:{friends:n}},{new:!0},function(e,r){if(e)return handleError(e);t.send(r)})},t.getFriends=function(e,t){let r=e.params.user_id;s.find({friends:{$in:[r]}},function(e,r){if(e)return handleError(e);t.send(r)})},t.getConversations=function(e,t){console.log(e.params.user_id);let r=e.params.user_id;console.log(r),console.log("get convo"),o.find({user_ids:{$in:[r]}},function(e,r){if(e)return handleError(e);console.log(r),t.send(r)})};var n=r(0);const s=r(5);r(2);const o=r(23);let i=r(24).ObjectId;t.showUser=function(e,t){let r=new RegExp(e.params.query,"i");s.find({$or:[{email:r},{name:r}]},function(e,r){t.send(r)})}},function(e,t,r){"use strict";var n=r(0);const s=r(2),o=(r(13),r(14)),i=(r(15)(o),r(16)),u=r(3),a=(r(4).Strategy,r(17),r(6),r(1)),d=r(18),l=r(19);a.connect("mongodb://localhost/ChatAppDB");const c=s();c.use(d()),c.use(i.urlencoded({extended:!0})),c.use(i.json()),c.use(u.initialize()),c.set("view engine","ejs"),c.use("/user",l),c.get("/",(e,t)=>{t.send("You got home page!\n")}),c.get("/login",(e,t)=>{t.render("login",{})}),c.post("/login",(e,t,r)=>{u.authenticate("local",(n,s,o)=>o?t.send(o.message):n?r(n):s?void e.login(s,e=>e?r(e):t.redirect("/authrequired")):t.redirect("/login"))(e,t,r)}),c.get("/authrequired",(e,t)=>{e.isAuthenticated()?t.send("you hit the authentication endpoint\n"):t.redirect("/")}),c.get("/private",n.authJwt,(e,t)=>{t.send("Private info!")}),c.use(function(e,t,r,n){e.errors?e.errors[0]?'"email" must be a valid email'==e.errors[0].messages[0]?r.status(400).json(t.body.email+e.errors[0].messages[0].slice(7)):r.status(400).json(e.errors[0].messages):e.errors.email&&r.status(400).json(e.errors.email.message):r.status(400).json(e)}),c.listen(3e3,()=>{console.log("Listening on localhost:3000...")}),e.exports=c},function(e,t){e.exports=require("passport-jwt")},function(e,t){e.exports=require("validator")},function(e,t){e.exports=require("mongoose-unique-validator")},function(e,t){e.exports=require("jsonwebtoken")},function(e,t){e.exports=require("uuid/v4")},function(e,t){e.exports=require("express-session")},function(e,t){e.exports=require("session-file-store")},function(e,t){e.exports=require("body-parser")},function(e,t){e.exports=require("axios")},function(e,t){e.exports=require("cors")},function(e,t,r){"use strict";var n=i(r(20)),s=i(r(21)),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,r):{};n.get||n.set?Object.defineProperty(t,r,n):t[r]=e[r]}return t.default=e,t}(r(7));r(0);function i(e){return e&&e.__esModule?e:{default:e}}const u=r(2).Router(),a=r(7);u.post("/register",(0,n.default)(s.default.loginUser),o.registerUser),u.post("/login",o.loginUser),u.get("/show/:query",a.showUser),u.post("/add_friend",o.addFriend),u.get("/get_friends/:user_id",o.getFriends),u.get("/get_conversations/:user_id",o.getConversations),e.exports=u},function(e,t){e.exports=require("express-validation")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){return e&&e.__esModule?e:{default:e}}(r(22));t.default={loginUser:{body:{email:n.default.string().email().required(),password:n.default.string().required(),name:n.default.string().required()}}}},function(e,t){e.exports=require("joi")},function(e,t,r){"use strict";var n=function(e){return e&&e.__esModule?e:{default:e}}(r(1));let s=new n.default.Schema({user_ids:{type:[String]},message_log:{type:[String]}});s.methods={toJSON(){return{_id:this._id,user_ids:this.user_ids,message_log:this.message_log}}},e.exports=n.default.model("Conversation",s)},function(e,t){e.exports=require("mongodb")}]);