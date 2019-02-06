
const WebSocket 				 = require('ws');
const { crc32 } 				 = require('crc');
const dom 					 = require('xmldom').DOMParser;
const CodeEval				 = require('./code-eval.js');


class WebSocketServer {



	constructor(serverConfig) {
		this.logger=serverConfig.getLogger();
		this.serverConfig = serverConfig;
		this.wss = new WebSocket.Server({ port: 8888 });
		this.wss.isAlive = false;
		var self = this;
		this.ws = function() { send = function () {console.log("error");} }



		this.wss.on('connection', function connection(ws) {

			self.ws = ws;
			self.logger.LogSystem('WebSocket Server: incomming connect from Client');


			self.ws.on('message', function incoming(message) {
				// console.log('received: %s', message);
				try {
					var data = JSON.parse(message);
					switch (data.type) {
					case "PONG":
						// console.log("got PONG set isAlive to true");
						self.wss.isAlive = true; // we put it to false 
						break;
					case "NEW FILE":
					//	console.log("new file,  fileName:" +  data.fileName  +", fileSize:" + data.fileSize + ", lastModified:" + data.lastModifiedDate );
						//if(self.serverConfig !== undefined) 
							self.serverConfig.invalidateConfig();
							self.serverConfig.setFileName((data.fileName === undefined) ? null : data.fileName);
							self.serverConfig.setFileSize((data.fileSize === undefined) ? null : data.fileSize);
							self.serverConfig.setFileLastModified((data.lastModifiedDate === undefined) ? null : data.lastModifiedDate);
							
						break;
					case "SERVERCONFIG-PUSH":
						var calculated_crc = crc32(data.data).toString(10);
					//	console.log("new server config,  data:" +  data.data  +", crc:" + data.crc32, ", calc crc: " +calculated_crc);
						if(calculated_crc != data.crc32) {
							logger.LogWarn('Server configuration CRC32 check failed');
							console.log('Server configuration CRC32 check failed');
						}
						var buf = Buffer.from(data.data, 'base64').toString("ascii");
						var xmlDoc = new dom().parseFromString(buf ,'text/xml');
						self.serverConfig.setConfig(xmlDoc);
						break;
					case "SERVERCONFIG-PULL":
						
						var xmlB64DocBuffer = Buffer.from(self.serverConfig.getConfig().toString()).toString('base64');
						var crc = crc32(xmlB64DocBuffer).toString(10);
						
						self.ws.send(JSON.stringify({type: "SERVERCONFIG", data: xmlB64DocBuffer, crc32: crc, fileName: self.serverConfig.getFileName(), fileSize : self.serverConfig.getFileSize(), lastModifiedDate: self.serverConfig.getFileLastModified() }));
						
						// console.log("pull config" + xmlDoc.toString());
						break;			
						
					case "SCRIPT-RUN":

						if(self.serverConfig.isScriptOk()) {

							
							if(self.serverConfig.getCodeEval() !== undefined) {
								if(self.serverConfig.getCodeEval().stop !== undefined && (!self.serverConfig.getCodeEval().isDead())) self.serverConfig.getCodeEval().stop();
							}
							var codeEval = new CodeEval(self.serverConfig);
							self.serverConfig.setCodeEval(codeEval); 							
							self.serverConfig.getCodeEval().run();
							
							
						}
						break;	
					case "SCRIPT-STOP":

						if(self.serverConfig.getCodeEval() !== undefined) {
							self.serverConfig.getCodeEval().stop();
						}
						break;	
					case "INPUT-UPDATE":
					case "BUTTON-CLICK":
						
						if(self.serverConfig.getCodeEval() !== undefined) {
							self.serverConfig.getCodeEval().postMessage(data);
						}
						break;	
					
					case "quit":
						self.wss.isAlive = false;
						self.ws.terminate();
						break;
					default:
					}
				} catch (e) {
					console.log(e);
					console.log(message);
				}				
			});

			ws.send(JSON.stringify({time:  self.logger.getTimeStamp(),type: "system", msg: "start Connections"}));
			self.eventScheduler(ws);

		});


		console.log('WS running at http://127.0.0.1:8888/');



	}


	eventScheduler(ws) {
		var self = this;
		self.wss.isAlive = false; // falsing isAlive to test if the PONG message will put it back to true
		var codeWorkerIsNotRunning = true;
		if(self.serverConfig.getCodeEval() !== undefined) {
			if(self.serverConfig.getCodeEval().isDead === undefined) {
				codeWorkerIsNotRunning = true;
			} else {
				codeWorkerIsNotRunning = self.serverConfig.getCodeEval().isDead();
			}
			
		}
		
		self.ws.send(JSON.stringify({type: 'PING', configok: self.serverConfig.isConfigOk(), isNotRunning : codeWorkerIsNotRunning}));
		
		setTimeout(function () {
			if(!self.wss.isAlive) { 
				console.log('terminating connection due to timeout');
				self.ws.terminate();
				return;
			}
			self.eventScheduler(ws);
		}, 1000);
	}


	send(data) {
		// console.log(this.wss);
		this.ws.send(data);
	}
	
	checkAlive() {
		var result = false
		try { 
			this.ws.send(JSON.stringify({type: 'PING'}));
			result = true;
		} catch (e) {  }
	}
	isNotRunning() {
		if(this.serverConfig === undefined) return true;
		if(this.serverConfig.getCodeEval() === undefined) return true;
		
		
		return this.serverConfig.getCodeEval().isDead();
	}
}


module.exports = WebSocketServer;


