//var express = require("express");
var mongo = require("../../config/schema");
var base = require("../../controller/baseController");
var result = {};

class AdminModel {
	constructor() {

	}

	addAdministrator(data) {
		return new Promise((resolve, reject) => {
			mongo.admin.create(data, function (err, docs) {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					reject(result);
				} else {
					result = {
						"result": true,
						"data": "Added Successfully"
					}
					resolve(result);
				}
			});
		});
	}

	adminLogin(data) {
		return new Promise((resolve, reject) => {
			mongo.admin.findOne({ 'emailId': data.emailId }, (err, docs) => {

				if (!err) {
					var hashPwd = (docs != null) ? base.validPassword(data.password, docs) : false;
					if (!hashPwd) {
						result = {
							"result": false,
							"message": "Authentication failed"
						}
						resolve(result);
					} else {
						result = {
							"result": true,
							"message": "authenticaition success",
							"data": docs
						}
						resolve(result);
					}

				} else {
					result = {
						result: false,
						dev: err,
						message: "something went wrong"
					}
					reject(result);
				}

			});
		});
	}

	adminChangePwd(data) {
		return new Promise((resolve, reject) => {
			mongo.admin.findOne({ '_id': data.id }, (err, docs) => {

				if (!err) {
					var hashPwd = (docs != null) ? base.validPassword(data.pwd, docs) : false;
					if (!hashPwd) {
						result = {
							"result": false,
							"message": "password not matched"
						}
						reject(result);
					} else {
						docs.password = base.hashPassword(data.newpwd);
						docs.save(function(err) {
							if (err) {
								result = {
									"result": false,
									"message": "Something went wrong"
								}
								reject(result);
							} else {
								result = {
									"result": true,
									"message": "Done successfully"
								}
								resolve(result);
							}
						});
					}

				} else {
					result = {
						result: false,
						dev: err,
						message: "something went wrong"
					}
					reject(result);
				}

			});
		});
	}

	webLogin(data) {
		return new Promise((resolve, reject) => {
			mongo.register.findOne({ 'emailId': data.emailId }, (err, docs) => {
				if (!err) {
					var hashPwd = (docs != null) ? base.validPassword(data.password, docs) : false;
					if (!hashPwd) {
						result = {
							"result": false,
							"message": "Authentication failed"
						}
						resolve(result);
					} else if (!docs.active) {
						result = {
							"result": false,
							"message": "Account is yet not activated. please check your email for activation",
							"expired": true
						}
						resolve(result);
					} else {
						result = {
							"result": true,
							"message": "authenticaition success",
							"data": docs
						}
						resolve(result);
					}

				} else {
					result = {
						result: false,
						dev: err,
						message: "something went wrong"
					}
					reject(result);
				}

			});
		});
	}

	adminList() {
		return new Promise((resolve, reject) => {
			mongo.admin.find((err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			});
		});
	}

	adminToken(data) {
		return new Promise(function (resolve, reject) {
			mongo.token.create(data, function (err, docs) {
				if (err) {
					//console.log(err);
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					reject(result);
					//res.write(result);
				} else {
					result = {
						"result": true,
						"data": "Token Inserted"
					};
					resolve(result);
					//res.write(result);	
				}
			});
		});


	}

	checkToken(data) {
		return new Promise(function (resolve, reject) {
			mongo.token.find({ 'userId': data.userId }, function (err, docs) {
				if (err) {
					console.log(err);
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					resolve(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			});
		});
	}

	removeTokenDetails(id) {
		return new Promise((resolve, reject) => {
			mongo.token.find({ 'userId': id }).remove((err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		})
	}

	addCategory(data) {
		return new Promise((resolve, reject) => {
			mongo.category.create(data, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	updateCategory(data) {
		return new Promise((resolve, reject) => {
			console.log(data);
			mongo.category.update({ _id: data.id }, { $set: data }, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	listCategories() {
		return new Promise((resolve, reject) => {
			mongo.category.find()
				.populate('course').exec((err, docs) => {
					if (err) {
						result = {
							"result": false,
							"dev": err,
							"message": "something went wrong"
						};
						//console.log(result);
						reject(result);
					} else {
						result = {
							"result": true,
							"data": docs
						};
						//console.log(result);
						resolve(result);
					}
				})
		});
	}

	listCategoriesBycourse(id) {
		return new Promise((resolve, reject) => {
			mongo.category.find({ course: { _id : id} })
				.populate('course').exec((err, docs) => {
					if (err) {
						result = {
							"result": false,
							"dev": err,
							"message": "something went wrong"
						};
						//console.log(result);
						reject(result);
					} else {
						docs[0].course.filter((data) => {
							if(data._id == id){
								result = {
									"result": true,
									"data": data
								};
							}
						});
						resolve(result);
					}
				})
		});
	}

	getCategory(catId) {
		return new Promise((resolve, reject) => {
			mongo.category.findById(catId, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	deleteCategory(catId) {
		return new Promise((resolve, reject) => {
			mongo.category.find({ '_id': catId }).remove((err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					resolve(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		})
	}

	addCourse(data) {
		return new Promise((resolve, reject) => {
			mongo.course.create(data, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					mongo.category.find({ '_id': data.categoryId }, (err, cat) => {
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
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	updateCourse(data) {
		return new Promise((resolve, reject) => {
			mongo.course.update({ _id: data.courseId }, { $set: data }, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	listCourse() {
		return new Promise((resolve, reject) => {
			mongo.course.find((err, docs) => {
				console.log(docs);
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	getCourse(courseId) {
		return new Promise((resolve, reject) => {
			mongo.course.findById(courseId, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	deleteCourse(courseId) {
		return new Promise((resolve, reject) => {
			mongo.course.find({ '_id': courseId }).remove((err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					resolve(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		})
	}

	addUpdatedCourse(data) {
		return new Promise((resolve, reject) => {
			mongo.updatedCourse.create(data, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	addChapter(data) {
		return new Promise((resolve, reject) => {
			mongo.chapter.create(data, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	listChapter(data) {
		return new Promise((resolve, reject) => {
			mongo.chapter.find((err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	getChapter(chapterId) {
		return new Promise((resolve, reject) => {
			mongo.chapter.findById(chapterId, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	deleteChapter(chapterId) {
		return new Promise((resolve, reject) => {
			mongo.chapter.find({ '_id': chapterId }).remove((err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					resolve(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		})
	}

	updateChapter(data) {
		return new Promise((resolve, reject) => {
			mongo.chapter.update({ _id: data.chapterId }, { $set: data }, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	addTopic(data) {
		return new Promise((resolve, reject) => {
			mongo.topic.create(data, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	updateTopic(data) {
		return new Promise((resolve, reject) => {
			mongo.topic.update({ _id: data.topicId }, { $set: data }, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	listTopic(data) {
		return new Promise((resolve, reject) => {
			mongo.topic.find((err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	getTopic(topicId) {
		return new Promise((resolve, reject) => {
			mongo.topic.findById(topicId, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	deleteTopic(topicId) {
		return new Promise((resolve, reject) => {
			mongo.topic.find({ '_id': topicId }).remove((err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					resolve(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		})
	}

	addLearning(data) {
		return new Promise((resolve, reject) => {
			mongo.learning.create(data, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	listLearning() {
		return new Promise((resolve, reject) => {
			mongo.learning.find((err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	getLearning(learningId) {
		return new Promise((resolve, reject) => {
			mongo.learning.findById(learningId, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	deleteLearning(learningId) {
		return new Promise((resolve, reject) => {
			mongo.learning.find({ '_id': learningId }).remove((err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					resolve(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		})
	}

	updateLearning(data) {
		return new Promise((resolve, reject) => {
			mongo.learning.update({ _id: data.learningId }, { $set: data }, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	frontendRegister(data) {
		return new Promise((resolve, reject) => {
			mongo.register.create(data, function (err, docs) {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					reject(result);
				} else {
					result = {
						"result": true,
						"data": "Account Added Please Check Your Email For Activation",
						"id": docs._id
					}
					resolve(result);
				}
			});
		});
	}

	frontendBannerImages(data) {
		return new Promise((resolve, reject) => {
			mongo.bannerImages.create(data, function (err, docs) {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					reject(result);
				} else {
					result = {
						"result": true,
						"data": "Added Successfully"
					}
					resolve(result);
				}
			});
		});
	}

	listBannerImages() {
		return new Promise((resolve, reject) => {
			mongo.bannerImages.find((err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	getBannerImages(id) {
		return new Promise((resolve, reject) => {
			mongo.bannerImages.find({ _id : id }, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	deleteBannerImages(id) {
		return new Promise((resolve, reject) => {
			mongo.bannerImages.remove({ _id: id})
			.exec((err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	updateBannerImages(data) {
		return new Promise((resolve, reject) => {
			mongo.bannerImages.update({ _id: data.id }, { $set: data }, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	updateBannerImagesDetails(data) {
		return new Promise((resolve, reject) => {
			mongo.bannerImages.update({ _id: data.id }, { $set: data }, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	webContactus(data) {
		console.log(data);
		return new Promise((resolve, reject) => {
			mongo.contactus.create(data, function (err, docs) {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					reject(result);
				} else {
					result = {
						"result": true,
						"data": "sent successfully"
					}
					resolve(result);
				}
			});
		});
	}

	updateTheCourse(data) {
		return new Promise((resolve, reject) => {
			mongo.course.update({ _id: data._id }, { $set: data }, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"message": 'updated successfully'
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	updateEmail(data) {
		return new Promise((resolve, reject) => {
			data.forEach((datas) => {
				console.log(data);
				mongo.register.update({ _id: datas._id }, { $set: datas }, (err, user) => {
					if (err) {
						result = {
							"result": false,
							"message": "something went wrong",
							"dev": user
						};
						reject(result);
					} else {
						result = {
							"result": true,
							"data": "success",
							"dev": user
						};
						resolve(result);
					}
				});
			});
		});
	}

	updatedUserData(data) {
		return new Promise((resolve, reject) => {
			mongo.register.update({ _id: data._id }, { $set: data }, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"message": 'updated successfully',
						data: docs
					};
					//console.log(result);
					resolve(result);
				}
			});
		});
	}

	changePassword(data) {
		return new Promise((resolve, reject) => {
			mongo.register.update({ _id: data._id }, { $set: data }, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"message": 'updated successfully',
						data: docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	//Created by chand
	addChatForum(data) {
		return new Promise((resolve, reject) => {
			mongo.forumDiscussion.create(data, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": 'Message Send'
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	getChatForum(id) {
		return new Promise((resolve, reject) => {
			mongo.forumDiscussion.find({ courseId: id }, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	replyChatForum(data, courseId, discussId) {
		return new Promise((resolve, reject) => {
			mongo.forumDiscussion.update({ courseId: courseId, _id: discussId },
				{ $push : { replyMessage: data }},
				(err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					result = {
						"result": true,
						"data": docs
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

}

module.exports = AdminModel;