/* Using pure xmlHttp with no ajax, no jquery
 * Relies on messages.js to store and display success and error messages
 */

/* as we have many scripts using xhr it may allready exist and it might be in the 
 * middle of a request so best to test if it exists and not redeclare it as this 
 * would have us wondering why the response was not being read by out javascript
 */
if (typeof xhr === 'undefined' || xhr === null) var xhr = new XMLHttpRequest();

selectclassescombo();

async function selectclassescombo() {
	clearMessages();
	
	var url = "http://localhost/yachtracing/api/displayclasses.php";
	
	if(xhr.readyState==0 || xhr.readyState==4){
		xhr.open('GET', url, true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onreadystatechange=selectclassescomboresponse;
		xhr.send(null);
	} 
}

function selectclassescomboresponse() {
	
	if(xhr.readyState==4 && xhr.status==200){
		// translate from text to JSON
		var jsObj = JSON.parse(xhr.responseText);
		var classes = jsObj.classes;
		
		classes.sort();
				
		var classesRows = "";

		classes.forEach(function(item) {
			classesRows += '<option value="' + item["class"] + '">' + item["class"] + " (" + item.handicap + ')</option>';
		} );
		
		classesRows = '<select id="classes">' + classesRows + '</select>';
		document.getElementById('classescomboresults').innerHTML = classesRows;
			
		
		if(typeof jsObj['success'] !== 'undefined' && jsObj['success'] !== null)
			successes.push(jsObj.success);
		if(typeof jsObj['failure'] !== 'undefined' && jsObj['failure'] !== null) 
				errors.push(jsObj['failure']);
		displayMessages();
	}
}