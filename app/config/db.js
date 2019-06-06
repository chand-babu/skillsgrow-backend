/* 
 * token key using for genarate and check token
 */
const mongoose = require('mongoose');
global.tokenKey = "skillsgrow@123";
var dbname = 'skillsgrow';
// var dbname = 'skillsgrow_server';


var dbset = {
	MONGO_CONNECT_URL: 'mongodb://localhost:27017/' + dbname,
	MONGO_CLIENT: {
		useMongoClient: true,
		keepAlive: true,
		// poolSize: 100
	}
}

mongoose.Promise = global.Promise;
mongoose.connect(dbset.MONGO_CONNECT_URL, {
	useMongoClient: true
}, function (err) {
	if (err) {
		console.error('Could not connect to MongoDB!');
		console.log('===================',err);
	} else {
		console.log("MongoDB: Connected to skillsgrow DB !");
	}
});


dbchange = (value) => {
	var dbname = '';
	if (!value) {
		dbname = 'skillsgrow';
	} else {
		dbname = 'skillsgrow_dev';
	}

	return mongoose.connections[0];
}


module.exports = dbchange;