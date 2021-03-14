<?php
header("Access-Control-Allow-Origin: * ");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Not safe as PHP can be added to the HTML to reveal the password 
require_once('..\authorisation\authController.php');
$conn = mysqli_connect(DB_HOST, $_SESSION['username'], $_SESSION['password'], DB_NAME);
if (mysqli_connect_errno()) {
	http_response_code(503);
	die('Database error:' . mysqli_connect_error() );
}

/* Some sanitising but not safe from SQL injection see:
	https://www.php.net/manual/en/security.database.sql-injection.php
 */
/* remove white space are the start and end, remove html tags, remove ASCII 
   characters below 32 and above 127 */
$query = filter_var(strip_tags(trim($_GET["sql"])), 
	FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
	
$stmt = mysqli_prepare($conn, $query);

// perform query and respond 
if (mysqli_stmt_execute($stmt)) {
	$sqlresult = mysqli_stmt_get_result($stmt);
	if ( mysqli_num_rows( $sqlresult ) == 0 ) {
		http_response_code(204);
	} else {
		http_response_code(200);
		$results = array();
		while ($row = mysqli_fetch_array($sqlresult,MYSQLI_ASSOC))
		{
			array_push( $results, $row );
		}
		echo json_encode($results);
	}
} else {
	http_response_code(404);
}
mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
