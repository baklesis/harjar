<?php
include "config.php";

$filters = json_decode(file_get_contents('php://input'),TRUE);

// create strings of all filter arrays using ", " delimiter
$content_types = join("', ''", $filters['content_types']);
//map days to numbers
$mapping=['sunday' => 1, 'monday' => 2, 'tuesday' => 3, 'wednesday' => 4, 'thursday' => 5, 'friday' => 6, 'saturday' => 7];
$mapped_days = array();
foreach($filters['days'] as $day){
  array_push($mapped_days,$mapping[$day]);
}
$days = join("', ''", []);
$providers = join("', '", $filters['providers']);
$http_methods = join("', '", $filters['http_methods']);

$output = array();



//calculate rsponse time for each hour
for ($i=0; $i<24; $i++){
  //set hour range for data
  if($i<10){
    $time="0".$i;
  }
  else{
    $time=$i;
  }
  //get average response time of entries for that hour
  // we check if any of the filter lists are empty. if any of them are, then "1" is returned in the logical expression (IF())
  // DAYOFWEEK() returns number of weekday that corresponds to the mapping above
  $sql = $conn->query("SELECT AVG(wait) as avg FROM entry
                       INNER JOIN response ON entry.id = response.entry
                       INNER JOIN request ON request.id = response.id
                       INNER JOIN header ON response.id = header.response
                       WHERE (DATE_FORMAT(startedDateTime,'%H'))='$time' AND
                       IF('' IN ('$content_types'), 1, content_type in ('$content_types')) AND
                       IF('' IN ('$days'), 1, DAYOFWEEK(startedDateTime) in ('$days')) AND
                       IF('' IN ('$providers'), 1, isp in ('$providers')) AND
                       IF('' IN ('$http_methods'), 1, method in ('$http_methods'))
                       ");
  if($sql){
      array_push($output, intval($sql->fetch_assoc()['avg']));
  }
}
echo json_encode($output);

?>
