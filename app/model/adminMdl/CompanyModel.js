var mongoCompany = require("../../config/companySchema");
var mongoAdmin = require("../../config/schema");
var base = require("../../controller/baseController");
var result = {};

class CompanyModel{
    constructor(){ }

    companyRegister(data) {
		return new Promise((resolve, reject) => {
			mongoCompany.company.create(data, function (err, docs) {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					reject(result);
				} else {
					let time = '1h';
					let id = docs._id.toString();
					docs.token = base.genarateToken(data,id,time);
					docs.active = false;
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
								"data": docs
							}
							resolve(result);
						}
					});
				}
			});
		});
	}

	addInternship(data) {
		return new Promise((resolve, reject) => {
			mongoCompany.internship.create(data, function (err, docs) {
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

	listInternship() {
		return new Promise((resolve, reject) => {
			mongoCompany.internship.find()
			.populate('companyId')
			.populate({path: 'category', select:'categoryName'})
			.exec((err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	updateInternship(data) {
		return new Promise((resolve, reject) => {
			mongoCompany.internship.update({ _id: data._id}, { $set : data },
			(err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	updateStatusInternship(data) {
		return new Promise((resolve, reject) => {
			mongoCompany.internship.update({ _id: data._id}, { $set : data },
			(err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	getInternshipByCompanyId(companyId) {
		return new Promise((resolve, reject) => {
			mongoCompany.internship.find({ companyId: companyId})
			.sort({createdOn: 'desc'})
			.populate({ path: 'companyId', select: 'companyName'})
			.populate({path: 'category', select:'categoryName'})
			.exec((err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	deleteInternship(id) {
		return new Promise((resolve, reject) => {
			mongoCompany.internship.remove({ _id: id}, (err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	getInternship(id) {
		return new Promise((resolve, reject) => {
			mongoCompany.internship.findOne({ _id: id}, (err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	getFilterInternship(query) {
		return new Promise((resolve, reject) => {
			mongoCompany.internship.find(query)
			.populate('companyId')
			.populate({path: 'category', select:'categoryName'})
			.exec((err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	listCategory() {
		return new Promise((resolve, reject) => {
			mongoAdmin.category.find()
			.exec((err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	companyLogin(data) {
		return new Promise((resolve, reject) => {
			mongoCompany.company.find({ email: data.email, status: 0})
			.exec((err, docs) => {
				if (!err) {
					var hashPwd = (docs.length != 0) ? base.validPassword(data.password, docs[0]) : false;
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
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					reject(result);
				}
			});
		});
	}

	applyInternship(data) {
		return new Promise((resolve, reject) => {
			mongoCompany.apply_internship.create(data,(err, docs) => {
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
						"data": "Created Successfully"
					}
					resolve(result);
				}
			});
		});
	}

	userAppliedDetails(data) {
		return new Promise((resolve, reject) => {
			mongoCompany.internship.findOneAndUpdate({ _id : data.internshipId },
				{ $push : { users: data.userId}},(err, docs) => {
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
						"message": docs
					}
					resolve(result);
				}
			});
		});
	}

	listAppliedInternship(companyId, id) {
		return new Promise((resolve, reject) => {
			mongoCompany.apply_internship.find({companyId : companyId, internshipId : id})
			.populate({ path: 'categoryId', select: 'categoryName' })
			.populate({ path: 'userId', select: 'userName' })
			.populate({ path: 'internshipId', select: 'jobRole' })
			.exec((err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	listAllAppliedInternship(companyId) {
		return new Promise((resolve, reject) => {
			mongoCompany.apply_internship.find({companyId : companyId})
			.populate({ path: 'categoryId', select: 'categoryName' })
			.populate({ path: 'userId', select: 'userName' })
			.populate({ path: 'internshipId', select: 'jobRole' })
			.exec((err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	getAppliedInternship(id) {
		return new Promise((resolve, reject) => {
			mongoCompany.apply_internship.findOne({ _id: id })
			.populate({ path: 'categoryId', select: 'categoryName' })
			.populate({ path: 'userId', select: 'userName' })
			.populate({ path: 'internshipId', select: 'jobRole' })
			.exec((err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	emailExist(email) {
		return new Promise((resolve, reject) => {
			mongoCompany.company.findOne({ email: email }, (err, docs) => {
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
						"data": docs,
						"status": docs == null ? false:true
					}
					resolve(result);
				}
			});
		});
	}

	listCompany() {
		return new Promise((resolve, reject) => {
			mongoCompany.company.find({}).sort({createdOn: 'desc'})
			.exec((err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	getCompany(id) {
		return new Promise((resolve, reject) => {
			mongoCompany.company.find({ _id: id },(err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	updateStatusCompany(data) {
		return new Promise((resolve, reject) => {
			mongoCompany.company.update({ _id: data._id},{ $set : data },(err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	updateCompany(data) {
		return new Promise((resolve, reject) => {
			mongoCompany.company.update({ _id: data._id},{ $set : data },(err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	changePasswordCompany(data) {
		return new Promise((resolve, reject) => {
			mongoCompany.company.findOne({ _id: data._id},(err, docs) => {
				var hashPwd = (docs.length != 0) ? base.validPassword(data.oldPassword, docs) : false;
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					reject(result);
				} else {
					console.log(hashPwd,data.password);
					if(hashPwd){
						docs.password = base.hashPassword(data.password);
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
					}else{
						result = {
							"result": false,
							"message": "Incorrect Password"
						}
						resolve(result);
					}
				}
			});
		});
	}

	activationRequest(id) {
		return new Promise((resolve, reject) => {
			mongoCompany.company.findOne({ _id: id},(err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	forgotPwdRequest(email, hashPwd) {
		return new Promise((resolve, reject) => {
			mongoCompany.company.find({ email: email},(err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					reject(result);
				} else {
					if(docs.length != 0){
						docs[0].password = hashPwd;
						docs[0].save(function(err) {
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
					}else{
						result = {
							"result": false,
							"message": "Email Id not exist"
						}
						resolve(result);
					}
				}
			});
		});
	}

	changeActiveStatus(id) {
		return new Promise((resolve, reject) => {
			mongoCompany.company.update({ _id: id }, { $set : { active: true }},(err, docs) => {
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
						"data": docs
					}
					resolve(result);
				}
			});
		});
	}

	resendActiveLink(id) {
		return new Promise((resolve, reject) => {
			mongoCompany.company.find({ _id: id },(err, docs) => {
				if (err) {
					result = {
						"result": false,
						"dev": err,
						"message": "something went wrong"
					};
					reject(result);
				} else {
					if(docs.length != 0){
						let dataSet = {
							id: docs[0]._id,
							email: docs[0].email
						}; 
						docs[0].token = base.genarateToken(dataSet,id,'1h');	
						docs[0].save(function(err) {
							if (err) {
								result = {
									"result": false,
									"message": "Something went wrong"
								}
								reject(result);
							} else {
								result = {
									"result": true,
									"message": "Done successfully",
									"data": docs
								}
								resolve(result);
							}
						});
					}else{
						result = {
							"result": false,
							"message": "Email ID not found"
						}
						resolve(result);
					}
					
				}
			});
		});
	}

}

module.exports = CompanyModel;
