<?php
$conn = mysqli_connect('localhost', 'commodore','root', 'yachtracing');
if (mysqli_connect_errno()) {
	http_response_code(503);
	die('Database error:' . mysqli_connect_error() );
}

$series = $_GET["series"];

$query = "SELECT s.seriesid, s.year, s.season, s.club, sk.skipper, b.registeredname, b.class, SUM(rs.place) totalplaces
			FROM `series` s 
				LEFT JOIN racesofseries rs ON s.`seriesid` = rs.seriesid
				LEFT JOIN skippered bs ON rs.boatskipid = bs.boatskipid
				LEFT JOIN skippers sk ON bs.skipper = sk.skipper
				LEFT JOIN boats b ON bs.registeredname = b.registeredname
			WHERE s.seriesid = ?
			GROUP BY s.seriesid, s.year, s.season, s.club, sk.skipper, b.registeredname, b.class
			ORDER BY b.class ASC, SUM(rs.place) ASC, b.registeredname ASC";
			
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param( $stmt, 'i', $series);

// perform query and respond 
if (mysqli_stmt_execute($stmt)) {
	$result = mysqli_stmt_get_result($stmt);
	if ( mysqli_num_rows( $result ) == 0 ) {
		http_response_code(204);
	} else {
		http_response_code(200);
		$races = array();
		while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC))
		{
			array_push( $races, $row );
		}
		echo json_encode($races);
	}
} else {
	http_response_code(404);
}
mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
