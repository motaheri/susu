<?php
$curl = curl_init('https://swansea.admin.ukmsl.net/msl/events/event_reports.aspx?event_id=564');

curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);                         
curl_setopt($curl, CURLOPT_USERPWD, 'mtaheri:c2XJa54z');
curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_ANY);                    
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);                          
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);                           
curl_setopt($curl, CURLOPT_USERAGENT, 'Sample Code');

$response = curl_exec($curl);                                          
$resultStatus = curl_getinfo($curl);                                   

if($resultStatus['http_code'] == 200) {
    echo $response;
} else {
    echo 'Call Failed '.print_r($resultStatus);                         
}

?>
