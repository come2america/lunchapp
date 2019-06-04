require("dotenv").config();
var express = require("express");
var jwt = require('express-jwt');

var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var db = require("./models");
var authRoutes = require("./routes/authRoutes");
var apiRoutes = require("./routes/apiRoutes");
var app = express();
var PORT = process.env.PORT || 3000;


var path = require("path");



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require(path.join(__dirname, "./routes/htmlRoutes"))(app);


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Routes

app.use("/auth", authRoutes);
app.use(auth);
app.use("/api", apiRoutes);

// app.post('/pusher/auth', function(req, res) {
//   var socketId = req.body.socket_id;
//   var channel = req.body.channel_name;
//   var auth = pusher.authenticate(socketId, channel);
//   res.send(auth);
// });

app.post('/message', function(req, res) {
  var message = req.body.message;
  var name = req.body.name;
  pusher.trigger( 'lunchapp-development', 'my-event', {   "message": message  });
  res.sendStatus(200);
});

app.get('/friends',function(req,res){
      res.sendFile('/public/search.html', {root: __dirname });
});

app.use(express.static(__dirname + '/public'));

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;