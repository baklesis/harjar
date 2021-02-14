<?php
include "config.php";

$username = $_SESSION['username'];

$sql = $conn->query("DELETE FROM user WHERE username = '$username'");
if($sql){
	echo 'ok';
  session_destroy();
}
else{
	echo null;
}
?>
