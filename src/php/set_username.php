<?php
include "config.php";

$input = json_decode(file_get_contents('php://input'),TRUE);
$new_username = $input['username'];
$old_username = $_SESSION['username'];

// we will create a new account with this username and transfer all the data from the old account to the new one

// get all account information
$sql_select = $conn->query("SELECT * FROM user WHERE username='$old_username'");
if($sql_select){
  $result = $sql_select->fetch_assoc();
  $password = $result['password'];
  $email = $result['email'];
  $type = $result['type'];
  // create new account with new username
  $sql_insert = $conn->query("INSERT INTO user VALUES ('$new_username','$password','$email','$type')");
  if($sql_insert){
  	$_SESSION['username'] = $new_username; // update session username
    //transfer entries to new account
    $sql_entries = $conn->query("UPDATE entry SET user='$new_username' WHERE user='$old_username'");
    if($sql_entries){
      //delete old account
      $sql_delete = $conn->query("DELETE FROM user WHERE username='$old_username'");
      if($sql_delete){
      	echo 1;
      }
    }
  }
}
else{
	echo null;
}

?>
