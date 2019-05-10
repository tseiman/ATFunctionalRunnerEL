/**
 * http://usejsdoc.org/
 */

/**
 * http://usejsdoc.org/
 */

class Table {
	
	constructor(name, dom,append_to_id) {
		var apped_to = (append_to_id === undefined) ? "#space" : append_to_id;
		this.name = name;
		var self = this;
		self.data = undefined;
		
		this.value = dom.evaluate( './/table[@name="' + name + '"]', dom, null, XPathResult.STRING_TYPE, null ).stringValue;

		var tableSceleton = '';
		$(apped_to).append('<p class="dynatable-wrapper dragable" id="wrapper-' + self.name + '"></p>');
		$('#wrapper-' + self.name).append('<table id="' + self.name + '" class="dynatable"></table>');

		
		
		var preconfiguredTable = dom.evaluate( './/table[@name="' + name + '"]', dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		for(var i = 0; i < preconfiguredTable.snapshotLength; i++) {
			  var node = preconfiguredTable.snapshotItem(i);
			
			  if(typeof node.innerHTML !== "undefined") {
				  $('#' + self.name).append(node.innerHTML);
		//		  console.log(node.innerHTML);
			  }
			  
		}
		
		self.$table = $('#' + self.name);
		self.$table.dynatable({
				dataset: {
					perPageDefault: 10
				}
		});
		self.dynatable = $('#' + self.name).data('dynatable');

		
		
	}
	
	update(data) {
		var self = this;
	//	console.log("Got Table update: \n" + JSON.stringify(data, undefined, 2));

		if(typeof data.cmd === undefined || typeof data.rowID === undefined) {
			console.trace("invalid table data: " +  JSON.stringify(data, undefined, 2));
		}

		
		switch (data.cmd) {
		case "add":
			if(typeof data.cols  === undefined ) {
				console.trace("invalid table data: " +  JSON.stringify(data, undefined, 2));
			}
			data.cols.rowID = data.rowid;
			self.dynatable.settings.dataset.originalRecords.push(data.cols);
			self.dynatable.process();
			break;
		case "modify":
			if(typeof data.cols  === undefined ) {
				console.trace("invalid table data: " +  JSON.stringify(data, undefined, 2));
			}
			data.cols.rowID = data.rowid;
			self.dynatable.settings.dataset.originalRecords[self.dynatable.settings.dataset.originalRecords.findIndex(id => id.rowID === data.rowid)] = data.cols;
			self.dynatable.process();
			break;
		case "del":
			self.dynatable.settings.dataset.originalRecords.splice(self.dynatable.settings.dataset.originalRecords.findIndex(id => id.rowID === data.rowid), 1);  
			self.dynatable.process();
			break;
			
		default:
			console.trace("invalid command: " + data.cmd);
		}
		
	}
	
	
	
}


