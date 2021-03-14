function requestGet() {
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", callback);

	xhr.open("GET", "http://localhost/yachtracing/api/selectracesdetailsbasic.php?race=5");

	xhr.send();	


	function callback() {
	  if(this.readyState === 4) {
		const JSONresponse=xhr.responseText;
		const jsObj = JSON.parse(JSONresponse);
		
		document.getElementById("msg").innerHTML = createTable(jsObj);
	  }
	}
}

function createTable(aObj) {
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
		const cols = getValues(record);
		cols.forEach(addCols);
		table += "</tr>";
	}
	function addCols(field,index){
		const data = field || '';
		table += "<td>" + data + "</td>";
	}
	
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

