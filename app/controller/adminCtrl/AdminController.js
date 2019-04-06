//var express = require("express");
var mongoose = require('mongoose');
var AdminModule = require("../../model/adminMdl/AdminModel");
var base = require("../baseController");
var jwt = require('jsonwebtoken');
var db = require('../../config/db');
var mongo = require("../../config/schema");
var url = 'https://skillsgrow.com/'; /* 'https://skillsgrow.com/' */
var express = require("express");
//var sharp = require('sharp');
var emailExistence = require('email-existence');
/* plugin for forgot password */
var session = require('express-session')
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var crypto = require('crypto');
const fs = require('fs');
let self;
let model = new AdminModule();


/* smtp config */
var smtpTransport = nodemailer.createTransport({
	host: 'smtp.zoho.in',
	port: 465,
	secure: 'true',
	auth: {
		user: 'admin@skillsgrow.com', // 'shrikumar01@gmail.com',//'!!! YOUR SENDGRID USERNAME !!!',
		pass: '$killsgrow123' // 'enter$2020'//'!!! YOUR SENDGRID PASSWORD !!!'
	}
});

let quickemailverification = require('quickemailverification').client('1b612ed679085008364e754a06e817ea11e7e2c951f2fe6cdd8e6861a830').quickemailverification();

var controller = {};
var result = {};

class AdminController {
	constructor() {
		this.admin = new AdminModule();
		self = this;
	}

	uploadFile(req, res) {
		base.upload(req, res, function (err) {
			if (!req.result) {
				result = {
					"result": req.result,
					"message": req.imageError
				}
				return res.send(result);
			}

			if (err) {
				res.send({
					result: 'fail',
					error: {
						code: 1001,
						message: 'File is too big'
					}
				});
			} else {
				res.send({
					"result": true,
					"filename": req.file.filename,
					"message": "File uploaded"
				});
			}
		});
	}

	uploadResume(req, res) {
		base.uploadResume(req, res, function (err) {
			if (!req.result) {
				result = {
					"result": req.result,
					"message": req.imageError
				}
				return res.send(result);
			}

			if (err) {
				res.send({
					result: 'fail',
					error: {
						code: 1001,
						message: 'File is too big'
					}
				});
			} else {
				res.send({
					"result": true,
					"filename": req.file.filename,
					"message": "File uploaded"
				});
			}
		});
	}

	addAdministrator(req, res) {
		var pwd = base.hashPassword(req.body.password);
		var data = {
			"username": req.body.username,
			"password": pwd,
			"emailId": req.body.emailId,
			"phone": req.body.phone,
			"rollsPermission": req.body.rollsPermission,
			"status": 1,
		}
		this.admin.addAdministrator(data, res)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}

			}, (reject) => {
				res.send(reject);
			});
	}

	updateAdministrator(req, res) {
		var data = {
			"id": req.body._id,
			"username": req.body.username,
			"emailId": req.body.emailId,
			"phone": req.body.phone,
			"rollsPermission": req.body.rollsPermission,
			"status": req.body.status
		}
		this.admin.updateAdministrator(data, res)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}

			}, (reject) => {
				res.send(reject);
			});
	}

	adminLogin(req, res) {

		var data = {
			"emailId": req.body.emailId,
			"password": req.body.password
		}

		this.admin.adminLogin(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject);
			});
	}

	adminChangePwd(req, res) {
		var data = {
			"id": req.body.id,
			"pwd": req.body.pwd,
			"newpwd": req.body.newpwd
		}
		this.admin.adminChangePwd(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject);
			});
	}

	frontendLogin(req, res) {

		var data = {
			"emailId": req.body.emailId,
			"password": req.body.password
		}

		this.admin.webLogin(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject);
			});
	}

	adminList(req, res) {
		this.admin.adminList()
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}

			}, (reject) => {
				res.send(reject);
			});
	}

	adminGet(req, res) {
		let id = req.params.id;
		this.admin.adminGet(id)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}

			}, (reject) => {
				res.send(reject);
			});
	}

	adminDelete(req, res) {
		let id = req.params.id;
		this.admin.adminDelete(id)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}

			}, (reject) => {
				res.send(reject);
			});
	}

	adminToken(req, res) {

		var data = {
			"tokenId": base.uniqueCode("TKN"),
			"userId": req.body.userId,
			"ip": req.body.ip,
			"browser": req.body.browser,
			"userType": req.body.userType,
			"status": 0
		}

		this.admin.checkToken(data)
			.then((response) => {
				if (response.result) {
					console.log(response);
					if (response.data.length == 0) {
						//create a token
						var token = jwt.sign(data, tokenKey);
						if (token != "") {
							this.admin.adminToken(data)
								.then((response) => {
									var tokenResult = (response.result) ? {
										result: true,
										token: token
									} : {
										result: false,
										token: "Something Went wrong"
									};
									res.send(tokenResult);
								}, (reject) => {
									res.send(reject);
								});
							//console.log(response);
						}
					} else {
						res.send(response);
					}
				} else {
					res.send(response);
				}

			}, (reject) => {
				res.send(reject)
			});
	}

	removeTokenDetails(id, req, res) {
		this.admin.removeTokenDetails(id)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	tokenAuth(req, res, next) {
		var token = req.headers['x-access-token'];
		//console.log(req)
		if (!token) return res.status(401).send({
			result: false,
			message: 'No token provided.'
		});

		jwt.verify(token, tokenKey, (err, decoded) => {
			//console.log(err);
			if (err) {
				return res.status(500).send({
					result: false,
					message: 'Failed to authenticate token.'
				});
			} else {
				next();
			}
		});
	}

	productionOrDevelopment(req, res, next) {
		if (req.headers['production-mode'] === 'true') {
			db(true)
		} else {
			db(false)
		}
		// mongoose.connect(db.MONGO_CONNECT_URL,db.MONGO_CLIENT,db.ERROR_FUN);
		next();
	}

	addCategory(req, res) {
		var data = {
			'categoryName': req.body.categoryName,
			'categoryImg': req.body.categoryImg,
			'categoryType': req.body.categoryType,
			'createdBy': req.body.createdBy,
			'status': req.body.status
		};

		this.admin.addCategory(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	updateCategory(req, res) {
		var data = {
			'id': req.body.id,
			'categoryName': req.body.categoryName,
			'categoryType': req.body.categoryType,
			'categoryImg': req.body.categoryImg,
			'status': req.body.status
		};

		this.admin.updateCategory(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	changeCategoryType(req, res) {
		var data = {
			id: req.body.id,
			categoryType: req.body.categoryType
		};

		this.admin.changeCategoryType(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	listCategories(req, res) {
		this.admin.listCategories()
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	listCategoryType(req, res) {
		let status = req.params.value;
		this.admin.listCategoryType(status)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	listCategoriesBycourse(req, res) {
		let id = req.params.id;
		this.admin.listCategoriesBycourse(id)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	getCategory(req, res) {
		var catId = req.params.catid;
		this.admin.getCategory(catId)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	deleteCategory(req, res) {
		var catId = req.params.catid;
		this.admin.deleteCategory(catId)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	addCourse(req, res) {
		var data = {
			'authorDetails': req.body.authorDetails,
			'boostText': req.body.boostText,
			'categoryId': req.body.categoryId,
			'courseName': req.body.courseName,
			'description': req.body.description,
			'shortDescription': req.body.shortDescription,
			'courseKeywords': req.body.courseKeywords,
			'imageLarge': req.body.imageLarge,
			'imageSmall': req.body.imageSmall,
			'video': req.body.video,
			'timeline': req.body.timeline,
			'createdBy': req.body.createdBy,
			'status': req.body.status,
		};

		this.admin.addCourse(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	updateCourse(req, res) {
		var data = {
			'courseId': req.body.courseId,
			'courseName': req.body.courseName,
			'description': req.body.description,
			'shortDescription': req.body.shortDescription,
			'imageLarge': req.body.imageLarge,
			'imageSmall': req.body.imageSmall,
			'video': req.body.video,
			'status': req.body.status
		};

		this.admin.updateCourse(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	listCourse(req, res) {
		this.admin.listCourse()
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject);
			});
	}

	getAllCourse(req, res) {
		this.admin.getAllCourse()
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	getCategoryCourseList(req, res) {
		this.admin.getCategoryCourseList(req)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}


	getCategoryCourseListByName(req, res) {
		this.admin.getCategoryCourseListByName(req)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	deleteCourse(req, res) {
		var courseId = req.params.courseid;
		this.admin.deleteCourse(courseId)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	addUpdatedCourse(req, res) {
		var data = {
			'courseId': req.body.courseId,
			'courseName': req.body.courseName,
			'description': req.body.description,
			'shortDescription': req.body.shortDescription,
			'imageLarge': req.body.imageLarge,
			'imageSmall': req.body.imageSmall,
			'video': req.body.video,
			'updatedBy': req.body.updatedBy
		};
		//console.log(data);
		this.admin.addUpdatedCourse(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	addChapter(req, res) {
		var data = {
			'categoryId': req.body.categoryId,
			'courseId': req.body.courseId,
			'chapterName': req.body.chapterName,
			'order': req.body.order,
			'description': req.body.description,
			'createdBy': req.body.createdBy,
			'status': req.body.status
		};

		this.admin.addChapter(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	listChapter(req, res) {
		this.admin.listChapter()
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	getChapter(req, res) {
		var chapterId = req.params.chapter_id;
		this.admin.getChapter(chapterId)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	deleteChapter(req, res) {
		var chapterId = req.params.chapter_id;
		this.admin.deleteChapter(chapterId)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	updateChapter(req, res) {
		var data = {
			'chapterId': req.body.chapterId,
			'chapterName': req.body.chapterName,
			'order': req.body.order,
			'description': req.body.description,
			'status': req.body.status
		};

		this.admin.updateChapter(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	addTopic(req, res) {
		var data = {
			'categoryId': req.body.categoryId,
			'courseId': req.body.courseId,
			'chapterId': req.body.chapterId,
			'topicName': req.body.topicName,
			'order': req.body.order,
			'description': req.body.description,
			'createdBy': req.body.createdBy,
			'status': req.body.status
		};

		this.admin.addTopic(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	updateTopic(req, res) {
		var data = {
			'topicId': req.body.topicId,
			'topicName': req.body.topicName,
			'order': req.body.order,
			'description': req.body.description,
			'status': req.body.status
		};

		this.admin.updateTopic(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	listTopic(req, res) {
		this.admin.listTopic()
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	getTopic(req, res) {
		var topicId = req.params.topic_id;
		this.admin.getTopic(topicId)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	deleteTopic(req, res) {
		var topicId = req.params.topic_id;
		this.admin.deleteTopic(topicId)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	addLearning(req, res) {
		var data = {
			"categoryId": req.body.categoryId,
			"courseId": req.body.courseId,
			"chapterId": req.body.chapterId,
			"topicId": req.body.topicId,
			"title": req.body.title,
			"image": req.body.image,
			"video": req.body.video,
			"content": req.body.content,
			"createdBy": req.body.createdBy,
			"status": req.body.status
		};

		this.admin.addLearning(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	listLearning(req, res) {
		this.admin.listLearning()
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	getLearning(req, res) {
		var learningId = req.params.learning_id;
		this.admin.getLearning(learningId)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	deleteLearning(req, res) {
		var learningId = req.params.learning_id;
		this.admin.deleteLearning(learningId)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	updateLearning(req, res) {
		var data = {
			"learningId": req.body.learningId,
			"title": req.body.title,
			"image": req.body.image,
			"video": req.body.video,
			"content": req.body.content,
			"status": req.body.status
		};

		this.admin.updateLearning(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	webRegister(req, res) {
		var pwd = base.hashPassword(req.body.password);
		var temptoken = jwt.sign({
			userName: req.body.userName,
			emailId: req.body.emailId
		}, tokenKey, {
			expiresIn: '24h'
		});
		var data = {
			"profilePic": req.body.profilePic,
			"userName": req.body.userName,
			"emailId": req.body.emailId,
			"phone": req.body.phone,
			"password": pwd,
			"status": req.body.status,
			"createdOn": req.body.createdOn,
			"temporaryToken": temptoken,
			"referId": req.body.referId
		};
		quickemailverification.verify(req.body.emailId, function (err, response) {
			console.log("Email id:", req.body.emailId, 'res:', response.body.result);
			if (response.body.result == 'valid') {
				model.frontendRegister(data)
					.then((response) => {
						if (response.result) {
							var mailOptions = {
								to: req.body.emailId,
								from: 'admin@skillsgrow.com',
								subject: 'Account Activation Link',
								text: 'Click on this to link to activate your account .\n\n' +
									url + 'activate/' + temptoken,
								html: 'Click on this to link to activate your account . </br>' +
									'<a href="' + url + 'activate/' + temptoken + '">' + url + 'activate/</a>'
							};
							smtpTransport.sendMail(mailOptions, function (err, info) {
								if (err) {
									console.log(err);
								}
							});
							res.send(response);
						} else {
							res.send(response);
						}
					}, (reject) => {
						res.send(reject)
					});
			} else {
				res.json({
					result: false,
					message: 'Please given a valid Mail Id'
				});
			}
		});
	}

	validEmailCheck(emailId) {
		quickemailverification.verify(emailId, function (err, response) {
			if (response.body.result == 'valid') {} else {
				res.json({
					result: true,
					message: 'Please given a valid Mail Id'
				});
			}
		});
	}

	storeBannerImages(req, res) {
		var data = {
			"image": req.body.image,
			"imageTitle": req.body.imageTitle,
			"description": req.body.description,
			"link": req.body.link,
			"status": req.body.status,
			"createdOn": req.body.createdOn
		};

		this.admin.frontendBannerImages(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
				mongoose.disconnect();
			}, (reject) => {
				res.send(reject);
				mongoose.disconnect();
			});
	}

	deleteBannerImages(req, res) {
		let id = req.params.id;
		this.admin.deleteBannerImages(id)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
				mongoose.disconnect();
			}, (reject) => {
				res.send(reject);
				mongoose.disconnect();
			});
	}

	getBannerImages(req, res) {
		let id = req.params.id;
		this.admin.getBannerImages(id)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
				mongoose.disconnect();
			}, (reject) => {
				res.send(reject);
				mongoose.disconnect();
			});
	}

	listBannerImages(req, res) {
		this.admin.listBannerImages()
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
				mongoose.disconnect();
			}, (reject) => {
				res.send(reject);
				mongoose.disconnect();
			});
	}

	updateBannerImages(req, res) {
		var data = {
			'id': req.body.id,
			'status': req.body.status
		};

		this.admin.updateBannerImages(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	updateBannerImagesDetails(req, res) {
		var data = {
			'id': req.body.id,
			'imageTitle': req.body.imageTitle,
			'image': req.body.image,
			'description': req.body.description,
			'link': req.body.link,
			'status': 0
		};

		this.admin.updateBannerImagesDetails(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}



	againResetPassword(req, res) {
		var token;
		async.waterfall([
			function (done) {
				crypto.randomBytes(20, function (err, buf) {
					token = buf.toString('hex');
				});
			},
			mongo.register.findOne({
				emailId: req.body.emailId
			}).select().exec(function (err, user) {
				if (err) throw err;
				if (!user) {
					res.json({
						resullt: false,
						message: 'email is not found',
						reason: 'not found',
					});
				} else if (!user.active) {
					res.json({
						result: false,
						message: 'Account yet not activated !',
						reason: 'activate err',
					});
				} else {
					quickemailverification.verify(req.body.emailId, function (err, response) {
						console.log("Forget Email id:", req.body.emailId, 'res:', response.body.result)
						if (response.body.result == 'valid') {
							user.resetPasswordToken = token;
							user.save(function (err) {
								if (err) {
									res.json({
										result: false,
										message: err,
										reason: 'Token save issue',
									});
								} else {
									var mailOptions = {
										to: user.emailId,
										from: 'admin@skillsgrow.com',
										subject: 'Skillsgrow.com Password Reset',
										text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
											'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
											url + '/resetpassword/' + user.resetPasswordToken + '\n\n' +
											'If you did not request this, please ignore this email and your password will remain unchanged.\n',
										html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.</br>' +
											'Please click on the following link, or paste this into your browser to complete the process.</br>' +
											'<a href="' + url + 'resetpassword/' + user.resetPasswordToken + '">' + url + 'resetpassword/</a> ' +
											'If you did not request this, please ignore this email and your password will remain unchanged',
									};
									smtpTransport.sendMail(mailOptions, function (err, info) {
										if (err) console.log(err);
									});
									res.json({
										result: true,
										message: 'please check your email'
									});
								}
							});
						} else {
							mongo.register.find({
								emailId: req.body.emailId
							}).remove((err, docs) => {
								if (err) {
									res.json({
										"result": false,
										"dev": err,
										"reason": 'Invalid',
										"message": "something went wrong, Please try again."
									});
								} else {
									res.json({
										result: false,
										reason: 'Invalid',
										message: 'you have enter invalid or wrong email  id so please register again.'
									});
								}
							})
						}
					});
				}
			})
		]);
	}

	checkTokenPassword(req, res, next) {
		var token;
		async.waterfall([
			function (done) {
				crypto.randomBytes(20, function (err, buf) {
					token = buf.toString('hex');
				});
			},
			mongo.register.findOne({
				resetPasswordToken: req.params.token
			}).select()
			.exec(function (err, user) {
				if (err) throw err;
				if (user) {
					res.json({
						success: true,
						data: user
					});
				} else {
					res.json({
						success: false,
						message: 'password link is expired'
					});
				}
				// function to verify token
				/* var token = req.params.token;
				jwt.verify(token, tokenKey, function (err, decoded) {
					if (err) {
						res.json({ success: false, message: 'password link is expried' });
					} else {
						res.json({ success: true, data: user });
					}
				}); */
			})
		]);
	}

	savePassword(req, res) {
		mongo.register.findOne({
			emailId: req.body.emailId
		}).select().exec(function (err, user) {
			if (err) throw err;
			if (req.body.confirmPassword == null || req.body.confirmPassword == '') {
				res.json({
					result: false,
					message: 'password not provided'
				});
			} else {
				var pwd = base.hashPassword(req.body.confirmPassword);
				user.password = pwd;
				user.resetPasswordToken = false;
				user.save(function (err) {
					if (err) {
						res.json({
							success: false,
							message: err
						});
					} else {
						var mailOptions = {
							to: user.emailId,
							from: 'admin@skillsgrow.com',
							subject: 'Skillsgrow.com Password changed',
							text: 'password successfully changed'
						};
						smtpTransport.sendMail(mailOptions, function (err, info) {
							if (err) console.log(err);
						});
						res.json({
							result: true,
							message: 'password has been reset'
						});
					}
				});
			}
		});
	}

	checkTokenForEmail(req, res, next) {
		mongo.register.findOne({
			temporaryToken: req.params.token
		}).select().exec(function (err, user) {
			if (err) throw err;
			if (!user) {
				res.json({
					result: false,
					message: 'link is expired'
				});
			} else {
				user.active = true;
				user.temporaryToken = false;
				user.save(function (err) {
					if (err) {
						console.log(err);
					} else {
						var mailOptions = {
							to: user.emailId,
							from: 'admin@skillsgrow.com',
							subject: 'Skillsgrow.com Account Activated',
							text: 'your account is activated'
						};
						smtpTransport.sendMail(mailOptions, function (err, info) {
							if (err) console.log(err);
						});
						res.json({
							result: true,
							message: 'Account activated'
						});
					}
				})
			}
			// function to verify token
			/* var token = req.params.token;
			jwt.verify(token, tokenKey, function (err, decoded) {
				if (err) {
					res.json({ result: false, message: 'link is expried' });
				} else if (!user) {
					res.json({ result: false, message: 'link is expired' });
				} else {
					user.active = true;
					user.temporaryToken = false;
					user.save(function(err) {
						if (err) {
							console.log(err);
						} else {
							var mailOptions = {
								to: user.emailId,
								from: 'admin@skillsgrow.com',
								subject: 'Skillsgrow.com Account Activated',
								text: 'your account is activated'
							};
							smtpTransport.sendMail(mailOptions, function (err, info) {
								if (err) console.log(err);
							});
							res.json({ result: true, message: 'Account activated' });
						}
					})
				}
			}); */
		})
	}

	resendActivationLink(req, res, next) {
		mongo.register.findOne({
			emailId: req.body.email
		}, function (err, user) {
			var hashPwd = (user != null) ? base.validPassword(req.body.password, user) : false;
			if (err) throw err;

			if (!user) {
				res.json({
					result: false,
					message: 'could not authenticate'
				});
			} else if (!hashPwd) {
				res.json({
					result: false,
					message: 'password is invalid'
				})
			} else if (user.active) {
				res.json({
					result: false,
					message: 'Account already activated'
				});
			} else {
				res.json({
					result: true,
					data: user
				});
			}
		});
	}

	resendLink(req, res, next) {
		//var temptoken = jwt.sign({userName: req.body.userName, emailId: req.body.emailId}, tokenKey, {expiresIn: '24h'});
		var token;
		async.waterfall([
			function (done) {
				crypto.randomBytes(20, function (err, buf) {
					token = buf.toString('hex');
				});
			},
			mongo.register.findOne({
				emailId: req.body.email
			}).select().exec(function (err, user) {
				if (err) throw err;
				user.temporaryToken = token;
				user.save(function (err) {
					if (err) {
						console.log(err);
					} else {
						var mailOptions = {
							to: req.body.email,
							from: 'admin@skillsgrow.com',
							subject: 'Skillsgrow.com Activation link Request',
							text: 'Click on this to link to activate your account .\n\n' +
								url + '/activate/' + token,
							html: 'Click on this to link to activate your account . </br>' +
								'<a href="' + url + 'activate/' + token + '">' + url + 'activate/</a>'
						};
						smtpTransport.sendMail(mailOptions, function (err, info) {
							if (err) console.log(err);
						});
						res.json({
							result: true,
							message: 'Activation link send to ' + req.body.email + '!'
						});
					}
				})
			})
		]);
	}

	// courseReview(req, res, next) {
	// 	console.log('=====', req.body, '++++')
	// 	mongo.course.findByIdAndUpdate({
	// 			_id: req.body.courseId
	// 		}, {
	// 			$push: {
	// 				courseReview: req.body
	// 			}
	// 		},
	// 		function (err, user) {
	// 			if (err) {
	// 				console.log(err);
	// 			} else {
	// 				if (user) {
	// 					user.save(function (err) {
	// 						if (err) {
	// 							console.log(err);
	// 						} else {
	// 							res.json({
	// 								result: true,
	// 								message: 'sent successfully'
	// 							});
	// 						}
	// 					});
	// 				}
	// 			}
	// 		});
	// }

	// courseEnrolled(req, res, next) {
	// 	console.log('===========');
	// 	console.log(req.body);
	// 	mongo.course.findByIdAndUpdate({ _id: req.body.courseId }, { $push: { enrolledUser: req.body } },
	// 		function (err, user) {
	// 			if (err) {
	// 				console.log(err);
	// 			} else {
	// 				console.log(user);
	// 				if (user) {
	// 					user.save(function (err) {
	// 						if (err) {
	// 							console.log(err);
	// 						} else {
	// 							res.json({ result: true, message: 'Enrolled successfully' });
	// 						}
	// 					});
	// 				}
	// 			}
	// 		});
	// }

	courseEnrolled(req, res, next) {
		this.admin.addEnrolledUser(req.body)
			.then((response) => {
				if (response.result) {
					mongo.course.findByIdAndUpdate({
							_id: req.body.courseId
						}, {
							$push: {
								enrolledUser: response.enroll_id
							}
						},
						function (err, user) {
							if (err) {
								console.log(err);
							} else {
								console.log(user);
								if (user) {
									user.save(function (err) {
										if (err) {
											console.log(err);
										} else {
											res.json({
												result: true,
												message: 'Enrolled successfully'
											});
										}
									});
								}
							}
						});
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject);
			});
	} //modified by nandita

	courseReview(req, res, next) {
		this.admin.addCourseReviewUser(req.body)
			.then((response) => {
				if (response.result) {
					mongo.course.findByIdAndUpdate({
							_id: req.body.courseId
						}, {
							$push: {
								courseReview: response.courseReview_id
							}
						},
						function (err, user) {
							if (err) {
								console.log(err);
							} else {
								if (user) {
									user.save(function (err) {
										if (err) {
											console.log(err);
										} else {
											res.json({
												result: true,
												message: 'sent successfully'
											});
										}
									});
								}
							}
						});

				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject);
			});
	} //modified by nandita


	userCourseEnrolled(req, res, next) {
		mongo.register.findByIdAndUpdate({
				_id: req.body.userId
			}, {
				$push: {
					courseEnrolled: req.body
				}
			},
			function (err, user) {
				if (err) {
					console.log(err);
				} else {
					if (user) {
						user.save(function (err) {
							if (err) {
								console.log(err);
							} else {
								res.json({
									result: true,
									message: 'User Enrolled the course successfully'
								});
							}
						});
					}
				}
			});
	}

	userScore(req, res, next) {
		mongo.register.findOne({
				_id: req.body.userId
			},
			function (err, user) {
				if (err) {
					console.log(err);
				} else {
					// console.log(user);
					console.log("++++++++++", req.body.courses);
					if (user) {
						user.courseEnrolled = req.body.courses;
						user.save(function (err) {
							if (err) {
								console.log(err);
							} else {
								res.json({
									result: true,
									message: 'successfully submitted'
								});
							}
						});
					}
				}
			});
	}

	contactUsDetails(req, res, next) {
		this.admin.webContactus(req.body)
			.then((response) => {
				if (response.result) {
					var mailOptions = {
						to: 'admin@skillsgrow.com',
						from: 'admin@skillsgrow.com',
						subject: 'Skillsgrow Contact us',
						text: req.body.message + '. \n\n' +
							'EmailID : ' + req.body.emailId + '.\n\n' +
							'Phone Number : ' + req.body.phone + '.'
					};
					smtpTransport.sendMail(mailOptions, function (err, info) {
						if (err) console.log(err);
					});
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	updateCourse(req, res, next) {
		var data = {
			'authorDetails': req.body.authorDetails,
			'boostText': req.body.boostText,
			'faq': req.body.faq,
			'discussionForums': req.body.discussionForums,
			'categoryId': req.body.categoryId,
			'courseReview': req.body.courseReview,
			'enrolledUser': req.body.enrolledUser,
			'courseName': req.body.courseName,
			'description': req.body.description,
			'shortDescription': req.body.shortDescription,
			'courseKeywords': req.body.courseKeywords,
			'imageLarge': req.body.imageLarge,
			'imageSmall': req.body.imageSmall,
			'video': req.body.video,
			'timeline': req.body.timeline,
			'createdBy': req.body.createdBy,
			'status': req.body.status,
			'_id': req.body._id
		};
		this.admin.updateTheCourse(data)
			.then((response) => {
				console.log("====res===", response)
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				console.log("+++++++rej++++++", reject)
				res.send(reject)
			});
	}

	discussionForums(req, res, next) {
		let chatData = req.body.discussionData;
		mongo.course.findOne({
				_id: req.body.courseId
			},
			function (err, user) {
				if (err) {
					console.log(err);
				} else {
					if (user) {
						(chatData.position == undefined) ?
						user.discussionForums.push(chatData):
							user.discussionForums[chatData.position].replyMessage.push(chatData);
						user.markModified('discussionForums');
						user.save(function (err) {
							if (err) {
								console.log(err);
							} else {
								res.json({
									result: true,
									message: 'sent successfully'
								});
							}
						});
					}
				}
			});
	}

	getDiscussionForums(req, res, next) {
		mongo.course.findOne({
				_id: req.params.courseId
			}, {
				discussionForums: 1
			},
			function (err, docs) {
				// console.log(docs);
				if (err) {
					res.json({
						"result": false,
						"message": "something went wrong",
						"dev": docs
					});
				} else {
					res.json({
						"result": true,
						"data": docs
					});
				}
			});
	}

	updateUserDetails(req, res) {
		var data = {
			profilePic: req.body.profilePic,
			_id: req.body._id,
			userName: req.body.userName,
			emailId: req.body.emailId,
			phone: req.body.phone,
			gender: req.body.gender,
			address: req.body.address,
		}
		this.admin.updatedUserData(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	updateUserPassword(req, res) {
		mongo.register.findOne({
			_id: req.body._id
		}, function (error, user) {
			if (user) {
				var hashPwd = base.validPassword(req.body.oldPassword, user)
				if (!hashPwd) {
					res.json({
						result: false,
						reason: 'incorrect pswd',
						message: 'Old Password is Incorrect'
					});
				} else {
					quickemailverification.verify(user.emailId, function (err, response) {
						console.log("Emai id in change pswd:", user.emailId, 'res:', response.body.result);
						if (response.body.result == 'valid') {
							var pwd = base.hashPassword(req.body.password);
							user.password = pwd;
							user.loginStatus = req.body.loginStatus;
							user.save(function (err) {
								if (err) {
									console.log(err);
								} else {
									res.json({
										result: true,
										message: 'Password Change Successfully'
									});
								}
							});
						} else {
							mongo.register.find({
								emailId: user.emailId
							}).remove((err, docs) => {
								if (err) {
									res.json({
										"result": false,
										"dev": err,
										"reason": 'Invalid',
										"message": "something went wrong, Please try again."
									});
								} else {
									res.json({
										result: false,
										reason: 'Invalid',
										message: 'Your email id is not valid, So please register again to'
									});
								}
							})
						}
					});
				}
			}
		})
	}

	checkEmailExistOrNot(req, res) {
		mongo.register.findOne({
			emailId: req.params.emailId
		}, function (error, user) {
			if (user) {
				res.json({
					result: true,
					message: 'Email Already Registered',
					_id: user._id
				});
			} else {
				res.json({
					result: false,
					message: 'Email is not found'
				});
			}
		})
	}

	checkCourseNameExistOrNot(req, res) {
		mongo.course.findOne({
			courseName: {
				$regex: new RegExp('^' + req.params.courseName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i')
			}
		}, {
			_id: 1
		}, function (error, user) {
			if (user) {
				res.json({
					result: true,
					message: 'course name already exist',
					_id: user._id
				});
			} else {
				res.json({
					result: false,
					message: 'course name not found'
				});
			}
		})
	}

	courseFaq(req, res) {
		mongo.course.findOne({
			_id: req.body.courseId
		}, function (err, course) {
			if (err) {
				console.log(err);
			} else {
				if (course) {
					course.faq = req.body.faq;
					course.save(function (err) {
						if (err) {
							console.log(err);
						} else {
							res.json({
								result: true,
								message: 'FAQ sent successfully'
							});
						}
					});
				}
			}
		})
	}

	deleteFaq(req, res) {
		mongo.course.findOne({
			_id: req.body.courseId
		}, function (err, course) {
			if (err) {
				console.log(err);
			} else {
				if (course) {
					course.faq = req.body.faq;
					course.save(function (err) {
						if (err) {
							console.log(err);
						} else {
							res.json({
								result: true,
								message: 'Delete Successfully'
							});
						}
					});
				}
			}
		})
	}

	contactEnterpriseTeamData(req, res) {
		mongo.contactEnterpriseTeam.create(req.body, function (err, docs) {
			if (err) {
				res.json({
					"result": false,
					"dev": err,
					"message": "something went wrong"
				});
			} else {
				var mailOptions = {
					to: 'admin@skillsgrow.com',
					from: 'admin@skillsgrow.com',
					subject: 'Skillsgrow Enterprise Team',
					text: req.body.query + '. \n\n' +
						'EmailID : ' + req.body.emailId + '.\n\n' +
						'Phone Number : ' + req.body.phoneNumber + '.'
				};
				smtpTransport.sendMail(mailOptions, function (err, info) {
					if (err) console.log(err);
				});
				res.json({
					"result": true,
					"data": "sent successfully"
				});
			}
		});
	}

	askQuestion(req, res) {
		mongo.askQuestion.create(req.body, function (err, docs) {
			if (err) {
				res.json({
					"result": false,
					"dev": err,
					"message": "something went wrong"
				});
			} else {
				var mailOptions = {
					to: 'admin@skillsgrow.com',
					from: 'admin@skillsgrow.com',
					subject: 'Skillsgrow FAQ',
					text: req.body.question + '. \n\n' +
						'EmailID : ' + req.body.emailId + '.\n\n'
				};
				smtpTransport.sendMail(mailOptions, function (err, info) {
					if (err) console.log(err);
				});
				res.json({
					"result": true,
					"message": "sent successfully"
				});
			}
		});
	}

	userCourseEnrolledList(req, res) {
		mongo.course.findOne({
			_id: req.params.userId
		}, function (err, data) {
			if (err) {
				res.json({
					"result": false,
					"dev": err,
					"message": "something went wrong"
				});
			} else {
				res.json({
					"result": true,
					"data": data
				});
			}
		});
	}

	publishSkillsgrow(req, res) {
		mongo.publishSkillsgrowScheme.create(req.body, function (err, docs) {
			if (err) {
				res.json({
					"result": false,
					"dev": err,
					"message": "something went wrong"
				});
			} else {
				var mailOptions = {
					to: 'admin@skillsgrow.com',
					from: 'admin@skillsgrow.com',
					subject: 'Publish Skillsgrow',
					text: req.body.message + '. \n\n' +
						'EmailID : ' + req.body.emailId + '.\n\n' +
						'Phone Number : ' + req.body.phoneNumber + '.'
				};
				smtpTransport.sendMail(mailOptions, function (err, info) {
					if (err) console.log(err);
				});
				res.json({
					"result": true,
					"data": "sent successfully"
				});
			}
		});
	}

	payuResponse(req, res) {
		// console.log(req.body);
		// req.body.status = "success";

		// console.log('=====', req.body.status);
		mongo.payuResponseScheme.create(req.body, function (err, docs) {
			if (err) {
				console.log(err);
			} else {
				// console.log(docs);
				// res.redirect('http://localhost:4200/response/' + req.body.mihpayid + '');
				res.redirect('https://www.skillsgrow.com/response/' + req.body.mihpayid + '');
			}
		});
	}



	payuGetResponse(req, res) {
		mongo.payuResponseScheme.find({
			mihpayid: req.params.id
		}, function (err, user) {
			if (err) {
				res.json({
					"result": false,
					"message": "something went wrong"
				});
			} else {
				// console.log(user);
				res.json({
					"result": true,
					"data": user
				});
			}
		});
	}

	certificatePayment(req, res) {
		mongo.register.findByIdAndUpdate({
			_id: req.body._id
		}).select().exec(function (err, user) {
			if (!user) {
				res.json({
					"result": false,
					"message": "something went wrong"
				});
			} else {
				user.courseEnrolled.filter((data, index) => {
					if (req.body.courseId === data._id) {
						user.courseEnrolled[index].authorDetails[0].certificatePayment = true;
						user.save(function (err) {
							if (err) {
								res.json({
									"result": false,
									"message": "something went wrong"
								});
							} else {
								res.json({
									"result": true,
									"message": "Done successfully"
								});
							}
						});
					}
				});
			}
		});
	}

	addSSP(req, res) {
		var pwd = base.hashPassword(req.body.password);
		var data = {
			"userName": req.body.userName,
			"emailId": req.body.emailId,
			"phone": req.body.phone,
			"password": pwd,
			"collegeName": req.body.collegeName,
			"collegeId": req.body.collegeId,
			"status": req.body.status,
			"createdOn": req.body.createdOn,
			"temporaryToken": false,
			"active": true,
			"loginStatus": req.body.loginStatus
		};
		this.admin.frontendRegister(data)
			.then((response) => {
				if (response.result) {
					var mailOptions = {
						to: req.body.emailId,
						from: 'admin@skillsgrow.com',
						subject: 'Account Activation Link',
						text: 'Congratulation! Skillsgrow Added you as a Skillsgrow student partner (SSP). \n\n' +
							'Your Skillsgrow Refer Id: ' + response.id + ' \n\n' +
							'Your Skillsgrow UserName: ' + req.body.emailId + ' \n\n' +
							'Your Skillsgrow Password: ' + 'skillsgrow123' + ' \n\n' +
							url + 'login',
						html: 'Congratulation! Skillsgrow Added you as a Skillsgrow student partner (SSP). <br/>' +
							'<div style="margin: 10px 0">Your Skillsgrow Refer Id: <b>' + response.id + '</b> </div>' +
							'<div style="margin: 10px 0">Your Skillsgrow UserName: <b>' + req.body.emailId + '</b> </div>' +
							'<div style="margin: 10px 0">Your Skillsgrow Password: <b>skillsgrow123</b>' + '<div>' +
							'<a href="' + url + 'login' + '">' + url + 'login</a>'
					};
					smtpTransport.sendMail(mailOptions, function (err, info) {
						if (err) console.log(err);
					});
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	getSSP(req, res) {
		mongo.register.find({
			status: req.params.status
		}, function (err, user) {
			if (err) {
				res.json({
					"result": true,
					"message": "something went wrong"
				});
			} else {
				res.json({
					"result": true,
					"data": user
				});
			}
		});
	}

	updateSSP(req, res) {
		mongo.register.update({
			_id: req.body._id
		}, {
			$set: req.body
		}, function (err, docs) {
			if (err) {
				res.json({
					"result": true,
					"message": "something went wrong"
				});
			} else {
				res.json({
					"result": true,
					"data": docs
				});
			}
		});
	}

	deleteSSP(req, res) {
		mongo.register.findByIdAndRemove({
			"_id": req.params.id
		}, (err, docs) => {
			if (err) {
				res.json({
					"result": false,
					"message": "something went wrong",
					"dev": err
				});
			} else {
				res.json({
					"result": true,
					"message": "Successfully Deleted"
				});
			}
		});
	}

	getRegister(req, res) {
		mongo.register.find({}, {
				_id: 1,
				userName: 1,
				emailId: 1,
				phone: 1,
				profilePic: 1,
				courseEnrolled: 1
			}).lean()
			.exec((err, user) => {
				if (err) {
					res.json({
						"result": false,
						"message": "something went wrong"
					});
				} else {
					res.json({
						"result": true,
						"data": user
					});
				}
			});
	}

	putRegister(req, res) {
		var a = req.body;
		this.admin.updateEmail(a)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	courseActiveInactive(req, res) {
		mongo.course.update({
			_id: req.body._id
		}, {
			$set: req.body
		}, (err, docs) => {
			if (err) {
				res.json({
					"result": false,
					"message": "something went wrong"
				});
			} else {
				res.json({
					"result": true,
					"mesage": "change successfully",
					"data": docs
				});
			}
		})
	}

	courseDelete(req, res) {
		mongo.course.findById({
				_id: req.params.id
			}, {
				timeline: 1,
				categoryId: 1
			})
			.populate([{
				path: 'timeline',
				populate: [{
					path: 'topics',
					populate: {
						path: 'questions'
					}
				}]
			}])
			.exec((err, docs) => {
				if (err) {
					res.json({
						"result": false,
						"message": "something went wrong",
						"err": err
					});
				} else {
					for (var timelineData of docs.timeline) {
						mongo.timeline.find({
							'_id': timelineData._id
						}).remove((err, timelineDeleteDocs) => {
							if (!err) {
								console.log('==timelineDeleteDocs===', timelineDeleteDocs.result);
							}
						})
						for (var topicsData of timelineData.topics) {
							mongo.topics.find({
								'_id': topicsData._id
							}).remove((err, topicsDeleteDocs) => {
								if (!err) {
									console.log('==topicsDeleteDocs===', topicsDeleteDocs.result);
								}
							})
							for (var questionsData of topicsData.questions) {
								mongo.questions.find({
									'_id': questionsData._id
								}).remove((err, questionsDeleteDocs) => {
									if (!err) {
										console.log('==questionsDeleteDocs===', questionsDeleteDocs.result);
									}
								})
							}
						}
					}


					mongo.course.find({
						'_id': req.params.id
					}).remove((err, courseDeleteDocs) => {
						if (!err) {
							mongo.category.find({
								'_id': docs.categoryId
							}, (catErr, catDocs) => {
								if (!catErr) {
									let courseIndex = catDocs[0].course.indexOf(docs._id);
									if (courseIndex > -1) {
										catDocs[0].course.splice(courseIndex, 1);
									}
									catDocs[0].save((catSaveErr) => {
										if (catSaveErr) {
											console.log("++++catSaveErr+++", catSaveErr);
										}
									});
								} else {
									console.log("++++catErr+++", catErr);
								}
							});
							res.json({
								"result": true,
								"mesage": "delete successfully",
								"data": courseDeleteDocs.resullt
							});
						}
					})
				}
			})
	} //modified by nandita

	getCourseById(req, res) {
		mongo.course.find({
				_id: req.params.id
			}, {
				discussionForums: 0
			}).populate([{
				path: 'enrolledUser',
				populate: {
					path: 'userId',
					select: {
						'emailId': 1,
						'userName': 1
					}
				}
			}]) //Modified by nandita
			.populate([{
				path: 'courseReview',
				populate: {
					path: 'userId',
					select: {
						'emailId': 1,
						'userName': 1
					}
				}
			}]) //Modified by nandita
			.populate([{
				path: 'timeline',
				// populate: {
				// 	path: 'topics'
				// }
				populate: [{
					path: 'topics',
					populate: {
						path: 'questions'
					}
				}]
			}]) //Modified by nandita
			.exec((err, data) => {
				if (err) {
					res.json({
						"result": false,
						"message": "something went wrong",
					});
				} else {
					res.json({
						"result": true,
						"data": data
					});
				}
			})
	}

	getUserDetailsById(req, res) {
		mongo.register.find({
				_id: req.params.id
			}, {
				password: 0
			})
			.exec((err, data) => {
				if (err) {
					res.json({
						"result": false,
						"message": "something went wrong",
					});
				} else {
					res.json({
						"result": true,
						"data": data
					});
				}
			})
	}

	getCourseByName(req, res) {
		mongo.course.find({
				// courseName: new RegExp(["^", req.params.courseName, "$"].join(""), "i")
				courseName: {
					$regex: new RegExp('^' + req.params.courseName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i')
				}
			}, {
				discussionForums: 0
			}).populate([{
				path: 'enrolledUser',
				populate: {
					path: 'userId',
					select: {
						'emailId': 1,
						'userName': 1
					}
				}
			}]) //Modified by nandita
			.populate([{
				path: 'courseReview',
				populate: {
					path: 'userId',
					select: {
						'emailId': 1,
						'userName': 1
					}
				}
			}]) //Modified by nandita
			.populate([{
				path: 'timeline',
				// populate: {
				// 	path: 'topics'
				// }
				populate: [{
					path: 'topics',
					populate: {
						path: 'questions'
					}
				}]
			}]) //Modified by nandita
			.exec((err, data) => {
				if (err) {
					res.json({
						"result": false,
						"message": "something went wrong",
					});
				} else {
					res.json({
						"result": true,
						"data": data
					});
				}
			})
	}


	getCategoryName(req, res) {
		mongo.category.find({}, {
				_id: 1,
				categoryName: 1,
				categoryImg: 1
			}).lean()
			.populate({
				path: 'course',
				select: 'courseName _id'
			})
			.exec((err, data) => {
				if (err) {
					res.json({
						"result": false,
						"message": "something went wrong",
					});
				} else {
					res.json({
						"result": true,
						"data": data
					});
				}
			})
	}

	getCourse(req, res) {
		mongo.course.find({
				viewTrending: true
			}, {
				discussionForums: 0,
				faq: 0,
				description: 0
			})
			.lean()
			.populate([{
				path: 'enrolledUser',
				populate: {
					path: 'userId',
					select: {
						'emailId': 1,
						'userName': 1
					}
				}
			}]) //Modified by nandita
			.populate([{
				path: 'courseReview',
				populate: {
					path: 'userId',
					select: {
						'emailId': 1,
						'userName': 1
					}
				}
			}]) //Modified by nandita
			.populate([{
				path: 'timeline',
				// populate: {
				// 	path: 'topics'
				// }

				populate: [{
					path: 'topics',
					populate: {
						path: 'questions'
					}
				}]
			}]) //Modified by nandita
			.exec((err, data) => {
				if (err) {
					res.json({
						"result": false,
						"message": "something went wrong",
					});
				} else {
					res.json({
						"result": true,
						"data": data
					});
				}
			})
	}

	//created by chand
	addRollsPermissions(req, res) {
		var data = {
			title: req.body.title,
			permissions: req.body.permissions,
			status: 0
		}
		this.admin.addRollsPermissions(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject);
			});
	}

	updateRollsPermissions(req, res) {
		var data = {
			id: req.body.id,
			title: req.body.title,
			permissions: req.body.permissions,
			status: 0
		}
		this.admin.updateRollsPermissions(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject);
			});
	}

	listRollsPermissions(req, res) {
		this.admin.listRollsPermissions()
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject);
			});
	}

	deleteRollsPermissions(req, res) {
		let id = req.params.id;
		this.admin.deleteRollsPermissions(id)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject);
			});
	}

	getRollsPermissions(req, res) {
		let id = req.params.id;
		this.admin.getRollsPermissions(id)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject);
			});
	}

	trandingCourse(req, res) {
		let data = {
			id: req.body.id,
			viewTrending: req.body.viewTrending
		}
		this.admin.trandingCourse(data)
			.then((response) => {
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject);
			});
	}

	testScriptForErolledUser(req, res) {
		async.parallel([
			function (cb) {
				mongo.course.find({
					_id: req.body.courseId
				}, {
					enrolledUser: 1
				}, (err, data) => {
					if (err) {
						cb({
							"result": false,
							"message": "something went wrong",
						}, null)
					} else {
						cb(null, data);
					}
				})
			}
		], function (err, results) {
			let enrolledUserId = [];
			if (results[0] != "") {
				async.forEachSeries(results[0], function (results, cb1) {
					async.forEachSeries(results.enrolledUser, function (item2, cb2) {
						mongo.register.findOne({
							'emailId': item2.userEmailId
						}, {
							_id: 1
						}, (err, docs) => {
							if (!err && docs != null) {
								mongo.enrolledUser.create({
									userId: docs._id,
									courseId: item2.courseId,
									enrolledOn: item2.enrolledOn
								}, (err, docs) => {
									if (err) {
										console.log(err, '+++1');
										cb2();
									} else {
										enrolledUserId.push(docs._id);
										cb2();
									}
								})
							} else {

								cb2()
							}
						});
					}, function (err) {
						cb1();
					});
				}, function (err) {
					console.log(enrolledUserId);
					if (enrolledUserId.length > 0) {
						mongo.course.update({
							_id: req.body.courseId
						}, {
							$set: {
								enrolledUser: enrolledUserId
							}
						}, (err, docs) => {
							if (err) {
								result = {
									"result": false,
									"dev": err,
									"message": "something went wrong"
								};
								console.log(result);
							} else {
								res.json({
									"result": true,
									"data": docs
								});
							}
						})
					} else {
						res.json({
							"result": true,
							"message": "already updated"
						});
					}
				});
			} else {
				res.json({
					"result": true,
					"message": 'no enrolled user data'
				});
			}
		});
	}

	testScriptForCourseReview(req, res) {
		async.parallel([
			function (cb) {
				mongo.course.find({
					// _id: '5bed156f60abd21ff74d00a0'
					_id: req.body.courseId
				}, {
					courseReview: 1
				}, (err, data) => {
					if (err) {
						cb({
							"result": false,
							"message": "something went wrong",
						}, null)
					} else {
						cb(null, data);
					}
				})
			}
		], function (err, results) {
			let userCourseReviewId = [];
			if (results[0] != "") {
				async.forEachSeries(results[0], function (results, cb1) {
					async.forEachSeries(results.courseReview, function (item2, cb2) {
						mongo.register.findOne({
							'emailId': item2.emailId
						}, {
							_id: 1
						}, (err, docs) => {
							if (!err && docs != null) {
								mongo.courseReview.create({
									userId: docs._id,
									courseId: item2.courseId,
									status: item2.status,
									rating: item2.rating,
									comment: item2.comment
								}, (err, docs) => {
									if (err) {
										console.log(err);
										cb2();
									} else {
										userCourseReviewId.push(docs._id);
										cb2();
									}
								})
							} else {
								console.log(err);
								cb2()
							}
						});
					}, function (err) {
						cb1();
					});
				}, function (err) {
					console.log(userCourseReviewId, '====')
					if (userCourseReviewId.length > 0) {
						mongo.course.update({
							_id: req.body.courseId
							// _id: '5bed156f60abd21ff74d00a0'
						}, {
							$set: {
								courseReview: userCourseReviewId
							}
						}, (err, docs) => {
							if (err) {
								result = {
									"result": false,
									"dev": err,
									"message": "something went wrong"
								};
								console.log(result);
							} else {
								res.json({
									"result": true,
									"data": docs
								});
							}
						})
					} else {
						res.json({
							"result": true,
							"message": "already updated"
						});
					}
				});
			} else {
				res.json({
					"result": true,
					"message": 'no data'
				});
			}

		});
	}

	testScriptForauthorDetails(req, res) {
		async.parallel([
			function (cb) {
				mongo.course.find({
					_id: req.body.courseId
				}, {
					authorDetails: 1
				}, (err, data) => {
					if (err) {
						cb({
							"result": false,
							"message": "something went wrong",
						}, null)
					} else {
						cb(null, data);
					}
				})
			}
		], function (err, results) {
			let authorDetailsId = [];
			if (results[0] != "") {
				async.forEachSeries(results[0], function (results, cb1) {
					async.forEachSeries(results.authorDetails, function (item2, cb2) {
						item2.courseId = results._id;
						console.log(item2);
						mongo.authorDetails.create(item2, (err, docs) => {
							if (err) {
								// console.log(err);
								res.json({
									"result": true,
									"err": err
								});
								cb2();
							} else {
								authorDetailsId.push(docs._id);
								cb2();
							}
						})
					}, function (err) {
						cb1();
					});
				}, function (err) {
					if (!err) {
						if (authorDetailsId.length > 0) {
							mongo.course.update({
								_id: req.body.courseId
							}, {
								$set: {
									authorDetails: authorDetailsId
								}
							}, (err, docs) => {
								if (err) {
									result = {
										"result": false,
										"dev": err,
										"message": "something went wrong"
									};
									console.log(result);
								} else {
									res.json({
										"result": true,
										"data": docs
									});
								}
							})
						} else {
							res.json({
								"result": true,
								"message": "already updated"
							});
						}
					} else {
						res.json({
							"result": true,
							"err": err
						});
					}
				});
			} else {
				res.json({
					"result": true,
					"message": 'no data',
					"err": err
				});
			}

		});
	}

	testScriptForTimeline(req, res) {
		async.parallel([
			function (cb) {
				mongo.course.find({
					_id: req.body.courseId
				}, {
					timeline: 1
				}, (err, data) => {
					if (err) {
						cb({
							"result": false,
							"message": "something went wrong",
						}, null)
					} else {
						cb(null, data);
					}
				})
			}
		], function (err, results) {
			let courseId;
			let timeId;
			let topId;
			let timelineId = [];
			let topicsId = [];
			let questionsId = [];
			if (!err) {
				if (results[0] != "") {
					async.forEachSeries(results[0], function (item1, cb1) {
						courseId = item1._id;
						async.forEachSeries(item1.timeline, function (item2, cb2) {
							mongo.timeline.create(item2, (err2, docs2) => {
								if (err2) {
									console.log('==2==', err2);
								} else {
									timeId = docs2._id;
									timelineId.push(docs2._id);
									console.log(timeId, '*****timeId*******', timelineId, '===')
									async.forEachSeries(item2.topics, function (item3, cb3) {
										mongo.topics.create(item3, (err3, docs3) => {
											if (err3) {
												console.log('==3==', err3);
											} else {
												topId = docs3._id;
												topicsId.push(docs3._id);
												console.log(topId, '********topId*******', topicsId, '++')
												async.forEachSeries(item3.questions, function (item4, cb4) {
													mongo.questions.create(item4, (err4, docs4) => {
														if (err4) {
															console.log('==4==', err4);
															cb4();
														} else {
															questionsId.push(docs4._id);
															cb4();
														}
													})
												}, function (err4) {
													if (!err4) {
														if (questionsId.length > 0) {
															mongo.topics.update({
																_id: topId
															}, {
																$set: {
																	questions: questionsId
																}
															}, (topicerr, topicdocs) => {
																if (topicerr) {
																	console.log(topicerr);
																	cb3()
																} else {
																	questionsId = [];
																	cb3();
																}
															})
														} else {
															cb3()
														}
													} else {
														console.log("===err4===", err4)
														cb3()
													}
												});
											}
										})
									}, function (err3) {
										if (!err3) {
											console.log("+++timeId++", timeId)
											console.log("++topicsId+++", topicsId)
											if (topicsId.length > 0) {
												mongo.timeline.update({
													_id: timeId
												}, {
													$set: {
														topics: topicsId
													}
												}, (timelineerr, timelinedocs) => {
													if (timelineerr) {
														console.log(timelineerr);
														cb2()
													} else {
														console.log("timeId data updated")
														topicsId = [];
														cb2();
													}
												})
											} else {
												cb2()
											}
										} else {
											console.log("===err3===", err3)
											cb2()
										}
									});
								}
							})
						}, function (err2) {
							if (!err2) {
								console.log("+++courseId++", courseId)
								console.log("++timelineId+++", timelineId)
								mongo.course.update({
									_id: courseId
								}, {
									$set: {
										timeline: timelineId
									}
								}, (courseerr, coursedocs) => {
									if (courseerr) {
										console.log(courseerr);
										cb1()
									} else {
										console.log("course data updated")
										timelineId = [];
										cb1();
									}
								})
							} else {
								console.log("====err2===", err2)
								cb1()
							}
						});

					}, function (err1) {
						if (!err1) {
							// console.log(timelineId, '=========tim====')
							// console.log(topicsId, '====top=====')
							// console.log(questionsId, '=====qu=====')

							if (timelineId.length == 0 && topicsId.length == 0 && questionsId.length == 0) {
								res.json({
									"result": true,
									"message": 'updated successfully'
								});
							} else {
								res.json({
									"result": false,
									"message": 'Somthing went wrong',
									"err1": err1,
									// "err2": err2,
									// "err3": err3,
									// "err4": err4

								});
							}
						} else {
							res.json({
								"result": false,
								"message": 'Somthing went wrong',
								"err1": err1
							});
						}
					});
				} else {
					res.json({
						"result": true,
						"Message": "No data found"
					});
				}
			} else {
				res.json({
					"result": true,
					"err": err
				});
			}

		});
	}



	testScript(req, res) {
		console.log(req.body.courseId)
		let timeId;
		let topId;
		let timelineId = [];
		let topicsId = [];
		let questionsId = [];
		let data = {
			authorDetails: [{
				authorName: 'Nandita Naik',
				authorEmail: 'nadita.prg@gmail.com',
				authorPhone: '9611670845',
				authorBiography: 'Sumanth works with the Instructional team to bring great content to more students and classrooms. He is a big fan of learning and teaching by using online technology and how it can bring employment opportunities to so many young students in India and all over the world.\n',
				coursePrice: 'Free',
				certificatePrice: 'Free'
			}],
			boostText: 'Learn and get Certificate Free',
			categoryId: '5bb92ba29a8d2c489741bc96',
			courseName: 'Node js',
			description: '<p>Have you never programmed a computer before, and have been told that C is a good programming language to get started with.</p><p><strong>It is!</strong></p><p>Maybe you have some experience with other programming languages, but want to learn C.</p><p>The fact is, learning how to program in C is not only an excellent programming language to get started with, but it will also make you a better programmer in other computer languages!</p><h2><strong><u>What Will I Learn as a Beginner?</u></strong></h2><ul><li>Learn the Data types, Variables, and Operators.</li><li>Know how to write basic instructions and functions in C.</li><li>Decision making in C.</li><li>C standard library.</li><li>Loops in C.</li><li>C Preprocessor commands.</li><li>Learn Functions, Arrays, Strings, Structures in C.</li><li>most importantly pointers.</li></ul><h2><strong><u>Description:</u></strong></h2><p><strong>C</strong> is a high-level and general-purpose programming language that is ideal for developing firmware or portable applications. Originally intended for writing system software, C was developed at Bell Labs by Dennis Ritchie for the Unix Operating System in the early 1970s.</p><p>Ranked among the most widely used languages, C has a compiler for most computer systems and has influenced many popular languages – notably C++.</p><p>C belongs to the structured, procedural paradigms of languages. It is proven, flexible and powerful and may be used for a variety of different applications. Although high level, C and assembly language share many of the same attributes.</p><h2><strong><u>Requirements:</u></strong></h2><p>No programming experience.</p><h2><strong><u>Target audience?</u></strong></h2><p>Anyone who is looking to learn C language.</p>',
			shortDescription: 'This course is meant to teach how to write programs to beginners of programming. It teaches how to get started with programming using C Language.',
			imageLarge: '',
			imageSmall: '',
			video: '',
			timeline: [{
				title: 'Introduction',
				topics: [{
					description: "<p>sxsxsxsxsxsxsxsxsx</p>",
					order: 0,
					subTopics: "zxzxz",
					timing: 33
				}],
				order: 0
			}],
			createdBy: '5c1b80b23bd70713241f5b0a',
			status: 0
		}
		async.forEachSeries(data.timeline, function (item2, cb2) {
			mongo.timeline.create({
				title: item2.title,
				order: item2.order
			}, (err2, docs2) => {
				if (err2) {
					console.log('==2==', err2);
				} else {
					timeId = docs2._id;
					timelineId.push(docs2._id);
					console.log(timeId, '*****timeId*******', timelineId, '===')
					async.forEachSeries(item2.topics, function (item3, cb3) {
						mongo.topics.create({
							description: item3.description,
							order: item3.order,
							subTopics: item3.subTopics,
							timing: item3.timing
						}, (err3, docs3) => {
							if (err3) {
								console.log('==3==', err3);
							} else {
								topId = docs3._id;
								topicsId.push(docs3._id);
								console.log(topId, '********topId*******', topicsId, '++')
								async.forEachSeries(item3.questions, function (item4, cb4) {
									mongo.questions.create(item4, (err4, docs4) => {
										if (err4) {
											console.log('==4==', err4);
											cb4();
										} else {
											questionsId.push(docs4._id);
											cb4();
										}
									})
								}, function (err4) {
									if (!err4) {
										if (questionsId.length > 0) {
											mongo.topics.update({
												_id: topId
											}, {
												$set: {
													questions: questionsId
												}
											}, (topicerr, topicdocs) => {
												if (topicerr) {
													console.log(topicerr);
													cb3()
												} else {
													questionsId = [];
													cb3();
												}
											})
										} else {
											cb3()
										}
									} else {
										console.log("===err4===", err4)
										cb3()
									}
								});
							}
						})
					}, function (err3) {
						if (!err3) {
							console.log("+++timeId++", timeId)
							console.log("++topicsId+++", topicsId)
							if (topicsId.length > 0) {
								mongo.timeline.update({
									_id: timeId
								}, {
									$set: {
										topics: topicsId
									}
								}, (timelineerr, timelinedocs) => {
									if (timelineerr) {
										console.log(timelineerr);
										cb2()
									} else {
										console.log("timeId data updated")
										topicsId = [];
										cb2();
									}
								})
							} else {
								cb2()
							}
						} else {
							console.log("===err3===", err3)
							cb2()
						}
					});
				}
			})
		}, function (err2) {
			if (!err2) {
				data.timeline = timelineId;
				console.log("+++course++", data)

				mongo.course.create(data, (err, docs) => {
					if (err) {
						result = {
							"result": false,
							"dev": err,
							"message": "something went wrong"
						};
						console.log(result);
						// reject(result);
					} else {
						mongo.category.find({
							'_id': data.categoryId
						}, (err, cat) => {
							//console.log(data);
							cat[0].course.push(docs._id);

							cat[0].save((err) => {
								if (err) {
									console.log(err);
								}
							});
						});
						result = {
							"result": true,
							"data": docs
						};
						console.log(result);
						// resolve(result);
					}
				})
			} else {
				console.log("====err2===", err2)
			}
		});
	}

}

module.exports = AdminController;