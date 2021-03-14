<?php
define('DB_HOST', 'localhost');
define('DB_USER','commodore');
define('DB_PASS','root');
define('DB_NAME','yachtracing');

$conn = mysqli_connect(DB_HOST, DB_USER,DB_PASS, DB_NAME);

if (mysqli_connect_errno())
{
	http_response_code(503);
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
	die('Database error:' . mysqli_connect_error() );
}

$messages = array();
