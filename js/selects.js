function runSelect(query, format, destination, success, failure) {
	// GET passes parameters via URL all other methods pass via a file
	var url = "http://localhost/yachtracing/api/selectapi.php?sql=";
	url += query;
	
	const destNode = document.getElementById(destination);
	const succNode = document.getElementById(success);
	const failNode = document.getElementById(failure);
	
	const xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", callback);
	xhr.open("GET", url);
	xhr.send();	

	function callback() {
		if(this.readyState === 4) {
			if(this.status === 200 ){
				const jsObj = JSON.parse(xhr.responseText);
				var data;
				switch (format) {
					case 'table':
							destNode.innerHTML = createTable(jsObj).outerHTML;
						break;
					case 'options':
							createOptions(jsObj, destNode);
						break;
					default:
						destNode.innerHTML = xhr.responseText;
				}
			} else if (this.status === 204 ) {
				succNode.innerHTML = 'No records returned';
			} else {
				failNode.innerHTML = 'Failed to run SQL';
			}
		}
	}
}

function selectClubs(format, destination, success, failure) {
	const sele = 'SELECT * FROM clubs';
	runSelect(sele, format, destination, success, failure);
}

function selectClasses(format, destination, success, failure) {
	const sele = 'SELECT * FROM classes';
	runSelect(sele, format, destination, success, failure);
}

function selectSkippers(format, destination, success, failure) {
	const sele = 'SELECT * FROM skippers';
	runSelect(sele, format, destination, success, failure);
}

function selectBoats(format, destination, success, failure) {
	const sele = 'SELECT * FROM boats';
	runSelect(sele, format, destination, success, failure);
}

function selectSkipperBoat(format, destination, success, failure) {
	const sele = 'SELECT * FROM skippered ';
	runSelect(sele, format, destination, success, failure);
}

function selectSeries(club, format, destination, success, failure) {
	const sele = 'SELECT * FROM series WHERE club =\'' + club + '\'';
	runSelect(sele, format, destination, success, failure);
}

function selectRaces(series, format, destination, success, failure) {
	const sele = 'SELECT * FROM races WHERE series =\'' + series + '\'';
	runSelect(sele, format, destination, success, failure);
}

function selectSkipperBoat(series, format, destination, success, failure) {
	const sele = 'SELECT * FROM races WHERE series =\'' + series + '\'';
	runSelect(sele, format, destination, success, failure);
}

function selectBoatsInSeries(series, format, destination, success, failure) {
	const sele = ' \
SELECT c.`boatskipid`, s.skipper, s.registeredname \
  FROM `competesin` c LEFT JOIN skippered s \
	ON c.`boatskipid` = s.boatskipid \
  WHERE c.seriesid = \'' + series + '\' \
UNION \
SELECT c.`boatskipid`, s.skipper, s.registeredname \
  FROM racesofseries c LEFT JOIN skippered s \
    ON c.`boatskipid` = s.boatskipid \
  WHERE c.seriesid = \'' + series + '\' \
ORDER BY `seriesid`, `boatskipid`, skipper, registeredname';
	runSelect(sele, format, destination, success, failure);
}

function selectRaceDetails(race, format, destination, success, failure) {
	const sele = ' \
SELECT rs.raceid, rs.seriesid, rs.boatskipid, bs.registeredname, bs.skipper, \
	rs.POB, rs.finishedtime, \
	time_to_sec(timediff(finishedtime, r.time)) / 60 AS \'elapsedtime\', \
	( SELECT handicap FROM handicaps \
		WHERE boatskipid = bs.boatskipid \
		AND date = (SELECT MAX(date) FROM handicaps \
						WHERE boatskipid = bs.boatskipid \
						  AND date < (SELECT date FROM `races` \
										WHERE raceid = rs.raceid)) \
	) AS \'handi\', \
	TIME_TO_SEC(TIMEDIFF(rs.`finishedtime`, r.time))/60 \
	* ( SELECT handicap FROM handicaps \
			WHERE boatskipid = bs.boatskipid \
			AND date = (SELECT MAX(date) FROM handicaps \
							WHERE boatskipid = bs.boatskipid \
							  AND date < (SELECT date FROM `races` \
											WHERE raceid = rs.raceid)) \
	  ) AS \'corrected\', rs.correctedtime, rs.place, \
	( SELECT SUM(place) FROM racesofseries rs2 \
		WHERE rs2.seriesid = rs.seriesid AND rs2.boatskipid = rs.boatskipid ) \
		AS \'seriespoints\' \
FROM `racesofseries` rs \
	LEFT JOIN skippered bs ON rs.boatskipid = bs.boatskipid \
	LEFT JOIN races r ON rs.raceid = r.raceid \
WHERE rs.raceid = ' + race; 
	runSelect(sele, format, destination, success, failure);
}

/* modified version of 
https://stackoverflow.com/questions/17684201/create-html-table-from-javascript-object/17684427
*/
function createTable(aObj) {
	const table = document.createElement("table");
	const properties = Object.keys(aObj[0]);
	const header = document.createElement("tr");
	
	// Add headings to table
	for ( field = 0; field < properties.length; field++ ) {
		const th = document.createElement("th");
		th.appendChild(document.createTextNode(properties[field]));
		header.appendChild(th);
	}
	table.appendChild(header);
	
	// Add records (rows) to table
	for( record = 0; record < aObj.length; record++ ) {
		const tr = document.createElement("tr");
		// Add field values (column data) to table
		for ( field = 0; field < properties.length; field++ ) {
			const td = document.createElement("td");
			const data = aObj[record][properties[field]] || '';
			td.appendChild( document.createTextNode( data) ) ;
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	return table;
}	

function createOptions(aObj, destNode) {
	const properties = Object.keys(aObj[0]);
	
	// clear all options from destNode
	/* several ways to do this 
	 *	https://www.somacon.com/p542.php has four methods
	 *	could also step through each option and remove it */
	const selectParent = destNode.parentNode;
	const newNode = destNode.cloneNode(false); // shallow copy
	selectParent.replaceChild( newNode, destNode);
	
	// add prompt at top of list
	const option = document.createElement("option");
	option.value = 0;  // there is no db ID of 0 so this is safe
	option.text = "-- please select an option --";
	newNode.appendChild(option);
	
	// for each record format and append to list of options
	for( record = 0; record < aObj.length; record++ ) {
		const option = document.createElement("option");
		// Add first field as value.  Assumes it is unique
		option.value = aObj[record][properties[0]];
		// If there is only one property then set it as the text
		if (properties.length == 1) {
			option.text = aObj[record][properties[0]];
		} else if (properties.length == 2) {
			// If there is only two properties then include both in the text
			option.text = aObj[record][properties[0]] + ', ' 
				+ aObj[record][properties[0]];
		} else {
			// Else include all but the first property in the text
			option.text += aObj[record][properties[1]];
			for ( field = 2; field < properties.length; field++ ) {
				option.text += ', ' + aObj[record][properties[field]];
			}
		}
		newNode.appendChild(option);
	}
}
	