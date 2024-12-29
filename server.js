require("./config/db"); //linking database
const express = require("express");
const app = express();
const userRoute = require("./routes/userRoutes");

app.use("/", userRoute);

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
})