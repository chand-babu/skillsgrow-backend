/* 
	* token key using for genarate and check token
*/
var mongoose = require('mongoose');
global.tokenKey = "skillsgrow@123";

dbchange = (value) => {
	// mongoose.connection.close();
	var dbname = ''; 
	// console.log(value);
	if (!value) {
		dbname = 'skillsgrow';
		// dbname = 'skillsgrow_server';
	} else {
		dbname = 'skillsgrow_dev';
	}
	var dbset = {
		MONGO_CONNECT_URL:'mongodb://localhost:27017/'+dbname,
		// MONGO_CONNECT_URL: 'mongodb://srikumar:@localhost:27017/' + dbname,
		MONGO_CLIENT : { 
			useMongoClient: true 
		},
		ERROR_FUN: function(err){
			(err) ? console.log(err):console.log("connected");
		}
	}
	console.log(dbset.MONGO_CONNECT_URL);
	
	return mongoose.connect(dbset.MONGO_CONNECT_URL,dbset.MONGO_CLIENT,dbset.ERROR_FUN);
}

module.exports = dbchange;