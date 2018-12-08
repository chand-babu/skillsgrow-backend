var administrator = require('../app/api/administrator/administrator');
var Chat = require('../app/api/administrator/chat');
var api = require('../app/api/docs/api');

class ApiRoute{
	
	constructor(){
		this.chat = new Chat();
	}

	routes(app){
		app.use('/docs', api);
		app.use('/admin', administrator);
	}

	webSocket(io){
		let room = '';
		io.on('connection',(socket) => {
			console.log('made socket connection', socket.id);
			
			socket.on('sendCourseId', (courseId) => {
				socket.join('room-' + courseId);
				this.chat.getChatHistory(courseId).then((response) => {
					if (response.result) {
						io.sockets.in("room-" + courseId).emit('chatHistory', response);
					} else {
						io.sockets.in("room-" + courseId).emit('chatHistory', response);
					}
				}, (reject) => {
					io.sockets.in("room-" + courseId).emit('chatHistory', reject);
				});	
			});	
			socket.on('storeChatMessage', (data) => {
				if(data.discussionData.hasOwnProperty('position')){
					this.chatReplyMessage(data, io);
				}else{
					this.chatStoreMessage(data, io);
				}
			});	
		})
		
	}

	chatReplyMessage(data, io){
		this.chat.replyChatForum(data)
		.then((addResponse) => {
			if (addResponse.result) {
				this.chat.getChatHistory(data.courseId)
				.then((response) => {
					if (response.result) {
						io.sockets.in("room-" + data.courseId).emit('chatHistory', response);
					} else {
						io.sockets.in("room-" + data.courseId).emit('chatHistory', response);
					}
				}, (reject) => {
					io.sockets.in("room-" + data.courseId).emit('chatHistory', reject);
				});	
			} else {
				io.sockets.in("room-" + data.courseId).emit('chatHistory', addResponse);
			}
		}, (reject) => {
			io.sockets.in("room-" + data.courseId).emit('chatHistory', reject);
		});
	}

	chatStoreMessage(data, io){
		this.chat.addChatForum(data)
		.then((addResponse) => {
			if (addResponse.result) {
				this.chat.getChatHistory(data.courseId)
				.then((response) => {
					if (response.result) {
						io.sockets.in("room-" + data.courseId).emit('chatHistory', response);
					} else {
						io.sockets.in("room-" + data.courseId).emit('chatHistory', response);
					}
				}, (reject) => {
					io.sockets.in("room-" + data.courseId).emit('chatHistory', reject);
				});	
			} else {
				io.sockets.in("room-" + data.courseId).emit('chatHistory', addResponse);
			}
		}, (reject) => {
			io.sockets.in("room-" + data.courseId).emit('chatHistory', reject);
		});
	}
}

module.exports = ApiRoute;