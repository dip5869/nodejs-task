var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const { checkToken } = require("./auth/token_validation");

const admin = require("./models/app");

app.get('/', function (req, res) {
    res.send("***Welcome to API ***");
  });

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});


//==================================================================================================
app.post("/app/login", function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    admin.login(email,password,function(err, data){  
        res.send(data);
    });
});

app.post("/app/register", function(req, res){
    var email = req.body.email;
    var name = req.body.name;
    var cat = req.body.cat;
    var desc = req.body.desc;
    var role = req.body.role;
    admin.register(email,name, cat, desc,role,function(err, data){  
        res.send(data);
    });
});

app.post("/app/update_password",checkToken, function(req, res){
    var body = {
        "email":req.body.email,
        "password":req.body.password
    }
    admin.update_password(body,function(err, data){  
        res.send(data);
    });
});

app.post("/app/users",checkToken, function(req, res){
    var body = {
         "limit" : '20',
         "page" : req.body.page
    }
    admin.users(body,function(err, data){  
        res.send(data);
    });
});

app.get("*",function(req, res){
    res.send({ "status": false, "msg": "Invalid Request OR No Data Found!!!" });
})

app.post("*",function(req, res){
    res.send({ "status": false, "msg": "Invalid Request OR No Data Found!!!" });
})

//==================================================================================================
app.listen(8080, function(){
    console.log("Server Started on 8080.....")
});
