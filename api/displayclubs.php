<?php
header("Access-Control-Allow-Origin: * ");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once('control.php');

$query = "SELECT club FROM clubs";

$stmt = mysqli_prepare($conn, $query);

// perform query and create message based on success or error
	$result = mysqli_stmt_get_result($stmt);
	if ( mysqli_num_rows( $result ) == 0 ) {
		http_response_code(204);
	} else {
		http_response_code(200);
		$records = array();
		while ($record = mysqli_fetch_array($result,MYSQLI_ASSOC))
		{
			array_push( $records, $record );
		}
		echo json_encode($records);
	}
} else {
	http_response_code(404);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);

// list of mysqli commands https://www.w3schools.com/php/php_ref_mysqli.asp
?>
