
if (typeof xhr === 'undefined' || xhr === null) var xhr = new XMLHttpRequest();

async function selectracesdetails() {
	clearMessages();
	
	var url = "http://localhost/yachtracing/api/selectracesdetails.php";
	url += "?race=" + document.getElementById('races').value;
	
	if(xhr.readyState==0 || xhr.readyState==4){
		xhr.open('GET', url ,true);  // true is asynchronous
		xhr.onreadystatechange=selectracesdetailsresponse;
		xhr.send(null);
	}
}

function selectracesdetailsresponse() {
	
	if(xhr.readyState==4 && xhr.status==200){
		// translate from text to JSON
		var jsObj = JSON.parse(xhr.responseText);
		var races = jsObj.races;
		
		var racesRows = " ";

		// used postman to see what the results would look like
		
		// build table 
		raceTable = "<table> \
			<tr><th>Boat Name</th><th>Skipper</th><th>POB</th><th>Finish Time</th> \
			<th>Elapsed Time</th><th>Handicap</th><th>Corrected Time</th><th>Margin to Winner</th> \
			<th>Placing</th><th>New Handicap</th><th>Series Points</th></tr>";
		if (races !== undefined ) {
			races.forEach(function(item) {
				raceTable += "<tr><td>" + item["registeredname"] + "</td><td>"
							+ item["skipper"] + "</td><td>"
							+ item["POB"] + "</td><td>"
							+ item["finishedtime"] + "</td><td>" 
							+ (item["elapsedtime"] * 1.0).toFixed(3) + "</td><td>"
							+ item["handi"] + "</td><td>"
							+ (item["corrected"] *1.0).toFixed(3) + "</td><td>" 
							+ " " + "</td><td>" 
							+ item["place"] + "</td><td>" 
							+ " " + "</td><td>" 
							+ item["seriespoints"] + "</td><tr>";
			} );
		}
		
		raceTable += "</table>";
		document.getElementById('racesdetails').innerHTML = raceTable;
			
		
		if(typeof jsObj['success'] !== 'undefined' && jsObj['success'] !== null)
			successes.push(jsObj.success);
		if(typeof jsObj['failure'] !== 'undefined' && jsObj['failure'] !== null) 
				errors.push(jsObj['failure']);
		displayMessages();
	}
}