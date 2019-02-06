/**
 * http://usejsdoc.org/
 */

var net = require('net');
var rl = require('readline');
var ScpiWS = require('./ScpiWS.js');


var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/++[++^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}



class ScpiClient {



	constructor(config, logger,callback, custom) {
		this.logger = logger;
		this.config  =  config;
		this.name  =  config.name;
		this.port  =  config.port;		
		this.type = config.type;
		this.remoteHost  =  config.remoteHost;
		this.customParams = custom;
		
		this.callback  =  callback;

		if(config.name === undefined) throw "config.name not defined in ScpiClient()";
		if(config.port === undefined) throw "config.port not defined in ScpiClient()";
		if(config.type === undefined) throw "config.type not defined in ScpiClient()";
		if(config.remoteHost === undefined) throw "config.remoteHost not defined in ScpiClient()";


		this.connected = false;
		this.isDisconnected = true;

		this.onClose = undefined;
		this.onOpen = undefined;

		var self = this;

		if(this.type === 'tcp') { /* TCP type */

			this.client = new net.Socket("bla");

			this.client.on('close', function(e) {
				self.connected = false;
				self.logger.LogIO('[' + self.name + '] Disconnected from SCPI server "' + self.remoteHost + ':' + self.port + '"');
				if(self.onClose !== undefined) {
					self.onClose(self.config);
				}
				if(!self.isDisconnected) {
					self.logger.LogIO('[' + self.name + '] Attemp to reconnect to SCPI server in 10sec: "' + self.remoteHost + ':' + self.port + '"');
					self.client.setTimeout(10000, function() {
						self.client.connect(self.port, self.remoteHost);
					});
				}
			});




			this.client.on('data', function(datain) {
				var data ="";
				if(/[\x00-\x08\x0E-\x1F]/.test(datain)) {
					data = Buffer.from(datain, 'base64').toString("ascii");
					self.logger.LogIO("[" + self.name + "]<<< BIN DATA - NOT PRINTED");

				} else {
					data = datain;
					self.logger.LogIO("[" + self.name + "]<<< " + data.toString());
				}


				if(self.callback !== undefined) { 
					self.callback(data); 
				} else {
					self.logger.LogIO('[' + self.name + '] No callback defined for "' + self.remoteHost + ':' + self.port + '"');
				}
			});

		} else if (this.type === 'ws') {
			this.client = new ScpiWS();
		} else {  
			throw "Unknown SCPI type in ScpiClient(): " + this.type;
		} /* none of the known SCPI types (TCP, WS, (TBD)) */
	}

	write (command) {
		var self = this;
		self.logger.LogIO("[" + self.name + "]>>> " + command.toString());
		if(self.connected) { 
			if(this.type === "tcp") {
				self.client.write(command + '\n');
			} else if (this.type === "ws") {
				self.client.Send(command);
			}
			
		} else {
			self.logger.LogIO('[' + self.name + '] Not connected to "' + self.remoteHost + ':' + self.port + '" - cant send command "' + command.toString() + '"');
		}
	}



	open() {

		this.isDisconnected = true;
		var self = this;

		if(this.type === 'tcp') {
			this.client.connect(this.port, this.remoteHost, function() {
				self.logger.LogIO('[' + self.name + '] Connected to SCPI server "' + self.remoteHost + ':' + self.port + '"');
				self.connected = true;
				if(self.onOpen !== undefined) {
					self.onOpen(self.config);
				}
			});
		} else if (this.type === 'ws') {
			console.log("scpi-client : " + this.client.bla);
			this.client.Open(this.remoteHost, // + ":" + this.port
					function(evt) { /* on text */
						self.logger.LogIO("[" + self.name + "]<<< " + evt);
						if(self.callback !== undefined) { 
							self.callback(evt); 
						} else {
							self.logger.LogIO('[' + self.name + '] No callback defined for "' + self.remoteHost + ':' + self.port + '"');
						}
					},
					function (evt, type) { /* on binary */
						var result = "";
						self.logger.LogIO("[" + self.name + "]<<< BIN DATA - NOT PRINTED");
						if(type != "BIN"){
							switch(type) {
								case "BMP":
									result="data:image/bmp;base64," + Buffer.from(evt).toString("base64");
					        //        downloadlink.download="Screen.bmp";
					                break;
								case "GIF": 
									result="data:image/gif;base64," + Buffer.from(evt).toString("base64");
					            //    downloadlink.download="Screen.gif";
					                break;
								case "PNG": 
									result="data:image/gif;base64," + Buffer.from(evt).toString("base64");
					              //  downloadlink.download="Screen.png";
					                break;
								default: 
									self.logger.LogIO('[' + self.name + '] Unknown Image Format on "' + self.remoteHost + ':' + self.port + '"'); 
									break;
							}
							
							
							if(self.callback !== undefined) { 
								// console.log('[' + self.name + '] Data: "' + result + '"'); 
								self.callback(result); 
							} else {
								self.logger.LogIO('[' + self.name + '] No callback defined for "' + self.remoteHost + ':' + self.port + '"');
							}
						
						//	self.logger.LogIO("[" + self.name + "]<<< " + result);
						}else{
							// scpidata.value = "-> " + byte2str(evt) +"\n" + scpidata.value; 
							self.logger.LogIO('[' + self.name + '] Unsupported Data Format on "' + self.remoteHost + ':' + self.port + '"'); 
						}
					},
					function () { /* on close */
						self.logger.LogIO('[' + self.name + '] Closed connection to WS SCPI server "' + self.remoteHost + ':' + self.port + '"');
						if(self.onClose !== undefined) {
							self.onClose(self.config);
						}
					},
					function () { /* on error */
						self.logger.LogIO('[' + self.name + '] Error connecting to WS SCPI server "' + self.remoteHost + ':' + self.port + '"');
					},
					function () { /* on open */
						self.isDisconnected = false;
						self.connected = true;
						self.logger.LogIO('[' + self.name + '] Connected to WS SCPI server "' + self.remoteHost + ':' + self.port + '"');
						if(self.onOpen !== undefined) {
							self.onOpen(self.config);
						}
					},this.customForm);


		} else {  
			throw "Unknown SCPI type in ScpiClient(): " + this.type;
		} /* none */


	}
	
	close() {
		this.isDisconnected = true;
		var self = this;
		if(this.type === "tcp") {
			this.client.destroy();
		} else if (this.type === "ws") {
			self.client.Close();
		}	
	}

	setOnClose(callback) {
		this.onClose = callback;
	}
	setOnOpen(callback) {
		this.onOpen = callback;
	}
}


module.exports = ScpiClient;


