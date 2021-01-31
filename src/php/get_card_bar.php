<?php
include "config.php";


$methods = [];
$status = [];
$sql = $conn->query("SELECT method,count(*) as count from request group by method");
if($sql)
{
	while($row = $sql -> fetch_assoc())
	{
		$methods[$row['method']]=intval($row['count']);
	}
}
$sql = $conn->query("SELECT status,count(*) as count from response where status is not null group by status");
if($sql)
{
	while($row = $sql -> fetch_assoc())
	{
		$status[$row['status']]=intval($row['count']);
	}
}

echo json_encode([$methods,$status]);
?>
