<?php
header("Access-Control-Allow-Origin: * ");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PATCH");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
/* make sure your web server supports PATCH requests, some are configured to 
   respond only to GET and POST */
   
if (!$_SESSION['update']) {
	// Method Not Allowed (user not allowed to update)
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
/* remove white space are the start and end, remove html tags, remove ASCII 
   characters below 32 and above 127 */
$query = filter_var(strip_tags(trim(file_get_contents('php://input'))), 
	FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
	
$stmt = mysqli_prepare($conn, $query);

// perform query and respond 
if (mysqli_stmt_execute($stmt)) {
	http_response_code(200);
	echo json_encode(array("success" => "UPDATE successful: " 
		. mysqli_stmt_affected_rows($stmt) . " rows updated"));
} else {
	// 404 (Not Found), if ID not found or invalid
	http_response_code(404);
	echo json_encode(array("failure" => "Failed to run UPDATE query: " 
		. mysqli_stmt_error($stmt) ) );
}
mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
