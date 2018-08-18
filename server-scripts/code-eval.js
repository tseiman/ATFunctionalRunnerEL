/**
 * http://usejsdoc.org/
 */

var cp = require('child_process');
const path = require('path');

class CodeEval {


	constructor(serverConfig) {
		this.code = serverConfig.getScript();
		this.logger = serverConfig.getLogger();
		this.statisticsInterface = serverConfig.getSatisticsInterface();
	}


	run() {
//		this.worker = cp.fork('server-scripts/script-runner.js', [this.code]);
		this.worker = cp.fork(path.join(__dirname, 'script-runner.js'), [this.code]);
		
		var self = this;
		this.running = false;
		self.logger.LogNormal("Code evaluation starts.");
		
		
		this.worker.on('message', function(data) {
			
			switch (data.type) {
			case "updateIndicator":
				self.statisticsInterface.updateIndicator(data.name,data.state);
				break;	
			case "updateGraph":
				self.statisticsInterface.updateGraph(data.name,data.set,data.value);
				break;	
			case "updateTextIO":
				
				self.statisticsInterface.updateTextIO(data.name,data.message);
				break;	
			case "log":
				switch (data.crit) {
					case "norm":
						self.logger.LogNormal(data.msg);
					break;
					case "warn":
						self.logger.LogWarn(data.msg);
					break;
					case "system":
						self.logger.LogSystem(data.msg);
					break;
					case "io":
						self.logger.LogIO(data.msg);
					break;
					default:				
						console.log("unknown log command" + data);
				}
			break;	
			case "exit":
				self.logger.LogSystem("application exits");
				self.worker.kill('SIGINT');
			break;

			default:
				console.log("unknown command" + data);
			}
			
		});

		this.worker.on('exit', function (code, signal) {

			self.logger.LogNormal("Code evaluation exits with code: " + code + " and signal: " + signal);
			try {
				self.worker.kill();
			} catch(e) { console.log(e); }
			self.running = false;
		});

		this.worker.on('error', function (err) {
			self.worker.kill('SIGTERM');
			self.running = false;
			self.logger.LogNormal("Code evaluation exits with error: " + err);
		});
		
		
		
		this.worker.on('close', function (code,signal) {
			self.running = false;
			self.logger.LogNormal("Code evaluation closes with code: " + code + ", and with signal: " + signal);
		});

/*		setTimeout(function killOnTimeOut() {
			worker.kill();
			console.log(new Error("timeout"));
		}, 5000);
		*/
		this.running = true;

	}

	stop() {
		var self = this;
//		console.log("code eval stop r --------");
		this.worker.kill();
		this.running = false;
		self.logger.LogNormal("Try to stop code evaluation worker. state.killed:" + self.worker.killed );
	}
	
	isDead() {
		var self = this;
		if(self.worker === undefined) return true;
		
		return ! this.running;

	//	return self.worker.killed;
//		return this.worker.isDead();
	}

	postMessage(data) {
		var self = this;
		if(self.worker === undefined) return;
		self.worker.send(data);
	}
}


module.exports = CodeEval;