var express = require("express");
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var userModel = require("./models/user");
var app = express();
app.use(bodyparser.urlencoded({ extended: true }));
var db = mongoose.connect('mongodb://localhost:27017/details', { useNewUrlParser: true, useUnifiedTopology: true });

var user = userModel.user;

app.post("/users", function (req, res) {
    console.log(user);
    if (req.body.name == "" || req.body.name == undefined || req.body.age == "" || req.body.age == undefined || req.body.email == "" || req.body.email == undefined || req.body.gender == "" || req.body.gender == undefined) {
        res.send({ message: "invalid details" });
        return;
    }
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!req.body.email.match(emailRegex)) {
        res.send({ message: "invalid email" });
        return;
    }
    var numberregex = /^[0-9]+$/;
    if (!req.body.age.match(numberregex)) {
        res.send({ message: "invalid age" });
        return;
    }
    if (req.body.age > 100) {
        res.send({ message: "invalid age input" });
        return
    }
    console.log(req.body.gender);
    if (req.body.gender != "male" && req.body.gender != "female") {
        res.send({ message: "invalid gender" });
        return;
    }

    var data = new user({ name: req.body.name, age: req.body.age, email: req.body.email, gender: req.body.gender });
    data.save(function (err, save) {
        if (err) throw err;
        res.send({ message: "inserted sucessfully", id: save._id });
        console.log("save:", save);
    });
    //res.send({ message: "inserted" });
});
app.put("/update", function (req, res) {
    if (req.body.name == "" || req.body.name == undefined || req.body.age == "" || req.body.age == undefined || req.body.email == "" || req.body.email == undefined || req.body.gender == "" || req.body.gender == undefined) {
        res.send({ message: "invalid details" });
        return;
    }
    var numberregex = /^[0-9]+$/;
    if (!req.body.age.match(numberregex)) {
        res.send({ message: "invalid age" });
        return;
    }
    if (req.body.age > 100) {
        res.send({ message: "invalid age input" });
        return
    }
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!req.body.email.match(emailRegex)) {
        res.send({ message: "invalid email" });
        return;
    }

    if (req.body.gender != "male" || req.body.gender != "female") {
        res.send({ message: "invalid gender" });
        return;
    }
    //console.log(req.body.id);
    var data = { name: req.body.name, age: req.body.age, email: req.body.email, gender: req.body.gender };
    user.findByIdAndUpdate(req.body.id, { data }, { new: true }, function (err, result) {
        console.log({ data });
        if (err) throw err;
        console.log("result:", result);
        res.send({ message: "updated" })
    });
});

app.delete("/delete", function (req, res) {
    if (req.body.id == "") {
        res.send({ message: "invalid id" });
        return;
    }
    user.deleteOne({ _id: req.body.id }, function (err, res) {
        if (err) throw err;
        console.log(res);
    })
})

app.get("/", function (req, res) {
    res.send({ messge: 'welcome' });
});

app.listen(8524, function () {
    console.log("8524 is listening");
});