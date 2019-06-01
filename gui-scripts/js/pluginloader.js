/**
 * http://usejsdoc.org/
 */


class Pluginloader {
	
	constructor(config, plugininfo) {
		console.log("Pluginloader init");
	//	this.config = config;
	//	this.plugininfo = plugininfo;
		this.pluginconfig = null;
		
	}
	
	
	loadPluginItem(data) {
		var self = this;
		this.pluginconfig = data;
		console.log(JSON.stringify(this.pluginconfig.mainfile));

		
		$.ajax({
			  url: "../ATplugins/" + this.pluginconfig.name + "/" + this.pluginconfig.mainfile ,
			  dataType: "script",
			  async: false,
			  success: function (script, textStatus) {
				  console.log( textStatus );
			  },
			  fail: function( jqxhr, settings, exception ) {
				  console.log( "Error in loading plugin:"  + exception );
				  logger.warn("Error in loading plugin:"  + exception );
			  }
			});
		
		
		config.addPluginTagLookup(data.tagname, this);
		
	}
	
}