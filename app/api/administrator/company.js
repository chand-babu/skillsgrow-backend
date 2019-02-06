var express = require("express");
var router = require("express").Router();
var AdminController = require('../../../app/controller/adminCtrl/AdminController');
var CompanyController = require('../../../app/controller/adminCtrl/CompanyController');
var tokenAuth = new AdminController().tokenAuth;

var productionOrDevelopment = new AdminController().productionOrDevelopment;

router.post("/internship", productionOrDevelopment, function(req , res){
    new CompanyController().postInternship(req , res);
});

router.post("/post-internship", productionOrDevelopment, function(req , res){
    new CompanyController().postInsideDashboard(req , res);
});

router.get("/internship", productionOrDevelopment, function(req , res){
    new CompanyController().listInternship(req , res);
});

router.put("/internship", productionOrDevelopment, function(req , res){
    new CompanyController().updateInternship(req , res);
});

router.put("/internship-status", productionOrDevelopment, function(req , res){
    new CompanyController().updateStatusInternship(req , res);
});

router.get("/internship/:companyId", productionOrDevelopment, function(req , res){
    new CompanyController().getInternshipByCompanyId(req , res);
});

router.delete("/internship/:id", productionOrDevelopment, function(req , res){
    new CompanyController().deleteInternship(req , res);
});

router.get("/get-internship/:id", productionOrDevelopment, function(req , res){
    new CompanyController().getInternship(req , res);
});

router.get("/internship/:category/:jobType/:location/:salary", productionOrDevelopment, function(req , res){
    new CompanyController().getFilterInternship(req , res);
});

router.get("/list-category", productionOrDevelopment, function(req , res){
    new CompanyController().listCategory(req , res);
});

router.post("/login", productionOrDevelopment, function(req , res){
    new CompanyController().companyLogin(req , res);
});

router.post("/apply-internship", productionOrDevelopment, function(req , res){
    new CompanyController().applyInternship(req , res);
});

router.get("/list-apply-internship/:companyId/:id", productionOrDevelopment, function(req , res){
    new CompanyController().listAppliedInternship(req , res);
});

router.get("/list-apply-internship/:companyId", productionOrDevelopment, function(req , res){
    new CompanyController().listAllAppliedInternship(req , res);
});

router.get("/get-apply-internship/:id", productionOrDevelopment, function(req , res){
    new CompanyController().getAppliedInternship(req , res);
});

router.get("/email-exist/:email", productionOrDevelopment, function(req , res){
    new CompanyController().emailExist(req , res);
});

router.get("/company", productionOrDevelopment, (req , res) => {
    new CompanyController().listCompany(req , res);
})

router.get("/company/:id", productionOrDevelopment, (req , res) => {
    new CompanyController().getCompany(req , res);
})

router.put("/company", productionOrDevelopment, (req , res) => {
    new CompanyController().updateStatusCompany(req , res);
})

router.put("/company-update", productionOrDevelopment, (req , res) => {
    new CompanyController().updateCompany(req , res);
})

router.put("/password-change", productionOrDevelopment, (req , res) => {
    new CompanyController().changePasswordCompany(req , res);
})

router.post("/activation-request", productionOrDevelopment, (req , res) => {
    new CompanyController().activationRequest(req , res);
})

router.post("/forgot-pwd", productionOrDevelopment, (req , res) => {
    new CompanyController().forgotPwdRequest(req , res);
})

router.post("/active-status", productionOrDevelopment, (req , res) => {
    new CompanyController().changeActiveStatus(req , res);
})

router.post("/resend-active-link", productionOrDevelopment, (req , res) => {
    new CompanyController().resendActiveLink(req , res);
})

module.exports = router;