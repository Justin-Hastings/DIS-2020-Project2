<?php
header("Access-Control-Allow-Origin: * ");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once('control.php');

$data = json_decode(file_get_contents("php://input"),true);

$regname = $data['regname'];  // sent from js as regname
$sponame = $data['sponame'];
$bclass  = $data['bclass'];

error_log( "received: data " . $regname . " " . $sponame . " " . $bclass, 0);


$query = "INSERT INTO boats SET registeredname = ?, sponsorsname = ?, class= ?";

/* i	corresponding variable has type integer
 * d	corresponding variable has type double
 * s	corresponding variable has type string
 * b	corresponding variable is a blob and will be sent in packets */
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param( $stmt, 'sss', $regname, $sponame, $bclass);

// perform query and create message based on success or error
if (mysqli_stmt_execute($stmt)) {
	http_response_code(200);
	array_push( $messages , array("success" => "INSERT successful: " . mysqli_stmt_affected_rows($stmt) . " rows added"));
	echo json_encode($messages);
} else {
	http_response_code(200);
	array_push( $messages , array("failure" => "Failed to run INSERT query: " . mysqli_stmt_error($stmt) ));
	echo json_encode($messages);
}
mysqli_stmt_close($stmt);
mysqli_close($conn);
?>