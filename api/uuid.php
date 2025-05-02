<?php

/* UUIDv1
 * LLLLLLLL-MMMM-VHHH-vCCC-NNNNNNNNNNNN
 * L low timestamp(last 8)
 * M mid timestamp(4-7)
 * H high timestamp(first 3)
 * V version (1)
 * v variant (8-b)
 * C random clock(0-0x3fff)
 * N node(mac address)(can random :)
 */

$uuid_version="1"; // time and node
$uuid_variant=0x8000; // variant
$time_offset=0x1b21dd213814000; // uuid offset is 122192928000000000
$time=hrtime(true); // accurate to nanoseconds
$time_str=str_pad(dechex($time),15,"0"); // convert time to string
$hightime=substr($time_str,0,3); // high time 
$midtime=substr($time_str,3,4); // middle time
$lowtime=substr($time_str,7,8); // low time
$clock=mt_rand(0,0x3fff); // random clock
$mac_address=str_pad(dechex(mt_rand(0,0xffffffffffff)),12,"0"); // to prevent information leakage, MAC address is random
$uuid_parts=[
	$lowtime, // pt.1
	$midtime, // pt.2
	$uuid_version . $hightime, // pt.3
	dechex($uuid_variant + $clock) , // pt.4
	$mac_address // pt.5
];
$json_data=json_encode(array(
	'uuid'=>join('-', $uuid_parts) // assemble the full uuid
));
header('Content-Type: application/json'); // set header:json
echo $json_data; // send 