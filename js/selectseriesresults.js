function requestSeriesResults(seriessource, destination) {
	const series = document.getElementById(seriessource).value;
	const xhr = new XMLHttpRequest();
	// xhr.withCredentials = true;
	xhr.addEventListener("readystatechange", callback);
	xhr.open("GET", 
		"http://localhost/yachtracing/api/selectseriesresults.php" 
		+ "?series=" + series);
	xhr.send();	

	function callback() {
		if(this.readyState === 4) {
			var headings = [];
			if(this.status === 200 || this.status === 206 ) {
				const JSONresponse=xhr.responseText;
				console.log( JSONresponse );
				const jsObj = JSON.parse(JSONresponse);
				document.getElementById(destination).childNodes[0].replaceWith(  
					createSeriesResultsTable(jsObj) );
			}
		}
	}
}

function createSeriesResultsTable( aObj ) {
	const table = document.createElement("table");
	const header = document.createElement("tr");
	/* ran in browser's address bar 
	 *	http://localhost/yachtracing/api/selectseriesresults.php?series=2
	 * to find property names being sent back */
	const properties = ["skipper", "registeredname", "class", "totalplaces"];
	const headings	 = ["Skipper", "Boat",           "Class", "Points"     ];
	// Add headings to table
	for ( field = 0; field < properties.length; field++ ) {
		const th = document.createElement("th");
		th.appendChild(document.createTextNode(headings[field]));
		header.appendChild(th);
	}
	table.appendChild(header);
	
	// Add records (rows) to table
	for( record = 0; record < aObj.length; record++ ) {
		const tr = document.createElement("tr");
		// Add field values (column data) to table
		for ( field = 0; field < properties.length; field++ ) {
			const td = document.createElement("td");
			const data = aObj[record][properties[field]] || '';
			td.appendChild( document.createTextNode( data) ) ;
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	return table;
}
