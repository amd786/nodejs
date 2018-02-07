var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./model/db');
var Checkin = require('./model/checkins');

var routes = require('./routes');
var users = require('./routes/user');
var checkins = require('./routes/checkins');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', routes.index);
app.get('/users', users.list);
app.use('/checkins', checkins);
// Set up our routes and start the server
//app.get('/checkins', getCheckins);
//app.get('/checkin', postCheckin);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

function getCheckins(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to server our response to any origin
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // .find() without any arguments, will return all results
  // the `-1` in .sort() means descending order
  Checkin.find().sort('date').exec(function (arr,data) {
    //console.log(data);
	res.send(data);
  });
}



function postCheckin(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // Create a new message model, fill it up and save it to Mongodb
  if(req.query.username && req.query.location){
	  var CheckinObj = new Checkin({ username: req.query.username, location:req.query.location, date: new Date() });
	  CheckinObj.save(function () {
				  Checkin.find({$or:[{username:req.query.username},{username:req.query.location}]}).sort('date').exec(function (arr,data) {
					//console.log(data);
					res.send(data);
				  });
		});
	}else{
		res.send({"response":"failed"});
	}
}

app.set('port', process.env.PORT || 5050);
module.exports = app;
