/* 
	Praamenters:
		clubsources		id of HTML element that contains the current club
		destination		id of HTML element that will receive the output
		type			set to table or select to set the format of the output
*/

function requestSeries(destination, type) {
	const sourceNode = event.target;
	const destNode = document.getElementById(destination);
	
	if ( cascadeDisplay( sourceNode, destNode ) == true ) {
	
		const club = sourceNode.value;
		const xhr = new XMLHttpRequest();
		// xhr.withCredentials = true;
		xhr.addEventListener("readystatechange", callback);
		xhr.open("GET", "http://localhost/yachtracing/api/selectseries.php" 
			+ "?club=" + club);
		xhr.send();	

		function callback() {
			if ( this.status === 200 && this.readyState === 4 ) {
				const JSONresponse=xhr.responseText;
				// console.log( JSONresponse );
				const jsObj = JSON.parse(JSONresponse);
				
				switch(type) {
					case "table": 
						destNode.innerHTML = createSeriesTable(jsObj).outerHTML; 
						break;
					case "select": 
						createSeriesOptions(jsObj, destNode ); 
						break;
					default: 
						destNode.innerHTML = JSONresponse;
						break;
				}
			} else if ( this.status === 204 ) {
			}
		}
	
	}
}

/* modified version of 
https://stackoverflow.com/questions/17684201/create-html-table-from-javascript-object/17684427
*/
function createSeriesTable( aObj ) {
	const table = document.createElement("table");
	const properties = Object.keys(aObj[0]);
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

function createSeriesOptions( aObj, destNode ) {
	// assumes fields are seriesid, year, season
	const properties = Object.keys(aObj[0]);
	
	// clear all options from destNode
	/* several ways to do this 
	 *	https://www.somacon.com/p542.php has four methods
	 *	could also step through each option and remove it */
	const selectParent = destNode.parentNode;
	const newNode = destNode.cloneNode(false); // shallow copy
	selectParent.replaceChild( newNode, destNode);
	
	// add prompt at top of list
	const option = document.createElement("option");
	option.value = 0;  // there is no db ID of 0 so this is safe
	option.text = "-- please select a series --";
	newNode.appendChild(option);
	
	// for each record add item to option list
	for( record = 0; record < aObj.length; record++ ) {
		const option = document.createElement("option");
		option.value = aObj[record]["seriesid"];
		option.text = aObj[record]["year"] + " " + aObj[record]["season"];
		newNode.appendChild(option);
	}
}

