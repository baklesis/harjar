<?php
include "config.php";

$input = json_decode(file_get_contents('php://input'),TRUE);
$new_password = $input['password'];
$old_password = $_SESSION['username'];
$sql = $conn->query("UPDATE user SET password='$new_password' WHERE username='$old_password'");
if($sql){
  echo 1;
}
else{
	echo null;
}
?>
