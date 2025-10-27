<?php
require_once "config.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstname = $conn->real_escape_string($_POST['firstname']);
    $lastname  = $conn->real_escape_string($_POST['lastname']);
    $email     = $conn->real_escape_string($_POST['email']);
    $address   = $conn->real_escape_string($_POST['address']);
    $phone     = $conn->real_escape_string($_POST['phone']);
    $password  = $_POST['password'];
    $confirm   = $_POST['confirm'];

    // ตรวจสอบว่ารหัสผ่านตรงกันไหม
    if ($password !== $confirm) {
        echo "❌ รหัสผ่านไม่ตรงกัน";
        exit;
    }

    // เข้ารหัสรหัสผ่าน
    $hashed = password_hash($password, PASSWORD_DEFAULT);

    // ตรวจสอบว่าอีเมลมีอยู่แล้วหรือยัง
    $check_sql = "SELECT id FROM users WHERE email = ?";
    $stmt = $conn->prepare($check_sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo "⚠️ อีเมลนี้ถูกใช้งานแล้ว";
        exit;
    }
    $stmt->close();

    // เพิ่มข้อมูลใหม่
    $insert_sql = "INSERT INTO users (firstname, lastname, email, password, address, phone) 
                   VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($insert_sql);
    $stmt->bind_param("ssssss", $firstname, $lastname, $email, $hashed, $address, $phone);

    if ($stmt->execute()) {
        // ✅ สมัครสำเร็จ ให้เปลี่ยนหน้าไป login
        header("Location: ../Frontend/login.html");
        exit;
    } else {
        echo "❌ เกิดข้อผิดพลาด: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
}
?>
