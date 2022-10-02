
<?php

    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {

        $result = $conn->query("SELECT login FROM users WHERE login='$login'");
        
        //checking to see if username already exists
        if($result->num_rows > 0)
        {
            returnWithError("Username Already Exists");
        }
        else
        {
            $stmt = $conn->prepare("INSERT into users(firstName, lastName, login, password) VALUES (?,?,?,?)");
            $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
            $stmt->execute();
            $last_id = $conn->insert_id;
            
            returnWithInfo($firstName, $lastName, $last_id);
        }
        
        $stmt->close();
        $conn->close();

    }
   
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>


