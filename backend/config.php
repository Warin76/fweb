<?php
$servername = "localhost";
$username = "root";       // ปรับตามของคุณ
$password = "";           // ถ้ามีรหัสผ่านให้ใส่
$dbname   = "otop";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
