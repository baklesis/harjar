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
  // get ISP of address with "ip-api" API using curl
  // $curl = curl_init();  # start curl
  // curl_setopt($curl, CURLOPT_POST, 1);  # set curl to send data
  // curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($addresses));  # set data as ip addresses
  // curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);  # set curl to return data
  // curl_setopt($curl, CURLOPT_URL,"http://ip-api.com/batch?fields=isp");  # set curl url
  // $providers = curl_exec($curl);
  // curl_close($curl)
echo json_encode($providers);
?>
