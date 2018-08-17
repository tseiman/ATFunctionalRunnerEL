/**
 * http://usejsdoc.org/
 */

const vm = require("vm");
const SerialIO				 = require('./serial-io.js');

var script = vm.createScript( process.argv[2] );


class ProcessLogger {

	LogIO(message) { process.send({type: "log", crit: "io", msg: message}); }
	LogSystem(message) {	process.send({type: "log", crit: "system" 	, msg: message}); }
	LogNormal(message) { process.send({type: "log", crit: "norm", msg: message}); }
	LogWarn(message) { process.send({type: "log", crit: "warn", msg: message}); 	}
}


var obj = { 
//		sendResult:function (result) { process.send(result); process.exit(0); }, 
		setTimeout: function(callback,time) { setTimeout(callback,time); },
		console: { log: function(text) { console.log(text); } },
		updateIndicator: function(name, state) { process.send({type: "updateIndicator", name: name, state: state}); },
		Graph: {
			update: 	function(name,set,value) { process.send({type: "updateGraph", name: name, set: set, value: value}); }
		},
		Indicator: { 
		     get INDICATOR_NOT_INITIALIZED() { return 0; },
		     get INDICATOR_UNKNOWN() { return 1; },
		     get INDICATOR_OK() { return 2; },
		     get INDICATOR_FAILED() { return 3; },
		},
		updateTextIO: function(name,message) { process.send({type: "updateTextIO", name: name, message: message}); },
		logger: { 
			norm:   	function(text) { process.send({type: "log", crit: "norm" 		, msg: text}); },
			system: 	function(text) { process.send({type: "log", crit: "system" 	, msg: text}); },
			warn: 	function(text) { process.send({type: "log", crit: "warn" 		, msg: text}); },
			io: 		function(text) { process.send({type: "log", crit: "io" 		, msg: text}); }
		},
		getNewSerial : function(config)  { return new SerialIO(config,new ProcessLogger()); },
		exit: function(code) { process.send({type: "exit", code: code}); },
		getInputEvent:  function(callback) { process.on('message',callback); }
		
};
var context = vm.createContext(obj);

script.runInNewContext(context);

process.on('uncaughtException', function(err) {
	console.log("uncaughtException:");
	console.log(err);
	// process.exit(1);
});
