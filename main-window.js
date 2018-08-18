// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');

const WebSocketServer 	 = require('./server-scripts/websocket-server.js');
const Logger 			 = require('./server-scripts/logger-server.js');
const StatisticsInterface = require('./server-scripts/statistics-interface.js');
const Config				 = require('./server-scripts/server-config.js');
const SerialIO				 = require('./server-scripts/serial-io.js');
const path = require('path');

// var staticServer = new StaticServer();

var serverConfig = new Config();
var logger = new Logger(serverConfig);
serverConfig.setLogger(logger);


var websocketServer = new WebSocketServer(serverConfig);
serverConfig.setWebSocketServer(websocketServer);

var statisticsInterface = new StatisticsInterface(serverConfig);
serverConfig.setSatisticsInterface(statisticsInterface);



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1200, height: 800, icon: path.join(__dirname, 'icons/png/icon64x64.png'), title: "AT Functional Runner (EL)",});
//	mainWindow = new BrowserWindow({width: 1200, height: 800, icon: __dirname +  '/icons/mac/Icon.icns'});
  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadFile('gui-scripts/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.




