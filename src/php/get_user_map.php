<?php
include "config.php";

$i_peas = array();
if(isset($_SESSION['username'])){
	$username = $_SESSION['username'];

	$sql = $conn->query("SELECT serverIPAddress FROM entry INNER JOIN response ON entry.id = response.entry INNER JOIN header ON response.id = header.response where user='$username' AND serverIPAddress IS NOT NULL AND content_type LIKE '%html';");
	if($sql){
	  while($row = $sql->fetch_assoc()) {
	    
	  array_push($i_peas,$row['serverIPAddress']);
	    
	  }
	}

}
echo json_encode($i_peas);
?>
