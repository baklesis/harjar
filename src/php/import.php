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

$jsonStream = \JsonMachine\JsonMachine::fromFile("../../assets/test.har","/log/entries");
foreach ($jsonStream as $name => $data) {
	var_dump($data);

	
}

?>