<?php

session_start();
define('DB_HOST', 'localhost');
define('DB_NAME','yachtracing');

/* Security considerations
 * https://owasp.org/www-community/attacks/xss/
 */

// global variables
$errors = array();

if(isset($_POST['login-btn'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
	$update = false;	// if user granted update
 
    // validation
    if (empty($username)) {
        $errors['username'] = "Username required";
    }
    if (empty($password)) {
        $errors['password'] = "Password required";
    }

    // if no errors try to create a connection
    if( count($errors) === 0 ) {
		$conn = mysqli_connect(DB_HOST, $username, $password, DB_NAME);

		if (mysqli_connect_errno())
		{
			http_response_code(503);
			$errors['db_connection'] = "Failed to connect to MySQL: " . mysqli_connect_error();
		} else {
			// connection created so find out level of access
			$sql = "SHOW GRANTS for CURRENT_USER";
			$stmt = mysqli_prepare($conn, $sql);
			// perform query and create message based on success or error
			if (mysqli_stmt_execute($stmt)) {
				$result = mysqli_stmt_get_result($stmt);
				if ( mysqli_num_rows( $result ) > 0 ) {
					$records = array();
					while ($record = mysqli_fetch_array($result,MYSQLI_ASSOC))
					{
						if (strpos($record, 'UPDATE') !== false) {
							$update = true;
						}
					}
				}
			}
			
			mysqli_stmt_close($stmt);
			mysqli_close($conn);

			// login user
			$_SESSION['username'] = $username;
			$_SESSION['password'] = $password;
			$_SESSION['connection'] = $conn;
			$_SESSION['update'] = $update;
			// set flash message
			$_SESSION['message'] = "You are now logged in!";
			$_SESSION['alert-class'] = "alert-success"; // will set message to green
			header('location: home.html');
			exit();
		}
    }
} else 

// logout user
if(isset($_GET['logout'])) {
    session_destroy();
    unset($_SESSION['username']);
    unset($_SESSION['password']);
    unset($_SESSION['connection']);
    unset($_SESSION['update']);
    unset($_SESSION['alert-class']);
    header('location: login.php');  // as they are logged out send them to the login page
    exit();
}
?>
