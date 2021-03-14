<?php
require_once('..\authorisation\authController.php');
$conn = mysqli_connect(DB_HOST, $_SESSION['username'], $_SESSION['password'], DB_NAME);
if (mysqli_connect_errno()) {
	http_response_code(503);
	die('Database error:' . mysqli_connect_error() );
}

$club = $_GET["club"];

$query = "SELECT * 
			FROM `series` 
			WHERE club = ?";
			
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param( $stmt, 's', $club);

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
