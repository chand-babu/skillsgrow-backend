var CompanyModule = require("../../model/adminMdl/CompanyModel");
var base = require("../baseController");
var url = 'https://skillsgrow.com/';


class CompanyController{
    constructor(){
        this.company = new CompanyModule();
    }

    postInternship(req, res){
        let register = {
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            email : req.body.email,
            password: base.hashPassword(req.body.password),
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
            dateOfJoining : new Date(req.body.dateOfJoining.year +'-'+req.body.dateOfJoining.month+'-'+req.body.dateOfJoining.day ),
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
                var mailOptions = {
                    to: req.body.email,
                    from: 'admin@skillsgrow.com',
                    subject: 'Forgot Password Request',
                    text: 'Click on this to link to activate your account .\n\n' +
							url + 'company/activate/' + response.data._id,
                    html: 'Click on this to link to activate your account . </br>' +
                        '<a href="' + url + 'company/activate/' + response.data._id + '">' + 
                        url + 'company/activate/' + response.data._id +'</a>'
                };
                base.sendMail(mailOptions);
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

    postInsideDashboard(req , res){
        let data = {
            companyId: req.body.companyId,
            category: req.body.categoryId,
            jobRole: req.body.jobRole,
            dateOfJoining: new Date(req.body.dateOfJoining.year +'-'+req.body.dateOfJoining.month+'-'+req.body.dateOfJoining.day ),
            location: req.body.location,
            qualification: req.body.qualification,
            salary: req.body.salary,
            internType: req.body.internType,
            contactPersonNo: req.body.contactPersonNo,
            contactPersonEmail: req.body.contactPersonEmail,
            jobDescription: req.body.jobDescription,
            status: 0
        }
        this.company.addInternship(data)
        .then((internResponse) => { 
            if (internResponse.result) {
                res.send(internResponse);
            } else {
                res.send(internResponse);
            }
        }, (reject) => {
            res.send(reject);
        });
    }

    listInternship(req , res){
        this.company.listInternship()
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

    updateInternship(req , res){
        let data = {
            _id: req.body._id,
            companyId: req.body.companyId,
            category: req.body.categoryId,
            jobRole: req.body.jobRole,
            dateOfJoining: new Date(req.body.dateOfJoining.year +'-'+req.body.dateOfJoining.month+'-'+req.body.dateOfJoining.day ),
            location: req.body.location,
            qualification: req.body.qualification,
            salary: req.body.salary,
            internType: req.body.internType,
            contactPersonNo: req.body.contactPersonNo,
            contactPersonEmail: req.body.contactPersonEmail,
            jobDescription: req.body.jobDescription,
            status: req.body.status
        };
        this.company.updateInternship(data)
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

    updateStatusInternship(req , res){
        let data = {
            _id: req.body._id,
            status: req.body.status
        };
        this.company.updateStatusInternship(data)
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

    getInternshipByCompanyId(req , res){
        let companyId = req.params.companyId
        this.company.getInternshipByCompanyId(companyId)
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

    deleteInternship(req , res){
        let id = req.params.id;
        this.company.deleteInternship(id)
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

    getInternship(req , res){
        let id = req.params.id
        this.company.getInternship(id)
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

    companyLogin(req , res){
        let data = {
            email: req.body.email,
            password: req.body.password
        }; 
        this.company.companyLogin(data)
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

    applyInternship(req , res){
        let data = {
            companyId: req.body.companyId,
            categoryId: req.body.categoryId,
            resume: req.body.resume,
            internshipId: req.body.internshipId,
            userId: req.body.userId,
            status: 0
        }; 
        this.company.applyInternship(data)
        .then((response) => {
            if(response.result){
                this.company.userAppliedDetails(data)
                .then((appliedResponse) => {
                    if(appliedResponse.result){
                        res.send(response);
                    }else{
                        res.send(response);
                    }
                }, (reject) => {
                    res.send(reject);
                });
            }else{
                res.send(response);
            }
        },(reject) => {
            res.send(reject);
        })
    }

    listAppliedInternship(req , res){
        let companyId = req.params.companyId;
        let id = req.params.id;
        this.company.listAppliedInternship(companyId, id)
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

    listAllAppliedInternship(req , res){
        let companyId = req.params.companyId;
        this.company.listAllAppliedInternship(companyId)
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

    getAppliedInternship(req , res){
        let id = req.params.id;
        this.company.getAppliedInternship(id)
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

    emailExist(req , res){
        let email = req.params.email;
        this.company.emailExist(email)
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

    listCompany(req , res){
        this.company.listCompany()
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

    getCompany(req , res){
        let id = req.params.id;
        this.company.getCompany(id)
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

    updateStatusCompany(req , res){
        let data = {
            _id: req.body._id,
            status: req.body.status
        }
        this.company.updateStatusCompany(data)
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

    updateCompany(req , res){
        let data = {
            _id: req.body._id,
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            email : req.body.email,
            contact : req.body.contact,
            companyName : req.body.companyName,
            companyUrl : req.body.companyUrl,
            companyDescription : req.body.companyDescription,
            companyLogo : req.body.companyLogo,
            status: 0
        }
        this.company.updateCompany(data)
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

    changePasswordCompany(req , res){
        let data = {
            _id: req.body._id,
            oldPassword: req.body.oldPassword,
            password: req.body.password
        }
        this.company.changePasswordCompany(data)
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

    activationRequest(req , res){
        let result = {};
        let id = req.body.id;
        this.company.activationRequest(id)
        .then((response) => {
            if(response.result){
                let token = response.data.token;
                let tokenVerification = base.verifyToken(token, id);
                if(tokenVerification.result){
                    result = tokenVerification
                }else{
                    result = tokenVerification
                }
                res.send(result);
            }else{
                res.send(response);
            }
        },(reject) => { 
            console.log(reject);
            res.send(reject);
        })
    }

    forgotPwdRequest(req , res){
        let pwd = Math.floor(100000 + Math.random() * 900000);
        let email = req.body.email;
        let hashPwd = base.hashPassword(pwd.toString());
        this.company.forgotPwdRequest(email, hashPwd)
        .then((response) => {
            if(response.result){
                var mailOptions = {
                    to: req.body.email,
                    from: 'admin@skillsgrow.com',
                    subject: 'Forgot Password Request',
                    text:  'This is your new password :' + pwd +'\n\n'+
                    'After login please reset your password immediatly to secure account.\n\n Thank You.'
                };
                base.sendMail(mailOptions);
                res.send(response);
            }else{
                res.send(response);
            }
        },(reject) => { 
            res.send(reject);
        })
    }

    changeActiveStatus(req , res){
        let id = req.body.id;
        this.company.changeActiveStatus(id)
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

    resendActiveLink(req , res){
        let id = req.body.id;
        this.company.resendActiveLink(id)
        .then((response) => {
            if(response.result){
                var mailOptions = {
                    to: response.data[0].email,
                    from: 'admin@skillsgrow.com',
                    subject: 'Forgot Password Request',
                    text: 'Click on this to link to activate your account .\n\n' +
							url + 'company/activate/' + response.data[0]._id,
                    html: 'Click on this to link to activate your account . </br>' +
                        '<a href="' + url + 'company/activate/' + response.data[0]._id + '">' + 
                        url + 'company/activate/' + response.data[0]._id +'</a>'
                };
                base.sendMail(mailOptions);
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