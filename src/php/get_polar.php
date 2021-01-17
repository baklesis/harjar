<?php
include "config.php";

$filters = json_decode(file_get_contents('php://input'),TRUE);
// create string of all array items  using ", " delimiter
$content_types = join("', '", $filters['content_types']);
$providers =join("', '", $filters['providers']);
echo $content_types;

$responses = 0;
$public = 0;
$private = 0;
$no_cache = 0;
$no_store = 0;

$results = null;

# get public directives
# we also check if any of the filter lists are empty. if any of them are then "1" is returned in the logical expression
$sql = $conn->query("SELECT COUNT(*) as count FROM cache_control
INNER JOIN header on header.id = cache_control.header
INNER JOIN response ON response.id = header.response
INNER JOIN entry ON entry.id = response.entry
WHERE control='public' AND
IF('' IN ('$content_types'), 1, content_type in ('$content_types')) AND
IF('' IN ('$providers'), 1, isp in ('$providers'))");
if($sql){
  $public = $sql->fetch_assoc()['count'];
}

# get private directives
$sql = $conn->query("SELECT COUNT(*) as count FROM cache_control
INNER JOIN header on header.id = cache_control.header
INNER JOIN response ON response.id = header.response
INNER JOIN entry ON entry.id = response.entry
WHERE control='private' AND
IF('' IN ('$content_types'), 1, content_type in ('$content_types')) AND
IF('' IN ('$providers'), 1, isp in ('$providers'))");
if($sql){
  $private = $sql->fetch_assoc()['count'];
}

# get no-cache directives
$sql = $conn->query("SELECT COUNT(*) as count FROM cache_control
INNER JOIN header on header.id = cache_control.header
INNER JOIN response ON response.id = header.response
INNER JOIN entry ON entry.id = response.entry
WHERE control='no-cache' AND
IF('' IN ('$content_types'), 1, content_type in ('$content_types')) AND
IF('' IN ('$providers'), 1, isp in ('$providers'))");
if($sql){
  $no_cache = $sql->fetch_assoc()['count'];
}

# get no-store directives
$sql = $conn->query("SELECT COUNT(*) as count FROM cache_control
INNER JOIN header on header.id = cache_control.header
INNER JOIN response ON response.id = header.response
INNER JOIN entry ON entry.id = response.entry
WHERE control='no-store' AND
IF('' IN ('$content_types'), 1, content_type in ('$content_types')) AND
IF('' IN ('$providers'), 1, isp in ('$providers'))");
if($sql){
  $no_store = $sql->fetch_assoc()['count'];
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
    $public = intval( 100 * $public / $responses );
    $private = intval( 100 * $private / $responses );
    $no_cache = intval( 100 * $no_cache / $responses );
    $no_store = intval( 100 * $no_store / $responses );

    $results = array($public,$private,$no_cache,$no_store);
  }
}
echo json_encode($results);
?>
