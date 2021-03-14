

function cascadeDisplay( sourceNode, destNode ) {
	/* 	This function manages the display of a sequence of HTML select elements
		where the lower select element is only are visible after the higher 
		select has had a selection made.
		
		Input: sourceNode and destNode are HTML select elements
		
		Logic:
		reset destNode as sourceNode has just been changed
	
		if sourceNode is not set then 
			hide destNode
		else
			make destNode visible
	*/
		
	if(destNode.length > 0) destNode.selectedIndex = -1;
	const event = new Event('change');
	destNode.dispatchEvent(event);
	
	if (sourceNode.selectedIndex < 1 ) {
		destNode.style.visibility = 'hidden';
		//destNode.style.display = 'none';
		// destNode.style.opacity = 0.1;
		
		return false;
	} else {
		destNode.style.visibility = 'visible';
		//destNode.style.display = 'initial';
		//destNode.style.opacity = 1.0;
		
		return true;
	}
}

function manageBreadcrumbs(list) {
	/* 	This function manages the display of the breadcrumb and when the 
		breadcrumb is clicked on for navigation
		
		Input: list is the name of the crumb clicked on
		if list is undefined
			it is assumed that the navigation has been made by
			a selection of one of the select listStyleType 
		
		Logic: 
			determine input source and set destNode based on source
				example:
					if source is a clublist select element then
						the serieslist select element needs to be reset
					else if the source is the club breadcrumb-item then
						the clubslist select element needs to be reset
			change breadcrumb based on input source
			if input source is a breadcrumb-item
				reset d to request 
				select
	*/
				
	var breadcrumb = '';
	document.getElementById('maintainClubs').style.display = 'none';
	document.getElementById('maintainSeries').style.display = 'none';
	document.getElementById('maintainRaces').style.display = 'none';
	
	
	var source = ' ';
	if(typeof list == "undefined") {
		source = event.target.id; // triggered by listbox
		if (event.target.selectedIndex < 1 ) {
			switch (event.target.id) {
				case 'clubslist':
					source = 'club';
					break;
				case 'serieslist':
					source = 'series';
					break;
				case 'races':
					source = 'race';
					break;
			}
		}
	} else
		source = list;		// triggered by breadcrumb
	
	if(source) {
		switch(source) {
			default: // default to home
			case 'home':
				breadcrumb = "<li class='breadcrumb-item active' \
					aria-current='page'><a href='home.html'>Home</a></li>";
				break;
			case 'club':	// breadcrumb name
				breadcrumb = "<li class='breadcrumb-item'>\
						<a href='home.html'>Home</a></li> \
					<li class='breadcrumb-item active' \
						onclick=\"manageBreadcrumbs('club')\" \
						aria-current='page'>Club</li>";
				destNode = document.getElementById('clubslist');
				requestClubs('detailedresults', 'table');
				document.getElementById('detailedresults').style.visibility
					= 'initial';
					
				if( typeof sessionStorage.getItem('canUpdate') === 'string' ) {
					if(sessionStorage.getItem('canUpdate')){
						document.getElementById('maintainClubs').style.display = 'block';
					}
				}
				break;
			case 'series': 		// breadcrumb name
			case 'clubslist':	// select list name
				breadcrumb = "<li class='breadcrumb-item'>\
						<a href='home.html'>Home</a></li> \
					<li class='breadcrumb-item' \
						onclick=\"manageBreadcrumbs('club')\">Club</li> \
					<li class='breadcrumb-item active' \
						onclick=\"manageBreadcrumbs('series')\" \
						aria-current='page'>Series</li>";
				destNode = document.getElementById('serieslist');
				requestSeries('detailedresults', 'table');
					
				if( typeof sessionStorage.getItem('canUpdate') === 'string' ) {
					if(sessionStorage.getItem('canUpdate')){
						document.getElementById('maintainSeries').style.display = 'block';
					}
				}
				break;
			case 'race':
			case 'serieslist':
				breadcrumb = "<li class='breadcrumb-item'>\
						<a href='home.html'>Home</a></li> \
					<li class='breadcrumb-item' \
						onclick=\"manageBreadcrumbs('club')\">Club</li> \
					<li class='breadcrumb-item' \
						onclick=\"manageBreadcrumbs('series')\">Series</li> \
					<li class='breadcrumb-item active' \
						onclick=\"manageBreadcrumbs('race')\" \
						aria-current='page'>Race</li>";
				destNode = document.getElementById('races');
				requestRaces('detailedresults', 'table');
					
				if( typeof sessionStorage.getItem('canUpdate') === 'string' ) {
					if(sessionStorage.getItem('canUpdate')){
						document.getElementById('maintainRaces').style.display = 'block';
					}
				}
				break;
			case 'races':
			case 'racedetails':
				breadcrumb = "<li class='breadcrumb-item'>\
						<a href='home.html'>Home</a></li> \
					<li class='breadcrumb-item' \
						onclick=\"manageBreadcrumbs('club')\">Club</li> \
					<li class='breadcrumb-item' \
						onclick=\"manageBreadcrumbs('series')\">Series</li> \
					<li class='breadcrumb-item' \
						onclick=\"manageBreadcrumbs('race')\">Race</li> \
					<li class='breadcrumb-item active' \
						onclick=\"manageBreadcrumbs('racedetails')\" \
						aria-current='page'>Race details</li>";
				break;
		}
	}
	
	if (typeof list != "undefined")	{
		destNode.selectedIndex = 0;
		const event = new Event('change');
		destNode.dispatchEvent(event);
	}
	
	document.getElementById('navbreadcrumblist').innerHTML = breadcrumb;
}

function canUpdate() {
	const url = "http://localhost/yachtracing/authorisation/canupdate.php";

	const xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", callback);
	xhr.open("GET", url);
	xhr.send();	

	function callback() {
		if(this.readyState === 4) {
			xhr.responseText;
			if (xhr.responseText === 'true') 
				sessionStorage.setItem('canUpdate', true);
			else
				sessionStorage.setItem('canUpdate', false);
		}
	}
}