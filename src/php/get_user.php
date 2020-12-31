<?php
include "config.php";

$usertype = null;
if(isset($_SESSION['username']) and isset($_SESSION['usertype'])){
  $results['type'] = $_SESSION['type'];
  $results['username'] = $_SESSION['username'];
}

echo json_encode($results);
?>
