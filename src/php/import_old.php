<?php
require("../../assets/lib/JSON-Machine/Lexer.php");
require("../../assets/lib/JSON-Machine/Parser.php");
require("../../assets/lib/JSON-Machine/StreamChunks.php");
require("../../assets/lib/JSON-Machine/StringChunks.php");
require("../../assets/lib/JSON-Machine/PositionAware.php");
require("../../assets/lib/JSON-Machine/JsonMachine.php");
require("../../assets/lib/JSON-Machine/FileChunks.php");
require("../../assets/lib/JSON-Machine/functions.php");
require("../../assets/lib/JSON-Machine/JsonDecoder/Decoder.php");
require("../../assets/lib/JSON-Machine/JsonDecoder/DecodingResult.php");
require("../../assets/lib/JSON-Machine/JsonDecoder/JsonDecodingTrait.php");
require("../../assets/lib/JSON-Machine/JsonDecoder/ExtJsonDecoder.php");
require("../../assets/lib/JSON-Machine/JsonDecoder/PassThruDecoder.php");
require("../../assets/lib/JSON-Machine/Exception/JsonMachineException.php");
require("../../assets/lib/JSON-Machine/Exception/SyntaxError.php");
require("../../assets/lib/JSON-Machine/Exception/PathNotFoundException.php");
require("../../assets/lib/JSON-Machine/Exception/InvalidArgumentException.php");
require("../../assets/lib/JSON-Machine/Exception/UnexpectedEndSyntaxErrorException.php");

include "config.php";

$jsonStream = \JsonMachine\JsonMachine::fromFile("../test.txt");
foreach ($jsonStream as $name => $data) {
 	//var_dump($data['response']['status']);

 	$started_datetime_full = str_replace('T',' ',$data['startedDateTime']);
 	list($started_datetime, $leftovers) = explode('.',$started_datetime_full);
 	// echo $started_datetime;
 	$server_ip = $data['serverIPAddress'];
 	$wait = $data['wait'];
 //	echo $wait;

 	$status = $data['response']['status'];
 	//echo $status;
 	$status_text = $data['response']['status_text'];
 	$content_type = $data['response']['content_type'];
 	$age = $data['response']['age'];
 	//var_dump($age);
 	$last_modified = $data['response']['last_modified']; // problem with return null

 	$method = $data['request']['method'];
 	$url = $data['request']['url'];
 	$pragma = $data['request']['pragma'];
 	$host = $data['request']['host'];

//$input = json_decode(file_get_contents('php://input'),TRUE);
//$data = $input['data'];
//$isp = $input['isp'];
$sql_entry = $conn->query("INSERT INTO entry(user,uploadDateTime,startedDateTime,wait,serverIPAddress,isp, city) VALUES ('prisonmike', NOW(), '$started_datetime', $wait, '$server_ip', 'WIND', 'Patras')");
if($sql_entry){
	//$sql_id = $conn->query("SELECT LAST_INSERT_ID()");
		$last_entry_id = $conn->insert_id;
		//echo $last_entry_id;
			$sql_response = $conn->query("INSERT INTO response(entry,status,status_text) VALUES ($last_entry_id, $status, '$status_text')");
			if($sql_response){
				$last_id = $conn->insert_id;
				$sql_res_h = $conn->query("INSERT INTO header(request,response,content_type) VALUES (null,$last_id, '$content_type')");
				if($sql_res_h){
					$sql_request = $conn->query("INSERT INTO request(entry, method, url) VALUES ($last_entry_id,'$method','$url')");
					if($sql_request){
						$last_id = $conn->insert_id;
						$sql_req_h = $conn->query("INSERT INTO header(request,response,host) VALUES ($last_id,null, '$host')");
						if($sql_req_h){
							echo "GUANTANAMERA!<br>";
						}
						else{
	echo $conn -> error . "5<br>";
}
					}
					else{
	echo $conn -> error . "4<br>";
}
				}
				else{
	echo $conn -> error . "3<br>";
}
			}
			else{
	echo $conn -> error . "2<br>";
}
}
else{
	echo $conn -> error . "1<br>";
}
}
//if($sql){
//  echo 1;
//}
//else{
//	echo null;
//}
?>