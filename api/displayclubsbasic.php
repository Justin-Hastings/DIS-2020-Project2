<?php
$conn = mysqli_connect('localhost', 'commodore','root', 'yachtracing');
$query = "SELECT club FROM clubs";

$stmt = mysqli_prepare($conn, $query);

if (mysqli_stmt_execute($stmt)) {
	$result = mysqli_stmt_get_result($stmt);
	http_response_code(200);
	$clubs = array();
	while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC))
	{
		array_push( $clubs, $row );
	}
	echo json_encode($clubs);
} else {
	http_response_code(404);
	echo "Well that did not work!";
}
mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
