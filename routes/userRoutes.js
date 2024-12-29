const express = require("express");
const session = require("express-session");
const auth = require("../middleware/auth");
const userRoute = express();
const path = require("path");
const userController = require("../controllers/userController");
const bodyParser = require("body-parser");

userRoute.use(session({secret: "myecret"}))
userRoute.use(express.static(path.join(__dirname, "../public")));
userRoute.set("view engine", "ejs");

userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true}));

//-------------------------GET-----------------------------------------
userRoute.get("/", auth.isLogout, userController.loadLogin);

userRoute.get("/logout", auth.isLogin, userController.userLogout);

userRoute.get("/register", auth.isLogout, userController.loadRegister);

userRoute.get("/dashboard", auth.isLogin, userController.loadDashboard);

//---------------------------POST-----------------------------------------
userRoute.post("/", userController.verifyLogin);

userRoute.post("/register", userController.register);

module.exports = userRoute;