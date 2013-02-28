
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

var MongoClient = require('mongodb').MongoClient, db;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
	
	// Connect to the db
	MongoClient.connect("mongodb://localhost:27017/twitter", function(err, db) {
	  if(!err) {
      this.db = db;
	    console.log("We are connected");
	  }
	});
	
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  this.db.collection('tweets', function(error, collection) {
    collection.find({}).toArray(function(error, tweets) {
      	res.render('index', {tweets: tweets});
    });
  });
});

app.get('/tweet', function(req, res) {
	res.render('tweet');
});

app.post('/submit', function(req, res) {
	this.db.collection('tweets', function(error, collection) {
	  collection.insert(req.body, function(error) {
	    if(error) res.send("Not submitted");
      else res.send("Submitted!");
	  });
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
