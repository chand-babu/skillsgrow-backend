var express = require("express");
var fs      = require('fs');
var router = require("express").Router();
var AdminController = require('../../../app/controller/adminCtrl/AdminController');

router.get('/admin',(req,res ) => {
    fs.readFile(basePath+'/docs/admin.txt', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      res.send('<pre>'+data+'</pre>');
    });
})

module.exports = router;