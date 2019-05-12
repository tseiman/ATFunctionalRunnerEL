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



var websocketServer = new WebSocketServer(serverConfig);
serverConfig.setWebSocketServer(websocketServer);

var statisticsInterface = new StatisticsInterface(serverConfig);
serverConfig.setSatisticsInterface(statisticsInterface);


