<?php

$input = json_decode(file_get_contents('php://input'),TRUE);
$filters = $input['filters']
$content_types = $filters['content_types'];
$days = $filters['days'];
$providers = $filters['providers'];
$http_methods = $filters['http_methods'];

//calculate TTL for each hour
for ($i=0; $i<24; $i++){
  //set hour range for data
  if($i<10){
    $time="0".$i;
  }
  else{
    $time=$i;
  }
  //get count of user records for that hour
  $sql = $conn->query("SELECT COUNT(*) as records FROM record WHERE (DATE_FORMAT(activity_timestamp,'%H'))='$time' AND activity_type='$activity' AND userid='$userid'");
  if($sql){
      array_push($output, intval($sql->fetch_assoc()['records']));
  }
}
$output = array_slice($output, 1);
echo json_encode($output);

?>
