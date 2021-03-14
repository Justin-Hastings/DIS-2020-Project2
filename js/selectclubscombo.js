
if (typeof xhr === 'undefined' || xhr === null) var xhr = new XMLHttpRequest();

selectclubscombo();

async function selectclubscombo() {
	clearMessages();
	
	var url = "http://localhost/yachtracing/api/displayclubs.php";
	
	if(xhr.readyState==0 || xhr.readyState==4){
		xhr.open('GET', url, true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onreadystatechange=selectclubscomboresponse;
		xhr.send(null);
	} 
}

function selectclubscomboresponse() {
	
	if(xhr.readyState==4 && xhr.status==200){
		// translate from text to JSON
		var jsObj = JSON.parse(xhr.responseText);
		var clubs = jsObj.clubs;
		
		clubs.sort();
				
		var clubsRows = "";

		// clear options from select statement
		var clubscombo = document.getElementById('clubs');
		var length = clubscombo.options.length;
		for (i = length-1; i >= 0; i--) {
			clubscombo.options[i] = null;
		}
		clubscombo.options[clubscombo.options.length] = 
				new Option('--- please select a club ---','');

		// add options into select statement
		clubs.forEach(function(item) {
			clubscombo.options[clubscombo.options.length] = 
				new Option(item["club"],item["club"]);
		} );
		
		if(typeof jsObj['success'] !== 'undefined' && jsObj['success'] !== null)
			successes.push(jsObj.success);
		if(typeof jsObj['failure'] !== 'undefined' && jsObj['failure'] !== null) 
				errors.push(jsObj['failure']);
		displayMessages();
	}
}