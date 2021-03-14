<?php
/*header("Access-Control-Allow-Origin: * ");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
*/
require_once('..\authorisation\authController.php');
$conn = mysqli_connect(DB_HOST, $_SESSION['username'], $_SESSION['password'], DB_NAME);

error_log( "selectraces: started", 0 );

$series = strval(htmlspecialchars($_GET["series"]));

error_log( "selectraces: received " . $series, 0 );

$query = "SELECT * FROM races 
			WHERE seriesid = ? 
			ORDER BY date DESC";
			
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param( $stmt, 'i', $series);

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
		$messages["success"] = "SELECT successful: " . mysqli_stmt_affected_rows($stmt) . " rows retrieved";
		$messages["races"] = $races;
		error_log( "selectraces: success", 0);
		echo json_encode($races);
	}
} else {
	http_response_code(404);
	$messages["failure"] = "Failed to run SELECT query: " . mysqli_stmt_error($stmt);
	error_log( "selectraces: failure", 0);
	echo json_encode($messages);
}
mysqli_stmt_close($stmt);
mysqli_close($conn);

error_log( "selectraces: " . json_encode($messages), 0);


// list of mysqli commands https://www.w3schools.com/php/php_ref_mysqli.asp
?>
