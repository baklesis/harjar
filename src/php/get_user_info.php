<?php
include "config.php";

$results = null;
if(isset($_SESSION['username']) and isset($_SESSION['type'])){ #if user session exists
  # get username
  $username = $_SESSION['username'];
  # get number of entries
  $sql = $conn->query("SELECT COUNT(*) FROM entry WHERE user='$username'");
  if($sql){
    $entries = $sql->fetch_assoc()['COUNT(*)'];
  }
  # get last entry datetime
  $sql = $conn->query("SELECT MAX(uploadDateTime) as MAX FROM entry WHERE user='$username'");
  if($sql){
    $last_entry = $sql->fetch_assoc()['MAX'];
  }
  else{
    $last_entry = '-';
  }
  $results = [
    'username' => $username,
    'entries' => $entries,
    'last_entry' => $last_entry
  ];
}

echo json_encode($results);
?>
