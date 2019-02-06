/**
 * http://usejsdoc.org/
 */
const StaticServer 		 = require('./server-scripts/static-server.js');
const WebSocketServer 	 = require('./server-scripts/websocket-server.js');
const Logger 			 = require('./server-scripts/logger-server.js');
const StatisticsInterface = require('./server-scripts/statistics-interface.js');
const Config				 = require('./server-scripts/server-config.js');
const SerialIO				 = require('./server-scripts/serial-io.js');
const ScpiClient				 = require('./server-scripts/scpi-client.js');


var staticServer = new StaticServer();

var serverConfig = new Config();
var logger = new Logger(serverConfig);
serverConfig.setLogger(logger);

/*
var serial = new SerialIO(serverConfig);

function myCallback(data) {
	console.log(">>>" + data);
}

serial.open(myCallback);

serial.writeln('ATE=0');


serial.writeln('ATE=0');


function testLoop () {
	
	setTimeout(function () {
		if(serial.isOpen()) {
			serial.writeln('AT+CPIN?');
		}
		testLoop();
	}, 1000);
}
testLoop();
*/
/*
function attSerialCallback(data) {
	console.log("aaaa callback serial: " + data);
}

var attSerial = new SerialIO({port: "/dev/tty.usbserial", baud: 115200},logger);
attSerial.open(attSerialCallback);
attSerial.writeln("rid");
//attSerial.close();
*/


var websocketServer = new WebSocketServer(serverConfig);
serverConfig.setWebSocketServer(websocketServer);

var statisticsInterface = new StatisticsInterface(serverConfig);
serverConfig.setSatisticsInterface(statisticsInterface);


