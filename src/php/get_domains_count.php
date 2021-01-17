<?php
include "config.php";

$count = 0;

$sql = $conn->query("SELECT DISTINCT COUNT(url) as count FROM request");
if($sql){
    $count = $sql->fetch_assoc()['count'];
}

echo json_encode($count);
?>
