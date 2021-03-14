function runInsert(sql, success, failure) {
	/* Generic insert function
		Inputs: url URL of api
				sql string containing insert query
				succ document element to display success message
				fail document element to display failure message
		Outputs:
				message to succ or fail
	*/
	const url = 'http://localhost/yachtracing/api/insertapi.php';
	const succ = document.getElementById(success);
	const fail = document.getElementById(failure);

	const xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", callback);
	xhr.open("POST", url);
	xhr.send(sql);	

	function callback() {
		if(this.readyState === 4) {
			if(this.status === 201 ){
				const jsObj = JSON.parse(xhr.responseText);
				succ.innerHTML 
					= JSON.stringify(jsObj['success']);
				fail.innerHTML = '';
			} else {
				switch (this.status) {
					default:
					case 405:
					case 503:
						succ.innerHTML = '';
						fail.innerHTML = 'ERROR ' + this.status + " " 
							+ xhr.responseText;
						break;
					case 409:
						error = ' ';
						try {
							const jsObj = JSON.parse(xhr.responseText);
							error = JSON.stringify(jsObj['failure']);
						}
						catch(err) {
							error = xhr.responseText;
						}
						succ.innerHTML = '';
						fail.innerHTML = 'ERROR ' + this.status + " " 
							+ error;
				}
			}
		}
	}
}

function insertClub(club, address, success, failure) {
	const sql = "INSERT INTO clubs (club, address) VALUES('"
			+ document.getElementById(club).value + "', '"
			+ document.getElementById(address).value + "')";
	runInsert(sql, success, failure);
}

function insertSeries(club, series, date, success, failure) {
	// minimal input validation
	if (  isEmpty(document.getElementById(club).value), 
		  isEmpty(document.getElementById(series).value), 
		  isEmpty(document.getElementById(date).value) ) {
		document.getElementById(failure).innerText 
			= "Club, series and date all need values";
	}else {
		const sql = 'INSERT INTO series (club, address) VALUES(\''
			+ document.getElementById(club).value + '\', \''
			+ document.getElementById(address).value + '\')';
		runInsert(sql, success, failure);
	}
}

function insertBoat(regName, sponName, bclass, success, failure) {
	const reg = document.getElementById(regName).value;
	const spo = document.getElementById(sponName).value;
	const bcl = document.getElementById(bclass).value;
	if ( isEmpty(reg) ) {
		document.getElementById(failure).innerText 
			= "Boat's registration name need a value";
		return;
	} 
	if ( isEmpty(bcl) ) {
		document.getElementById(failure).innerText 
			= "Boats must be given a class";
		return;
	}
	const sql = "INSERT INTO boats (registeredname, sponsorsname, class) \
		VALUES ( '" + reg + "', '" + spo + "', '" + bcl +"' )";
	runInsert(sql, success, failure);
}

function isEmpty(avar) {
	if (avar.trim() == undefined ) {
		// This also handles null as null == undefined is true
		return true;
	}
	if (avar.trim() == '' ) {
		// This also handles ""
		return true;
	}
	return false;
}

function displaySuccess(dest, msg) {
	aStr = "<div class='alert alert-success'>";
	aStr += msg;
	aStr += "</div>";
	document.getElementById(dest).innerHTML = aStr;
}

function displayfailure(dest, msg) {
	aStr = "<div class='alert alert-danger'>";
	aStr += msg;
	aStr += "</div>";
	document.getElementById(dest).innerHTML = aStr;
}

function clearMessage(success, failure){
	document.getElementById(success).innerHTML = '';
	document.getElementById(failure).innerHTML = '';
}