<?php
include "config.php";

$i_peas = array();
if(isset($_SESSION['username'])){
	$username = $_SESSION['username'];

	$sql = $conn->query("SELECT serverIPAddress from entry where user='$username' AND serverIPAddress IS NOT NULL");
	if($sql){
	  while($row = $sql->fetch_assoc()) {
	    
	  array_push($i_peas,$row['serverIPAddress']);
	    
	  }
	}

}
echo json_encode($i_peas);
?>
