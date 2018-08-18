/**
 * http://usejsdoc.org/
 */

class Output {
	
	constructor(name, dom) {

		this.name = name;
		var self = this;
		this.caption = dom.evaluate( '//atrun/client/io/output[@name="' + name + '"]/@caption', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		this.value = dom.evaluate( '//atrun/client/io/output[@name="' + name + '"]', dom, null, XPathResult.STRING_TYPE, null ).stringValue;

		this.regex =  new RegExp(this.inputcheck);

		$("#space").append('<div class="dragable output-wrap">' + self.caption + ': <span id="' + name + '">' + this.value + '</span></div>');

		
	}
	
	updateOutput(data) {
		$( "#" + this.name ).text(data);
	}
	
	
	
}


