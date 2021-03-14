
/* Using pure xmlHttp with no ajax, no jquery
 * Relies on messages.js to store and display success and error messages
 */
 
if (typeof xhr === 'undefined' || xhr === null) var xhr = new XMLHttpRequest();

function insertboat() {
	validateBoatInput();
	if(errors.length == 0 ) {
		clearMessages();
		
		// scrap the data from the html document.  
		var regname = document.getElementsByName('regname')[0].value;
		var sponame = document.getElementsByName('sponname')[0].value;
		var bclass = document.getElementById('classes').value;

		var url = "http://localhost/yachtracing/api/insertboat.php";
		
		// build JSON message to send
		var jsonString = JSON.stringify({'regname':regname, 'sponame':sponame, 'bclass':bclass} );
		
		if(xhr.readyState==0 || xhr.readyState==4){
			//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
			xhr.open('POST', url ,true);  // true is asynchronous
			// set MIME type and character set to match that in insertuser.php
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			// set callback function that will respond to the listener being triggered
			xhr.onreadystatechange=insertBoatResponse;
			// send message
			xhr.send(jsonString);
		}
	}
}

function insertBoatResponse() {
	
	if(xhr.readyState==4 && xhr.status==200){
		// translate from text to JSON
		var jsObj = JSON.parse(xhr.responseText);
		
		jsObj.forEach(function(item, index) {
			if(typeof item['success'] !== 'undefined' && item['success'] !== null) 
				successes.push(item['success']);
			if(typeof item['failure'] !== 'undefined' && item['failure'] !== null) 
				errors.push(item['failure']);
		});
		displayMessages();
	}
}

function validateBoatInput() {
	clearMessages();
	// scrap the data from the html document
	var regname = document.getElementsByName('regname')[0].value;
	var sponame = document.getElementsByName('sponname')[0].value;
	var bclass 	= document.getElementById('classes').value;
	
	/* Note: if( value ) { }
		will evaluate to true if value is not:
			null
			undefined
			NaN
			empty string ("")
			0
			false
	*/
	// event.target.name is the html element that triggered the event
	switch(event.target.name) {
		case 'regname':
			if (!regname) {
				errors.push("Boat's registered name cannot be nothing");
			}
			break;
		case 'sponname':
			// nothing to check
			break;
		case 'classes':
			if (!bclass) {
				errors.push("Boat's class cannot be nothing");
			}
			break;
		case 'insertboat-btn':
			if (!regname) {
				errors.push("Boat's registered name cannot be nothing");
			}
			if (!bclass) {
				errors.push("Boat's class cannot be nothing");
			}
			break;
	}
	
	displayMessages();
}	