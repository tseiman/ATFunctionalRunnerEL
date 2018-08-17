var db = 0;
function pad(num, size) {
	var s = "000000000" + num;
	return s.substr(s.length-size);
}

function attSerialCallback(data) {
	console.log("aaaa callback serial: " + data);
}

var attSerial = getNewSerial({port: "/dev/tty.usbserial", baud: 115200, delimiter: "\n" });
attSerial.open(attSerialCallback);
attSerial.writeln("rid");



function testEvent() {
	setTimeout(function() {
		var padString = pad(db,4);
		//	logger.norm("Set DB to:" + padString + "0");
		attSerial.writeln("wv" + padString+ "0");
		Graph.update("Attenuator","attenuation",db / 10);
		++db;
		if(db  < 901) { 
			testEvent(); 
		} else {
			attSerial.close();
			exit(0);
		}
	}, 100);
}

testEvent();
