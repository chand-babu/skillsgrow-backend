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

/* plugin for forgot password */
var session = require('express-session')
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var crypto = require('crypto');

/* smtp config */

var smtpTransport = nodemailer.createTransport({
	host: 'smtp.zoho.in',
	port: 465,
	secure: 'true',
	auth: {
		user: 'admin@skillsgrow.com', // 'shrikumar01@gmail.com',//'!!! YOUR SENDGRID USERNAME !!!',
		pass: '$killsgrow123'// 'enter$2020'//'!!! YOUR SENDGRID PASSWORD !!!'
	}
});

var controller = {};
var result = {};

class AdminController {
	constructor() {
		this.admin = new AdminModule();
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
				res.send({ result: 'fail', error: { code: 1001, message: 'File is too big' } });
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
									var tokenResult = (response.result) ? { result: true, token: token } : { result: false, token: "Something Went wrong" };
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
		if (!token) return res.status(401).send({ result: false, message: 'No token provided.' });

		jwt.verify(token, tokenKey, (err, decoded) => {
			//console.log(err);
			if (err) {
				return res.status(500).send({ result: false, message: 'Failed to authenticate token.' });
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

	listCategoriesBycourse(req, res) {
		let id = req.params.id;
		console.log(id,'asdfs');
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
		console.log(req.body.timeline);
		var data = {
			'authorDetails': req.body.authorDetails,
			'boostText': req.body.boostText,
			'categoryId': req.body.categoryId,
			'courseName': req.body.courseName,
			'description': req.body.description,
			'shortDescription': req.body.shortDescription,
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
				res.send(reject)
			});
	}

	getCourse(req, res) {
		var courseId = req.params.courseid;
		this.admin.getCourse(courseId)
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
		var temptoken = jwt.sign({ userName: req.body.userName, emailId: req.body.emailId }, tokenKey, { expiresIn: '24h' });
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
		this.admin.frontendRegister(data)
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
			mongo.register.findOne({ emailId: req.body.emailId }).select().exec(function (err, user) {
				if (err) throw err;
				if (!user) {
					res.json({ resullt: false, message: 'email is not found' });
				} else if (!user.active) {
					res.json({ result: false, message: 'Account yet not activated !' });
				} else {
					//user.resetPasswordToken = jwt.sign(user.toJSON(), tokenKey, { expiresIn: '24h' });
					user.resetPasswordToken = token;
					user.save(function (err) {
						if (err) {
							res.json({ result: false, message: err });
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
							res.json({ result: true, message: 'please check your email' });
						}
					})
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
			mongo.register.findOne({ resetPasswordToken: req.params.token }).select()
			.exec(function (err, user) {
				if (err) throw err;
				if (user) {
					res.json({ success: true, data: user });
				} else {
					res.json({ success: false, message: 'password link is expired' });
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
		mongo.register.findOne({ emailId: req.body.emailId }).select().exec(function (err, user) {
			if (err) throw err;
			if (req.body.confirmPassword == null || req.body.confirmPassword == '') {
				res.json({ result: false, message: 'password not provided' });
			} else {
				var pwd = base.hashPassword(req.body.confirmPassword);
				user.password = pwd;
				user.resetPasswordToken = false;
				user.save(function (err) {
					if (err) {
						res.json({ success: false, message: err });
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
						res.json({ result: true, message: 'password has been reset' });
					}
				});
			}
		});
	}

	checkTokenForEmail(req, res, next) {
		mongo.register.findOne({ temporaryToken: req.params.token }).select().exec(function (err, user) {
			if (err) throw err;
			if (!user) {
				res.json({ result: false, message: 'link is expired' });
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
						res.json({ result: true, message: 'Account activated' });
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
		mongo.register.findOne({ emailId: req.body.email }, function (err, user) {
			var hashPwd = (user != null) ? base.validPassword(req.body.password, user) : false;
			if (err) throw err;

			if (!user) {
				res.json({ result: false, message: 'could not authenticate' });
			} else if (!hashPwd) {
				res.json({ result: false, message: 'password is invalid' })
			} else if (user.active) {
				res.json({ result: false, message: 'Account already activated' });
			} else {
				res.json({ result: true, data: user });
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
			mongo.register.findOne({ emailId: req.body.email }).select().exec(function (err, user) {
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
						res.json({ result: true, message: 'Activation link send to ' + req.body.email + '!' });
					}
				})
			})
		]);
	}

	courseReview(req, res, next) {
		mongo.course.findByIdAndUpdate({ _id: req.body.courseId }, { $push: { courseReview: req.body } },
			function (err, user) {
				if (err) {
					console.log(err);
				} else {
					if (user) {
						user.save(function (err) {
							if (err) {
								console.log(err);
							} else {
								res.json({ result: true, message: 'sent successfully' });
							}
						});
					}
				}
			});
	}

	courseEnrolled(req, res, next) {
		mongo.course.findByIdAndUpdate({ _id: req.body.courseId }, { $push: { enrolledUser: req.body } },
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
								res.json({ result: true, message: 'Enrolled successfully' });
							}
						});
					}
				}
			});
	}

	userCourseEnrolled(req, res, next) {
		mongo.register.findByIdAndUpdate({ _id: req.body.userId }, { $push: { courseEnrolled: req.body } },
			function (err, user) {
				if (err) {
					console.log(err);
				} else {
					if (user) {
						user.save(function (err) {
							if (err) {
								console.log(err);
							} else {
								res.json({ result: true, message: 'User Enrolled the course successfully' });
							}
						});
					}
				}
			});
	}

	userScore(req, res, next) {
		mongo.register.findOne({ _id: req.body.userId },
			function (err, user) {
				if (err) {
					console.log(err);
				} else {
					console.log(user);
					if (user) {
						user.courseEnrolled = req.body.courses;
						user.save(function (err) {
							if (err) {
								console.log(err);
							} else {
								res.json({ result: true, message: 'successfully submitted' });
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
				if (response.result) {
					res.send(response);
				} else {
					res.send(response);
				}
			}, (reject) => {
				res.send(reject)
			});
	}

	discussionForums(req, res, next) {
		let chatData = req.body.discussionData;
		mongo.course.findOne({ _id: req.body.courseId },
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
								res.json({ result: true, message: 'sent successfully' });
							}
						});
					}
				}
			});
	}

	getDiscussionForums(req, res, next) {
		mongo.course.findOne({ _id: req.params.courseId }, { discussionForums: 1 },
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
		mongo.register.findOne({ _id: req.body._id }, function (error, user) {
			if (user) {
				var hashPwd = base.validPassword(req.body.oldPassword, user)
				if (!hashPwd) {
					res.json({ result: false, message: 'Old Password is Incorrect' });
				} else {
					var pwd = base.hashPassword(req.body.password);
					user.password = pwd;
					user.loginStatus = req.body.loginStatus;
					user.save(function (err) {
						if (err) {
							console.log(err);
						} else {
							res.json({ result: true, message: 'Password Change Successfully' });
						}
					});
				}
			}
		})
	}

	checkEmailExistOrNot(req, res) {
		mongo.register.findOne({ emailId: req.params.emailId }, function (error, user) {
			if (user) {
				res.json({ result: true, message: 'Email Alredy there', _id: user._id });
			} else {
				res.json({ result: false, message: 'Email is not found' });
			}
		})
	}

	courseFaq(req, res) {
		mongo.course.findOne({ _id: req.body.courseId }, function (err, course) {
			if (err) {
				console.log(err);
			} else {
				if (course) {
					course.faq = req.body.faq;
					course.save(function (err) {
						if (err) {
							console.log(err);
						} else {
							res.json({ result: true, message: 'FAQ sent successfully' });
						}
					});
				}
			}
		})
	}

	deleteFaq(req, res) {
		mongo.course.findOne({ _id: req.body.courseId }, function (err, course) {
			if (err) {
				console.log(err);
			} else {
				if (course) {
					course.faq = req.body.faq;
					course.save(function (err) {
						if (err) {
							console.log(err);
						} else {
							res.json({ result: true, message: 'Delete Successfully' });
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
		mongo.course.findOne({ _id: req.params.userId }, function (err, data) {
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
		console.log(req.body);
		mongo.payuResponseScheme.create(req.body, function (err, docs) {
			if (err) {
				console.log(err);
			} else {
				console.log(docs);
				res.redirect('http://localhost:4200/response/' + req.body.mihpayid + '');
			}
		});
	}

	payuGetResponse(req, res) {
		mongo.payuResponseScheme.find({ mihpayid: req.params.id }, function (err, user) {
			if (err) {
				res.json({
					"result": false,
					"message": "something went wrong"
				});
			} else {
				console.log(user);
				res.json({
					"result": true,
					"data": user
				});
			}
		});
	}

	certificatePayment(req, res) {
		mongo.register.findByIdAndUpdate({ _id: req.body._id }).select().exec(function (err, user) {
			if (!user) {
				res.json({
					"result": false,
					"message": "something went wrong"
				});
			} else {
				user.courseEnrolled.filter((data, index) => {
					if (req.body.courseId === data._id) {
						user.courseEnrolled[index].authorDetails[0].certificatePayment = true;
						console.log(user.courseEnrolled[index].authorDetails[0].certificatePayment);
						user.save(function(err) {
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
		mongo.register.find({ status: req.params.status }, function (err, user) {
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
		mongo.register.update({ _id: req.body._id }, { $set: req.body }, function (err, docs) {
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
		mongo.register.findByIdAndRemove({"_id": req.params.id }, (err, docs) => {
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
		mongo.register.find({}, { _id: 1, userName: 1, emailId: 1, 
			phone: 1, profilePic:1, courseEnrolled:1 }).lean()
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
		mongo.course.update({_id: req.body._id}, {$set: req.body}, (err,docs) => {
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
		mongo.course.findByIdAndRemove({_id: req.params.id}, (err,docs) => {
			if (err) {
				res.json({
					"result": false,
					"message": "something went wrong",
					"dev": docs
				});
			} else {
				res.json({
					"result": true,
					"mesage": "delete successfully",
					"data": docs
				});
			}
		})
	}

	getCourseById(req, res) {
		mongo.course.find({_id: req.params.id}, (err,data) => {
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
		mongo.category.find({}, { _id: 1, categoryName: 1, categoryImg: 1}).lean()
		 .populate({path: 'course', select: 'courseName _id'})
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
		mongo.course.find({}).limit(7)
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
			title : req.body.title,
			permissions : req.body.permissions,
			status : 0
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
			id : req.body.id,
			title : req.body.title,
			permissions : req.body.permissions,
			status : 0
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
}

module.exports = AdminController;
