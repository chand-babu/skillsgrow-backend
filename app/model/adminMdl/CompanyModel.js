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
}

module.exports = CompanyModel;
