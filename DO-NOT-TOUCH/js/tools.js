var X = XLSX;
var dateTime = new Date();
var today = String(dateTime.getFullYear()) + "-" + String(dateTime.getMonth()+1) + "-" + String(dateTime.getDate());
var ArrayWaves;
var PickWaves;
var ArrayComp;

var manifest = (function() {
	return function manifest(wb) {
		var routesArray = [];
		var output = to_json(wb);
        var j = JSON.parse(output);
        var keys = Object.keys(j);
		for(var i = 0; i < Object.keys(j).length; i++) {
        	var lol = keys[i];
        	var route = lol.slice(15);
        	var obj = j[lol];
			var dsp = obj[0]["E"].slice(-9);
			var time = parseFloat(obj[3]["C"]);
			var zip = parseFloat(obj[3]["G"]);
			var routeValue = {route, dsp, time, zip};
			routesArray[i] = routeValue;
       	};

		routesArray = routesArray.sort(compare);

		function compare(a, b) {
  			const genreA = a.time;
  			const genreB = b.time;
  
  			let comparison = 0;
 			if (genreA < genreB) {
				comparison = 1;
			} else if (genreA > genreB) {
				comparison = -1;
			}
			return comparison;
		};
		ArrayWaves = routesArray;
		console.log(routesArray);
	};
})();

var picklist = (function() {
	return function picklist(wb) {
		var pickArray = [];
		var output = to_json(wb);
		var h = JSON.parse(output);
		var sheets = Object.keys(h);
		var pickList = h[sheets];
		var routeZone = [];
		var pCount = [];
		var tpCount = [];
		var tempPick;
		for(var i = 1; i < pickList.length; i++) {
			var route = pickList[i]["A"];
			if (tempPick!==route) {
				pCount = []; routeZone = []; tpCount = [];
				tempPick = route;
			};
			routeZone.push(pickList[i]["B"]);
			pCount.push(pickList[i]["C"]);
			tpCount.push(pickList[i]["D"]);
			var routeValue = {route, routeZone, pCount, tpCount};
			pickArray[route] = routeValue;
		};
		PickWaves = pickArray;
		console.log(pickArray);
	};
})();

var comp = (function() {
	return function picklist(wb) {
		var compArray = [];
		var output = to_json(wb);
		var h = JSON.parse(output);
		var sheets = Object.keys(h);
		var compList = h[sheets];
		for(var i = 1; i < compList.length; i++) {
			if (tempStation!==station) {
				pCount = []; routeZone = []; tpCount = [];
				tempStaion = Station;
            };
            var trackingID = compList[i]["C"];
            var stopComp = compList[i]["BA"];
            var routesComp = compList[i]["P"];
            var cityComp = compList[i]["K"];
            var addressComp = compList[i]["M"];
            var capComp = compList[i]["W"];
            var buyerComp = compList[i]["AB"];
            var bagComp = compList[i]["BB"];
            var weightComp = parseFloat(compList[i]["AA"]);
            var daComp = compList[i]["AJ"];
            var dspComp = daComp.slit(" / ");
            var compValue = {dspComp};
			compArray[route] = routeValue;
		};
		ArrayComp = compArray;
		console.log(compArray);
	};
})();

var to_json = function to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function(sheetName) {
		var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName],{header:"A"});
		if(roa.length) result[sheetName] = roa;
	});
	return JSON.stringify(result, 2, 2);
};

var printWave = function(wave, pick) {
	var target;
	for(var i = 1; i < Object.keys(wave).length; i++) {
		if (i < 60) target = "#w1";
		if (i == 60 && i < 120) target = "#w2";
		if (i > 120) target = "#w3";
		var waveobj = wave[i].route;
		var A = 'A'+i; var B = 'B'+i; var C = 'C'+i; var D = 'D'+i; var E = 'E'+i; var F = 'F'+i;
		$(target).append("<div class='row' style='page-break-before: always; margin: 0px'><div class='col s4' id = '" + A + "'></div><div class='col s8 qr' id = '" + B + "'></div><div class='col s4' id = '" + C + "'></div></div>");
		$("<h1 style='font-size: 80px; border: solid; padding-top: 20px; padding-bottom: 20px; text-align: center'>").html(waveobj).appendTo("#"+ A);
		var qrcode = new QRCode(B, {width: 90, height: 90});
		makeQR(qrcode, waveobj);
		$("<p style='font-size: 30px'>").html(today).appendTo("#"+ A);
		$("<p style='font-size: 30px'>").html("Login").appendTo("#"+ A);
		$("<p style='font-size: 30px'>").html("_____________________").appendTo("#"+ A);
		$("<p style='font-size: 30px'>").html("_____________________").appendTo("#"+ A);
		for(var j = 0; j < pick[waveobj].pCount.length; j++) {
			if (pick[waveobj].pCount[j]===pick[waveobj].tpCount[j]) {
				$("<p style='text-align: right; font-size: 25px; margin: 0px'>"+ pick[waveobj].routeZone[j] + " - "  + pick[waveobj].pCount[j]+"</p>").appendTo("#"+ B);
			} else {
				$("<p style='text-align: right; text-decoration: underline; font-weight: bold; font-size: 25px; margin: 0px'>"+ pick[waveobj].routeZone[j] + " - " + pick[waveobj].pCount[j] + "/" + pick[waveobj].tpCount[j]+ "</p>").appendTo("#"+ B);
			};
		};
		$("<h1 style='font-size: 80px; border: solid;  padding-top: 20px; padding-bottom: 20px; text-align: center'>").html(waveobj).appendTo("#"+ A);
		$("<span style='font-size: 30px'>").html(today).appendTo("#"+ A);
		$("<p style='font-size: 30px'>").html("Login").appendTo("#"+ A);
		$("<p style='font-size: 30px'>").html("_____________________").appendTo("#"+ A);
		$("<p style='font-size: 30px'>").html("_____________________").appendTo("#"+ A);
    };
};

var generate = function() {
	printWave(ArrayWaves, PickWaves);
};

var makeQR = (function (){
	return function makeQR(qr, val) {
		qr.makeCode(val);
	};
})();

var do_file = (function() {
	var rABS = typeof FileReader !== "undefined" && (FileReader.prototype||{}).readAsBinaryString;
	var domrabs = document.getElementsByName("userabs")[0];
	if(!rABS) domrabs.disabled = !(domrabs.checked = false);
		return function do_file(files, elenco) {
			rABS = domrabs.checked;
			var f = files[0];
			var reader = new FileReader();
			reader.onload = function(e) {
				var data = e.target.result;
				if(!rABS) data = new Uint8Array(data);
                    if(elenco == 'manifest') manifest(X.read(data, {type: rABS ? 'binary' : 'array'}));
                    else if(elenco == 'picklist') picklist(X.read(data, {type: rABS ? 'binary' : 'array'}));
					else process_wb_2(X.read(data, {type: rABS ? 'binary' : 'array'}));
				};
				if(rABS) reader.readAsBinaryString(f);
				else reader.readAsArrayBuffer(f);
	};
})();

(function() {
	var xlf = document.getElementById('xlf');
	if(!xlf.addEventListener) return;
	function handleFile(e) { do_file(e.target.files, 'manifest'); }
	xlf.addEventListener('change', handleFile, false);
	var xlf2 = document.getElementById('xlf2');
	if(!xlf2.addEventListener) return;
	function handleFile2(e) { do_file(e.target.files, 'picklist'); }
    xlf2.addEventListener('change', handleFile2, false);
    /*
	var xlf3 = document.getElementById('xlf3');
	if(!xlf3.addEventListener) return;
	function handleFile2(e) { do_file(e.target.files, false); }
    xlf3.addEventListener('change', handleFile3, false);
    */
})();