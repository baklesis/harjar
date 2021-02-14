<?php
include "config.php";

$filters = json_decode(file_get_contents('php://input'),TRUE);

// selected filter arrays
$content_types = $filters['content_types'];
$providers = $filters['providers'];

// flag variables for "where" statement in MySQL
$content_types_empty = 0;
$providers_empty = 0;
if(sizeof($content_types)==0){$content_types_empty = 1;}
if(sizeof($providers)==0){$providers_empty = 1;}

// create string of all array items  using ", " delimiter to pass to MySQL
$content_types = join("|", $content_types);
$providers =join("', '", $providers);

// cache control vars
$responses = 0;
$max_stale = 0;
$min_fresh = 0;
$public = 0;
$private = 0;
$no_cache = 0;
$no_store = 0;

# get count of directives in responses
// SQL: We check if any of the filter lists are empty
// if any of them are, then we "switch off" the rspective filter by returning "1"
// in the logical expression (IF()).
// We also check if content_type is null. If it is, we check if 'undefined' filter is in the content_types selected filter list.
$sql = $conn->query("SELECT control, COUNT(*) as count FROM cache_control
                    INNER JOIN header on header.id = cache_control.header
                    INNER JOIN response ON response.id = header.response
                    INNER JOIN entry ON entry.id = response.entry
                    WHERE
                    IF($content_types_empty, 1, IF((content_type IS NULL) OR (content_type = ''), 'undefined' REGEXP '$content_types', content_type REGEXP '$content_types')) AND
                    IF($providers_empty, 1, isp in ('$providers'))
                    GROUP BY control");
if($sql){
  while($row = $sql->fetch_assoc()) {
    if ($row['control'] == 'public') {$public = $row['count'];}
    else if ($row['control'] == 'private') {$private = $row['count'];}
    else if ($row['control'] == 'no-cache') {$no_cache = $row['count'];}
    else if ($row['control'] == 'no-store') {$no_store = $row['count'];}
  }
}

# get count of max-stale min-fresh directives in requests
$sql = $conn->query("SELECT control, COUNT(*) as count FROM cache_control
                    INNER JOIN header ON header.id = cache_control.header
                    INNER JOIN request ON request.id = header.request
                    INNER JOIN (SELECT entry.id FROM entry
                    INNER JOIN response ON response.entry = entry.id
                    INNER JOIN header ON header.response = response.id
                    WHERE
                    IF($content_types_empty, 1, IF((content_type IS NULL) OR (content_type = ''), 'undefined' REGEXP '$content_types', content_type REGEXP '$content_types')) AND
                    IF($providers_empty, 1, isp in ('$providers')))
                    AS filtered_entries ON filtered_entries.id = request.entry
                    WHERE control = 'max-stale' OR control = 'min-fresh'
                    GROUP BY control");
if($sql){
  while($row = $sql->fetch_assoc()) {
    if ($row['control'] == 'max-stale') {$max_stale = $row['count'];}
    else if ($row['control'] == 'min-fresh') {$min_fresh = $row['count'];}
  }
}

# get number of responses
$sql = $conn->query("SELECT COUNT(*) as count FROM response
                    INNER JOIN header on header.response = response.id
                    INNER JOIN entry ON entry.id = response.entry
                    WHERE
                    IF($content_types_empty, 1, IF((content_type IS NULL) OR (content_type = ''), 'undefined' REGEXP '$content_types', content_type REGEXP '$content_types')) AND
                    IF('' IN ('$providers'), 1, isp in ('$providers'))");
if($sql){
  $responses = $sql->fetch_assoc()['count'];
  // create percentages
  if($responses != 0){
    $public = intval( 100 * $public / $responses );
    $private = intval( 100 * $private / $responses );
    $no_cache = intval( 100 * $no_cache / $responses );
    $no_store = intval( 100 * $no_store / $responses );
  }
}

# get number of requests
$sql = $conn->query("SELECT COUNT(*) as count FROM request
                    INNER JOIN (SELECT entry.id FROM entry
                    INNER JOIN response ON response.entry = entry.id
                    INNER JOIN header ON header.response = response.id
                    WHERE
                    IF($content_types_empty, 1, IF((content_type IS NULL) OR (content_type = ''), 'undefined' REGEXP '$content_types', content_type REGEXP '$content_types')) AND
                    IF($providers_empty, 1, isp in ('$providers')))
                    AS filtered_entries ON filtered_entries.id = request.entry");
if($sql){
  $requests = $sql->fetch_assoc()['count'];
  // create percentages
  if($requests != 0){
    $max_stale = intval( 100 * $max_stale / $requests );
    $min_fresh = intval( 100 * $min_fresh / $requests);
  }
}

$results = [
  'max-stale' => $max_stale,
  'min-fresh' => $min_fresh,
  'public' => $public,
  'private' => $private,
  'no-cache' => $no_cache,
  'no-store' => $no_store
];

echo json_encode($results);
?>
