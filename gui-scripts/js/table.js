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
		this.value = dom.evaluate( './/table[@name="' + name + '"]', dom, null, XPathResult.STRING_TYPE, null ).stringValue;

		$(apped_to).append('<p><b>Name:' + self.name + '</p><p>'+ self.value + '</p></b>')

		
		
		
/*		
		$(apped_to).append('<div class="dragable button-wrap"><button id="button_' + name +'">' + self.value + '</button></div>')
		
		$( '#button_' + name ).button();
		
		$( '#button_' + name ).click( function( event ) {
			
			socket_log.send(JSON.stringify({type: 'BUTTON-CLICK', input: name, valid:true}));
		} );
		
		*/
	}
	
	updateOutput(data) {
//		$( "#" + this.name ).text(data);
	}
	
	
	
}


