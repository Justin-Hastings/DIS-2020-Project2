
// Arrays to store messages 
var successes = [];
var errors = [];

function displayMessages() {
	if (successes.length > 0) {
		successStr = "<div class='alert alert-success'>";
		for( i = 0; i < successes.length; i++) {
			successStr += "<li>" + successes[i] + "</li>";
		}
		successStr += "</div>";
		document.getElementById("alert-success").innerHTML = successStr;
	} else {
		document.getElementById("alert-success").innerHTML = "";
	}
	
	if(errors.length > 0 ) {
		failureStr = "<div class='alert alert-danger'>";
		for( i = 0; i < errors.length; i++) {
			failureStr += "<li>" + errors[i] + "</li>";
		}
		failureStr += "</div>";
		document.getElementById("alert-danger").innerHTML = failureStr;
	} else {
		document.getElementById("alert-danger").innerHTML = "";
	}
}

function clearMessages() {
	successes = [];
	errors = [];

	document.getElementById("alert-success").innerHTML = "";
	document.getElementById("alert-danger").innerHTML = "";
}
