/**
 * http://usejsdoc.org/
 */


class Indicator {

	constructor(dom) {
		var table = dom.evaluate( '//atrun/client/indicator/table', dom, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;

//		console.log( table.innerHTML);
		$("#space").append('<div  class="dragable"><table id="indicator"><tr><th colspan="2000">System states</th></tr> ' + table.innerHTML + "</table></div>");
		
	}

	static get INDICATOR_NOT_INITIALIZED() { return 0; }
	static get INDICATOR_UNKNOWN() { return 1; }
	static get INDICATOR_OK() { return 2; }
	static get INDICATOR_FAILED() { return 3; }

	updateIndicator(name, state) {
	//	console.log("indicator: " + name + ", state: " + state);


		switch (state) {
		case Indicator.INDICATOR_UNKNOWN:

			if(! $("#indicator").find('td[name="' + name + '"]').hasClass("indicator-INDICATOR_UNKNOWN")) {
				$("#indicator").find('td[name="' + name + '"]').removeClass (function (index, className) {
					return (className.match (/(^|\s)indicator-\S+/g) || []).join(' ');
				});
				$("#indicator").find('td[name="' + name + '"]').addClass("indicator-INDICATOR_UNKNOWN");					
			}

			break;
		case Indicator.INDICATOR_OK:

			if(! $("#indicator").find('td[name="' + name + '"]').hasClass("indicator-INDICATOR_OK")) {
				$("#indicator").find('td[name="' + name + '"]').removeClass (function (index, className) {
					return (className.match (/(^|\s)indicator-\S+/g) || []).join(' ');
				});
				$("#indicator").find('td[name="' + name + '"]').addClass("indicator-INDICATOR_OK");					
			}
			
			break;
		case Indicator.INDICATOR_FAILED:
			if(! $("#indicator").find('td[name="' + name + '"]').hasClass("indicator-INDICATOR_FAILED")) {
				$("#indicator").find('td[name="' + name + '"]').removeClass (function (index, className) {
					return (className.match (/(^|\s)indicator-\S+/g) || []).join(' ');
				});
				$("#indicator").find('td[name="' + name + '"]').addClass("indicator-INDICATOR_FAILED");					
			}
			break;
		default:
			if(! $("#indicator").find('td[name="' + name + '"]').hasClass("indicator-NOT_INITIALIZED")) {
				$("#indicator").find('td[name="' + name + '"]').removeClass (function (index, className) {
					return (className.match (/(^|\s)indicator-\S+/g) || []).join(' ');
				});
				$("#indicator").find('td[name="' + name + '"]').addClass("indicator-NOT_INITIALIZED");					
			}
		}

	}


}

