var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('results.db');

// open the database for reading if file exists
// create new database file if not

function addToDB(photo, result) {
  db.serialize(function() {
    db.run("CREATE TABLE results (photo INTEGER, result INTEGER)");
   
    var stmt = db.prepare("INSERT INTO results VALUES (?)");
    stmt.run(photo + ',' + result);
    stmt.finalize();
  });
  db.close();
}

function getFromDB() {
  db.each("SELECT * AS photo, result FROM results", function(err, row) {
    console.log(row.photo + ": " + row.result);
  });
  db.close();
}

app.post('add/', function(req, res) {
  addToDB(req.query.photo, req.query.result);
});

app.post('get/', function(req,res) {
  var results = getFromDB();
  res.redirect('graphs/');
})

var server = app.listen(8080, function () {
  var port = server.address().port;
  console.log("Listening on", port);
});