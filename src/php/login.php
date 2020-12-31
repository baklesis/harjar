<?php
include "config.php";

$input = json_decode(file_get_contents('php://input'),TRUE);
$username = $input['username'];
$password = $input['password'];
$sql = $conn->query("SELECT username,type FROM user WHERE username='$username' AND password='$password'");
if($sql){
  $result = $sql->fetch_assoc();
  $_SESSION['username']=$result['username'];
  $_SESSION['type']=$result['type'];
}
echo json_encode($result);
?>
