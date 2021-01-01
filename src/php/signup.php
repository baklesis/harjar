<?php
include "config.php";

$input = json_decode(file_get_contents('php://input'),TRUE);
$username = $input['username'];
$email = $input['email'];
$password = $input['password'];
$type = 'user';

$sql = $conn->query("INSERT INTO user (username,password,email,type) VALUES('$username','$password', '$email', '$type')");
if($sql){
	echo 'ok';
}
else{
	echo null;
}
?>
