/**
 * http://usejsdoc.org/
 */

class Button {
	
	constructor(name, dom,append_to_id) {
		var apped_to = (append_to_id === undefined) ? "#space" : append_to_id;
		this.name = name;
		var self = this;
		this.value = dom.evaluate( './/button[@name="' + name + '"]', dom, null, XPathResult.STRING_TYPE, null ).stringValue;

		$(apped_to).append('<div class="dragable button-wrap"><button id="button_' + name +'">' + self.value + '</button></div>')
		
		$( '#button_' + name ).button();
		
		$( '#button_' + name ).click( function( event ) {
			console.log("click");
			socket_log.send(JSON.stringify({type: 'BUTTON-CLICK', input: name, valid:true}));
		} );
	}
	
	updateOutput(data) {
		$( "#" + this.name ).text(data);
	}
	
	
	
}


