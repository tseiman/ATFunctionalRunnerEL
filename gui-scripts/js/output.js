/**
 * http://usejsdoc.org/
 */

class Output {
	
	constructor(name, dom,append_to_id) {
		var apped_to = (append_to_id === undefined) ? "#space" : append_to_id;
		this.name = name;
		var self = this;
		this.caption = dom.evaluate( './/output[@name="' + name + '"]/@caption', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		this.value = dom.evaluate( './/output[@name="' + name + '"]', dom, null, XPathResult.STRING_TYPE, null ).stringValue;

		this.regex =  new RegExp(this.inputcheck);

		$(apped_to).append('<div class="dragable output-wrap">' + self.caption + ': <span id="' + name + '">' + this.value + '</span></div>');

		
	}
	
	updateOutput(data) {
		$( "#" + this.name ).text(data);
	}
	
	
	
}


