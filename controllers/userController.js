const user = require("../models/user");
const bcrypt = require("bcrypt");

const loadLogin = async(req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error);
    }
}

const loadRegister = (req, res) => {
    try {
        res.render("register");
    } catch (error) {
        console.log(error);
    }
}

const loadDashboard = async(req, res) => {
    try {
        const USER = await user.findOne({ email : req.session.user_id });
        res.render("dashboard", { user:USER });
    } catch (error) {
        console.log(error);
    }
}

const register = async(req, res) => {
    try {
        let { username, email, password } = req.body;
        username = username.trim();
        email = email.trim();
        password = password.trim();
        
        const saltRounds = 10;
            bcrypt.hash (password, saltRounds)
            .then(hashedPassword => {
                const User = new user({
                    name: username,
                    email: email,
                    password: hashedPassword,
                })
                User.save()
                .then(result => {
                    res.render("register", {message: "Registered Successfully, Please Login"});
                })
                .catch(err => {
                    res.render("register", {message: "Error registering please try again after some time."});
                })
            })
            .catch(err => {
                    res.json({
                    Status: "FAILED",
                    Message: "ERROR occurred while hashing password!"
                })
            })
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {

        let { email, password } = req.body;
        const userData = await user.findOne( {email: email} );

        if(userData){
            bcrypt.compare (password, userData.password)
                    .then(result => {
                        if (result) {
                            req.session.user_id = userData.email;
                            res.redirect("/dashboard");
                        } 
                        else{
                            res.render("login", {message: "Email or password incorrect."});
                        }
                    })
                    .catch( err => {
                        console.log(err.message);
                    })
        }
        else{
            //emailid not in records
            res.render("login", {message: "Email or password incorrect."})
        }

    } catch (error) {
        console.log(error.message);
    }
}

const userLogout = (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = { loadLogin, loadRegister, register, verifyLogin, loadDashboard, userLogout }