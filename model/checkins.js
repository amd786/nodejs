var mongoose = require('mongoose');  
/*var blobSchema = new mongoose.Schema({  
  name: String,
  badge: Number,
  dob: { type: Date, default: Date.now },
  isloved: Boolean
});
mongoose.model('Blob', blobSchema);
*/
var CheckinSchema = new mongoose.Schema({
  username: String,
  location: String,
  date: Date
});

mongoose.model('Checkin', CheckinSchema);