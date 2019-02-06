/**
 * http://usejsdoc.org/
 */

class Input {
	

	constructor(name, dom, append_to_id) {
		this.valid = false;
		var append_to = (append_to_id === undefined) ? "#space" : append_to_id;
	//	console.log("input append to:" + append_to);
		this.name = name;
		var self = this;
		this.caption = dom.evaluate( './/input[@name="' + name + '"]/@caption', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		this.type = dom.evaluate( './/input[@name="' + name + '"]/@type', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		this.inputcheck = dom.evaluate( './/input[@name="' + name + '"]/@inputcheck', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		this.value = dom.evaluate( './/input[@name="' + name + '"]', dom, null, XPathResult.STRING_TYPE, null ).stringValue;

		this.regex =  new RegExp(this.inputcheck);

		var passwordType = "";
		if(this.type !== undefined) {
			passwordType = (this.type === "password") ? 'type="password">&nbsp;<span class="ui-icon ui-icon-eye appindicators" id="pw_hidden_' + name +'"></span' : '';
		} 
		$(append_to).append('<div class="item-content dragable input-wrap">' + self.caption + '<input id="' + name + '" class="ui-widget ui-corner-all" ' + passwordType +'><span id="' + name + '-warning" class="ui-icon ui-icon-alert" style="visibility: hidden;"></span></input></div>');

		$( '#pw_hidden_' + name).mousedown(function() {
			$('#' + name).attr('type', 'text'); 
		});		
		$( '#pw_hidden_' + name).mouseup(function() {
			$('#' + name).attr('type', 'password'); 
		});		
		$( '#pw_hidden_' + name).mouseleave(function() {
			$('#' + name).attr('type', 'password'); 
		});		
		

		$( "#" + name ).val(this.value);
		
		$( "#" + name ).on('input', function() {
			this.valid = false;
			if($( "#" + name ).val().match(self.regex)) {
				$( "#" + name ).removeClass('ui-state-error');
				$( "#" + name + "-warning" ).css('visibility','hidden');
				this.valid = true;
			} else {
				$( "#" + name ).addClass('ui-state-error');
				$( "#" + name + "-warning" ).css('visibility','visible');
			}
			socket_log.send(JSON.stringify({type: 'INPUT-UPDATE', input: name, valid: this.valid, value: $( "#" + name ).val()}));
		});
		
		
	}

	getInput() {
		this.valid = false;
		var self = this;
		if($( "#" + this.name ).val().match(self.regex)) {
			$( "#" + this.name ).removeClass('ui-state-error');
			$( "#" + this.name + "-warning" ).css('visibility','hidden');
			this.valid = true;
		} else {
			$( "#" + this.name ).addClass('ui-state-error');
			$( "#" + this.name + "-warning" ).css('visibility','visible');
		}
		socket_log.send(JSON.stringify({type: 'INPUT-UPDATE', input: this.name, valid: this.valid, value: $( "#" + this.name ).val()}));		
	}



	

}


