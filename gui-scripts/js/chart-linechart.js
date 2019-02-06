/**
 * http://usejsdoc.org/
 */

class LineChart {
	
	constructor(name, dom, append_to_id) {

		var apped_to = (append_to_id === undefined) ? "#space" : append_to_id;
		
		
//		this.config = dom.evaluate( './/graph[@name="' + name + '"]', dom, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
		console.log( this.config);
		this.name = name;
		var self = this;
		this.title = dom.evaluate( './/graph[@name="' + name + '"]/title', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		this.type = dom.evaluate( './/graph[@name="' + name + '"]/@type', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
	//	this.delay = dom.evaluate( './/graph[@name="' + name + '"]/@delay', dom, null, XPathResult.NUMBER_TYPE, null ).numberValue;
		this.refresh = dom.evaluate( './/graph[@name="' + name + '"]/@refresh', dom, null, XPathResult.NUMBER_TYPE, null ).numberValue;
	//	this.duration = dom.evaluate( './/graph[@name="' + name + '"]/@duration', dom, null, XPathResult.NUMBER_TYPE, null ).numberValue;
		
		this.scales = {xaxes: {}, yaxes: {}};
		this.scales.xaxes.display = dom.evaluate( './/graph[@name="' + name + '"]/scales/xaxes/@display', dom, null, XPathResult.BOOLEAN_TYPE, null ).booleanValue;
		this.scales.xaxes.tooltipFormat = dom.evaluate( './/graph[@name="' + name + '"]/scales/xaxes/@tooltipFormat', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		this.scales.xaxes.label = dom.evaluate( './/graph[@name="' + name + '"]/scales/xaxes/label', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		this.scales.xaxes.labeldisplay = dom.evaluate( './/graph[@name="' + name + '"]/scales/xaxes/label/@display', dom, null, XPathResult.BOOLEAN_TYPE, null ).booleanValue;
		this.scales.yaxes.display = dom.evaluate( './/graph[@name="' + name + '"]/scales/yaxes/@display', dom, null, XPathResult.BOOLEAN_TYPE, null ).booleanValue;
		this.scales.yaxes.label = dom.evaluate( './/graph[@name="' + name + '"]/scales/yaxes/label', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
		this.scales.yaxes.labeldisplay = dom.evaluate( './/graph[@name="' + name + '"]/scales/yaxes/label/@display', dom, null, XPathResult.BOOLEAN_TYPE, null ).booleanValue;
		this.scales.yaxes.suggestedMin = dom.evaluate( './/graph[@name="' + name + '"]/scales/yaxes/@suggestedMin', dom, null, XPathResult.NUMBER_TYPE, null ).numberValue;
		this.scales.yaxes.suggestedMax = dom.evaluate( './/graph[@name="' + name + '"]/scales/yaxes/@suggestedMax', dom, null, XPathResult.NUMBER_TYPE, null ).numberValue;

		this.datasets = [];
		this.dataQueues = {};
		
		let result = dom.evaluate('.//graph[@name="' + name + '"]/data/set/@name', dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		
		for (let i=0, length=result.snapshotLength; i<length; ++i) {
			let borderColorOfSet = dom.evaluate( './/graph[@name="' + name + '"]/data/set[@name="' + result.snapshotItem(i).value + '"]/@borderColor', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
			let backgroundColorOfSet = dom.evaluate( './/graph[@name="' + name + '"]/data/set[@name="' + result.snapshotItem(i).value + '"]/@backgroundColor', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
			let backgroundColorFillOfSet = dom.evaluate( './/graph[@name="' + name + '"]/data/set[@name="' + result.snapshotItem(i).value + '"]/@backgroundColorFill', dom, null, XPathResult.BOOLEAN_TYPE, null ).booleanValue;
			let lineTensionOfSet = dom.evaluate( './/graph[@name="' + name + '"]/data/set[@name="' + result.snapshotItem(i).value + '"]/@lineTension', dom, null, XPathResult.NUMBER_TYPE, null ).numberValue;
			let pointRadiusOfSet = dom.evaluate( './/graph[@name="' + name + '"]/data/set[@name="' + result.snapshotItem(i).value + '"]/@pointRadius', dom, null, XPathResult.NUMBER_TYPE, null ).numberValue;
			let pointHoverRadiusOfSet = dom.evaluate( './/graph[@name="' + name + '"]/data/set[@name="' + result.snapshotItem(i).value + '"]/@pointHoverRadius', dom, null, XPathResult.NUMBER_TYPE, null ).numberValue;

		
			let labelOfSet = dom.evaluate( './/graph[@name="' + name + '"]/data/set[@name="' + result.snapshotItem(i).value + '"]/label', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
			
		//	 this.datasets[result.snapshotItem(i).value] = {borderColor: borderColorOfSet, backgroundColor : backgroundColorOfSet, lineTension: lineTensionOfSet, label: labelOfSet };
			let setdata = { 
					name					: result.snapshotItem(i).value,
					label				: labelOfSet,
					borderColor			: borderColorOfSet,
					backgroundColor 		: backgroundColorOfSet,
					lineTension			: lineTensionOfSet,
					lineTension			: lineTensionOfSet,
					fill					: backgroundColorFillOfSet,
					pointRadius			: pointRadiusOfSet,
					pointHoverRadius 	: pointHoverRadiusOfSet,
					borderWidth			: 1 
			};

			this.datasets.push(setdata);
			this.dataQueues[result.snapshotItem(i).value] = new Array();
				
		    console.log("graph name: " + name +  ", setname: " + result.snapshotItem(i).value + ", borderColorOfSet:" + borderColorOfSet + ", backgroundColorOfSet:" + backgroundColorOfSet + ", lineTensionOfSet:" + lineTensionOfSet + ", labelOfSet:" + labelOfSet);
			
//		    this.datasets[result.snapshotItem(i).value] = new LineChart(result.snapshotItem(i).value, this.configData);
		}
		

		$(apped_to).append('<div class="chart-wrapper dragable" id="chart-wrapper-' + name + '"><canvas id="' + name + '" ></canvas></div>');
		
	
	
	


		
		let visualizationChartElement = document.getElementById(name).getContext('2d');
		this.visualizationChart = new Chart(visualizationChartElement, {
			type: 'line',
			responsive: false,
			maintainAspectRatio: false,
			data: {
				labels: [ 				], 
				datasets: self.datasets,
				
			}, 
			options: {
				title: {
					text: self.title
				},
				scales: {
					xAxes: [{
						display: self.scales.xaxes.display,
						type: 'time',
						time: {

							tooltipFormat: self.scales.xaxes.tooltipFormat
						},
						scaleLabel: {
							display: self.scales.xaxes.labeldisplay,
							labelString: self.scales.xaxes.label
						}
					}],
					yAxes: [{
						display: self.scales.yaxes.display,
						scaleLabel: {
							display: self.scales.yaxes.labeldisplay,
							labelString: self.scales.yaxes.label
						},
						ticks: {
							suggestedMin: self.scales.yaxes.suggestedMin,
							suggestedMax: self.scales.yaxes.suggestedMax,
						}
					}]
				},
			}
		});
		
		this.updateGraph();
	
		
	}
	
	updateGraph() {
		var self = this;
		
		setTimeout(function() {
			self.visualizationChart.update();
			self.updateGraph();
		}, this.refresh);

	}
	
	
	pushData(time, set,value) {
		var now = moment(time).toDate();
		this.visualizationChart.data.datasets.forEach(function(dataset) {
			if(dataset.name === set) {
				dataset.data.push({
					x: now, // time 
					y: value
				}); 	
			}	
		});
	}
}


/*

<graph type="line" name="test-graph" delay="2000" duration="600000" refresh="2000">
<title>Test graph</title>

<data>
	<set name="test-a" borderColor="rgba(255, 0, 0, 1)" backgroundColor="rgba(180, 0, 180, 0)" lineTension="0">
		<label>Test a Data</label>
	</set>
</data>
<scales>
	<xaxes timeunit="second" unitStepsize="10" />
	<yaxes beginAtZero="true" min="0" />
</scales>
</graph>
*/