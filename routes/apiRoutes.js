var express = require("express");
var app = express.Router();
var db = require("../models");

//User's lunches
app.get("/user/:id", function (req, res) {
  db.Lunch.findAll({
    where: {
      userID: req.params.id
    },
  }).then(function (dbLunches) {
    res.json(dbLunches);
  }).catch(function (err) {
    throw err;
  });
});

//Add lunche
app.post("/user", function (req, res) {
  db.Lunch.create(req.body)
    .then(function (dbLunches) {
      res.json(dbLunches);
    }).catch(function (err) {
      throw err;
    });
});

//Delete lunche
app.delete("/user/:id", function (req, res) {
  db.Lunch.destroy({
    where: { id: req.params.id }
  })
    .then(function (dbLunches) {
      res.json(dbLunches);
    }).catch(function (err) {
      throw err;
    });
});

//All tradable lunches
app.get("/lunch", function (req, res) {
  db.Lunch.findAll({})
    .then(function (dbLunches) {
      res.json(dbLunches);
    }).catch(function (err) {
      throw err;
    });
});

//Search lunches
app.get("/lunch/:food", function (req, res) {
  db.Lunch.findAll({
    where: { lunch: req.params.food }
  })
    .then(function (dbLunches) {
      res.json(dbLunches);
    }).catch(function (err) {
      throw err;
    });
});

app.put("/lunch", function (req, res) {
  db.Lunch.update(
    req.body,
    {
      where: {
        id: req.body.id
      }
    }).then(function (dbLunches) {
      res.json(dbLunches);
    }).catch(function (err) {
      throw err;;
    });
});

//Get food
app.get("/food/:id", function (req, res) {
  db.Lunch.findOne({
    where: { id: req.params.id }
  })
    .then(function (dbLunches) {
      res.json(dbLunches);
    }).catch(function (err) {
      throw err;
    });
});

module.exports = app;