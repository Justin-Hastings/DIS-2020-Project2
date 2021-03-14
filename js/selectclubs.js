function requestClubs(destination, type) {
	const sourceNode = event.target;
	const destNode = document.getElementById(destination);
	const url = "http://localhost/yachtracing/api/selectclubs.php";

	const xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", callback);
	xhr.open("GET", url);
	xhr.send();	

	function callback() {
		if(this.readyState === 4) {
			const JSONresponse=xhr.responseText;
			// console.log( JSONresponse );
			const jsObj = JSON.parse(JSONresponse);
			
			switch(type) {
				case "table": 
					destNode.innerHTML = createClubTable(jsObj).outerHTML; 
					break;
				case "select": 
					createClubOptions(jsObj, destNode ); 
					break;
				default: 
					destNode.innerHTML = JSONresponse; 
					break;
			}
		}
	}
}

// modified version of https://stackoverflow.com/questions/17684201/create-html-table-from-javascript-object/17684427
function createClubTable( aObj ) {
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

function createClubOptions( aObj, destNode ) {
	/* aObj is a JS object that was converted from JSON string the object 
			contains an array of zero or more items where each item contains a
			record from a database.  The record may have one or many fields but
			the first field is expected to be the club.
	   destNode	is the select HTML element that will contain the options.	*/
	   
	// assumes the first field is unique and meaningful to the user
	const properties = Object.keys(aObj[0]);
	
	// add prompt at top of list
	const option = document.createElement("option");
	option.value = 0;  // there is no db ID of 0 so this is safe
	option.text = "-- please select a club --";
	destNode.appendChild(option);
	
	// Add each option to destNode
	for( record = 0; record < aObj.length; record++ ) {
		const option = document.createElement("option");
		option.value = aObj[record][properties[0]];
		option.text = option.value;
		destNode.appendChild(option);
	}
	
	/* https://stackoverflow.com/questions/136617/how-do-i-programmatically-force-an-onchange-event-on-an-input
	 * To trigger onchange event of clubs select list so that the series select list is loaded 
	 * when the page loads. */
	const event = new Event('change');
	destNode.dispatchEvent(event);
}

