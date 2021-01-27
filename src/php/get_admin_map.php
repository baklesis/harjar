<?php
include "config.php";

$results = array();

$sql = $conn->query("SELECT city, serverIPAddress from entry where serverIPAddress is not NULL");
if($sql){
  while($row = $sql->fetch_assoc()) {
    
  array_push($results,$row);
    
  }
}


echo json_encode($results);
?>
