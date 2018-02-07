var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST
require("../model/checkins");
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

router.get('/create', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // Create a new message model, fill it up and save it to Mongodb
  if(req.query.username && req.query.location){
	/*  var CheckinObj = new Checkin({ username: req.query.username, location:req.query.location, date: new Date() });
	  CheckinObj.save(function () {
				  Checkin.find({$or:[{username:req.query.username},{username:req.query.location}]}).sort('date').exec(function (arr,data) {
					//console.log(data);
					res.send(data);
				  });
		});
	}else{
		res.send({"response":"failed"});
	}*/
		mongoose.model('Checkin').create({
				username : req.query.username,
				location : req.query.location,
				date : new Date()
			}, function (err, blob) {
				if (err) {
					  res.send("There was a problem adding the information to the database.");
				  } else {
					  //Blob has been created
					  console.log('POST creating new blob: ' + blob);
					  res.format({
						
						json: function(){
							res.json(blob);
						}
					});
				  }
		});
	}else{
		res.send({"response":"failed"});
	}
});

router.get('/', function(req, res) {
	// Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to server our response to any origin
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // .find() without any arguments, will return all results
  // the `-1` in .sort() means descending order
  mongoose.model('Checkin').find().sort('date').exec(function (arr,data) {
    //console.log(data);
	res.send(data);
  });
});

module.exports = router;