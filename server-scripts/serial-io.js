/**
 * http://usejsdoc.org/
 */

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')

//var port = new SerialPort('/dev/tty-usbserial1', { autoOpen: false });




class SerialIO {



	constructor(config, logger) {
		this.logger = logger;
		this.config  =  config;
		this.name  =  config.name;
		
		if(config.port === undefined || config.port === null || config.baud === undefined || config.baud === null) throw ('configuration for serial needs port and baud - e.g. new SerialIO({port: "/dev/ttyUSB1", baud: 115200, delimiter: "\r\n" });');
		this.logger.LogIO("creating new serial port [" + this.name + "]: " + config.port + ", baud: " + config.baud );

		this.port = new SerialPort(config.port, { 
			autoOpen: false,
			baudRate: config.baud
		});

		

	}


	open(callback) {
		var self = this;
		console.log("open port");
//		this.logger.LogIO("opening port: " + this.config.port );
		this.port.open(function (err) {
			if (err) {
				console.log('Error opening port [' + self.name + ']: ' + err.message);
				return false;
			}
			return true;
		});
		this.parser =  this.port.pipe(new Readline({ delimiter: this.config.delimiter }));

		if(callback !== undefined || callback !== null) {


			this.parser.on('data', function (data) {

				self.logger.LogIO("[" + self.name + "]<<< " + data.toString());
				console.log(data);
				callback(data);
			});	

		}


	}

	writeln(data) {
		this.logger.LogIO("[" + this.name + "]>>> " + data);
		this.port.write(data + this.config.delimiter);
	}


	write(data) {
		this.logger.LogIO("[" + this.name + "]>>> " + data.toString());
		this.port.write(data);
	}

	isOpen() {
		if(this.port === undefined || this.port === null) return false;
		return this.port.isOpen;
	}

	close() {
		this.logger.LogIO("Closing a serial port [" + this.name + "]");

		if(this.isOpen()) this.port.close();
	}
}


module.exports = SerialIO;


