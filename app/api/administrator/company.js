var express = require("express");
var router = require("express").Router();
var AdminController = require('../../../app/controller/adminCtrl/AdminController');
var CompanyController = require('../../../app/controller/adminCtrl/CompanyController');
var tokenAuth = new AdminController().tokenAuth;

var productionOrDevelopment = new AdminController().productionOrDevelopment;

router.post("/internship", productionOrDevelopment, function(req , res){
    new CompanyController().postInternship(req , res);
});

router.get("/internship", productionOrDevelopment, function(req , res){
    new CompanyController().getInternship(req , res);
});

router.get("/internship/:category/:jobType/:location/:salary", productionOrDevelopment, function(req , res){
    new CompanyController().getFilterInternship(req , res);
});

router.get("/list-category", productionOrDevelopment, function(req , res){
    new CompanyController().listCategory(req , res);
});

module.exports = router;