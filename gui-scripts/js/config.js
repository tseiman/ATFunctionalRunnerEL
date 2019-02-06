/**
 * http://usejsdoc.org/
 */

const fs = require("fs");

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
		this.images = {};
		this.buttons = {};
		this.codes = {};
	}


	loadConfigFile() {
		this.dummyId = 0;
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
					self.zipdata = zip;	
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
	
	
	loadResource(src) {
		console.log({ssssssssssssrrc: src});
		
		try {
			let fileContents = fs.readFileSync(src);
			console.log({fileContent: fileContents});

			return fileContents;	
			
		} catch (err) {
			logger.system(err);
			console.log(err);
			return null;
		}


	}


	parseConfigForClientElements(node,depth,append_to_id) {

		var ldep = depth + 1;



//		var result = {};
		switch (node.nodeName) {
		case "i":
		case "ol":
		case "ul":
		case "li":
			var apped_to = (append_to_id === undefined) ? "#space" : append_to_id;
			var appendingId = 'dummyID_' + this.dummyId;

			$(apped_to).append('<' + node.nodeName +' id="' + appendingId +'"></' + node.nodeName +'>');
			appendingId = '#' + appendingId;
			++this.dummyId;
			var element  = node.ownerDocument.evaluate('./node()',node,node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
			if(element != null) { 
				for (var i=0, length=element.snapshotLength; i<length; ++i) {			
					if(element.snapshotItem(i).nodeType == 1) {
						this.parseConfigForClientElements(element.snapshotItem(i), ldep, appendingId);
					} else if (element.snapshotItem(i).nodeType == 3) {
						if(element.snapshotItem(i).nodeValue != undefined) {
							$(appendingId).append( element.snapshotItem(i).nodeValue);
						}
					} 

				}
				break;
			}


			break;
		case "button":
			var result = node.ownerDocument.evaluate(".//@name", node, node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			this.buttons[result.snapshotItem(0).value] = new Button(result.snapshotItem(0).value, this.configData,append_to_id);
			break;
		case "image":
			var result = node.ownerDocument.evaluate(".//@name", node, node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			console.log({name:result});
			
//			var imgpath = node.ownerDocument.evaluate(".//@src", node, node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).stringValue;
//			var imgData = this.loadResource(imgpath);
			this.images[result.snapshotItem(0).value] = new Image(result.snapshotItem(0).value, this.configData,append_to_id);
			break;
		case "input":
			var result = node.ownerDocument.evaluate(".//@name", node, node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			this.inputs[result.snapshotItem(0).value] = new Input(result.snapshotItem(0).value, this.configData,append_to_id);
			break;
		case "output":
			var result = node.ownerDocument.evaluate(".//@name", node, node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			this.outputs[result.snapshotItem(0).value] = new Output(result.snapshotItem(0).value, this.configData,append_to_id);
			break;
		case "code":
			var result = node.ownerDocument.evaluate(".//@name", node, node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			this.codes[result.snapshotItem(0).value] = new HighlightCode(result.snapshotItem(0).value, this.configData,append_to_id);
			break;
		case "indicator":			
			if(null == node.ownerDocument.evaluate(".//table", node, node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) throw("check indicator XML");
			this.indicator = new Indicator(this.configData,append_to_id);
			break;
		case "graph":				
			var result = node.ownerDocument.evaluate(".//@name", node, node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			this.graphs[result.snapshotItem(0).value] = new LineChart(result.snapshotItem(0).value, this.configData,append_to_id);

			break;
		case "section":
			var result = node.ownerDocument.evaluate(".//@name", node, node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			$("#space").html($("#space").html() +'<div id="accordion_' + result.snapshotItem(0).value + '"></div>');
			//				$("#space").append('<p>aaaaaaaa');

			var element  = node.ownerDocument.evaluate('.//section-item',node,node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
			if(element != null) { 
				for (let i=0, length=element.snapshotLength; i<length; ++i) {			
//					console.log({aaaaaaa:"aaaaaaaaaa", ldep : ldep, el: element.snapshotItem(i)});
					this.parseConfigForClientElements(element.snapshotItem(i), ldep, '#accordion_' + result.snapshotItem(0).value);

				}
			}
//			$("#space").append('<script> $( function() {  $( "#accordion_' + result.snapshotItem(0).value + '").accordion({heightStyle: "content"});} ); </script>');
			$( document ).ready(function() {
				$( '#accordion_' + result.snapshotItem(0).value).accordion({ autoHeight: true, collapsible: true, active : 'none'});
				$( '#accordion_' + result.snapshotItem(0).value + ' .section-item').each(function( index ) {
					$( this ).height($('#space').height() - $( '#accordion_' + result.snapshotItem(0).value).height() - 36);						
				});

				$( '#accordion_' + result.snapshotItem(0).value ).attr("originalHeight",$( '#accordion_' + result.snapshotItem(0).value ).height());

				// $('#space').height() - $( '#accordion_' + result.snapshotItem(0).value).height();




			});



			break;
		case "section-item":

			var apped_to = (append_to_id === undefined) ? "#space" : append_to_id;
			//	console.log("append to:" + apped_to);

			result = node.ownerDocument.evaluate(".//@head", node, node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var result2 = node.ownerDocument.evaluate(".//@id", node, node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

			//		 console.log({"result 2" : result2.snapshotItem(0)});
			//		$(apped_to).append('<h3>' + result.snapshotItem(0).value + '</h3><div id="'+ apped_to + '_' +  result2.snapshotItem(0).value +'">aaaa<div>');

			$(apped_to).append('<h3>' + result.snapshotItem(0).value + '</h3><div style="height:100%" class="section-item" id="'+ apped_to.substr(1)  + '_' +  result2.snapshotItem(0).value +'"></div');

			var element  = node.ownerDocument.evaluate('./node()',node,node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
			
			
			if(element != null) { 
				for (let i=0, length=element.snapshotLength; i<length; ++i) {	
					
					if(element.snapshotItem(i).nodeType == 1) {
						this.parseConfigForClientElements(element.snapshotItem(i), ldep, '#' + apped_to.substr(1)  + '_' +  result2.snapshotItem(0).value);
					} else if (element.snapshotItem(i).nodeType == 3) {
						$('#' + apped_to.substr(1)  + '_' +  result2.snapshotItem(0).value).append(element.snapshotItem(i).nodeValue);
					}


//					ORIG					this.parseConfigForClientElements(element.snapshotItem(i), ldep,apped_to + '_' +  result2.snapshotItem(0).value);
				}					

			}


			//	$("#space").append('</div>');

			break;


		default:
			var apped_to = (append_to_id === undefined) ? "#space" : append_to_id;

		var element  = node.ownerDocument.evaluate('./node()',node,node.ownerDocument.createNSResolver(node.ownerDocument), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);

		if(element != null) { 
			for (let i=0, length=element.snapshotLength; i<length; ++i) {		

				if(element.snapshotItem(i).nodeType == 1) {
					//		console.log({type: "tag", dummyId : '#dummyID_' +  this.dummyId, appendingId: appendingId, item: element.snapshotItem(i), nodeType: element.snapshotItem(i).nodeType,innerHTML:  element.snapshotItem(i).innerHTML})
					this.parseConfigForClientElements(element.snapshotItem(i), ldep, appendingId);
				} else  if (element.snapshotItem(i).nodeType == 3) {
					//		console.log({type: "text",dummyId : '#dummyID_' +  this.dummyId, appendingId: appendingId, item: element.snapshotItem(i), nodeType: element.snapshotItem(i).nodeType,nodeValue:  element.snapshotItem(i).innerHTML})
					$(element.snapshotItem(i)).append(element.snapshotItem(i).nodeValue);
				}


				//		this.parseConfigForClientElements(element.snapshotItem(i));
			}
		}  
		break;	 
		}
	}

	parseConfigForClient() {
		this.dummyId = 0;
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




		var element = this.configData.evaluate('//atrun/client/*', this.configData, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		//	if(element != null) { 

		// let result = this.configData.evaluate("//atrun/client/io/input/@name", this.configData, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		for (let i=0, length=element.snapshotLength; i<length; ++i) {

			//	console.log({i: i, data: element.snapshotItem(i).nodeName});
			if(element.snapshotItem(i).nodeName !== "maxlog") {
				this.parseConfigForClientElements(element.snapshotItem(i),0);
			}
//			this.inputs[result.snapshotItem(i).value] = new Input(result.snapshotItem(i).value, this.configData);
		}

		//	}


	

	}



	parsePlainConfigForServer() {
		var serverScriptBufferArray = new Array();

		var element = this.configData.evaluate( '//atrun', this.configData, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
		if(element != null) {

			var data = element.outerHTML;

			var scriptElement = this.configData.evaluate('//atrun/server/script', this.configData, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if(scriptElement != null) { 

				let result = this.configData.evaluate("//atrun/server/script", this.configData, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

				for (let i=0; i<result.snapshotLength; ++i) {
					if(result.snapshotItem(i).hasAttribute('src')) {

						var fullFileName = this.configFile.path.substring( 0, this.configFile.path.indexOf(this.configFile.name ) ) + '' + result.snapshotItem(i).getAttribute('src');
						logger.norm("Reading JS script file:" + fullFileName);

						try {
							let fileContents = fs.readFileSync(fullFileName);
							serverScriptBufferArray[i] = fileContents.toString() + "\n";	
						} catch (err) {
							logger.system(err);
							console.log(err);
						}

					} else {
						serverScriptBufferArray[i] = result.snapshotItem(i).textContent;				
					}
					result.snapshotItem(i).parentNode.removeChild(result.snapshotItem(i));

				}

			}

			let serverScriptBuffer = "";
			for (var i = 0; i <  serverScriptBufferArray.length; i++) {
				serverScriptBuffer += serverScriptBufferArray[i] + "\n";			
			}

			let newScript = this.configData.createElement("script");			
			let result = this.configData.evaluate("//atrun/server", this.configData, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

			result.snapshotItem(0).appendChild(newScript);
			result = this.configData.evaluate("//atrun/server/script", this.configData, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			result.snapshotItem(0).innerHTML = serverScriptBuffer;


			var element = this.configData.evaluate( '//atrun', this.configData, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
			var data = element.outerHTML;

			var enc = new TextEncoder();
			var enc_data = enc.encode(data);
			var b64data = base64ArrayBuffer(enc_data);

			var b64enc_data = enc.encode(b64data);

			var crc32 = new CRC32();
			for (var i = 0; i < b64enc_data.byteLength; i++) {
				crc32.update(b64enc_data[i]);
			}

			socket_log.send(JSON.stringify({type: 'SERVERCONFIG-PUSH', data: b64data, crc32: crc32.get() }));
		}

	}



	parseZipConfigForServer() {
		var self = this;
		var serverScriptBufferArray = new Array();

		var processedEntries = 0;
		var entriesToProcess = 0;

		var inSync = false;

		var element = this.configData.evaluate('//atrun/server/script', this.configData, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if(element != null) { 

			let result = this.configData.evaluate("//atrun/server/script", this.configData, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

			entriesToProcess = result.snapshotLength;
			for (let i=0; i<entriesToProcess; ++i) {
				if(result.snapshotItem(i).hasAttribute('src')) {

					self.zipdata.files[result.snapshotItem(i).getAttribute('src')].async("string").then(function (data) {
						++processedEntries;						
						serverScriptBufferArray[i] = data;
						result.snapshotItem(i).parentNode.removeChild(result.snapshotItem(i));
					});                                             

				} else {

					++processedEntries;
					serverScriptBufferArray[i] = result.snapshotItem(i).textContent;
					result.snapshotItem(i).parentNode.removeChild(result.snapshotItem(i));
				}

			}

		}

		var intvl = setInterval(function() {
			if (entriesToProcess >= processedEntries) { 
				clearInterval(intvl);
				console.log("-------");

				//	let serverScriptBuffer = "  <![CDATA[  \n";
				let serverScriptBuffer = "";
				for (var i = 0; i <  serverScriptBufferArray.length; i++) {
					serverScriptBuffer += serverScriptBufferArray[i] + "\n";

					//Do something
				}
//				serverScriptBuffer += "]]>";

				let newScript = self.configData.createElement("script");
				//	console.log(newScript[0]);
				//			newScript.appendChild(serverScriptBuffer);

				//	newScript.innerHTML("aaaaaaa");

				let result = self.configData.evaluate("//atrun/server", self.configData, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

				//		var node = self.configData.createTextNode("This is new.");
				result.snapshotItem(0).appendChild(newScript);

				result = self.configData.evaluate("//atrun/server/script", self.configData, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				result.snapshotItem(0).innerHTML = serverScriptBuffer;

				console.log(self.configData);
				self.parsePlainConfigForServer();


			}
		}, 100);


	}






	parseConfigForServer() {
		if( typeof this.configData === 'undefined') throw('no config data ?!');
		if(this.ziptype) {
			this.filetype = "zip";
			this.parseZipConfigForServer();
		} else {
			this.filetype = "plain";
			this.parsePlainConfigForServer();
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
	hasInput(name) {
		return (this.inputs[name] === undefined || this.inputs[name] === null) ? false : true; 
	}
	hasOutputText(name) {
		return (this.outputs[name] === undefined || this.outputs[name] === null) ? false : true; 
	}
	getOutputText(name) {
		return this.outputs[name];
	}
	getImage(name) {
		return this.images[name];
	}
	
}


