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

$input = json_decode(file_get_contents('php://input'),true,2);

$jsonStream = \JsonMachine\JsonMachine::fromString($input["data"]);
// $jsonStream = \JsonMachine\JsonMachine::fromFile("test1.txt"); // For testing
foreach ($jsonStream as $index => $data_group) {

	//$test = "INSERT INTO entry(user,uploadDateTime,startedDateTime,wait,serverIPAddress,isp, city) VALUES ".implode(',',array_fill(0,sizeof($data_group),"(?,?,?,?,?,?,?)"));
	//echo $test;
	$sql_entry = $conn->prepare("INSERT INTO entry(user,uploadDateTime,startedDateTime,wait,serverIPAddress,isp, city) VALUES (?,CONVERT_TZ(?,'+00:00','+02:00'),?,?,?,?,?)");
	$sql_request= $conn->prepare("INSERT INTO request(entry, method, url) VALUES (?,?,?)");
	$sql_req_h= $conn->prepare("INSERT INTO header(request,max_age,host) VALUES (?,?,?)");
	$sql_response = $conn->prepare("INSERT INTO response(entry,status,status_text) VALUES (?, ?, ?)");
	$sql_res_h = $conn->prepare("INSERT INTO header(response,content_type,max_age,age,last_modified) VALUES (?, ?, ?, ?, STR_TO_DATE(?,'%a, %d %b %Y %k:%i:%s GMT'))");
	$sql_cache = $conn->prepare("INSERT INTO cache_control VALUES (?, ?)");

	for ($i=0; $i < sizeof($data_group); $i++) {

		$data = $data_group[$i];
		// Bind for entry
		//$user = $input['username'];
		$user = "prisonmike";
		$upload_datetime = date("Y-m-d H:i:s");
		$started_datetime_full = str_replace('T',' ',$data['startedDateTime']);
	 	list($started_datetime, $leftovers) = explode('.',$started_datetime_full);
	 	$server_ip = $data['serverIPAddress'];

	 	$wait = $data['wait'];
	 	$isp = $data['isp'];
	 	$city = $data['city'];

		$sql_entry->bind_param("sssisss",$user,$upload_datetime,$started_datetime,$wait,$server_ip,$isp,$city);

		if($sql_entry->execute()){

			$last_entry_id = $conn->insert_id;
		 	$method = $data['request']['method'];
		 	$url = $data['request']['url'];

		 	$sql_request->bind_param("iss",$last_entry_id,$method,$url);

		 	if($sql_request->execute()){

		 		$last_r_id = $conn->insert_id;
		 		$pragma = $data['request']['pragma'];
			 	if(!empty($data['request']['cache_control'])){
			 		$max_age = $data['request']['cache_control']['max_age'];
			 	}
			 	$host = $data['request']['host'];

		 		$sql_req_h->bind_param("iis",$last_r_id,$max_age,$host);

		 		if($sql_req_h->execute()){

		 			$last_h_id = $conn->insert_id;
		 			if(!empty($data['request']['cache_control'])){
		 				foreach($data['request']['cache_control']['control'] as $control){
		 				 	$sql_cache->bind_param('is',$last_h_id,$control);
		 				 	if($sql_cache->execute()){
		 				 		echo 'Inserted request cache_control';
		 				 	}
		 				 	else{
							 	echo $conn -> error . "Request cache-control error.<br>";
		 				 	}
		 				}
		 			}

		 			$status = $data['response']['status'] == 0 ? null : $data['response']['status']; // consider zero status codes as null
				 	$status_text = $data['response']['status_text'] == '' ? null : $data['response']['status_text']; // consider empty status text strings as null

					$sql_response->bind_param("iis",$last_entry_id,$status,$status_text);

					if($sql_response->execute()){

						$last_r_id = $conn->insert_id;
						$content_type = $data['response']['content_type'];
						$type_split_array =explode(";",$content_type);
						$content_type = $type_split_array[0];
					 	$age = $data['response']['age'];
				 		$last_modified = $data['response']['last_modified'];
						if(!empty($data['response']['cache_control'])){
			 				$max_age = $data['response']['cache_control']['max_age'];
			 			}
						$sql_res_h->bind_param("isiis",$last_r_id,$content_type,$max_age,$age,$last_modified);

						if($sql_res_h->execute()){

							$last_h_id = $conn->insert_id;
				 			if(!empty($data['response']['cache_control'])){
				 				foreach($data['response']['cache_control']['control'] as $control){
				 					$sql_cache->bind_param('is',$last_h_id,$control);
				 					if($sql_cache->execute()){
				 						echo "Inserted response cache_control";
				 					}
				 					else{
										echo $conn -> error . "Response cache-control error. Control:" . $control;
				 					}
				 				}
				 				echo "Row complete!";
				 			}
						}
						else{
							echo $conn -> error . "res_header_error\n";
						}
					}
					else{
						echo $conn -> error . "response_error\n";
					}

		 		}
		 		else{
		 			echo $conn -> error . "req_header_error\n";
		 		}
		 	}
		 	else{
				echo $conn -> error . "request_error\n";
			}
		}
		else
		{
		echo $conn -> error . "entry_error\n";
		}




	}
}
?>
