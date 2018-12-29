var express = require("express");
var router = require("express").Router();
var AdminController = require('../../../app/controller/adminCtrl/AdminController');
var tokenAuth = new AdminController().tokenAuth;
var productionOrDevelopment = new AdminController().productionOrDevelopment;

/* 
    # tokenAuth is checking token exist or not
*/

router.post("/upload", productionOrDevelopment, function(req , res){
    new AdminController().uploadFile(req , res);
});

router.post("/add", function(req , res){
    new AdminController().addAdministrator(req , res);
});

router.put("/add", function(req , res){
    new AdminController().updateAdministrator(req , res);
});

router.post("/login", productionOrDevelopment, function(req , res){
    // console.log(req.originalUrl, req.headers['production-mode']);
    new AdminController().adminLogin(req , res);
});

router.post("/admin-change-pwd", productionOrDevelopment, function(req , res){
    new AdminController().adminChangePwd(req , res);
});

router.post("/token", productionOrDevelopment, function(req , res){
    new AdminController().adminToken(req , res);
});

router.get("/add", productionOrDevelopment, function(req , res){
    new AdminController().adminList(req, res);
});

router.get("/add/:id", productionOrDevelopment, function(req , res){
    new AdminController().adminGet(req, res);
});

router.delete("/add/:id", productionOrDevelopment, function(req , res){
    new AdminController().adminDelete(req, res);
});

router.delete("/delete-token/:userId", function(req , res){
    console.log(req.originalUrl, req.headers['production-mode']);
    var id = req.params.userId;
    new AdminController().removeTokenDetails(id, req, res);
});

router.post("/add-category",tokenAuth, function(req , res){
    new AdminController().addCategory(req , res);
});

router.put("/update-category",tokenAuth, function(req , res){
    new AdminController().updateCategory(req , res);
});

router.get("/list-categories", productionOrDevelopment, function(req , res){
    console.log(req.originalUrl, req.headers['production-mode']);
    new AdminController().listCategories(req , res);
});

router.get("/list-categories-course/:id", productionOrDevelopment, function(req , res){
    console.log(req.originalUrl, req.headers['production-mode']);
    new AdminController().listCategoriesBycourse(req , res);
});

router.get("/get-category-details/:catid",tokenAuth ,function(req , res){
    new AdminController().getCategory(req , res);
});

router.delete("/delete-category/:catid",tokenAuth ,function(req , res){
    new AdminController().deleteCategory(req , res);
});

router.post("/add-course",tokenAuth ,function(req , res){
    new AdminController().addCourse(req , res);
});

router.put("/update-course",tokenAuth ,function(req , res){
    new AdminController().updateCourse(req , res);
});

router.get("/list-course",tokenAuth ,function(req , res){
    new AdminController().listCourse(req , res);
});

router.get("/get-course-details/:courseid",tokenAuth ,function(req , res){
    new AdminController().getCourse(req , res);
});

router.delete("/delete-course/:courseid",tokenAuth ,function(req , res){
    new AdminController().deleteCourse(req , res);
});

router.post("/add-updated-course",tokenAuth ,function(req , res){
    new AdminController().addUpdatedCourse(req , res);
});

router.post("/add-chapter",tokenAuth,function(req ,res){
    new AdminController().addChapter(req , res);
});

router.get("/list-chapter",tokenAuth,function(req ,res){
    new AdminController().listChapter(req , res);
});

router.get("/get-chapter-details/:chapter_id",tokenAuth,function(req , res){
    new AdminController().getChapter(req , res);
});

router.delete("/delete-chapter/:chapter_id",tokenAuth,function(req , res){
    new AdminController().deleteChapter(req , res);
});

router.put("/update-chapter",tokenAuth,function(req ,res){
    new AdminController().updateChapter(req , res);
});

router.post("/add-topic",tokenAuth,function(req ,res){
    new AdminController().addTopic(req , res);
});

router.put("/update-topic",tokenAuth,function(req ,res){
    new AdminController().updateTopic(req , res);
});

router.get("/list-topic",tokenAuth,function(req ,res){
    new AdminController().listTopic(req , res);
});

router.get("/get-topic-details/:topic_id",tokenAuth,function(req ,res){
    new AdminController().getTopic(req , res);
});

router.delete("/delete-topic/:topic_id",tokenAuth,function(req ,res){
    new AdminController().deleteTopic(req , res);
});

router.post("/add-learning",tokenAuth,function(req ,res){
    new AdminController().addLearning(req , res);
});

router.get("/list-learning",tokenAuth,function(req ,res){
    new AdminController().listLearning(req , res);
});

router.get("/get-learning-details/:learning_id",tokenAuth,function(req ,res){
    new AdminController().getLearning(req , res);
});

router.delete("/delete-learning/:learning_id",tokenAuth,function(req ,res){
    new AdminController().deleteLearning(req , res);
});

router.put("/update-learning",tokenAuth,function(req ,res){
    new AdminController().updateLearning(req , res);
});

/* frontend API */

router.post("/web-register", function(req, res){
    new AdminController().webRegister(req, res);
});

router.post("/web-login", function(req, res){
    new AdminController().frontendLogin(req, res);
});

router.post("/banner-images", tokenAuth, function(req, res){
    new AdminController().storeBannerImages(req, res);
});

router.get("/list-banner-images", productionOrDevelopment, function(req , res){
    new AdminController().listBannerImages(req , res);
});

router.delete("/banner-images/:id", productionOrDevelopment, function(req , res){
    new AdminController().deleteBannerImages(req , res);
});

router.get("/banner-images/:id", productionOrDevelopment, function(req , res){
    new AdminController().getBannerImages(req , res);
});

router.put("/update-bannerImages",tokenAuth, function(req , res){
    new AdminController().updateBannerImages(req , res);
});

router.put("/update-images",tokenAuth, function(req , res){
    new AdminController().updateBannerImagesDetails(req , res);
});

router.put("/resetpassword", productionOrDevelopment, function(req, res, next){
    new AdminController().againResetPassword(req, res, next);
});

router.get("/resetpassword/:token", productionOrDevelopment, function(req, res, next){
    new AdminController().checkTokenPassword(req, res, next);
});

router.put("/savepassword", productionOrDevelopment, function(req, res, next){
    new AdminController().savePassword(req, res, next);
});

router.put("/activate/:token", productionOrDevelopment, function(req, res, next){
    new AdminController().checkTokenForEmail(req, res, next);
});

router.post("/resend", productionOrDevelopment, function(req, res, next){
    new AdminController().resendActivationLink(req, res, next);
});

router.put("/resendlink", productionOrDevelopment, function(req, res, next){
    new AdminController().resendLink(req, res, next);
});

router.post("/course-review", productionOrDevelopment, function(req, res, next){
    new AdminController().courseReview(req, res, next);
});

router.put("/course-enrolled", productionOrDevelopment, function(req, res, next){
    console.log(req.body, req.headers['production-mode']);
    new AdminController().courseEnrolled(req, res, next);
});

router.post("/user-course-enrolled", productionOrDevelopment, function(req, res, next){
    new AdminController().userCourseEnrolled(req, res, next);
});

router.get("/user-course-enrolled-list", productionOrDevelopment, function(req, res, next){
    new AdminController().userCourseEnrolledList(req, res, next);
});

router.post("/user-score", productionOrDevelopment, function(req, res, next){
    new AdminController().userScore(req, res, next);
});

router.post("/contactus-details", productionOrDevelopment, function(req, res, next){
    new AdminController().contactUsDetails(req, res, next);
});

router.put("/update-course", productionOrDevelopment, function(req, res, next){
    new AdminController().updateCourse(req, res, next);
});

router.post("/discussion-forums", productionOrDevelopment, function(req, res, next){
    new AdminController().discussionForums(req, res, next);
});

router.get("/discussion-forums/:courseId", productionOrDevelopment, function(req, res, next){
    new AdminController().getDiscussionForums(req, res, next);
});

router.put("/update-user-details", productionOrDevelopment, function(req, res, next){
    new AdminController().updateUserDetails(req, res);
});

router.put("/update-user-password", productionOrDevelopment, function(req, res, next){
    new AdminController().updateUserPassword(req, res);
});

router.get("/check-email/:emailId", productionOrDevelopment, function(req, res, next){
    new AdminController().checkEmailExistOrNot(req, res);
});

router.put("/course-faq", productionOrDevelopment, function(req, res, next){
    new AdminController().courseFaq(req, res);
});

router.put("/delete-faq", productionOrDevelopment, function(req, res, next){
    new AdminController().deleteFaq(req, res);
});

router.post("/contact-enterprise-team", productionOrDevelopment, function(req, res, next){
    new AdminController().contactEnterpriseTeamData(req, res);
});

router.post("/ask-question", productionOrDevelopment, function(req, res, next){
    new AdminController().askQuestion(req, res);
});

router.post("/publish-skillsgrow", productionOrDevelopment, function(req, res, next){
    new AdminController().publishSkillsgrow(req, res);
});

router.post("/payu-response", productionOrDevelopment, function(req, res){
    new AdminController().payuResponse(req, res);
});

router.get("/payu-response-get/:id", productionOrDevelopment, function(req, res){
    new AdminController().payuGetResponse(req, res);
});

router.put("/payu-certificate-payment", productionOrDevelopment, function(req, res){
    new AdminController().certificatePayment(req, res);
});

router.post("/add-ssp", productionOrDevelopment, function(req, res){
    new AdminController().addSSP(req, res);
});

router.get("/get-ssp/:status", productionOrDevelopment, function(req, res){
    new AdminController().getSSP(req, res);
});

router.put("/add-ssp", productionOrDevelopment, function(req, res){
    new AdminController().updateSSP(req, res);
});

router.delete("/add-ssp/:id", productionOrDevelopment, function(req, res){
    new AdminController().deleteSSP(req, res);
});

router.get("/get-register", productionOrDevelopment, function(req, res){
    new AdminController().getRegister(req, res);
});

router.put("/put-register", productionOrDevelopment, function(req, res){
    new AdminController().putRegister(req, res);
});

router.put("/course-status", productionOrDevelopment, function(req, res){
    new AdminController().courseActiveInactive(req, res);
});

router.delete("/course-delete/:id", productionOrDevelopment, function(req, res){
    new AdminController().courseDelete(req, res);
});

//created by chand
router.post("/rolls-permissions", productionOrDevelopment,function(req, res){
    new AdminController().addRollsPermissions(req, res);
});

router.put("/rolls-permissions", productionOrDevelopment, function(req, res){
    new AdminController().updateRollsPermissions(req, res);
});

router.get("/rolls-permissions", productionOrDevelopment, function(req, res){
    new AdminController().listRollsPermissions(req, res);
});

router.get("/rolls-permissions/:id", productionOrDevelopment, function(req, res){
    new AdminController().getRollsPermissions(req, res);
});

router.delete("/rolls-permissions/:id", productionOrDevelopment, function(req, res){
    new AdminController().deleteRollsPermissions(req, res);
});


module.exports = router;