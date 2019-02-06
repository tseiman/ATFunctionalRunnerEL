/**
 * http://usejsdoc.org/
 * This is a script taken directly from the internal WebUI of a R&S HMS8012 
 * There is no copyright coming with it - none of the code has any copyright remark
 * If you have any issue with this code snippet - please let me know <t.schmidt@md-network.de> - I'l take immediate action.
 */

const WebSocket 				 = require('ws');
var querystring = require('querystring');
var request = require('request');

class ScpiWS {


	constructor() {
		this.ws = null;
		this.callReceiveText = new Function();
		this.callReceiveBinary = new Function();
		this.callClose = new Function();
		this.callError = new Function();
		this.callOpen = new Function();
	}
	Close(){
		ws.close();
	}

	Send(command) {
		this.ws.send(command+"\n");
	}

	WebSocketOpened(){		
		this.binaryType = 'arraybuffer';
		this.onmessage = this.callerObject.WebSocketReceive;
		this.callerObject.callOpen(); 
	}

	WebSocketClose(){
		if(this.callClose !== undefined) {
			this.callerObject.callClose();
		} else {
			console.log("Closing WS");
		}
	}

	WebSocketError(err){
		console.log(err);
		if(this.callError !== undefined) {
			this.callerObject.callError(err);
		} else {
			console.log(err);
		}
	}

	Open(device, cbReceiveText, cbRecevieBinary , cbClose ,cbError, cbOpen, custom) {
		this.callReceiveText = cbReceiveText;
		this.callReceiveBinary = cbRecevieBinary;
		this.callClose = cbClose;
		this.callError = cbError;
		this.callOpen = cbOpen;
		var self = this;
		
// console.log("FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME ScpiWS.js:64");		
		
		var form = custom.form;
		


		var formData = querystring.stringify(form);
		var contentLength = formData.length;
		request({
		    headers: {
		      'Content-Length': contentLength,
		      'Content-Type': 'application/x-www-form-urlencoded'
		    },
		    uri: 'http://' + device + custom.intUrl,
		    body: formData,
		    method: 'POST'
		  }, function (err, res, body) {

				self.ws = new WebSocket('ws://'+device +'/', {
					origin: 'http://'+device,
					perMessageDeflate: false,
					headers : {
						'Pragma': 'no-cache',
						'Cache-Control': 'no-cache',
						'Host': device,
						'User-Agent': 'ATFunctionalRunner 1.0'
					}

				});
				
				self.ws.onerror = self.WebSocketError;
				self.ws.onopen = self.WebSocketOpened;
				self.ws.onclose = self.WebSocketClose;
				self.ws.callerObject = self;
			  
		  });
		

	
	}



	WebSocketReceive(evt) {
		if(evt.data.byteLength>0){
			var firstChar = String.fromCharCode.apply(null, new Uint8Array(evt.data,0,1));

			switch(firstChar)
			{
			case '#':
				var LengthOfLengthString = String.fromCharCode.apply(null, new Uint8Array(evt.data,1,1));
				var LengthOfLength = parseInt(LengthOfLengthString);

				var LengthString = String.fromCharCode.apply(null, new Uint8Array(evt.data,2,LengthOfLength));
				var Length = parseInt(LengthString);

				var format = "BIN";
				switch(String.fromCharCode.apply(null, new Uint8Array(evt.data,2+LengthOfLength,2)))
				{
				case "BM":	format = "BMP";	break;
				case "GI":	format = "GIF";	break;
				default:
					if(String.fromCharCode.apply(null, new Uint8Array(evt.data,2+LengthOfLength+1,3))=="PNG"){
						format = "PNG";
					}
				break;
				}
				this.callerObject.callReceiveBinary(new Uint8Array(evt.data,2+LengthOfLength,Length),format);
				break;

			case '"':
				this.callerObject.callReceiveText(byte2str(new Uint8Array(evt.data,1,evt.data.byteLength-3)));
				break;

			default:
				this.callerObject.callReceiveText(byte2str(new Uint8Array(evt.data,0,evt.data.byteLength-1)));
			break;
			}
		}else{
			callReceiveText('');
		}
	}

}

function byte2str(buf){return String.fromCharCode.apply(null, new Uint8Array(buf));}

function base64ArrayBuffer(arrayBuffer) { 
	var base64    = '' 
		var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/' 

			var bytes         = new Uint8Array(arrayBuffer) 
	var byteLength    = bytes.byteLength 
	var byteRemainder = byteLength % 3 
	var mainLength    = byteLength - byteRemainder 

	var a, b, c, d 
	var chunk 

	for (var i = 0; i < mainLength; i = i + 3) 
	{ 
		chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2] 

		a = (chunk & 16515072) >> 18 
		b = (chunk & 258048)   >> 12 
		c = (chunk & 4032)     >>  6 
		d = chunk & 63               

		base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d] 
	} 

	if (byteRemainder == 1) 
	{ 
		chunk = bytes[mainLength] 
		a = (chunk & 252) >> 2
		b = (chunk & 3)   << 4
		base64 += encodings[a] + encodings[b] + '==' 
	} else if (byteRemainder == 2) 
	{ 
		chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1] 

		a = (chunk & 64512) >> 10
		b = (chunk & 1008)  >>  4

		c = (chunk & 15)    <<  2

		base64 += encodings[a] + encodings[b] + encodings[c] + '=' 
	} 
	return base64;
}
module.exports = ScpiWS;

