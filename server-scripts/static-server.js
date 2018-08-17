
const express = require('express');


class StaticServer {
	
	constructor() {
		this.staticserver = express(); // better instead
		// server.configure(function(){
//			server.use('/media', express.static(__dirname + '/media'));
//			server.use(express.static(__dirname + '/public'));
		// });
		this.staticserver.use(express.static('public'));

		this.staticserver.listen(3000);
		console.log("Static running at http://127.0.0.1:3000/");
	
		
		
		
		
	}
}



module.exports = StaticServer;








