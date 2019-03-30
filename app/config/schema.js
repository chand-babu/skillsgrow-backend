var mongoose = require('mongoose');
var integerValidator = require('mongoose-integer');

var schemaObj = {};
var collections = {}

/* All collection names */
collections.TOKEN = 'tokenSession';
collections.ADMIN = 'administrator';
collections.CATEGORY = 'category';
collections.COURSE = 'course';
collections.UPDATED_COURSE = 'updatedCourse';
collections.CHAPTER = 'chapter';
collections.TOPIC = 'topic';
collections.LEARNING = 'learning';

/* Created by chand */
collections.FORUM_DISCUSSION = 'forumDiscussion';
collections.ROLLS_PERMISSIONS = 'rollsPermissions';

/* Created by nandita */
collections.ENROLLED_USER = 'enrolledUser';
collections.COURSE_REVIEW = 'courseReview';
collections.AUTHOR_DETAILS = 'authorDetails';
collections.TIMELINE = 'timeline';
collections.TOPICS = 'topics';
collections.QUESTIONS = 'questions';

/* Fronted collections */
collections.REGISTER = 'register';
collections.BANNERIMAGES = 'bannerImages';
collections.CONTACTUS = 'contactus';
collections.CONTACTENTERPRISETEAM = 'contactEnterpriseTeam';
collections.ASKQUESTION = 'askQuestion';
collections.PUBLISHSKILLSGROWSCHEME = 'publishSkillsgrowScheme';
collections.PAYURESPONSESCHEME = 'payuResponseScheme';

var Schema = mongoose.Schema;

/* 
	# Schema is a structure of collections(table) 
	# to store and retrive the data
*/
var administrator = new Schema({
	username: {
		type: String,
		required: true
	},
	emailId: {
		type: String,
		index: {
			unique: true
		},
		required: true
	},
	phone: String,
	image: String,
	password: String,
	rollsPermission: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'rollsPermissions'
	}],
	createdOn: {
		type: Date,
		default: Date.now
	},
	status: Number // 0-admin 1-subadmin default -1
}, {
	versionKey: false
})

var token = new Schema({
	tokenId: String,
	userId: {
		type: String,
		required: true
	},
	ip: {
		type: String,
		required: true
	},
	browser: {
		type: String,
		required: true
	},
	userType: Number,
	createdOn: {
		type: Date,
		default: Date.now
	},
	status: Number
}, {
	versionKey: false
});

var category = new Schema({
	categoryName: {
		type: String,
		trim: true,
		index: {
			unique: true
		},
		required: true
	},
	categoryImg: {
		type: String,
		required: true
	},
	categoryType: {
		type: Number
	},
	createdBy: {
		type: String
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	course: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'course'
	}],
	status: {
		type: Number,
		required: true,
		integer: true
	} //default -0
}, {
	versionKey: false,
	usePushEach: true
});
category.plugin(integerValidator);

var course = new Schema({
	authorDetails: [],
	discussionForums: [],
	boostText: String,
	faq: [],
	categoryId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'category'
	},
	courseName: {
		type: String,
		required: true,
		trim: true,
		index: {
			unique: true
		}
	},
	description: String,
	shortDescription: String,
	courseKeywords: String,
	imageLarge: String,
	imageSmall: String,
	video: String,
	createdBy: {
		type: String
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	// timeline: [],
	timeline: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'timeline'
	}], //modified by nandita
	// enrolledUser: [],
	enrolledUser: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'enrolledUser'
	}], //modified by nandita
	// courseReview: [],
	courseReview: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'courseReview'
	}], //modified by nandita
	active: Boolean,
	viewTrending: Boolean,
	status: {
		type: Number,
		required: true,
		integer: true
	} //0-skillsgrow courses, 1-skillsgrow internship,
}, {
	versionKey: false,
	usePushEach: true
});
course.plugin(integerValidator);

var updatedCourse = new Schema({
	courseId: {
		type: String,
		required: true
	},
	courseName:{
		type: String,
		trim: true
	},
	description: String,
	shortDescription: String,
	imageLarge: String,
	imageSmall: String,
	video: String,
	updatedBy: {
		type: String
	},
	createdOn: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

var chapter = new Schema({
	categoryId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'category'
	},
	courseId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'course'
	},
	chapterName: {
		type: String,
		required: true,
		trim: true
	},
	order: {
		type: Number
	},
	description: {
		type: String
	},
	createdBy: {
		type: String
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	status: {
		type: Number,
		required: true,
		integer: true
	} //default -0
}, {
	versionKey: false
});
chapter.plugin(integerValidator);

var topic = new Schema({
	categoryId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'category'
	},
	courseId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'course'
	},
	chapterId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'chapter'
	},
	topicName: {
		type: String,
		required: true,
		trim: true
	},
	order: {
		type: Number
	},
	description: {
		type: String
	},
	createdBy: {
		type: String
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	status: {
		type: Number,
		required: true,
		integer: true
	} //default -0
}, {
	versionKey: false
});
topic.plugin(integerValidator);

var learning = new Schema({
	learning_id: {
		type: mongoose.Schema.Types.ObjectId
	},
	categoryId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'category'
	},
	courseId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'course'
	},
	chapterId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'chapter'
	},
	topicId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'topic'
	},
	title: {
		type: String,
		required: true
	},
	image: {
		type: String
	},
	video: {
		type: String
	},
	content: {
		type: String
	},
	createdBy: {
		type: String
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	status: {
		type: Number,
		required: true,
		integer: true
	} //default -0
}, {
	versionKey: false
});
topic.plugin(integerValidator);

/* schema for frontend */
var register = new Schema({
	profilePic: String,
	userName: {
		type: String,
		required: true,
		trim: true
	},
	emailId: {
		type: String,
		index: {
			unique: true
		},
		required: true
	},
	loginStatus: Number, // 0-first-time-login, 1-multople-login
	wallet: Number,
	discountUsers: [],
	referId: String,
	phone: String,
	password: String,
	address: String,
	gender: String,
	collegeName: {
		type: String,
		trim: true
	},
	collegeId: String,
	courseEnrolled: [],
	createdOn: {
		type: Date,
		default: Date.now
	},
	status: Number, // 0-learner, 1-institute, 2-author, 3-SSP
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	active: {
		type: Boolean,
		required: true,
		default: false
	},
	temporaryToken: {
		type: String,
		required: true
	}
}, {
	versionKey: false
});

var bannerImages = new Schema({
	image: {
		type: String
	},
	imageTitle: {
		type: String
	},
	description: {
		type: String
	},
	link: {
		type: String
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	status: Number // 0-active, 1-inactive
}, {
	versionKey: false
});

var contactus = new Schema({
	name: {
		type: String
	},
	emailId: {
		type: String,
		required: true
	},
	phone: {
		type: String
	},
	subject: {
		type: String
	},
	message: {
		type: String
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	status: Number // 0-active, 1-inactive
}, {
	versionKey: false
});

var contactEnterpriseTeam = new Schema({
	name: {
		type: String
	},
	emailId: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String
	},
	companyName: {
		type: String,
		trim: true
	},
	phoneNumbercode: {
		type: String
	},
	query: {
		type: String
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	status: Number // 0-active, 1-inactive
}, {
	versionKey: false
});

var askQuestion = new Schema({
	name: {
		type: String
	},
	emailId: {
		type: String,
		required: true
	},
	question: {
		type: String
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	status: Number // 0-active, 1-inactive
}, {
	versionKey: false
});

var publishSkillsgrowScheme = new Schema({
	name: {
		type: String
	},
	emailId: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String
	},
	areaExpertise: {
		type: String
	},
	phoneNumbercode: {
		type: String
	},
	message: {
		type: String
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	status: Number // 0-active, 1-inactive
}, {
	versionKey: false
});

var payuResponseScheme = new Schema({
	txnStatus: {
		type: String
	},
	mode: {
		type: String
	},
	udf1: {
		type: String
	},
	udf2: {
		type: String
	},
	txnMessage: {
		type: String
	},
	postBackParamId: {
		type: String
	},
	mihpayid: {
		type: String
	},
	paymentId: {
		type: String
	},
	status: {
		type: String
	},
	unmappedstatus: {
		type: String
	},
	key: {
		type: String
	},
	txnid: {
		type: String
	},
	amount: {
		type: String
	},
	addedon: {
		type: String
	},
	createdOn: {
		type: String
	},
	productinfo: {
		type: String
	},
	firstname: {
		type: String
	},
	email: {
		type: String
	},
	phone: {
		type: String
	},
	hash: {
		type: String
	},
	field9: {
		type: String
	},
	PG_TYPE: {
		type: String
	},
	bank_ref_num: {
		type: String
	},
	bankcode: {
		type: String
	},
	error: {
		type: String
	},
	error_Message: {
		type: String
	},
	postUrl: {
		type: String
	},
	calledStatus: Boolean,
	additional_param: {
		type: String
	},
	amount_split: {
		type: String
	},
	paisa_mecode: {
		type: String
	},
	meCode: {
		type: String
	},
	payuMoneyId: {
		type: String
	},
}, {
	versionKey: false
});

//created by chand
var forumDiscussion = new Schema({
	courseId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'course'
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'register'
	},
	userName: String,
	chatMessage: String,
	replyMessage: [{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'register'
		},
		userName: String,
		replyMessage: String,
		createdOn: {
			type: Date
		}
	}],
	createdOn: {
		type: Date
	}
}, {
	versionKey: false,
	usePushEach: true
});

var rollsPermissions = new Schema({
	title: String,
	permissions: [],
	createdOn: {
		type: Date,
		default: Date.now
	},
	status: Number
}, {
	versionKey: false,
	usePushEach: true
});

//Created by nandita
var enrolledUser = new Schema({
	courseId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'course'
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'register'
	},
	enrolledOn: {
		type: Date
	}
}, {
	versionKey: false,
	usePushEach: true
});

var courseReview = new Schema({
	courseId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'course'
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'register'
	},
	status: Number,
	rating: Number,
	comment: String,
	createdOn: {
		type: Date
	}
}, {
	versionKey: false,
	usePushEach: true
});

var authorDetails = new Schema({
	courseId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'course'
	},
	certificatePrice: String,
	coursePrice: String,
	authorBiography: String,
	authorPhone: String,
	authorEmail: String,
	authorName: String

}, {
	versionKey: false,
	usePushEach: true
});

var timeline = new Schema({
	title: String,
	// topics:[],
	topics: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'topics'
	}],
	order: Number
}, {
	versionKey: false,
	usePushEach: true
});

var topics = new Schema({
	subTopics: String,
	description: String,
	timing: Number,
	order: Number,
	// questions:[]
	questions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'questions'
	}]
}, {
	versionKey: false,
	usePushEach: true
});

var questions = new Schema({
	id: Number,
	question: mongoose.Schema.Types.Mixed,
	answer: String,
	options: [],
	questionStatus: String,
	instruction: String,
	timing: String,
	imageQuestion: String,
	passageTitle: String,
	passage: String
}, {
	versionKey: false,
	usePushEach: true
});


/* 
	# Created model for schema to access database
*/
schemaObj.token = mongoose.model('token', token, collections.TOKEN);
schemaObj.admin = mongoose.model('admin', administrator, collections.ADMIN);
schemaObj.category = mongoose.model('category', category, collections.CATEGORY);
schemaObj.course = mongoose.model('course', course, collections.COURSE);
schemaObj.updatedCourse = mongoose.model('updatedCourse', updatedCourse, collections.UPDATED_COURSE);
schemaObj.chapter = mongoose.model('chapter', chapter, collections.CHAPTER);
schemaObj.topic = mongoose.model('topic', topic, collections.TOPIC);
schemaObj.learning = mongoose.model('learning', learning, collections.LEARNING);
schemaObj.forumDiscussion = mongoose.model('forumDiscussion', forumDiscussion, collections.FORUM_DISCUSSION);
schemaObj.enrolledUser = mongoose.model('enrolledUser', enrolledUser, collections.ENROLLED_USER);
schemaObj.courseReview = mongoose.model('courseReview', courseReview, collections.COURSE_REVIEW);
schemaObj.authorDetails = mongoose.model('authorDetails', authorDetails, collections.AUTHOR_DETAILS);
schemaObj.timeline = mongoose.model('timeline', timeline, collections.TIMELINE);
schemaObj.topics = mongoose.model('topics', topics, collections.TOPICS);
schemaObj.questions = mongoose.model('questions', questions, collections.QUESTIONS);
schemaObj.register = mongoose.model('register', register, collections.REGISTER);
schemaObj.bannerImages = mongoose.model('bannerImages', bannerImages, collections.BANNERIMAGES);
schemaObj.contactus = mongoose.model('contactus', contactus, collections.CONTACTUS);
schemaObj.contactEnterpriseTeam = mongoose.model('contactEnterpriseTeam', contactEnterpriseTeam, collections.CONTACTENTERPRISETEAM);
schemaObj.askQuestion = mongoose.model('askQuestion', askQuestion, collections.ASKQUESTION);
schemaObj.publishSkillsgrowScheme = mongoose.model('publishSkillsgrowScheme', publishSkillsgrowScheme, collections.PUBLISHSKILLSGROWSCHEME);
schemaObj.payuResponseScheme = mongoose.model('payuResponseScheme', payuResponseScheme, collections.PAYURESPONSESCHEME);
schemaObj.rollsPermissions = mongoose.model('rollsPermissions', rollsPermissions, collections.ROLLS_PERMISSIONS);
module.exports = schemaObj;

// testkey - chandbabu123
// Shell access skillsgrow
// The key “testkey.pub” has been authorized.