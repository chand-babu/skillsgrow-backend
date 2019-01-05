var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var companySchemaObj = {};
var collections = {};

collections.COMPANY = 'company';
collections.INTERNSHIP = 'internship';

var company = new Schema({
	firstname: String,
	lastname: String,
	email: String,
	contact: String,
	companyName: String,
    companyUrl: String,
    companyDescription: String,
    companyLogo: String,
	createdOn: { type: Date, default: Date.now },
	status: Number
}, { versionKey: false });

var internship = new Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'company'},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category'},
    jobRole: String,
    dateOfJoining: Date,
    location: String,
    qualification: String,
    salary: Number,
    internType: String,
    contactPersonNo: String,
    contactPersonEmail: String,
    jobDescription: String,
    createdOn: { type: Date, default: Date.now },
	status: Number
}, { versionKey: false }); 

companySchemaObj.company = mongoose.model('company', company, collections.COMPANY);
companySchemaObj.internship = mongoose.model('internship', internship, collections.INTERNSHIP);

module.exports = companySchemaObj;