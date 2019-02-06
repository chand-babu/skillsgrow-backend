var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var companySchemaObj = {};
var collections = {};

collections.COMPANY = 'company';
collections.INTERNSHIP = 'internship';
collections.APPLY_INTERNSHIP = 'apply_internship';

var company = new Schema({
	firstname: String,
    lastname: String,
    password: String,
	email: String,
	contact: String,
	companyName: String,
    companyUrl: String,
    companyDescription: String,
    companyLogo: String,
    token: String,
    active: Boolean,
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
    users : [{ type: String }],
    createdOn: { type: Date, default: Date.now },
	status: Number
}, { versionKey: false, usePushEach: true }); 

var apply_internship = new Schema({
    companyId : { type: mongoose.Schema.Types.ObjectId, ref: 'company'},
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category'},
    resume : String,
    internshipId : { type: mongoose.Schema.Types.ObjectId, ref: 'internship'},
    userId : { type: mongoose.Schema.Types.ObjectId, ref: 'register'},
    createdOn: { type: Date, default: Date.now },
	status: Number
}, { versionKey: false }); 

companySchemaObj.company = mongoose.model('company', company, collections.COMPANY);
companySchemaObj.internship = mongoose.model('internship', internship, collections.INTERNSHIP);
companySchemaObj.apply_internship = mongoose.model('apply_internship', apply_internship, collections.APPLY_INTERNSHIP);

module.exports = companySchemaObj;