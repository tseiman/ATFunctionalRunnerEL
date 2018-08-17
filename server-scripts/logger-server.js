/**
 * http://usejsdoc.org/
 */
const moment = require('moment');

class Logger {
	
	constructor(serverConfig) {
		this.serverConfig = serverConfig;
	}

	getTimeStamp() {
		var now = moment()
		var formatted = now.format('YYYY-MM-DD HH:mm:ss.SSS')
		return formatted;
	}

	localLog(message) {
		console.log("[ " + this.getTimeStamp() + " ] : " + message);
	}
	
	
	LogIO(message) {
		if(typeof this.serverConfig.getWebSocketServer() !== 'undefined' && this.serverConfig.getWebSocketServer() != null) {
				var data = {time:  this.getTimeStamp(), type: 'iolog', msg : message}
				this.serverConfig.getWebSocketServer().send(JSON.stringify(data));
				this.localLog(message);
		} else {
			console.log("logging w/o WS enabled: " + message);
		}		
	}
	LogSystem(message) {
		if(typeof this.serverConfig.getWebSocketServer() !== 'undefined' && this.serverConfig.getWebSocketServer() != null) {
				var data = {time:  this.getTimeStamp(), type: 'system', msg : message}
				this.serverConfig.getWebSocketServer().send(JSON.stringify(data));
				this.localLog(message);
		} else {
			console.log("logging w/o WS enabled: " + message);
		}		
	}

	LogNormal(message) {
		if(typeof this.serverConfig.getWebSocketServer() !== 'undefined' && this.serverConfig.getWebSocketServer() != null) {
			var data = {time:  this.getTimeStamp(),type: 'norm', msg : message}
			this.serverConfig.getWebSocketServer().send(JSON.stringify(data));
			this.localLog(message);
		} else {
			console.log("logging w/o WS enabled: " + message);
		}
	}
	
	LogWarn(message) {
		if(typeof this.serverConfig.getWebSocketServer() !== 'undefined' && this.serverConfig.getWebSocketServer() != null) {
			var data = {time:  this.getTimeStamp(),type: 'warn', msg : message}
			this.serverConfig.getWebSocketServer().send(JSON.stringify(data));
			this.localLog(message);
		} else {
			console.log("logging w/o WS enabled: " + message);
		}
	}
	
/*	setWebSocket(websocket) {
		this.websocket = websocket;
	}
*/

}

module.exports = Logger;