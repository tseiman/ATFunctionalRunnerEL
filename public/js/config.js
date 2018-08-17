/**
 * http://usejsdoc.org/
 */


class Config {


	constructor(configFile) {
		this.ziptype = false;
		if(!arguments.length) {
			this.configFile = null;
			this.configData = "";
			this.setFileName(null);
			this.setFileSize(null);
			this.setFileLastModified(null);

		} else {
			this.configFile = configFile;
			logger.system('Loaded file : ' + configFile.name + '" with ' + configFile.size + 'bytes, last modified: ' + configFile.lastModifiedDate);
			this.loadConfigFile();
			this.setFileName(configFile.name);
			this.setFileSize(configFile.size);
			this.setFileLastModified(configFile.lastModifiedDate);

		}

		this.graphs = {};
		this.inputs = {};
		this.outputs = {};
	}


	loadConfigFile() {
		var self = this;
		this.fr = new FileReader(); // FileReader instance
		this.fr.onload = function () {
			try {
				self.parseConfig(self.fr.result);
			} catch (e) {
				console.log(e);
				logger.system(e);
			}
		};

		if(this.configFile.name.endsWith(".zip")) {
			logger.system("We have a ZIP !: " + this.configFile );
			this.ziptype = true;			

	/*		JSZip.loadAsync(this.configFile).then(function(zip) {

				zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
						console.log(zipEntry);
						self.parseConfig(zipEntry.asText());
				});
			}, function (e) {
		    	console.log('error loading ZIP "' + this.configFile + '" because: ' + e );
				logger.system('error loading ZIP "' + this.configFile + '" because: ' + e );
			});
*/
			
			var zipFile = new JSZip();
			zipFile.loadAsync(this.configFile).then(function(zip) {
				zip.files['main.xml'].async("string").then(function (data) {
					self.parseConfig(data);                         

				});                                             
			}, function (e) {
		    	console.log('error loading ZIP "' + this.configFile + '" because: ' + e );
				logger.system('error loading ZIP "' + this.configFile + '" because: ' + e );
			}); 


		} else if (this.configFile.name.endsWith(".xml")) {
			this.fr.readAsText( this.configFile );
		} else {
			console.log("unsupported file type: " + this.configFile);
			logger.system("unsupported file type: " + this.configFile);
		}

	}

	parseConfig(domTxt) {
		var parser = new DOMParser();
		this.configData = parser.parseFromString(domTxt,"text/xml");
		this.parseConfigForClient();
		this.parseConfigForServer();	
	}


	parseConfigForClient() {
		if( typeof this.configData === 'undefined') throw('no config data ?!');

		$("#space").empty();
		var element = this.configData.evaluate( '//atrun/client/maxlog', this.configData, null, XPathResult.NUMBER_TYPE, null );

		if(element != null) {
			//		console.log(element);
			if(String(element.numberValue).match(/^([0-9]+)$/)) {
				//		console.log(element.numberValue);

				logger.setMaxLog(parseInt(element.numberValue));
			}
		}

		element = this.configData.evaluate('//atrun/client/indicator', this.configData, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if(element != null) { 
			if(null == this.configData.evaluate('//atrun/client/indicator/table', this.configData, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) throw("check indicator XML");

			this.indicator = new Indicator(this.configData);
		}

		element = this.configData.evaluate('//atrun/client/io/input', this.configData, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if(element != null) { 

			let result = this.configData.evaluate("//atrun/client/io/input/@name", this.configData, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

			for (let i=0, length=result.snapshotLength; i<length; ++i) {
				this.inputs[result.snapshotItem(i).value] = new Input(result.snapshotItem(i).value, this.configData);
			}

		}
		element = this.configData.evaluate('//atrun/client/io/output', this.configData, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if(element != null) { 

			let result = this.configData.evaluate("//atrun/client/io/output/@name", this.configData, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

			for (let i=0, length=result.snapshotLength; i<length; ++i) {
				this.outputs[result.snapshotItem(i).value] = new Output(result.snapshotItem(i).value, this.configData);
			}

		}



		element = this.configData.evaluate('//atrun/client/graphs/graph', this.configData, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if(element != null) { 

			let result = this.configData.evaluate("//atrun/client/graphs/graph/@name", this.configData, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

			for (let i=0, length=result.snapshotLength; i<length; ++i) {
				this.graphs[result.snapshotItem(i).value] = new LineChart(result.snapshotItem(i).value, this.configData);
			}

		}




	}

	parseConfigForServer() {
		if( typeof this.configData === 'undefined') throw('no config data ?!');



		var element = this.configData.evaluate( '//atrun', this.configData, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
		if(element != null) {
//			if(this.configData != null) {
			//		var head = this.configData.evaluate( '//atrun/head', this.configData, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;

			//		if(head != null) {
			//			element.prepend(head);
			//		}

//			var tmp = document.createElement("server"); // hack 
//			tmp.appendChild(element);

			var data = element.outerHTML;
//			var data = this.configData.outerHTML;
			var enc = new TextEncoder();
			var enc_data = enc.encode(data);
			var b64data = base64ArrayBuffer(enc_data);

			var b64enc_data = enc.encode(b64data);




			var crc32 = new CRC32();
			for (var i = 0; i < b64enc_data.byteLength; i++) {
				crc32.update(b64enc_data[i]);
			}


			//	console.log(enc_data + ", " + crc32.get());
			//	console.log(base64ArrayBuffer(enc_data) + ", " + crc32.get());
			//	console.log(JSON.stringify({type: 'SERVERCONFIG-PUSH', data: b64data, crc32: crc32.get() }));

			socket_log.send(JSON.stringify({type: 'SERVERCONFIG-PUSH', data: b64data, crc32: crc32.get() }));
		}

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
	setConfigFile(cf) {
		this.configFile = cf;
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


	hasConfig() {
		if(this.configFile === null)  return false;
		return true;
	}

	getIndicator() {
		return this.indicator;
	}

	hasGraph(name) {
		return (this.graphs[name] === undefined || this.graphs[name] === null) ? false : true; 
	}
	getGraph(name) {
		return this.graphs[name];
	}
	getGraphs() {
		return this.graphs;
	}
	getInput(name) {
		return this.inputs[name];
	}
	getInputs() {
		return this.inputs;
	}

	hasOutputText(name) {
		return (this.outputs[name] === undefined || this.outputs[name] === null) ? false : true; 
	}
	getOutputText(name) {
		return this.outputs[name];
	}
}


