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
		db(false);
	}

	addChatForum(data) {
		let dataSet = {
			courseId: data.courseId,
			userId: data.discussionData.userId,
			userName: data.discussionData.userName,
			chatMessage: data.discussionData.chatMessage,
			replyMessage: data.discussionData.replyMessage,
			createdOn: data.discussionData.createdOn
		}
		return this.admin.addChatForum(dataSet);
	}

	replyChatForum(data) {
		let discussId = data.discussionData.position; 
		let courseId = data.courseId;
		let dataSet = {
			userId: data.discussionData.userId,
			userName: data.discussionData.userName,
			replyMessage: data.discussionData.replyMessage,
			createdOn: data.discussionData.createdOn
		}
		return this.admin.replyChatForum(dataSet, courseId, discussId);
	}

	getChatHistory(courseId){
		return this.admin.getChatForum(courseId);
	}
}

module.exports = Chat;