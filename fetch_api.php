<?php

// Required setup to login to the API and fetch data
$loginUrl = "https://api.baubuddy.de/index.php/login";
$loginData = json_encode(["username" => "365", "password" => "1"]); // User credentials sent in JSON format

// Headers to be included in the HTTP request (Authorization and Content-Type)
$headers = [
    "Authorization: Basic QVBJX0V4cGxvcmVyOjEyMzQ1NmlzQUxhbWVQYXNz", // API key for authentication
    "Content-Type: application/json" // Indicates that the content is in JSON format
];

// Sending login request using cURL
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $loginUrl,
    CURLOPT_RETURNTRANSFER => true, 
    CURLOPT_CUSTOMREQUEST => "POST", // POST request
    CURLOPT_POSTFIELDS => $loginData, // JSON data to be sent
    CURLOPT_HTTPHEADER => $headers // Headers
]);

$response = curl_exec($curl); // Receive the login response
$error = curl_error($curl); // Check for any errors
curl_close($curl); // Close the cURL session

if ($error) { // Return error message in JSON format if an error occurs
    echo json_encode(["error" => "Login request failed: $error"]);
    exit;
}

$responseData = json_decode($response, true); // Decode the JSON response
$accessToken = $responseData["oauth"]["access_token"] ?? null; // Retrieve the access token

if (!$accessToken) { // Return error if the token cannot be retrieved
    echo json_encode(["error" => "Failed to retrieve access token"]);
    exit;
}

// URL to fetch the data
$dataUrl = "https://api.baubuddy.de/dev/index.php/v1/tasks/select";

// Fetching data using cURL
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $dataUrl,
    CURLOPT_RETURNTRANSFER => true, 
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $accessToken" 
    ]
]);

$dataResponse = curl_exec($curl); // Receive the data response
$error = curl_error($curl); // Check for any errors
curl_close($curl); // Close the cURL session

if ($error) { // Return error message in JSON format if an error occurs
    echo json_encode(["error" => "Data request failed: $error"]);
    exit;
}

header('Content-Type: application/json');

// Directly output the response
echo $dataResponse;
?>
