class DPT {

	constructor(socket) {
		this.socket = socket;
		return(this);
	}
	
	// user

	getMetadataUser(publicKey) {
		this.socket.emit("api", {
			method: 'get',
			path: '/metadata/user/'+publicKey+'/',
			data: {
				publicKey: publicKey
			}
		});
	}
	
	userReclaim(phrase, publicKey) {
		this.socket.emit("api", {
			method: 'put',
			path: '/user/reclaim/'+publicKey+'/',
			data: {
				body: {
					phraseGuess: phrase,
					publicKey: publicKey,
				}
			}
		});
	}	

	userLogin(publicKey) {
		this.socket.emit("login", {
			method: 'post',
			path: '/user/login/',
			data: {
				publicKey: publicKey
			}
		});
	}
	
	// topic
	
	
	getTopic() {
		this.socket.emit("api", {
			method: 'get',
			path: '/topic/'
		});
	}
	
	postTopic(topic) {
		this.socket.emit("api", {
			method: 'post',
			path: '/topic/',
			data: {
				content: topic
			}
		});
	}
	
	putTopic(topic, topicId, publicKey) {
		this.socket.emit("api", {
			method: 'put',
			path: '/topic/'+topicId+'/',
			data: {
				dptUUID: publicKey,
				topicId: topicId,
				body: {
					content: topic
				}
			}
		});
	}
	
	// opinion
	
	getOpinionByTopic(topicId) {
		this.socket.emit("api", {
			method: "get",
			path: "/opinion/"+topicId+"/",
			data: {
				id: topicId
			}
		});
	}
	
	opinionPostAllowed(topicId) {
		this.socket.emit('api', {
			method: 'get',
			path: "/opinion/postAllowed/",
			data: {
				topicId: topicId
			}
		});
	}

	postOpinion(topicId, newOpinion) {
		this.socket.emit("api", {
			method: 'post',
			path: '/opinion/',
			data: {
				topic: topicId,
				content: newOpinion
			}
		});
	}
	
	putOpinion(publicKey, opinionId, topicId, newOpinion) {
		this.socket.emit("api", {
			method: 'put',
			path: '/opinion/'+opinionId+'/',
			data: {
				dptUUID: publicKey,
				opinionId: opinionId,
				topicId: topicId,
				body: {
					content: newOpinion
				}
			}
		});
	}
	
	// dialog
	
	postDialog(proposition, publicKey, opinionId) {
		console.log('here we go: '+proposition+' me: '+publicKey+' opinionId: '+opinionId);
		this.socket.emit("api", {
			method: 'post',
			path: '/dialog/',
			data: {
				dptUUID: publicKey,
				body: {
					opinion: opinionId,
					opinionProposition: proposition,
				}
			}
		});
	}
	
	getDialogList() {
		this.socket.emit('api', {
			method: 'get',
			path: '/dialog/list/',
			data: {},
		});
	}
	
	getDialog(dialogId) {
		this.socket.emit('api', {
			method: 'get',
			path: '/dialog/'+ dialogId +'/',
			data: {
				body: {
					dialogId: dialogId
				}
			},
		});
	}
	
	putDialog(dialogId, key, value) {
		var obj = {
				method: 'put',
				path: '/dialog/'+ dialogId +'/',
				data: {
					dialogId: dialogId,
					body: {
					}
				}
		};
		obj.data.body[key] = value;
		this.socket.emit('api', obj);
	}
	
	postMessage(message, publicKey, dialogId) {
		this.socket.emit('api', {
			method: 'post',
			path: '/dialog/'+dialogId+'/message/',
			data: {
				publicKey: publicKey,
				message: message,
				dialogId: dialogId
			},
		});
	}
}
