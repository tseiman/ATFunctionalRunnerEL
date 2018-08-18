/**
 * http://usejsdoc.org/
 */

class Input {
	
	constructor(name, dom) {

		this.name = name;
		var self = this;
		this.caption = dom.evaluate( '//atrun/client/io/input[@name="' + name + '"]/@caption', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		this.type = dom.evaluate( '//atrun/client/io/input[@name="' + name + '"]/@type', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		this.inputcheck = dom.evaluate( '//atrun/client/io/input[@name="' + name + '"]/@inputcheck', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		this.value = dom.evaluate( '//atrun/client/io/input[@name="' + name + '"]', dom, null, XPathResult.STRING_TYPE, null ).stringValue;

		this.regex =  new RegExp(this.inputcheck);

		$("#space").append('<div class="dragable input-wrap">' + self.caption + '<input id="' + name + '" class="ui-widget ui-corner-all"><span id="' + name + '-warning" class="ui-icon ui-icon-alert" style="visibility: hidden;"></span></input></div>');

		$( "#" + name ).val(this.value);
		
		$( "#" + name ).on('input', function() {
			let valid = false;
			if($( "#" + name ).val().match(self.regex)) {
				$( "#" + name ).removeClass('ui-state-error');
				$( "#" + name + "-warning" ).css('visibility','hidden');
				valid = true;
			} else {
				$( "#" + name ).addClass('ui-state-error');
				$( "#" + name + "-warning" ).css('visibility','visible');
			}
			socket_log.send(JSON.stringify({type: 'INPUT-UPDATE', input: name, valid: valid, value: $( "#" + name ).val()}));
		});
		
	}
	

}


