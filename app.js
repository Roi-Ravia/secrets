//jshint esversion:6
require('dotnev').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/secretsDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })


const userSchema = new mongoose.Schema(
    {
        username: String,
        password: String
    }
);


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });


const User = mongoose.model("User", userSchema);


app.get("/", function (req, res) {
    res.render("home")
})

app.get("/login", function (req, res) {
    res.render("login")
})

app.get("/register", function (req, res) {
    res.render("register")
})


app.post("/register", function (req, res) {

    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    })

    newUser.save(function (err) {
        if(!err) {
            res.render("secrets")
        } else {
            console.log(err)
        }
    });
})

app.post("/login", function (req, res) {

    const password = req.body.password;

    User.findOne({ username: req.body.username }, function (err, foundUser) {
        if(err) {
            console.log(err)
        } else {
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render("secrets");
                } else {
                    console.log("Wrong Password")
                }
            }
        }
    })
})



app.listen(3000, function () {
    console.log("Server has started running")
})