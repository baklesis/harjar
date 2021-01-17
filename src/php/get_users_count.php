<?php
include "config.php";

$count = 0;

$sql = $conn->query("SELECT DISTINCT COUNT(*) as count FROM user");
if($sql){
    $count = $sql->fetch_assoc()['count'];
}

echo json_encode($count);
?>
