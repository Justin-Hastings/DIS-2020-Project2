/* Using pure xmlHttp with no ajax, no jquery
 * Relies on messages.js to store and display success and error messages
 */

/* as we have many scripts using xhr it may allready exist and it might be in the 
 * middle of a request so best to test if it exists and not redeclare it as this 
 * would have us wondering why the response was not being read by out javascript
 */
if (typeof xhr === 'undefined' || xhr === null) var xhr = new XMLHttpRequest();

displayboats();

async function displayboats() {
	clearMessages();
	
	var url = "http://localhost/yachtracing/api/displayboats.php";
	
	var counter = 3;
	
	while ( (xhr.readyState!=0) && (xhr.readyState!=4) && (counter > 0 ) ) {
		let promise = new Promise((resolve, reject) => {
		setTimeout(() => resolve("done!"), 50)
		});
		let result = await promise; // wait until the promise resolves (*)
		counter --;
	}
	
	if(xhr.readyState==0 || xhr.readyState==4){
		xhr.open('GET', url, true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onreadystatechange=displayboatsresponse;
		xhr.send(null);
	}
}

function displayboatsresponse() {
	
	if(xhr.readyState==4 && xhr.status==200){
		// translate from text to JSON
		var jsObj = JSON.parse(xhr.responseText);
		var boats = jsObj.boats;
		
		boats.sort();
				
		var boatsRows = "";

		boats.forEach(function(item) {
			boatsRows += '<tr><td>' + item.registeredname + '</td><td>' + item.sponsorsname
				+ '</td><td>' + item['class'] + '</td></tr>';
		} );
		
		boatsRows = '<table id="boats"><tr><th>Registered Name</th><th>Sponsor\'s Name</th><th>Class</th></tr>' + boatsRows + '</table>';
		document.getElementById('boatsresults').innerHTML = boatsRows;
			
		
		if(typeof jsObj['success'] !== 'undefined' && jsObj['success'] !== null)
			successes.push(jsObj.success);
		if(typeof jsObj['failure'] !== 'undefined' && jsObj['failure'] !== null) 
				errors.push(jsObj['failure']);
		displayMessages();
	}
}