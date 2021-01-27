<?php
include "config.php";

$filters = json_decode(file_get_contents('php://input'),TRUE);

// selected filter arrays
$content_types = $filters['content_types'];
$days = $filters['days'];
$providers = $filters['providers'];
$http_methods = $filters['http_methods'];

// flag variables for "where" statement in MySQL
$content_types_empty = 0;
$days_empty = 0;
$providers_empty = 0;
$http_methods_empty = 0;
if(sizeof($filters['content_types'])==0){$content_types_empty = 1;}
if(sizeof($filters['days'])==0){$days_empty = 1;}
if(sizeof($filters['providers'])==0){$providers_empty = 1;}
if(sizeof($filters['http_methods'])==0){$http_methods_empty = 1;}

// create strings of all filter arrays using ", " delimiter to pass to MySQL
$content_types = join("', '", $filters['content_types']);
//map days to numbers
$mapping=['sunday' => 1, 'monday' => 2, 'tuesday' => 3, 'wednesday' => 4, 'thursday' => 5, 'friday' => 6, 'saturday' => 7];
$mapped_days = array();
foreach($filters['days'] as $day){
  array_push($mapped_days,$mapping[$day]);
}
$days = join("', '", $mapped_days);
$providers = join("', '", $filters['providers']);
$http_methods = join("', '", $filters['http_methods']);

$output = array();

//calculate response time for each hour
for ($i=0; $i<24; $i++){
  //set hour range for data
  if($i<10){
    $time="0".$i;
  }
  else{
    $time=$i;
  }

  // get average response time of entries for that hour

  // SQL: We check if any of the filter lists are empty
  // if any of them are, then we "switch off" the rspective filter by returning "1"
  // in the logical expression (IF()).
  // DAYOFWEEK() returns number of weekday that corresponds to the mapping above
  $sql = $conn->query("SELECT AVG(wait) as avg FROM entry
                       INNER JOIN response ON entry.id = response.entry
                       INNER JOIN request ON request.id = response.id
                       INNER JOIN header ON response.id = header.response
                       WHERE (DATE_FORMAT(startedDateTime,'%H'))='$time' AND
                       IF($content_types_empty, 1, content_type in ('$content_types')) AND
                       IF($days_empty, 1, DAYOFWEEK(startedDateTime) in ('$days')) AND
                       IF($providers_empty, 1, isp in ('$providers')) AND
                       IF($http_methods_empty, 1, method in ('$http_methods'))
                       ");
  if($sql){
      array_push($output, intval($sql->fetch_assoc()['avg']));
  }
}
echo json_encode($output);

?>
