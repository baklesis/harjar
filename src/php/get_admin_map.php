<?php
include "config.php";

$results = array();

$sql = $conn->query("SELECT user_lat, user_lon, server_lat, server_lon, COUNT(*) as count from entry
                    where (server_lat is not NULL) and (server_lon is not NULL) and (user_lat is not NULL) and (user_lon is not NULL)
                    group by user_lat, user_lon, server_lat, server_lon");
if($sql){
  while($row = $sql->fetch_assoc()) {
  array_push($results,$row);
  }
}

echo json_encode($results);
?>
