var mysql=require("mysql");
var connection;

if(process.env.JAWSBD_URL){
    connection=mysql.createConnection(process.env.JAWSBD_URL);
} else{
    connection=mysql.createConnection({
        host:"localhost",
        user: "root",
        password: "root",
        database: "o68tkvzt7x351ohr",
    })
}
connection.connect()
module.exports=connection;