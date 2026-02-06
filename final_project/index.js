const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // TODO: Check user from cookies/session
    console.log("Session:", req.session);
    if(req.session && req.session.username && req.session.token){
        jwt.verify(req.session.token, "secret_key", (err, user) => {
            if(err){
                return res.status(403).json({message: "Unauthorized access"});
            }
            console.log("User:", user.username, " Authenticated");
            next();
        });
    } else {
        return res.status(403).json({message: "Unauthorized access"});
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
