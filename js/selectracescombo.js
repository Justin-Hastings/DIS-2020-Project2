
if (typeof xhr === 'undefined' || xhr === null) var xhr = new XMLHttpRequest();

async function selectracescombo() {
	clearMessages();
	
	var url = "http://localhost/yachtracing/api/selectraces.php";
	url += "?club=" + document.getElementById('clubs').value;
	
	if(xhr.readyState==0 || xhr.readyState==4){
		xhr.open('GET', url ,true);  // true is asynchronous
		xhr.onreadystatechange=selectracescomboresponse;
		xhr.send(null);
	}
}

function selectracescomboresponse() {
	
	if(xhr.readyState==4 && xhr.status==200){
		// translate from text to JSON
		var jsObj = JSON.parse(xhr.responseText);
		var races = jsObj.races;
		
		var racesRows = " ";
		
		// clear options from select
		var racescombo = document.getElementById('races');
		var length = racescombo.options.length;
		for (i = length-1; i >= 0; i--) {
			racescombo.options[i] = null;
		}
		racescombo.options[racescombo.options.length] 
					= new Option( '---  please select a race ---','' );

		// used postman to see what the results would look like
		
		// add options to select
		if (races !== undefined ) {
			races.forEach(function(item) {
				racescombo.options[racescombo.options.length] 
					= new Option( 'Series:' + item["season"] + " Race:" 
						+ item["race"] + " " + item["date"], item["raceid"]);
			} );
		}
		
		if(typeof jsObj['success'] !== 'undefined' && jsObj['success'] !== null)
			successes.push(jsObj.success);
		if(typeof jsObj['failure'] !== 'undefined' && jsObj['failure'] !== null) 
				errors.push(jsObj['failure']);
		displayMessages();
	}
}