<?php
include "config.php";

$filters = json_decode(file_get_contents('php://input'),TRUE);

// selected filter arrays
$content_types = $filters['content_types'];
$providers = $filters['providers'];

// flag variables for "where" statement in MySQL
$content_types_empty = 0;
$providers_empty = 0;
if(sizeof($filters['content_types'])==0){$content_types_empty = 1;}
if(sizeof($filters['providers'])==0){$providers_empty = 1;}

// create strings of all filter arrays using ", " delimiter to pass to MySQL
$content_types = join("|", $filters['content_types']);
$providers =join("', '", $filters['providers']);

$buckets = array();  // all bucket ranges
$bucket_vals = array();  // all bucket values


// finds max TTL either using max_age or using expires/last-modified

// SQL
// We check if any of the filter lists are empty
// if any of them are, then we "switch off" the rspective filter by returning "1"
// in the logical expression (IF()).
// We also check if content_type is null. If it is, we check if 'undefined' filter is in the content_types selected filter list.
// COALESCE is used to replace null value with zero
// DAYOFWEEK() returns number of weekday that corresponds to the mapping above
$sql_max_ttl = $conn->query("SELECT GREATEST(COALESCE(TTL1,0), COALESCE(TTL2, 0)) AS TTL
                             FROM
                             ( SELECT MAX(max_age) AS TTL1 , MAX(TIME_TO_SEC(TIMEDIFF(expires,last_modified))) AS TTL2
                             FROM response
                             INNER JOIN header ON response.id = header.response
                             INNER JOIN entry ON entry.id = response.entry
                             WHERE
                             IF($content_types_empty, 1, IF(content_type IS NULL, 'undefined' REGEXP '$content_types', content_type REGEXP '$content_types')) AND
                             IF($providers_empty, 1, isp in ('$providers'))
                             )AS all_both_TTL");

if($sql_max_ttl){  // if max value has been found

  $max_ttl = intval ($sql_max_ttl->fetch_assoc()['TTL']);

  // define bucket limits (10 buckets)
  $ttl_step = intval ( $max_ttl / 10 );

  //for every bucket
  for($i = 0; $i<10; $i++){

    $curr_bucket_vals = array(); // temp var for current bucket values

    # define bucket range
    $start = $i*$ttl_step;

    if($i == 9){  // if it is the last bucket
      $end = $max_ttl;
    }
    else{
      $end = ($i+1)*$ttl_step;
    }

    # define range string to show on graph
    array_push($buckets,$start."-".$end);  // range to show on graph (ex 12-16)

    #get count of responses with TTL in range of bucket
    // SELECT calculates count of responses with bucket TTL either using max_age (TTL1) or using expires/last-modified (TTL2)
    $sql_ttl = $conn->query("SELECT COUNT(*) AS count FROM
                             ( SELECT IF(TTL1 IS NULL, TTL2, TTL1) as TTL FROM
                             ( SELECT max_age AS TTL1 , TIME_TO_SEC(TIMEDIFF(expires,last_modified)) AS TTL2
                             FROM response
                             INNER JOIN header ON response.id = header.response
                             INNER JOIN entry ON entry.id = response.entry
                             WHERE
                             IF($content_types_empty, 1, IF(content_type IS NULL, 'undefined' REGEXP '$content_types', content_type REGEXP '$content_types')) AND
                             IF($providers_empty, 1, isp in ('$providers'))
                             )
                             AS all_both_TTL
                             HAVING (TTL > '$start') and (TTL <= '$end')
                             )
                             AS all_TTL");
    if($sql_ttl){
      array_push($bucket_vals,intval($sql_ttl->fetch_assoc()['count']));  // push current bucket values in bucket values (containes values of every bucket)
    }
  }
}

$results = array(
  "buckets" => $buckets,
  "bucket_vals" => $bucket_vals
);

echo json_encode($results);

?>
