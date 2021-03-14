<?php
header("Access-Control-Allow-Origin: * ");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once('..\authorisation\authController.php');
  
if (!$_SESSION['update']) {
	// Method Not Allowed (user not allowed to insert)
	http_response_code(405);
	die('User not allowed to update');
}

// Not safe as PHP can be added to the HTML to reveal the password 
require_once('..\authorisation\authController.php');
$conn = mysqli_connect(DB_HOST, $_SESSION['username'], 
		$_SESSION['password'], DB_NAME);
if (mysqli_connect_errno()) {
	http_response_code(503);
	die('Database error:' . mysqli_connect_error() );
}

/* Some sanitising but not safe from SQL injection see:
	https://www.php.net/manual/en/security.database.sql-injection.php
 */
/* For some reason when filter_var was included it was invisibly corrupting the
	SQL in a way that could not be determined as the SQL would run manually
$query = filter_var(strip_tags(trim(file_get_contents('php://input'))), 
	FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH); */

$query = strip_tags(trim(file_get_contents('php://input')));

$stmt = mysqli_prepare($conn, $query);
if (!$stmt ) {
	 die('mysqli error: '.mysqli_error($conn) . '<br />' . $query);
}	

/*
mysqli_stmt_bind_param($stmt, 'i', $race);
if ( !mysqli_execute($stmt1) ) {
 die( 'stmt error: '.mysqli_stmt_error($stmt) );
}
*/

// perform query and respond 
if (mysqli_stmt_execute($stmt)) {
	http_response_code(201);
	echo json_encode(array("success" => "INSERT successful: " 
		. mysqli_stmt_affected_rows($stmt) . " rows updated"));
} else {
	// 409 (Conflict) if resource already exists.
	http_response_code(409);
	echo json_encode(array("failure" => "Failed to run INSERT query: " 
		. mysqli_stmt_error($stmt) ) );
}
mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
