//var express = require("express");
var async = require('async');
// var await = require('asyncawait/await');
var mongo = require("../../config/schema");
var base = require("../../controller/baseController");
var result = {};
let self;

class AdminModel {
	constructor() {
		self = this;
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

	updateAdministrator(data) {
		return new Promise((resolve, reject) => {
			mongo.admin.update({
				_id: data.id
			}, {
				$set: data
			}, function (err, docs) {
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
						"data": "updated Successfully"
					}
					resolve(result);
				}
			});
		});
	}

	adminLogin(data) {
		return new Promise((resolve, reject) => {
			mongo.admin.findOne({
					'emailId': data.emailId,
					'status': {
						$ne: 2
					}
				})
				.populate('rollsPermission')
				.exec((err, docs) => {

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
			mongo.admin.findOne({
				'_id': data.id
			}, (err, docs) => {

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
						docs.save(function (err) {
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
			mongo.register.findOne({
				'emailId': data.emailId
			}, (err, docs) => {
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
			mongo.admin.find({
					status: {
						$ne: 0
					}
				}, {
					password: 0
				})
				.populate('rollsPermission')
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
				});
		});
	}

	adminGet(id) {
		return new Promise((resolve, reject) => {
			mongo.admin.find({
					_id: id
				}, {
					password: 0
				})
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
				});
		});
	}

	adminDelete(id) {
		return new Promise((resolve, reject) => {
			mongo.admin.remove({
					_id: id
				})
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
			mongo.token.find({
				'userId': data.userId
			}, function (err, docs) {
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
			mongo.token.find({
				'userId': id
			}).remove((err, docs) => {
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
			mongo.category.update({
				_id: data.id
			}, {
				$set: data
			}, (err, docs) => {
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

	changeCategoryType(data) {
		return new Promise((resolve, reject) => {
			mongo.category.update({
				_id: data.id
			}, {
				$set: data
			}, (err, docs) => {
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
				// .populate('course')
				.populate([{
					path: 'course',
					select: {
						'discussionForums': 0,
						'faq': 0
					},
					populate: [{
						path: 'enrolledUser',
						populate: {
							path: 'userId',
							select: {
								'emailId': 1,
								'userName': 1
							}
						}
					}]
				}]) //modified by nandita
				.populate([{
					path: 'course',
					select: {
						'discussionForums': 0,
						'faq': 0
					},
					populate: [{
						path: 'courseReview',
						populate: {
							path: 'userId',
							select: {
								'emailId': 1,
								'userName': 1
							}
						}
					}]
				}]) //modified by nandita
				.populate([{
					path: 'course',
					select: {
						'discussionForums': 0,
						'faq': 0
					},
					populate: [{
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
					}]
				}]) //modified by nandita
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

	listCategoryType(status) {
		return new Promise((resolve, reject) => {
			mongo.category.find({
					categoryType: status
				})
				.populate({
					path: 'course',
					select: '_id courseName'
				})
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
				});
		});
	}

	listCategoriesBycourse(id) {
		return new Promise((resolve, reject) => {
			mongo.category.find({
					course: {
						_id: id
					}
				})
				.populate('course')
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
						docs[0].course.filter((data) => {
							if (data._id == id) {
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
			mongo.category.find({
				'_id': catId
			}).remove((err, docs) => {
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

	// addCourse(data) {
	// 	return new Promise((resolve, reject) => {
	// 		mongo.course.create(data, (err, docs) => {
	// 			if (err) {
	// 				result = {
	// 					"result": false,
	// 					"dev": err,
	// 					"message": "something went wrong"
	// 				};
	// 				//console.log(result);
	// 				reject(result);
	// 			} else {
	// 				mongo.category.find({
	// 					'_id': data.categoryId
	// 				}, (err, cat) => {
	// 					//console.log(data);
	// 					cat[0].course.push(docs._id);

	// 					cat[0].save((err) => {
	// 						if (err) {
	// 							console.log(err);
	// 						}
	// 					});
	// 				});
	// 				result = {
	// 					"result": true,
	// 					"data": docs
	// 				};
	// 				//console.log(result);
	// 				resolve(result);
	// 			}
	// 		})
	// 	});
	// }

	addCourse(data) {
		let timeId;
		let topId;
		let timelineId = [];
		let topicsId = [];
		let questionsId = [];
		return new Promise((resolve, reject) => {
			async.forEachSeries(data.timeline, function (item2, cb2) {
				mongo.timeline.create({
					title: item2.title,
					order: item2.order
				}, (timelineErr, docs2) => {
					if (timelineErr) {
						result = {
							"result": false,
							"timelineErr": timelineErr,
							"message": "something went wrong"
						};
						reject(result);
					} else {
						timeId = docs2._id;
						timelineId.push(docs2._id);
						async.forEachSeries(item2.topics, function (item3, cb3) {
							mongo.topics.create({
								description: item3.description,
								order: item3.order,
								subTopics: item3.subTopics,
								timing: item3.timing
							}, (topicErr, docs3) => {
								if (topicErr) {
									result = {
										"result": false,
										"topicErr": topicErr,
										"message": "something went wrong"
									};
									reject(result);
								} else {
									topId = docs3._id;
									topicsId.push(docs3._id);
									async.forEachSeries(item3.questions, function (item4, cb4) {
										mongo.questions.create(item4, (quesErr, docs4) => {
											if (quesErr) {
												result = {
													"result": false,
													"quesErr": quesErr,
													"message": "something went wrong"
												};
												reject(result);
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
												}, (topicUpadteErr, topicdocs) => {
													if (topicUpadteErr) {
														result = {
															"result": false,
															"topicUpadteErr": topicUpadteErr,
															"message": "something went wrong"
														};
														reject(result);
													} else {
														questionsId = [];
														cb3();
													}
												})
											} else {
												cb3()
											}
										} else {
											result = {
												"result": false,
												"err4": err4,
												"message": "something went wrong"
											};
											reject(result);
										}
									});
								}
							})
						}, function (err3) {
							if (!err3) {
								if (topicsId.length > 0) {
									mongo.timeline.update({
										_id: timeId
									}, {
										$set: {
											topics: topicsId
										}
									}, (timelineUpadtEerr, timelinedocs) => {
										if (timelineUpadtEerr) {
											result = {
												"result": false,
												"topicErr": topicErr,
												"message": "something went wrong"
											};
											reject(result);
										} else {
											topicsId = [];
											cb2();
										}
									})
								} else {
									cb2();
								}
							} else {
								result = {
									"result": false,
									"err3": err3,
									"message": "something went wrong"
								};
								reject(result);
							}
						});
					}
				})
			}, function (err2) {
				if (!err2) {
					data.timeline = timelineId;
					mongo.course.create(data, (courseErr, courseDocs) => {
						if (courseErr) {
							result = {
								"result": false,
								"courseErr": courseErr,
								"message": "something went wrong"
							};
							reject(result);
						} else {
							mongo.category.find({
								'_id': data.categoryId
							}, (catErr, catDocs) => {
								if (!catErr) {
									catDocs[0].course.push(courseDocs._id);
									catDocs[0].save((catSaveErr) => {
										if (catSaveErr) {
											result = {
												"result": false,
												"catSaveErr": catSaveErr,
												"message": "something went wrong"
											};
											reject(result);
										}
									});
								} else {
									result = {
										"result": false,
										"catErr": catErr,
										"message": "something went wrong"
									};
									reject(result);
								}
							});
							result = {
								"result": true,
								"data": courseDocs
							};
							resolve(result);
						}
					})
				} else {
					result = {
						"result": false,
						"err2": err2,
						"message": "something went wrong"
					};
					reject(result);
				}
			});
		});
	}

	updateCourse(data) {
		return new Promise((resolve, reject) => {
			mongo.course.update({
				_id: data.courseId
			}, {
				$set: data
			}, (err, docs) => {
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

	getAllCourse() {
		return new Promise((resolve, reject) => {
			mongo.course.find({
					active: true
				}, {
					discussionForums: 0,
					faq: 0,
					description: 0
				})
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
							"data": data
						};
						//console.log(result);
						resolve(result);
					}
				})
		});
	}

	getCategoryCourseList(req) {
		return new Promise((resolve, reject) => {
			mongo.category.find({
					_id: req.params.categoryId
				}, {
					_id: 1,
					categoryName: 1
				})
				.lean()
				// .populate({
				// 	path: 'course',
				// })
				.populate([{
					path: 'course',
					populate: [{
						path: 'enrolledUser',
						populate: {
							path: 'userId',
							select: {
								'emailId': 1,
								'userName': 1
							}
						}
					}]
				}]) //modified by nandita
				.populate([{
					path: 'course',
					populate: [{
						path: 'courseReview',
						populate: {
							path: 'userId',
							select: {
								'emailId': 1,
								'userName': 1
							}
						}
					}]
				}]) //modified by nandita
				.populate([{
					path: 'course',
					populate: [{
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
					}]
				}]) //modified by nandita
				.exec((err, data) => {
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
							"data": data
						};
						resolve(result);
					}
				})
		});
	}

	getCategoryCourseListByName(req) {
		return new Promise((resolve, reject) => {
			mongo.category.find({
					categoryName: new RegExp(["^", req.params.categoryName, "$"].join(""), "i")
				}, {
					_id: 1,
					categoryName: 1
				})
				.lean()
				.populate([{
					path: 'course',
					populate: [{
						path: 'enrolledUser',
						populate: {
							path: 'userId',
							select: {
								'emailId': 1,
								'userName': 1
							}
						}
					}]
				}]) 
				.populate([{
					path: 'course',
					populate: [{
						path: 'courseReview',
						populate: {
							path: 'userId',
							select: {
								'emailId': 1,
								'userName': 1
							}
						}
					}]
				}])
				.populate([{
					path: 'course',
					populate: [{
						path: 'timeline',
						populate: [{
							path: 'topics',
							populate: {
								path: 'questions'
							}
						}]
					}]
				}]) 
				.exec((err, data) => {
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
							"data": data
						};
						resolve(result);
					}
				})
		});
	} //created by nandita

	deleteCourse(courseId) {
		return new Promise((resolve, reject) => {
			mongo.course.find({
				'_id': courseId
			}).remove((err, docs) => {
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
			mongo.chapter.find({
				'_id': chapterId
			}).remove((err, docs) => {
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
			mongo.chapter.update({
				_id: data.chapterId
			}, {
				$set: data
			}, (err, docs) => {
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
			mongo.topic.update({
				_id: data.topicId
			}, {
				$set: data
			}, (err, docs) => {
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

	// deleteTopic(topicId) {
	// 	return new Promise((resolve, reject) => {
	// 		mongo.topic.find({
	// 			'_id': topicId
	// 		}).remove((err, docs) => {
	// 			if (err) {
	// 				result = {
	// 					"result": false,
	// 					"dev": err,
	// 					"message": "something went wrong"
	// 				};
	// 				//console.log(result);
	// 				resolve(result);
	// 			} else {
	// 				result = {
	// 					"result": true,
	// 					"data": docs
	// 				};
	// 				//console.log(result);
	// 				resolve(result);
	// 			}
	// 		})
	// 	})
	// }

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
			mongo.learning.find({
				'_id': learningId
			}).remove((err, docs) => {
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
			mongo.learning.update({
				_id: data.learningId
			}, {
				$set: data
			}, (err, docs) => {
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
			mongo.bannerImages.find({
				_id: id
			}, (err, docs) => {
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
			mongo.bannerImages.remove({
					_id: id
				})
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
			mongo.bannerImages.update({
				_id: data.id
			}, {
				$set: data
			}, (err, docs) => {
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
			mongo.bannerImages.update({
				_id: data.id
			}, {
				$set: data
			}, (err, docs) => {
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
		let timeId;
		let topId;
		let topicData;
		let timelineData;
		let timelineId = [];
		let topicsId = [];
		let questionsId = [];
		return new Promise((resolve, reject) => {
			async.forEachSeries(data.timeline, function (item2, cb2) {
				if (item2._id) {
					timeId = item2._id;
					timelineData = item2;
					mongo.timeline.update({
						_id: item2._id
					}, {
						$set: {
							title: item2.title,
							order: item2.order
						}
					}, (timelineUpdateErr, timelineUpdateDocs) => {
						if (timelineUpdateErr) {
							result = {
								"result": false,
								"timelineUpdateErr": timelineUpdateErr,
								"message": "something went wrong"
							};
							reject(result);
						} else {
							async.forEachSeries(item2.topics, function (item3, cb3) {
								if (item3._id) {
									topId = item3._id;
									topicData = item3;
									mongo.topics.update({
										_id: item3._id
									}, {
										$set: {
											description: item3.description,
											order: item3.order,
											subTopics: item3.subTopics,
											timing: item3.timing
										}
									}, (topicsUpdateErr, topicsUpdateDocs) => {
										if (topicsUpdateErr) {
											result = {
												"result": false,
												"topicsUpdateErr": topicsUpdateErr,
												"message": "something went wrong"
											};
											reject(result);
										} else {
											async.forEachSeries(item3.questions, function (item4, cb4) {
												if (item4._id) {
													mongo.questions.update({
														_id: item4._id
													}, {
														$set: item4
													}, (questionsUpdateErr, questionsUpdateDocs) => {
														if (questionsUpdateErr) {
															result = {
																"result": false,
																"questionsUpdateErr": questionsUpdateErr,
																"message": "something went wrong"
															};
															reject(result);
														} else {
															cb4();
														}
													})
												} else {
													mongo.questions.create(item4, (quesErr, docs4) => {
														if (quesErr) {
															result = {
																"result": false,
																"quesErr": quesErr,
																"message": "something went wrong"
															};
															reject(result);
														} else {
															questionsId.push(docs4._id);
															cb4();
														}
													})
												}
											}, function (err4) {
												if (!err4) {
													console.log("&&coming&SURAJ")
													topicData.questions.filter((questionsData) => {
														if (questionsData._id) {
															questionsId.push(questionsData._id)
														}
													});
													// if (questionsId.length > 0) {
													mongo.topics.find({
														'_id': topId
													}, (topicfindErr, topicDocsData) => {
														if (!topicfindErr) {
															console.log("^^^44444", topicDocsData[0].questions)
															for (var id of topicDocsData[0].questions) {
																console.log(id, "^^^^", questionsId.includes(id.toString()))
																if (!questionsId.includes(id.toString())) {
																	self.deleteQestion(id);
																}
															}
															mongo.topics.update({
																_id: topId
															}, {
																$set: {
																	questions: questionsId
																}
															}, (topicUpadteErr, topidocs) => {
																if (topicUpadteErr) {
																	result = {
																		"result": false,
																		"topicUpadteErr": topicUpadteErr,
																		"message": "something went wrong"
																	};
																	reject(result);
																} else {
																	questionsId = [];
																	cb3();
																}
															})
														} else {
															result = {
																"result": false,
																"topicfindErr": topicfindErr,
																"message": "something went wrong"
															};
															reject(result);
														}
													});

													// } else {
													// 	cb3()
													// }
												} else {
													result = {
														"result": false,
														"err4": err4,
														"message": "something went wrong"
													};
													reject(result);
												}
											});
										}
									})
								} else {
									mongo.topics.create({
										description: item3.description,
										order: item3.order,
										subTopics: item3.subTopics,
										timing: item3.timing
									}, (topicErr, docs3) => {
										if (topicErr) {
											result = {
												"result": false,
												"topicErr": topicErr,
												"message": "something went wrong"
											};
											reject(result);
										} else {
											topId = docs3._id;
											topicData = docs3;
											topicsId.push(docs3._id);
											async.forEachSeries(item3.questions, function (item4, cb4) {
												mongo.questions.create(item4, (quesErr, docs4) => {
													if (quesErr) {
														result = {
															"result": false,
															"quesErr": quesErr,
															"message": "something went wrong"
														};
														reject(result);
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
														}, (topicUpadteErr, topicdocs) => {
															if (topicUpadteErr) {
																result = {
																	"result": false,
																	"topicUpadteErr": topicUpadteErr,
																	"message": "something went wrong"
																};
																reject(result);
															} else {
																questionsId = [];
																cb3();
															}
														})
													} else {
														cb3()
													}
												} else {
													result = {
														"result": false,
														"err4": err4,
														"message": "something went wrong"
													};
													reject(result);
												}
											});
										}
									})
								}
							}, function (err3) {
								if (!err3) {
									timelineData.topics.filter((topicsData) => {
										if (topicsData._id) {
											topicsId.push(topicsData._id)
										}
									});
									// if (topicsId.length > 0) {
									mongo.timeline.find({
										'_id': timeId
									}, (timelineUpadtEerr, timelinedocs) => {
										if (!timelineUpadtEerr) {
											mongo.timeline.update({
												_id: timeId
											}, {
												$set: {
													topics: topicsId
												}
											}, (timelineUpadtEerr, timelineUpdateDocs) => {
												if (timelineUpadtEerr) {
													result = {
														"result": false,
														"topicErr": topicErr,
														"message": "something went wrong"
													};
													reject(result);
												} else {
													for (var id of timelinedocs[0].topics) {
														if (!topicsId.includes(id.toString())) {
															self.deleteTopic(id);
														}
													}
													topicsId = [];
													cb2();
												}
											})
										} else {
											result = {
												"result": false,
												"timelineUpadtEerr": timelineUpadtEerr,
												"message": "something went wrong"
											};
											reject(result);
										}
									});

									// } else {
									// 	cb2();
									// }
								} else {
									result = {
										"result": false,
										"err3": err3,
										"message": "something went wrong"
									};
									reject(result);
								}
							});
						}
					})
				} else if (item2.title != '') {
					mongo.timeline.create({
						title: item2.title,
						order: item2.order
					}, (timelineErr, docs2) => {
						if (timelineErr) {
							result = {
								"result": false,
								"timelineErr": timelineErr,
								"message": "something went wrong"
							};
							reject(result);
						} else {
							timeId = docs2._id;
							timelineId.push(docs2._id);
							async.forEachSeries(item2.topics, function (item3, cb3) {
								mongo.topics.create({
									description: item3.description,
									order: item3.order,
									subTopics: item3.subTopics,
									timing: item3.timing
								}, (topicErr, docs3) => {
									if (topicErr) {
										result = {
											"result": false,
											"topicErr": topicErr,
											"message": "something went wrong"
										};
										reject(result);
									} else {
										topId = docs3._id;
										topicsId.push(docs3._id);
										async.forEachSeries(item3.questions, function (item4, cb4) {
											mongo.questions.create(item4, (quesErr, docs4) => {
												if (quesErr) {
													result = {
														"result": false,
														"quesErr": quesErr,
														"message": "something went wrong"
													};
													reject(result);
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
													}, (topicUpadteErr, topicdocs) => {
														if (topicUpadteErr) {
															result = {
																"result": false,
																"topicUpadteErr": topicUpadteErr,
																"message": "something went wrong"
															};
															reject(result);
														} else {
															questionsId = [];
															cb3();
														}
													})
												} else {
													cb3()
												}
											} else {
												result = {
													"result": false,
													"err4": err4,
													"message": "something went wrong"
												};
												reject(result);
											}
										});
									}
								})
							}, function (err3) {
								if (!err3) {
									if (topicsId.length > 0) {
										mongo.timeline.update({
											_id: timeId
										}, {
											$set: {
												topics: topicsId
											}
										}, (timelineUpadtEerr, timelinedocs) => {
											if (timelineUpadtEerr) {
												result = {
													"result": false,
													"topicErr": topicErr,
													"message": "something went wrong"
												};
												reject(result);
											} else {
												topicsId = [];
												cb2();
											}
										})
									} else {
										cb2();
									}
								} else {
									result = {
										"result": false,
										"err3": err3,
										"message": "something went wrong"
									};
									reject(result);
								}
							});
						}
					})
				}else{
					cb2();
				}
			}, function (err2) {
				if (!err2) {
					data.timeline.filter((timelineData) => {
						if (timelineData._id) {
							timelineId.push(timelineData._id)
						}
					});
					data.timeline = timelineId;
					mongo.course.find({
						'_id': data._id
					}, (courseUpadtEerr, coursedocs) => {
						if (!courseUpadtEerr) {
							mongo.course.update({
								_id: data._id
							}, {
								$set: data
							}, (err, docs) => {
								if (err) {
									result = {
										"result": false,
										"dev": err,
										"message": "something went wrong"
									};
									reject(result);
								} else {
									for (var id of coursedocs[0].timeline) {
										if (!timelineId.includes(id.toString())) {
											self.deleteTimeline(id);
										}
									}
									result = {
										"result": true,
										"message": 'updated successfully'
									};
									resolve(result);
								}
							})
						} else {
							result = {
								"result": false,
								"courseUpadtEerr": courseUpadtEerr,
								"message": "something went wrong"
							};
							reject(result);
						}
					});

				} else {
					result = {
						"result": false,
						"err2": err2,
						"message": "something went wrong"
					};
					reject(result);
				}
			});
		});
	}


	async deleteQestion(questionId) {
		await mongo.questions.find({
			'_id': questionId
		}).remove((err, questionsDeleteDocs) => {
			if (!err) {
				console.log('==questionsDeleteDocs===', questionsDeleteDocs.result);
			}
		})
	} //added by nandita

	async deleteQuestions(topicId) {
		await mongo.topics.find({
			'_id': topicId
		}, (toErr, toDocs) => {
			if (!toErr) {
				for (var qId of toDocs[0].questions) {
					self.deleteQestion(qId);
				}
			}
		})
	} //added by nandita

	async deleteTopic(topicId) {
		await self.deleteQuestions(topicId)
		await mongo.topics.find({
			'_id': topicId
		}).remove((err, topicsDeleteDocs) => {
			if (!err) {
				console.log('==topicsDeleteDocs===', topicsDeleteDocs.result);
			}
		})
	} //added by nandita

	async deleteTopics(timelineId) {
		await mongo.timeline.find({
			'_id': timelineId
		}, (timErr, timDocs) => {
			if (!timErr) {
				for (var topicId of timDocs[0].topics) {
					// self.deleteQuestions(topicId)
					self.deleteTopic(topicId)
				}
			}
		});
	} //added by nandita

	async deleteTimeline(timelineId) {
		await self.deleteTopics(timelineId);
		await mongo.timeline.find({
			'_id': timelineId
		}).remove((err, timelineDeleteDocs) => {
			if (!err) {
				console.log('==timelineDeleteDocs===', timelineDeleteDocs.result);
			}
		})
	} //added by nandita

	updateEmail(data) {
		return new Promise((resolve, reject) => {
			data.forEach((datas) => {
				console.log(data);
				mongo.register.update({
					_id: datas._id
				}, {
					$set: datas
				}, (err, user) => {
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
			mongo.register.update({
				_id: data._id
			}, {
				$set: data
			}, (err, docs) => {
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
			mongo.register.update({
				_id: data._id
			}, {
				$set: data
			}, (err, docs) => {
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
			mongo.forumDiscussion.find({
				courseId: id
			}, (err, docs) => {
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
			mongo.forumDiscussion.update({
					courseId: courseId,
					_id: discussId
				}, {
					$push: {
						replyMessage: data
					}
				},
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

	addRollsPermissions(data) {
		return new Promise((resolve, reject) => {
			mongo.rollsPermissions.create(data, (err, docs) => {
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
						"data": 'Successfully Added'
					};
					//console.log(result);
					resolve(result);
				}
			})
		});
	}

	updateRollsPermissions(data) {
		return new Promise((resolve, reject) => {
			mongo.rollsPermissions.update({
					_id: data.id
				}, {
					$set: data
				},
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

	listRollsPermissions() {
		return new Promise((resolve, reject) => {
			mongo.rollsPermissions.find((err, docs) => {
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

	deleteRollsPermissions(id) {
		return new Promise((resolve, reject) => {
			mongo.rollsPermissions.remove({
				_id: id
			}, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					//console.log(result);
					reject(result);
				} else {
					mongo.admin.update({}, {
						$pull: {
							rollsPermission: [id]
						}
					}, (err, doc) => {
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
								"data": doc
							};
							resolve(result);
						}
					});
				}
			})
		});
	}

	getRollsPermissions(id) {
		return new Promise((resolve, reject) => {
			mongo.rollsPermissions.find({
				_id: id
			}, (err, docs) => {
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

	trandingCourse(data) {
		return new Promise((resolve, reject) => {
			mongo.course.find({
				active: true,
				viewTrending: true
			}, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					reject(result);
				} else {
					let count = docs.length;
					if (count >= 6 && data.viewTrending == true) {
						result = {
							"result": true,
							"status": true
						};
						resolve(result);
					} else {
						mongo.course.update({
							_id: data.id
						}, {
							$set: data
						}, (err, doc) => {
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
									"data": doc
								};
								resolve(result);
							}
						});
					}

				}
			})
		});
	}


	//Created by Nandita
	addEnrolledUser(data) {
		return new Promise((resolve, reject) => {
			mongo.enrolledUser.create(data, (err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					reject(result);
				} else {
					// console.log(docs,'====')
					result = {
						"result": true,
						"enroll_id": docs._id,
						"data": 'Enrolled User data save successfully'
					};
					resolve(result);
				}
			})
		});
	}

	addCourseReviewUser(data) {
		return new Promise((resolve, reject) => {
			mongo.courseReview.create(data, (err, docs) => {
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
						"courseReview_id": docs._id,
						"data": 'Course review User data save successfully'
					};
					resolve(result);
				}
			})
		});
	}


}

module.exports = AdminModel;