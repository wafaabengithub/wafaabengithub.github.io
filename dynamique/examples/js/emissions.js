
$(document).ready(function() {
	var map;
	var baseLayer = new L.StamenTileLayer('toner', {
		detectRetina: true
	});

	var baseMaps = {
	    "Stamen Toner": baseLayer
	};
	

	map = L.map('map').setView([30.9284236281563, 7.065620631721979], 4);


	L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	}).addTo(map);


	var emissionTypes = ['low', 'average','high','very high'];
	var valueArray = [/*{"id":"HIC","value":"High income"},*/
	{"id":"high","value":"6 100 -< 16 100"},
	{"id":"average","value":" 2900 -< 6 100"},
	{"id":"low","value":"620 -< 2900"},
	
	{"id":"very high","value":"16 100 - 75 982"}
	
	
	
	
	
	/*{"id":"INX","value":"Not classified"},*/
	/*{"id":"LIC","value":"Low income"},*/
	/*{"id":"LMC","value":"Lower average income"},
	{"id":"LMY","value":"Low & average income"},*/
	
	/*{"id":"NOC","value":"High income: nonvery highD"},*/
	
	];
	var getMap = function (valueArray) {
	
		var map = {};
		for (var index = 0; index < valueArray.length; ++index) {
			var value = valueArray[index];

			map[value['id']] = value['value'];
		}
		return map;
	};

	var valueMap = getMap(valueArray);

	var emissionToText = function (value) {
		return valueMap[emissionTypes[value]];
	};

	var colorFunction1 = new L.HSLLuminosityFunction(new L.Point(0, 0.2), new L.Point(emissionTypes.length - 1, 0.75), {outputHue: 0, outputLuminosity: '100%'});
	var fillColorFunction1 = new L.HSLLuminosityFunction(new L.Point(0, 0.5), new L.Point(emissionTypes.length - 1, 1), {outputHue: 0, outputLuminosity: '100%'});

	var colorFunction1 = new L.HSLHueFunction(new L.Point(0, 240), new L.Point(emissionTypes.length - 1, 0), {outputSaturation: '100%', outputLuminosity: '25%'});
	var fillColorFunction1 = new L.HSLHueFunction(new L.Point(0, 240), new L.Point(emissionTypes.length - 1, 0), {outputSaturation: '100%', outputLuminosity: '50%'});

	var colorFunction1 = new L.HSLLuminosityFunction(new L.Point(0, 0.5), new L.Point(emissionTypes.length - 1, 0.1), {outputHue: 27, outputLuminosity: '100%'});
	var fillColorFunction1 = new L.HSLLuminosityFunction(new L.Point(0, 0.5), new L.Point(emissionTypes.length - 1, 0.2), {outputHue: 27, outputLuminosity: '100%'});

	var styles = new L.StylesBuilder(emissionTypes, {
		displayName: emissionToText,
		color: colorFunction1,
		fillColor: fillColorFunction1
	});

	var options = {
		recordsField: '1',
		locationMode: L.LocationModes.COUNTRY,
		codeField: 'id',
		displayOptions: {
			'emission.id': {
				displayName: 'Total agricultural greenhouse gas emissions(gigagrams CO2eq,2010)',
				styles: styles.getStyles()
			}
		},
		layerOptions: {
			fillOpacity: 0.7,
			opacity: 1,
			weight: 1
		},
		tooltipOptions: {
			iconSize: new L.Point(100,100),
			iconAnchor: new L.Point(-5,65)
		},

		onEachRecord: function (layer, record) {
			var $html = $(L.HTMLUtils.buildTable(record));

			layer.bindPopup($html.wrap('<div/>').parent().html(), {
				maxWidth: 400,
				minWidth: 400
			});
		}
	};

	var incomeLayer = new L.ChoroplethDataLayer(emissions, options);

	map.addLayer(incomeLayer);

	$('#legend').append(incomeLayer.getLegend({
		className: 'well'
	}));

	var colorFunction = new L.HSLHueFunction(new L.Point(0,90), new L.Point(3150,0), {outputSaturation: '100%', outputLuminosity: '30%'});
	var fillColorFunction = new L.HSLHueFunction(new L.Point(343,90), new L.Point(3150,0));

	options = {
		recordsField: null,
		locationMode: L.LocationModes.COUNTRY,
		codeField: 'CountryCode',
		displayOptions: {
			'2019': {
				displayName: 'Number of forest fires (2019)',
				color: colorFunction,
				fillColor: fillColorFunction
			}
		},
		layerOptions: {
			fillOpacity: 0.7,
			opacity: 1,
			weight: 1
		},
		tooltipOptions: {
			iconSize: new L.Point(100,65),
			iconAnchor: new L.Point(-5,65)
		},

		onEachRecord: function (layer, record) {
			var $html = $(L.HTMLUtils.buildTable(record));

			layer.bindPopup($html.wrap('<div/>').parent().html(), {
				maxWidth: 400,
				minWidth: 400
			});
		}
	};
	var telephoneLinesLayer = new L.ChoroplethDataLayer(telephoneLines, options);

	$('#legend').append(telephoneLinesLayer.getLegend({
		className: 'well'
	}));

	var categories = ['2015','2016','2017','2018','2019'];
	var fillColorFunctionBars = new L.HSLLuminosityFunction(new L.Point(0,0.5), new L.Point(categories.length - 1,1), {outputHue: 0, outputSaturation: '100%'});
	var styleFunction = new L.StylesBuilder(categories,{
		displayName: function (index) {
			return categories[index];
		},
		color: 'hsl(0,100%,20%)',
		fillColor: fillColorFunctionBars,
		minValue: 0,
		maxValue: 300//3150
	});

	options = {
		recordsField: null,
		locationMode: L.LocationModes.COUNTRY,
		codeField: 'CountryCode',
		chartOptions: styleFunction.getStyles(),
		layerOptions: {
			fillOpacity: 0.7,
			opacity: 1,
			weight: 1,
			width: 6
		},
		tooltipOptions: {
			iconSize: new L.Point(100,65),
			iconAnchor: new L.Point(-5,65)
		},

		onEachRecord: function (layer, record) {
			var $html = $(L.HTMLUtils.buildTable(record));

			layer.bindPopup($html.wrap('<div/>').parent().html(), {
				maxWidth: 400,
				minWidth: 400
			});
		}
	};

	var telephoneLinesBarChart = new L.BarChartDataLayer(telephoneLines, options);

	$('#legend').append(telephoneLinesBarChart.getLegend({
		className: 'well',
		title: 'Number of forest fires by year'
	}));

	var sfFillColorFunction = new L.HSLSaturationFunction(new L.Point(0,0.1), new L.Point(0,0.1), {outputHue: 220, outputLuminosity: '50%'});
	var radiusFunction = new L.LinearFunction(new L.Point(1.61,10), new L.Point(27.52,20));

	options = {
		recordsField: null,
		locationMode: L.LocationModes.COUNTRY,
		codeField: 'CountryCode',
		displayOptions: {
			'Vulnerability to drought (%)': {
				displayName: 'Vulnerability to drought (%)',
				fillColor: sfFillColorFunction,
				radius: radiusFunction
			}
		},
		layerOptions: {
			fillOpacity: 0.7,
			opacity: 1,
			weight: 1,
			color: 'hsl(220,100%,25%)',
			numberOfSides: 40,
			dropShadow: true,
			gradient: true
		},
		tooltipOptions: {
			iconSize: new L.Point(100,65),
			iconAnchor: new L.Point(-5,65)
		},

		onEachRecord: function (layer, record) {
			var $html = $(L.HTMLUtils.buildTable(record));

			layer.bindPopup($html.wrap('<div/>').parent().html(), {
				maxWidth: 400,
				minWidth: 400
			});
		}
	};
	var solidFuelLayer = new L.DataLayer(solidFuels, options);

	$('#legend').append(solidFuelLayer.getLegend({
		className: 'well'
	}));

	var overlays = {
		"Total agricultural greenhouse gas emissions": incomeLayer,
		"Number of forest fires (2019)": telephoneLinesLayer,
		"Number of forest fires by Year": telephoneLinesBarChart,
		"Vulnerability to drought (%)": solidFuelLayer
	};

	L.control.layers(baseMaps, overlays).addTo(map);
});
