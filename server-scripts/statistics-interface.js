/**
 * http://usejsdoc.org/
 */


/**
 * http://usejsdoc.org/
 */
const moment = require('moment');
const SerialIO				 = require('./serial-io.js');

class StatisticsInterface {

	
	
	constructor(serverConfig) {
		this.ws = serverConfig.getWebSocketServer();
		this.logger = serverConfig.getLogger();
	}
	
	getTimeStamp() {
		var now = moment()
		var formatted = now.format('YYYY-MM-DD HH:mm:ss.SSS')
		return formatted;
	}

    static get INDICATOR_NOT_INITIALIZED() { return 0; }
    static get INDICATOR_UNKNOWN() { return 1; }
    static get INDICATOR_OK() { return 2; }
    static get INDICATOR_FAILED() { return 3; }

    
    getInputVal(name) {
//		console.log("indicator: " + name + ", state: " + state);
		var data = {time:  this.getTimeStamp(), type: 'getInputVal' , name: name}
		try { this.ws.send(JSON.stringify(data)); } catch(e) { console.log(e); }
	}

    
	updateIndicator(name, state) {
//		console.log("indicator: " + name + ", state: " + state);
		var data = {time:  this.getTimeStamp(), type: 'statistics-indicator' , name: name, state : state}
		try { this.ws.send(JSON.stringify(data)); } catch(e) { console.log(e); }
	}
    
	updateImage(name, value) {
		console.log("image: " + name );
		var data = {time:  this.getTimeStamp(), type: 'statistics-image' , name: name, data : value}
		try { this.ws.send(JSON.stringify(data)); } catch(e) { console.log(e); }
	}
	
	updateTable(name, value) {
	//	console.log("table: " + name );
		var data = {time:  this.getTimeStamp(), type: 'statistics-table' , name: name, data : value}
		try { this.ws.send(JSON.stringify(data)); } catch(e) { console.log(e); }
	}

	updateGraph(name, set, value) {
//		console.log("indicator: " + name + ", state: " + state);
		var data = {time:  this.getTimeStamp(), type: 'statistics-graph' , name: name, set : set, value: value}
		try { this.ws.send(JSON.stringify(data)); } catch(e) { console.log(e); }
	}

	updateTextIO(name, message) {
		console.log("indicator: " + name );
		var data = {time:  this.getTimeStamp(), type: 'statistics-text' , name: name, message : message}
		try { this.ws.send(JSON.stringify(data)); } catch(e) { console.log(e); }
	}
	

}

module.exports = StatisticsInterface;