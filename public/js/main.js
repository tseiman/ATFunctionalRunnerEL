

var socket_log = new ReconnectingWebSocket( "ws://localhost:8888/log", "log_protocol" );


Chart.defaults.global.responsive = true;
Chart.defaults.global.maintainAspectRatio = false;



var logger = new Logger();
var config = new Config();
var wsOK = 0;
var linkOk = false;
var remoteConfigOk = false;



function loadFile() {
	$("#runnderfile-info").text($("#fileLoader").val().replace(/C:\\fakepath\\/i, ''));

	if($('#fileLoader' )[0].files &&  $('#fileLoader' )[0].files[0] ) {
		var configFile = $( '#fileLoader' )[0].files[0];
		config = new Config(configFile);
		if(!config.ziptype) socket_log.send(JSON.stringify({type: 'NEW FILE', fileName: configFile.name, fileSize: configFile.size, lastModified:configFile.lastModifiedDate }));
		

	} else {
		alert( "File not selected or browser incompatible." );
	}
}


function pullConfig() {
	console.log("pull config");
	socket_log.send(JSON.stringify({type: 'SERVERCONFIG-PULL'}));
}


function checkConfig() {
	if((!remoteConfigOk) && linkOk && $('#fileLoader' )[0].files &&  $('#fileLoader' )[0].files[0] ) {
		if(!config.ziptype) 	loadFile();
	}

//	console.log("remoteConfigOk: " + remoteConfigOk + ", linkOk :" + linkOk + ", config.hasConfig():" + config.hasConfig() +  ", $('#fileLoader' )[0].files):" +  $('#fileLoader' )[0].files + "$('#fileLoader' )[0].files[0]" +  $('#fileLoader' )[0].files[0] );
	
	if(remoteConfigOk && linkOk && (! config.hasConfig()) && ( (! $('#fileLoader' )[0].files) || (!  $('#fileLoader' )[0].files[0])) ) {
		pullConfig();
	}

	
}


socket_log.onopen = function() { 
	console.log("socket_log open");  
	wsOK = 0;
}
socket_log.onclose = function() { 
	console.log("socket_log close");  
	wsOK = 2;
}

socket_log.onmessage = function(msg) {  
	var self = this;
	try {
		var data = JSON.parse(msg.data);
		switch (data.type) {
		case "PING":
			--wsOK;
		//		console.log("got PING : data.configok" + data.configok + ", data.isNotRunning" + data.isNotRunning) ;
			
//			let inputlist = config.getInputs();

			if(data.configok && data.isNotRunning) {
				$( "#server-start-exec" ).button( "enable" );
			} else {
				$( "#server-start-exec" ).button( "disable" );
			}
			if(data.configok && (!data.isNotRunning)) {
				$( "#server-stop-exec" ).button( "enable" );						
/*				for(var index in inputlist) {
					$( "#" + index ).prop('disabled', false);
					$( "#" + index ).removeClass(".ui-state-disabled");

				}
*/				
			} else {
				$( "#server-stop-exec" ).button( "disable" );
/*				for(var index in inputlist) {
					$( "#" + index ).prop('disabled', true);
					$( "#" + index ).addClass(".ui-state-disabled");
				} */
			}
			remoteConfigOk = data.configok;
			
			checkConfig();				
			
			socket_log.send(JSON.stringify({type: 'PONG'}));

			break;
		case "SERVERCONFIG":
			
			var enc = new TextEncoder();
			var enc_data = enc.encode(data.data);
		
			var crc32 = new CRC32();
			for (var i = 0; i < enc_data.byteLength; i++) {
				crc32.update(enc_data[i]);
			}
			
	//		console.log("crc32 calc: " + crc32.get() + ", crc32 got:" + data.crc32);
			
			if(crc32.get() != data.crc32) {
				logger.warn("server config pull crc32 missmatch");
				throw ("server config pull crc32 missmatch");
			}
		
		//	console.log("server config -------");
	//		console.log(window.atob(data.data));
			config.setConfigFile(data.fileName);
			config.setFileName(data.fileName);
			config.setFileSize(data.fileSize);
			config.setFileLastModified(data.lastModifiedDate);
			config.parseConfig(window.atob(data.data));
		//	console.log("END server config -------");

			$("#runnderfile-info").text(config.getFileName());
			
			break;	
		case "statistics-indicator":
//			console.log(config);
			if(config.configFile !== null) config.indicator.updateIndicator(data.name, data.state);
			break;
		case "statistics-graph":
//			console.log(config);
//			if(config.configFile !== null) config.indicator.updateIndicator(data.name, data.state);
			if(config.configFile !== null) {
				 if(config.hasGraph(data.name))  config.getGraph(data.name).pushData(data.time, data.set,data.value);
//				
					 // config.graphs[data.name].pushData(data.set,data.value);	
			}
			break;
		case "statistics-text":
			if(config.configFile !== null) {
				 if(config.hasOutputText(data.name))  config.getOutputText(data.name).updateOutput(data.message);
			}
			break;
		default:
			logger.log(data);
		}
	} catch (e) {
		logger.system("Error in received JSON: " + e + ", please check from SysConsole, msg was:  " + JSON.stringify(msg.data));
		console.log(e);
		console.log(msg.data);

	}

//	socket_log.send( msg.data);
}



function linkOkCheck() {
	setTimeout(function () {
		++wsOK;
		if(wsOK >= 2) {
			$("#serverlink").removeClass( "appindicator-green" )		
			$( "#server-start-exec" ).button( "disable" );
			$( "#server-stop-exec" ).button( "disable" );
			linkOk =  false;
			wsOK = 2;
		} else {
			$("#serverlink").addClass( "appindicator-green" )	;	
			linkOk =  true;				
		}
		linkOkCheck();
	}, 1000);
}
linkOkCheck();



$( document ).ready(function() {
	$( "#logtext" ).scroll(function() {
		var offset = $( "#logtext" ).outerHeight(); // height of textarea

		if (this.scrollHeight <= (this.scrollTop+offset)) {
			// scrollLogEnable = true;
			logger.enableLog();
		} else {
//			scrollLogEnable = false;
			logger.disableLog();

		}
	});

	$("#fileLoader").click(function(){ 
		$("#fileLoader").val(""); 
		
	});
	
	$("#fileLoader").change(function(){ 
		loadFile();


	});


	$( "#server-start-exec" ).button({
		  disabled: true
	}).click(function(){ 
		socket_log.send(JSON.stringify({type: 'SCRIPT-RUN'}));
	});;
	$( "#server-stop-exec" ).button({
		  disabled: true
	}).click(function(){ 
		socket_log.send(JSON.stringify({type: 'SCRIPT-STOP'}));
	});
	
	$( "#reload-file" ).button().click(function(){ 
		loadFile();
	});
	
	$( "#toPdf" ).button({
	}).click(function(){ 
		var doc = new jsPDF();
	    doc.fromHTML($('#space').html(), 15, 15, {
	        'width': 170,
	  //          'elementHandlers': specialElementHandlers
	    });
	    doc.save('sample-file.pdf');
		
		
	});
	
	$( "#move-widgets" ).button().click(function(){ 
		
		if($( "#move-widgets" ).attr('data-checked') === undefined) { $( "#move-widgets" ).attr('data-checked','false'); }
		
		if($( "#move-widgets" ).attr('data-checked') === 'true') {
			$( "#move-widgets" ).removeClass("ui-state-active"); 
			$( "#move-widgets" ).attr('data-checked','false');
			
			$( ".dragable" ).draggable({ disabled: true });
			$(".dragable-icon-wrap").remove();
		} else {
			$( "#move-widgets" ).addClass("ui-state-active"); 
			$( "#move-widgets" ).attr('data-checked','true');
			$( ".dragable" ).draggable({ grid: [ 2, 2 ], disabled: false });
			$( ".dragable" ).prepend( '<div class="dragable-icon-wrap"><span class="ui-icon ui-icon-arrow-4 dragable-icon">icon</span></div>' );
			$(".dragable-icon").css("color", $(".ui-state-active").css("background-color"));
			
		}
		console.log($( "#move-widgets" ));
	});
	
	
	$( window ).unload(function() {
//		$( "#exit-nodejs" ).dialog('open');
		socket_log.send(JSON.stringify({type: 'quit'}));
	})
	
	



});



