var mysql = require('mysql');
var crypto = require('crypto');
const { connected } = require('process');
const { sign } = require("jsonwebtoken");

var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'task_node'
});

dbConn.connect();

function randomValueHex(len)
{
   return crypto
     .randomBytes(Math.ceil(len / 2))
     .toString('hex') // convert to hexadecimal format
     .slice(0, len) // return required number of characters
}

exports.login = function(email,password,callback){
var data = {}
    var query = 'SELECT * FROM tbl_user where u_email="'+email+'" and u_password = "'+password+'" and u_status = "Active" ';
     //    console.log(query);
      dbConn.query(query, function (error, rows, fields) {   
     if(rows.length != 0)
     {
        // console.log('key'+process.env.JWT_KEY);

      var password = undefined;
        const jsontoken = sign({ pwd: password }, process.env.JWT_KEY, {
            expiresIn: "1min"
          });

      var u_id  = rows[0].u_id ;
      var token = randomValueHex(36);
      var query = 'update tbl_user set u_token="'+token+'" where u_id ="'+u_id +'"';
    //   console.log(query);
       dbConn.query(query, function (error, rows, fields) {
           if (rows.affectedRows > 0) {
                    data["msg"] = "succesfully logged in!";
                    data["user_id"] = u_id;
                    data["token"] = jsontoken; 
                    data["status"] = true; 
                    callback(null,data);
                 }
                  else {
                      data["status"] = false;
                      data["code"] = error.code;
                      data["msg"] = "You have Entered Wrong EPassword";
                      callback(null,data);
                  }
            });
    }else{
            data["msg"] = "You have Entered Wrong Email Id or Password";
            data["status"] = false; 
            callback(null,data);
        }
    });  
}

exports.register = function(email,name, cat, desc,role,callback){
var data = {}
    var query = 'SELECT * FROM tbl_user where u_email="'+email+'" ';
     //    console.log(query);
      dbConn.query(query, function (error, rows, fields) {   
     if(rows.length == 0)
     {
      var password = randomValueHex(4);
      var query = 'INSERT INTO `tbl_user`( `u_name`, `u_catagery`, `u_desc`, `u_email`, `u_password`, `u_status`,  `u_role`) VALUES ("'+name+'","'+cat+'","'+desc+'","'+email+'","'+password+'","Active","'+role+'")';
    //   console.log(query);
       dbConn.query(query, function (error, rows, fields) {
                    data["msg"] = "succesfully Added!";
                    data["status"] = true; 
                    callback(null,data);
            });
    }else{
            data["msg"] = "User Already Registered!";
            data["status"] = false; 
            callback(null,data);
        }
    });  
}


exports.update_password = function(body,callback){
    var data = {}
    dbConn.query('update `tbl_user` set `u_password` = "'+body.password+'" where `u_email`="'+body.email+'"', function (error, rows, fields) { 
    if(rows.length != 0)
    {
        data["msg"] = "Password Updated";
        data["status"] = true;
        callback(null,data);
    }
    else{
            data["msg"] = "Password Not Update!";
            data["status"] = false;
            callback(null,data);
    }
    }); 
}


exports.users = function(body,callback){
    var data = {}
    // calculate offset
    var offset = (body.page - 1) * body.limit;
    var qury = 'select * from tbl_user limit '+body.limit+' OFFSET '+offset+'';
    // console.log(qury);
    dbConn.query(qury, function (error, rows, fields) { 
        if(rows.length != 0)
        {
            data["products_page_count"] = rows.length,
            data["page_number"] = body.page,
            data["users"] = rows
            data["msg"] = "Users found successfully!";
            data["status"] = true;
            callback(null,data);
        }else{
            data["msg"] = "Users Not Found!";
            data["status"] = false;
            callback(null,data);
        }    
  });
}