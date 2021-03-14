function requestGet(table) {
	const xhr = new XMLHttpRequest();
	// xhr.withCredentials = true;
	xhr.addEventListener("readystatechange", callback);
	xhr.open("GET", "http://localhost/yachtracing/api/selectracesdetailsbasic.php?race=5");
	xhr.send();	

	function callback() {
		if(this.readyState === 4) {
			var headings = [];
			const JSONresponse=xhr.responseText;
			console.log( JSONresponse );
			const jsObj = JSON.parse(JSONresponse);
			
			switch(table) {
				case 1: 
					document.getElementById("msg").innerHTML = createTable(jsObj); 
					break;
				case 2: 
					document.getElementById("msg2").innerHTML = createTable2(jsObj); 
					break;
				case 3: 
					document.getElementById("msg3").appendChild(createTable3(jsObj)); 
					break;
				case 4: 
					document.getElementById("msg4").appendChild(createTable4(jsObj)); 
					break;
			}
		}
	}
}

function createTable( aObj ) {
	var table = "<table><tr>";
	const headings = Object.keys(aObj[0]);
	headings.forEach(addHeadings);
	table += "</tr>"
	aObj.forEach(addRows);
	table += "</table>";
	return table;
	
	function addHeadings(item, index) {
		table += "<th>" + item + "</th>";
	}
	function addRows(record,index){
		table += "<tr>";
		var cols = getValues(record);
		cols.forEach(addCols);
		table += "</tr>";
	}
	function addCols(field,index){
		const data = field || '';
		table += "<td>" + data + "</td>";
	}
}

function createTable2( aObj ) {
	var table = "<table><tr>";
	var headings = Object.keys(aObj[0]);
	
	// Add headings to table
	table += "<tr>";
	for ( field = 0; field < headings.length; field++ ) {
		table += "<th>" + headings[field] + "</th>";
	}
	table += "</tr>";
	
	// Add records (rows) to table
	for( record = 0; record < aObj.length; record++ ) {
		table += "<tr>";
		// Add field values (column data) to table
		for ( field = 0; field < headings.length; field++ ) {
			const data = aObj[record][headings[field]] || '';
			table += "<td>" + data + "</td>";
		}
		table += "</tr>";
	}
	table += "</table>";
	return table;
}

function createTable3( aObj ) {
	const table = document.createElement("table");
	const headings = Object.keys(aObj[0]);
	const header = document.createElement("tr");
	
	headings.forEach(addHeadings);
	table.appendChild(header);
	
	aObj.forEach(addRows);
	return table;
	
	function addHeadings(item, index) {
		const th = document.createElement("th");
		th.appendChild( document.createTextNode(item) );
		header.appendChild(th);
	}
	function addRows(record,index){
		const tr = document.createElement("tr");
		var cols = getValues(record);
		cols.forEach(addCols);
		table.appendChild(tr);
		
		function addCols(field,index){
			const td = document.createElement("td");
			const data = field || '';
			td.appendChild(document.createTextNode(data));
			tr.appendChild(td)
		}
	}
}

// modified version of https://stackoverflow.com/questions/17684201/create-html-table-from-javascript-object/17684427
function createTable4( aObj ) {
	const table = document.createElement("table");
	const headings = Object.keys(aObj[0]);
	const header = document.createElement("tr");
	
	// Add headings to table
	for ( field = 0; field < headings.length; field++ ) {
		const th = document.createElement("th");
		th.appendChild(document.createTextNode(headings[field]));
		header.appendChild(th);
	}
	table.appendChild(header);
	
	// Add records (rows) to table
	for( record = 0; record < aObj.length; record++ ) {
		const tr = document.createElement("tr");
		// Add field values (column data) to table
		for ( field = 0; field < headings.length; field++ ) {
			const td = document.createElement("td");
			const data = aObj[record][headings[field]] || '';
			td.appendChild( document.createTextNode( data) ) ;
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	return table;
}

function getValues(obj){
	// to allow for IE's lack of support for Object.values
	if (Object.values) {
		return Object.values(obj);
	} else {
		return Object.keys(obj).map(function(e) {
			return obj[e]
			});
	}
}

