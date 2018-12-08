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
	webSocket(io, app){
		io.on('connection',(socket) => {
			console.log('made socket connection', socket.id);
			socket.on('sendCourseId', (courseId) => {
				// console.log(this.chat.getChatHistory(courseId));
				this.chat.getChatHistory(courseId).then((response) => {
					if (response.result) {
						io.sockets.emit('chatHistory', this.chat.getChatHistory(response));
					} else {
						io.sockets.emit('chatHistory', this.chat.getChatHistory(response));
					}
				}, (reject) => {
					io.sockets.emit('chatHistory', this.chat.getChatHistory(reject));
				});	
			});	
			socket.on('storeChatMessage', (data) => {
				this.chat.addChatForum(data);
				// io.sockets.emit('chatHistory', this.chat.getChatHistory(courseId));
			});	
			
		})
		
	}
}

module.exports = ApiRoute;