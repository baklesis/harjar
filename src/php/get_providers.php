<?php
include "config.php";

$providers = array();

$sql = $conn->query("SELECT DISTINCT isp FROM entry");
if($sql){
  while($row = $sql->fetch_assoc()) {
    $provider = $row['isp'];
    array_push($providers,$provider);
  }
}
echo json_encode($providers);
?>
