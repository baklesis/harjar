<?php
include "config.php";

$results = null;
if(isset($_SESSION['username']) and isset($_SESSION['type'])){ #if user session exists
  # get username
  $username = $_SESSION['username'];
  # get password length (we will show only length for safety)
  $sql = $conn->query("SELECT LENGTH(password) FROM user WHERE username='$username'");
  if($sql){
    $password_len = $sql->fetch_assoc()['LENGTH(password)'];
  }
  # get number of entries
  $sql = $conn->query("SELECT COUNT(*) FROM entry WHERE user='$username'");
  if($sql){
    $entries = $sql->fetch_assoc()['COUNT(*)'];
  }
  # get last entry datetime
  $sql = $conn->query("SELECT MAX(datetime) FROM entry WHERE user='$username'");
  if($sql){
    $last_entry = $sql->fetch_assoc();
  }
  else{
    $last_entry = '-';
  }
  $results = [
    'username' => $username,
    'password_len' => $password_len,
    'entries' => $entries,
    'last_entry' => $last_entry
  ];
}

echo json_encode($results);
?>
