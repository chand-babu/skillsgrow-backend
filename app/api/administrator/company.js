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
    new CompanyController().getInternship(req , res);
});

router.get("/internship/:companyId", productionOrDevelopment, function(req , res){
    new CompanyController().getInternshipByCompanyId(req , res);
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

router.get("/list-apply-internship/:companyId", productionOrDevelopment, function(req , res){
    new CompanyController().listAppliedInternship(req , res);
});

router.get("/get-apply-internship/:id", productionOrDevelopment, function(req , res){
    new CompanyController().getAppliedInternship(req , res);
});

router.get("/email-exist/:email", productionOrDevelopment, function(req , res){
    new CompanyController().emailExist(req , res);
});

module.exports = router;