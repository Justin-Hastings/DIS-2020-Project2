function requestRaceDetail(destination) {
	const sourceNode = event.target;
	const destNode = document.getElementById(destination);
	
	if ( cascadeDisplay( sourceNode, destNode ) == true ) {
		const race = sourceNode.value;
		const xhr = new XMLHttpRequest();
		xhr.addEventListener("readystatechange", callback);
		xhr.open("GET", "http://localhost/yachtracing/api/selectracesdetails.php" + "?race=" + race);
		xhr.send();	

		function callback() {
			if(this.readyState === 4 && this.status == 200) {
				const JSONresponse=xhr.responseText;
				// console.log( JSONresponse );
				const jsObj = JSON.parse(JSONresponse);
				destNode.innerHTML = createRaceDetailTable(jsObj);
			} else if ( this.status === 204 ) {
				destNode.style.visibility = 'hidden';
			}
		}
	}
}

function createRaceDetailTable(races) {
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
	return raceTable;
}