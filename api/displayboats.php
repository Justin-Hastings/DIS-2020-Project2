<?php
header("Access-Control-Allow-Origin: * ");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once('control.php');
// $conn = $_SESSION['connection'] ;

$data = json_decode(file_get_contents("php://input"),true);

error_log( "displayboats received: data", 0);

$query = "SELECT registeredname, sponsorsname, class FROM boats";

$stmt = mysqli_prepare($conn, $query);

// perform query and create message based on success or error
if (mysqli_stmt_execute($stmt)) {
	$result = mysqli_stmt_get_result($stmt);
	http_response_code(200);
	$boats = array();
	while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC))
	{
		array_push( $boats, $row );
	}
	$messages["success"]="SELECT successful: " . mysqli_stmt_affected_rows($stmt) . " rows retrieved";
	$messages["boats"]=$boats;
	error_log( "displayboats sent 29: success", 0);
	echo json_encode($messages);
} else {
	http_response_code(200);
	$messages["failure"] = "Failed to run SELECT query: " . mysqli_stmt_error($stmt);
	error_log( "displayboats sent 34: failure", 0);
	echo json_encode($messages);
}
mysqli_stmt_close($stmt);
mysqli_close($conn);

error_log( "displayboats sent40: " . json_encode($messages), 0);


// list of mysqli commands https://www.w3schools.com/php/php_ref_mysqli.asp
?>
