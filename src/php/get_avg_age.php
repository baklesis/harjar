<?php
include "config.php";

$results = array();

$sql = $conn->query("SELECT content_type as name, AVG(age) as value FROM header GROUP BY content_type");
if($sql){
  while($row = $sql->fetch_assoc()) {
    if($row['name']!= null){
      $row['name'] = ucfirst($row['name']);  //capitalize first letter
      array_push($results,$row);
    }
  }
}


echo json_encode($results);
?>
