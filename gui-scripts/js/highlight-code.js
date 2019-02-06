/**
 * http://usejsdoc.org/
 */

class HighlightCode {
	
	constructor(name, dom,append_to_id) {
		var apped_to = (append_to_id === undefined) ? "#space" : append_to_id;
		this.name = name;
		var self = this;
		this.caption = dom.evaluate( './/code[@name="' + name + '"]/@caption', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		var type = dom.evaluate( './/code[@name="' + name + '"]/@type', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		(undefined === type) ? this.type ="plaintext": this.type = type;
		this.value = dom.evaluate( './/code[@name="' + name + '"]', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		

		this.regex =  new RegExp(this.inputcheck);

		$(apped_to).append('<pre id="code_' + this.name  +'"><code class="' + this.type + '">'+ this.value + '</code></pre>');
		
		$('#code_' + this.name + ' code').each(function(i, block) {  hljs.highlightBlock(block); });

		
	}
	
	updateOutput(data) {
		$( "#" + this.name ).text(data);
	}
	
	
	
}


