
/* Using pure xmlHttp with no ajax, no jquery
 * Relies on messages.js to store and display success and error messages
 */
 
if (typeof xhr === 'undefined' || xhr === null) var xhr = new XMLHttpRequest();

function insertclass() {
	validateClassInput();
	if(errors.length == 0 ) {
		clearMessages();
		
		// scrap the data from the html document.  boatclass is the name of the input text tag
		var bclass = document.getElementsByName('boatclass')[0].value;
		var handicap = document.getElementsByName('boathandicap')[0].value;

		var url = "http://localhost/yachtracing/api/insertclass.php";
		
		// build JSON message to send
		var jsonString = JSON.stringify({'class':bclass, 'handicap':handicap} );
		
		if(xhr.readyState==0 || xhr.readyState==4){
			//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
			xhr.open('POST', url ,true);  // true is asynchronous
			// set MIME type and character set to match that in insertuser.php
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			// set callback function that will respond to the listener being triggered
			xhr.onreadystatechange=insertclassresponse;
			// send message
			xhr.send(jsonString);
		}
	}
}

function insertclassresponse() {
	
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

function validateClassInput() {
	clearMessages();
	// scrap the data from the html document
	var bclass = document.getElementsByName('boatclass')[0].value;
	var handicap = document.getElementsByName('boathandicap')[0].value;
	
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
		case 'boatclass':
			if (!bclass) {
				errors.push("Boat class cannot be nothing");
			}
			break;
		case 'boathandicap':
			if (!handicap) {
				errors.push("Boat class cannot be nothing");
			} else if (!handicap > 1.0) {
				errors.push("Boat class cannot be greater than 1.0");
			} else if (!handicap < 0.2) {
				errors.push("Boat class cannot be less than 0.2");
			}
			break;
		case 'insertclass-btn':
			if (!bclass) {
				errors.push("Boat class cannot be nothing");
			}
			if (!handicap) {
				errors.push("Boat class cannot be nothing");
			}
			break;
	}
	
	displayMessages();
}	