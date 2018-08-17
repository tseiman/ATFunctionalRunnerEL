

/**
 * http://usejsdoc.org/
 */

const xpath = require('xpath');

class Config {

	constructor() {
		this.config = null;
		this.statisticsInterface = null;

	}
	
	setConfig(dom) {
		
		this.config = dom;
	}
	
	getConfig() {
		return this.config;
	}
	
	invalidateConfig() {
		this.config = null;
		
		delete this.fileName;
		delete this.fileSize;
		delete this.fileLastModified;
		
	}
	
	setFileName(fname) {
		this.fileName = fname;
	}
	setFileSize(size) {
		this.fileSize = size;
	}
	setFileLastModified(lm) {
		this.fileLastModified = lm;
	}
	getFileName() {
		return this.fileName;
	}
	getFileSize() {
		return this.fileSize;
	}
	getFileLastModified() {
		return this.fileLastModified;
	}

	getScript() {
		if(this.config === null) return null;
		return xpath.select("string(//atrun/server/script)", this.config);
	}
	isScriptOk() {
		if(this.getScript() === null) return false;
		return (this.getScript().length < 3) ?  false : true;
	}

	isConfigOk() {
		if(this.fileName === undefined) return false;
		if(this.fileSize === undefined) return false;
		if(this.fileLastModified === undefined) return false;
		return this.isScriptOk();
	}
	
	setCodeEval(setCodeEval) {
		this.codeEvalDat = setCodeEval;
	}

	getCodeEval() {
		return this.codeEvalDat;
	}
	
	
	setSatisticsInterface(si) {
		this.statisticsInterface = si;
	}
	getSatisticsInterface() {
		return this.statisticsInterface;
	}
	setLogger(logger) {
		this.logger = logger;
	}	
	getLogger() {
		return this.logger;
	}
	setWebSocketServer(websocketServer) {
		this.websocketServer = websocketServer;
	}
	getWebSocketServer() {
		return this.websocketServer;
	}

}

module.exports = Config;