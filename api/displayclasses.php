<?php
header("Access-Control-Allow-Origin: * ");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once('control.php');

$data = json_decode(file_get_contents("php://input"),true);

error_log( "displayclasses received: data", 0);

$query = "SELECT class, handicap FROM classes";

$stmt = mysqli_prepare($conn, $query);

// perform query and create message based on success or error
if (mysqli_stmt_execute($stmt)) {
	$result = mysqli_stmt_get_result($stmt);
	http_response_code(200);
	$classes = array();
	while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC))
	{
		array_push( $classes, $row );
	}
	$messages["success"]="SELECT successful: " . mysqli_stmt_affected_rows($stmt) . " rows retrieved";
	$messages["classes"]=$classes;
	error_log( "displayclasses sent 29: success", 0);
	echo json_encode($messages);
} else {
	http_response_code(200);
	$messages["failure"] = "Failed to run SELECT query: " . mysqli_stmt_error($stmt);
	error_log( "displayclasses sent 34: failure", 0);
	echo json_encode($messages);
}
mysqli_stmt_close($stmt);
mysqli_close($conn);

error_log( "displayclasses sent40: " . json_encode($messages), 0);


// list of mysqli commands https://www.w3schools.com/php/php_ref_mysqli.asp
?>
