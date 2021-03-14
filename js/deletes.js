		<script>
			function runDelete() {
				var url = "http://localhost/basicapis/api/deleteapi.php";
				var data = document.getElementById('sql').value;
				
				const xhr = new XMLHttpRequest();
				xhr.addEventListener("readystatechange", callback);
				xhr.open("DELETE", url);
				xhr.send(data);	

				function callback() {
					if(this.readyState === 4) {
						if(this.status === 200 ){
							const jsObj = JSON.parse(xhr.responseText);
							document.getElementById('data').innerHTML 
								= JSON.stringify(jsObj['success']);
						} else {
							document.getElementById('data').innerHTML 
								= 'ERROR ' + this.status + " " + JSON.stringify(jsObj['failure']);
						}
					}
				}
			}
		</script>
