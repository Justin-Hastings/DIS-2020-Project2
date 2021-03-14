<?php require_once 'authorisation/authController.php'; ?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Sign in</title>
		
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

		<link rel="stylesheet" href="css/style.css">
	</head>
	
	<body>
		<div class="container">
			<div class="row">
				<div class="col-md-4 offset-me-4 form-div">
				<form action="login.php" method="post">

					<h3 class="text-centre">Register</h3>

					<?php if(count($errors) > 0): ?>
						<div class="alert alert-danger">
							<?php foreach($errors as $error): ?>
								<li><?php echo $error; ?></li>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
                    
					<div class="form-group">
						<label for="username" >Username or Email</label>
						<input type="text" name="username" class="form-control form-control-lg">
					</div>

					<div class="form-group">
						<label for="password" >Password</label>
						<input type="password" name="password" class="form-control form-control-lg">
					</div>

					<div class="form-group">
						<button type="submit" name="login-btn" class="btn btn-primary btn-block btn-lg">Sign in</button>
					</div>
				</form>
				</div>
			</div>
		</div>
	</body>
</html>