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
					result = {
						"result": true,
						"data": docs
					}
					resolve(result);
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

	getInternship() {
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

	getInternshipByCompanyId(companyId) {
		return new Promise((resolve, reject) => {
			mongoCompany.internship.find({ companyId: companyId})
			// .populate('companyId')
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

	listAppliedInternship(companyId) {
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
}

module.exports = CompanyModel;
