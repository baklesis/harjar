<?php
include "config.php";

$results = array();
if(isset($_SESSION['username'])){
	$username = $_SESSION['username'];

	$sql = $conn->query("SELECT server_lat, server_lon, COUNT(*) as count FROM entry
											INNER JOIN response ON entry.id = response.entry INNER JOIN header ON response.id = header.response
											where user='$username'
											AND content_type LIKE '%html'
											AND (server_lat is not NULL) AND (server_lon is not NULL) AND (user_lat is not NULL) AND (user_lon is not NULL)
											group by server_lat, server_lon;");
	if($sql){
	  while($row = $sql->fetch_assoc()) {
	  array_push($results,$row);
	  }
	}
}
echo json_encode($results);
?>
