<?php
	require_once('..\authorisation\authController.php');
	if (isset($_SESSION['update'])){
		if ( $_SESSION['update'])
			echo 'true';
		else echo 'false';
	}
	else
		echo 'false';
?>