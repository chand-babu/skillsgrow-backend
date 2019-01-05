var CompanyModule = require("../../model/adminMdl/CompanyModel");
var base = require("../baseController");

class CompanyController{
    constructor(){
        this.company = new CompanyModule();
    }

    postInternship(req, res){
        let register = {
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            email : req.body.email,
            contact : req.body.contact,
            companyName : req.body.companyName,
            companyUrl : req.body.companyUrl,
            companyDescription : req.body.companyDescription,
            companyLogo : req.body.companyLogo,
            status : 0
        }
         
        let internship = {
            category : req.body.category,
            jobRole : req.body.jobRole,
            dateOfJoining : req.body.dateOfJoining,
            location : req.body.location,
            qualification : req.body.qualification,
            salary : req.body.salary,
            internType : req.body.internType,
            contactPersonNo : req.body.contactPersonNo,
            contactPersonEmail : req.body.contactPersonEmail,
            jobDescription : req.body.jobDescription,
            status : 0
        }
        this.company.companyRegister(register)
		.then((response) => {
			if (response.result) {
                //start intern post
                internship.companyId = response.data._id;
                this.company.addInternship(internship)
                .then((internResponse) => {
                    if (internResponse.result) {
                        res.send(internResponse);
                    } else {
                        res.send(internResponse);
                    }
                }, (reject) => {
                    res.send(reject);
                });
                //end intern post
			} else {
				res.send(response);
			}
		}, (reject) => {
			res.send(reject);
		});
    }

    getInternship(req , res){
        this.company.getInternship()
        .then((response) => {
            if(response.result){
                res.send(response);
            }else{
                res.send(response);
            }
        },(reject) => {
            res.send(reject);
        })
    }

    getFilterInternship(req , res){
        let splitSalary = '';
        let salaryBetween = {};

        if(req.params.salary == 'null'){
            splitSalary = req.params.salary;
        }else{
            splitSalary = req.params.salary.split('-');
            salaryBetween = { $gte: splitSalary[0], $lte: splitSalary[1] };
        }

        let query = {
            category: req.params.category,
            internType: req.params.jobType,
            location: req.params.location,
            salary: (req.params.salary == 'null') ? splitSalary:salaryBetween
        };
        for(var key in query) {
            if(query.hasOwnProperty(key)){
                if(query[key] == 'null'){
                    delete query[key];
                }
            }
        }
        this.company.getFilterInternship(query)
            .then((response) => {
                if(response.result){
                    res.send(response);
                }else{
                    res.send(response);
                }
            },(reject) => {
                res.send(reject);
            });
    }

    listCategory(req , res){
        this.company.listCategory()
        .then((response) => {
            if(response.result){
                res.send(response);
            }else{
                res.send(response);
            }
        },(reject) => {
            res.send(reject);
        })
    }
}

module.exports = CompanyController;