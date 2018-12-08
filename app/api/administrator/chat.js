var express = require("express");
var router = require("express").Router();
var AdminController = require('../../../app/controller/adminCtrl/AdminController');
var AdminModule = require("../../model/adminMdl/AdminModel");
var tokenAuth = new AdminController().tokenAuth;
var db = require('../../config/db');
var mongo = require("../../config/schema");

var productionOrDevelopment = new AdminController().productionOrDevelopment;
class Chat {
	constructor() {
		this.admin = new AdminModule();
		db(true);
	}

	addChatForum(data) {
		// console.log(data);
		let dataSet = {
			courseId: data.courseId,
			userId: data.discussionData.userId,
			userName: data.discussionData.userName,
			chatMessage: data.discussionData.chatMessage,
			replyMessage: data.discussionData.replyMessage,
			createdOn: data.discussionData.createdOn
		}
		// console.log(dataSet);
		this.admin.addChatForum(dataSet)
		.then((response) => {
			if (response.result) {
				return response;	
			} else {
				return response;
			}
		}, (reject) => {
			return reject;
		});
	}

	getChatHistory(courseId){
		this.admin = new AdminModule();
		return this.admin.getChatForum(courseId);
	}
}

module.exports = Chat;
/* -------------------------------------------------- */
// previous code for chat forum
    /* let chatData = data.discussionData;
		mongo.course.findOne({ _id: data.courseId },
			function (err, user) {
				if (err) {
					console.log(err);
				} else {
					if (user) {
						if (chatData.position == undefined) {
							user.discussionForums.push(chatData);
						} else {
							user.discussionForums[chatData.position].replyMessage.push(chatData);
						}
						user.markModified('discussionForums');
						user.save(function (err) {
							if (err) {
								console.log(err);
							} else {
								res.json({ result: true, message: 'sent successfully' });
							}
						});
					}
				}
			}); */
    /* mongo.course.findOne({ _id: data.courseId }, { discussionForums: 1 },
        function (err, docs) {
            // console.log(docs);
            if (err) {
                res.json({
                    "result": false,
                    "message": "something went wrong",
                    "dev": docs
                });
            } else {
                res.json({
                    "result": true,
                    "data": docs
                });
            }
        }); */