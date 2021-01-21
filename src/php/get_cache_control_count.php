<?php
include "config.php";

$filters = json_decode(file_get_contents('php://input'),TRUE);
// create string of all array items  using ", " delimiter
$content_types = join("', '", $filters['content_types']);
$providers =join("', '", $filters['providers']);

$responses = 0;
$max_stale = 0;
$min_fresh = 0;
$public = 0;
$private = 0;
$no_cache = 0;
$no_store = 0;

$results = [
  'max-stale' => $max_stale,
  'min-fresh' => $min_fresh,
  'public' => $public,
  'private' => $private,
  'no-cache' => $no_cache,
  'no-store' => $no_store
];

# get count of directives
# we check if any of the filter lists are empty. if any of them are then "1" is returned in the logical expression
$sql = $conn->query("SELECT control, COUNT(*) as count FROM cache_control
INNER JOIN header on header.id = cache_control.header
INNER JOIN response ON response.id = header.response
INNER JOIN entry ON entry.id = response.entry
WHERE
IF('' IN ('$content_types'), 1, content_type in ('$content_types')) AND
IF('' IN ('$providers'), 1, isp in ('$providers'))
GROUP BY control");
if($sql){
  while($row = $sql->fetch_assoc()) {
    if ($row['control'] == 'max-stale') {$max_stale = $row['count'];}
    else if ($row['control'] == 'min-fresh') {$min_fresh = $row['count'];}
    else if ($row['control'] == 'public') {$public = $row['count'];}
    else if ($row['control'] == 'private') {$private = $row['count'];}
    else if ($row['control'] == 'no-cache') {$no_cache = $row['count'];}
    else if ($row['control'] == 'no-store') {$no_store = $row['count'];}
  }
}

# get number of responses
$sql = $conn->query("SELECT COUNT(*) as count FROM response
INNER JOIN header on header.response = response.id
INNER JOIN entry ON entry.id = response.entry
WHERE
IF('' IN ('$content_types'), 1, content_type in ('$content_types')) AND
IF('' IN ('$providers'), 1, isp in ('$providers'))");
if($sql){
  $responses = $sql->fetch_assoc()['count'];
  // create percentages
  if($responses != 0){
    $max_stale = intval( 100 * $max_stale / $responses );
    $min_fresh = intval( 100 * $min_fresh / $responses );
    $public = intval( 100 * $public / $responses );
    $private = intval( 100 * $private / $responses );
    $no_cache = intval( 100 * $no_cache / $responses );
    $no_store = intval( 100 * $no_store / $responses );

    $results = [
      'max-stale' => $max_stale,
      'min-fresh' => $min_fresh,
      'public' => $public,
      'private' => $private,
      'no-cache' => $no_cache,
      'no-store' => $no_store
    ];
  }
}
echo json_encode($results);
?>
