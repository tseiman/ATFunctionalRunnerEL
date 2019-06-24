/**
 * http://usejsdoc.org/
 */

class Table {
	
	constructor(name, dom,append_to_id) {
		var apped_to = (append_to_id === undefined) ? "#space" : append_to_id;
		this.name = name;
		var self = this;
		self.ruleFunction = null;
		
		this.value = dom.evaluate( './/table[@name="' + name + '"]', dom, null, XPathResult.STRING_TYPE, null ).stringValue;

		var tableSceleton = '';
		$(apped_to).append('<p class="dynatable-wrapper dragable" id="wrapper-' + self.name + '"></p>');
		$('#wrapper-' + self.name).append('<table id="' + self.name + '" class="dynatable"></table>');

		
		
		var preconfiguredTable = dom.evaluate( './/table[@name="' + name + '"]', dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		for(var i = 0; i < preconfiguredTable.snapshotLength; i++) {
			  var node = preconfiguredTable.snapshotItem(i);
			
			  if(typeof node.innerHTML !== "undefined") {
				  $('#' + self.name).append(node.innerHTML);
			  }
			  
		}

		
		self.table = $('#' + self.name).DataTable();
		
	}
	
	checkData(rowid,data) {
		var result = null;
		if(typeof this.ruleFunction  !== undefined && this.ruleFunction  !== null) {
			try {
				result = this.ruleFunction(rowid,data);
			} catch (e) {
				logger.warn('Problem to evaluating Table rule: ' + func + ', ERROR:' + e.toString());
				console.log('Problem to evaluating Table rule: ' + func + ', ERROR:' + e.toString()) ;
			}
			if(result === undefined) {
				reult = null;
			}

		}
		if(result === null) {
			 $(this.table.row("tr[data-id='" + rowid + "']").node()).css('background-color','');
		} else {
			 $(this.table.row("tr[data-id='" + rowid + "']").node()).css('background-color',result);			
		}
	}
	

	
	update(data) {
		var self = this;
		if(typeof data.cmd === undefined || typeof data.rowID === undefined) {
			console.trace("invalid table data: " +  JSON.stringify(data, undefined, 2));
		}

		
		switch (data.cmd) {
		case "add":
			if(typeof data.cols  === undefined ) {
				console.trace("invalid table data: " +  JSON.stringify(data, undefined, 2));
			}
//			console.log("adding new table entry");
//			console.log(data.cols);
//			self.table.row.add(data.cols).node().dataid = data.rowid;
			$(self.table.row.add(data.cols).node()).attr('data-id',data.rowid);
			self.table.draw( false );
			self.checkData(data.rowid, data.cols);
			
			break;
		case "modify":
			if(typeof data.cols  === undefined ) {
				console.trace("invalid table data: " +  JSON.stringify(data, undefined, 2));
			}
//			console.log("mod table entry");
//			console.log(data.cols);
			
			self.table.row("tr[data-id='" + data.rowid + "']").data(data.cols).draw();		
			self.checkData(data.rowid, data.cols);
			break;
		case "del":
			self.table.row("tr[data-id='" + data.rowid + "']").remove().draw();
			break;
			
		default:
			console.trace("invalid command: " + data.cmd);
		}

		/*

		 */
		
		
	}
	
	setRule(func) {
		try {
			eval("this.ruleFunction = " + func);			
		} catch (e) {
			logger.warn('Problem to evaluating Table rule: ' + func + ', ERROR:' + e.toString());
			console.log('Problem to evaluating Table rule: ' + func + ', ERROR:' + e.toString()) ;
		}
	}
	
	
}



