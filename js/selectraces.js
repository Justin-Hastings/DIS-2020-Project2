function requestRaces(destination, type) {
	const sourceNode = event.target;
	const destNode = document.getElementById(destination);
	
	if ( cascadeDisplay( sourceNode, destNode ) == true ) {
		const series = sourceNode.value;
		const xhr = new XMLHttpRequest();
		// xhr.withCredentials = true;
		xhr.addEventListener("readystatechange", callback);
		xhr.open("GET", "http://localhost/yachtracing/api/selectraces.php" + "?series=" + series);
		xhr.send();	

		function callback() {
			if(this.status === 200 && this.readyState === 4) {
				const JSONresponse=xhr.responseText;
				// console.log( JSONresponse );
				const jsObj = JSON.parse(JSONresponse);
				
				switch(type) {
					case "table": 
						// destNode.childNodes[0].replaceWith(createRacesTable(jsObj)); 
						destNode.innerHTML = createRacesTable(jsObj).outerHTML;
						break;
					case "select": 
						createRacesOptions(jsObj, destNode ); 
						break;
					default: 
						document.getElementById(destination).innerHTML = JSONresponse; 
						break;
				}
			} else if ( this.status === 204 ) {
			}
		}
	}
}

/* From browser address line tested with:
 *	http://localhost/yachtracing/api/selectraces.php?series=2
 * Returned:
 *	[{"raceid":5,"race":3,"date":"2020-03-18","time":"14:02:00","seriesid":2},
 *	 {"raceid":4,"race":2,"date":"2020-03-11","time":"14:00:00","seriesid":2},
 *	 {"raceid":3,"race":1,"date":"2020-03-04","time":"14:00:00","seriesid":2}] */

// modified version of https://stackoverflow.com/questions/17684201/create-html-table-from-javascript-object/17684427
function createRacesTable( aObj ) {
	const table = document.createElement("table");
	const properties = ["race","date","time"];
	const header = document.createElement("tr");
	
	// Add headings to table
	for ( field = 0; field < properties.length; field++ ) {
		const th = document.createElement("th");
		th.appendChild(document.createTextNode(properties[field]));
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

function createRacesOptions( aObj, selectNode ) {
	// assumes fields are seriesid, year, season
	const uniqueID = "raceid";
	const properties = ["race","date","time"];;
	
	// clear all options from selectNode
	/* several ways to do this 
	 *	https://www.somacon.com/p542.php has four methods
	 *	could also step through each option and remove it */
	const selectParent = selectNode.parentNode;
	const newNode = selectNode.cloneNode(false); // shallow copy
	selectParent.replaceChild( newNode, selectNode);

	// add prompt at top of list
	const option = document.createElement("option");
	option.value = 0;  // there is no db ID of 0 so this is safe
	option.text = "-- please select a race --";
	newNode.appendChild(option);
	
	for( record = 0; record < aObj.length; record++ ) {
		const option = document.createElement("option");
		option.value = aObj[record]["raceid"];
		option.text = aObj[record]["race"] + " " + aObj[record]["date"];
		newNode.appendChild(option);
	}
}

