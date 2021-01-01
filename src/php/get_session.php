<?php
include "config.php";

$results = null;
if(isset($_SESSION['username']) and isset($_SESSION['type'])){
  $results = [
    'type' => $_SESSION['type'],
    'username' => $_SESSION['username']
  ];
}

echo json_encode($results);
?>
