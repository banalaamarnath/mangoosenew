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
        res.status(400).send({ message: "invalid details" });
        return;
    }
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!req.body.email.match(emailRegex)) {
        res.status(400).send({ message: "invalid email" });
        return;
    }
    var numberregex = /^[0-9]+$/;
    if (!req.body.age.match(numberregex)) {
        res.status(400).send({ message: "invalid age" });
        return;
    }
    if (req.body.age > 100) {
        res.status(400).send({ message: "age should be lessthan 100" });
        return
    }
    console.log(req.body.gender);
    if (req.body.gender != "male" && req.body.gender != "female") {
        res.status(400).send({ message: "invalid gender" });
        return;
    }

    var data = new user({ name: req.body.name, age: req.body.age, email: req.body.email, gender: req.body.gender });
    data.save(function (err, save) {
        if (err) {
            res.status(400).send({ message: "bad request" });
        }
        res.status(200).send({ message: "inserted sucessfully", id: save._id });
        console.log("save:", save);
    });
    //res.send({ message: "inserted" });
});
app.put("/update", function (req, res) {
    if (req.body.age != "") {
        var numberregex = /^[0-9]+$/;
        if (!req.body.age.match(numberregex)) {
            res.status(400).send({ message: "invalid age" });
            return;
        }

        if (req.body.age > 100) {
            res.status(400).send({ message: "age should be lessthan 100 " });
            return
        }
    }
    if (req.body.email != "") {
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if (!req.body.email.match(emailRegex)) {
            res.status(400).send({ message: "invalid email" });
            return;
        }
    }
    if (req.body.gender != "") {
        if (req.body.gender != "male" && req.body.gender != "female") {
            res.status(400).send({ message: "invalid gender" });
            return;
        }
    }
    if (req.body.id == "") {
        res.status(400).send({ message: "id needed for update details" });
        return;
    }
    //console.log(req.body.id);
    var data = { name: req.body.name, age: req.body.age, email: req.body.email, gender: req.body.gender };
    user.findByIdAndUpdate(req.body.id, data, { new: true }, function (err, result) {
        //console.log({ data });
        if (err) {
            res.status(404).send({ message: "Id not found" })
        }
        console.log("result:", result);
        res.status(200).send({ message: "updated" })
    });
});

app.delete("/delete", function (req, res) {
    if (req.body.id == "") {
        res.status(400).send({ message: "invalid id" });
        return;
    }
    user.deleteOne({ _id: req.body.id }, function (err, result) {
        if (err) {
            res.status(400).send({ message: "bad request,check your id" });
            return;
        }
        if(result.deletedCount == 1){
        res.status(200).send({ message: "deleted sucessfully" });
        return;
        }
        if(result.deletedCount == 0){
            res.status(400).send({ message: "bad request,check id" });
            return;
        }
        console.log(result);
    })
})

app.get("/", function (req, res) {
    res.send({ messge: 'welcome' });
});

app.listen(8524, function () {
    console.log("8524 is listening");
});