<?php
/*header("Access-Control-Allow-Origin: * ");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
*/
require_once('..\authorisation\authController.php');
$conn = mysqli_connect(DB_HOST, $_SESSION['username'], $_SESSION['password'], DB_NAME);

$race = htmlspecialchars($_GET["race"]);

// $query = "SELECT * FROM clubs c LEFT JOIN series s ON c.club = s.club LEFT JOIN races r ON s.seriesid = r.seriesid WHERE c.club = \"Trinity Yacht Squadron\" ORDER BY r.date DESC";
$query = "SELECT rs.raceid, rs.seriesid, rs.boatskipid, bs.registeredname, bs.skipper, rs.POB, rs.finishedtime, time_to_sec(timediff(finishedtime, r.time)) / 60 AS 'elapsedtime',
				( SELECT handicap FROM handicaps
					WHERE boatskipid = bs.boatskipid
					AND date = (SELECT MAX(date) FROM handicaps 
									WHERE boatskipid = bs.boatskipid 
									  AND date < (SELECT date FROM `races` WHERE raceid = rs.raceid))
				) AS 'handi',
				
				TIME_TO_SEC(TIMEDIFF(rs.`finishedtime`, r.time))/60 
				* ( SELECT handicap FROM handicaps
						WHERE boatskipid = bs.boatskipid
						AND date = (SELECT MAX(date) FROM handicaps 
										WHERE boatskipid = bs.boatskipid 
										  AND date < (SELECT date FROM `races` 
														WHERE raceid = rs.raceid))
				  ) AS 'corrected', rs.correctedtime, rs.place, 
                
                ( SELECT SUM(place) FROM racesofseries rs2 
					WHERE rs2.seriesid = rs.seriesid AND rs2.boatskipid = rs.boatskipid ) AS 'seriespoints'

			FROM `racesofseries` rs 
				LEFT JOIN skippered bs ON rs.boatskipid = bs.boatskipid
				LEFT JOIN races r ON rs.raceid = r.raceid
			WHERE rs.raceid = ?";
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param( $stmt, 'i', $race);

// perform query and create message based on success or error
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
		$messages["success"]="SELECT successful: " . mysqli_stmt_affected_rows($stmt) . " rows retrieved";
		$messages["races"]=$races;
		echo json_encode($races);
	}
} else {
	http_response_code(404);
	$messages["failure"] = "Failed to run SELECT query: " . mysqli_stmt_error($stmt);
	echo json_encode($messages);
}
mysqli_stmt_close($stmt);
mysqli_close($conn);

?>
