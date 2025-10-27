const cors = require("cors");
const express = require("express");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost/phpmyadmin/index.php?route=/table/structure&db=otop&table=ueser"],
  }),
);
app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }),
);

const port = 8080;
const secret = "mysecret";

let conn = null;

// function init connection mysql
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "ueser",
  });
};

/* เราจะแก้ไข code ที่อยู่ตรงกลาง */
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await conn.query("SELECT * FROM 	ueser WHERE email = ?", email);
  if (rows.length) {
    return res.status(400).send({ message: "Email is already registered" });
  }

  // Hash the password
  const hash = await bcrypt.hash(password, 10);
  // 10 = salt (การสุ่มค่าเพื่อเพิ่มความซับซ้อนในการเข้ารหัส)
  // และมันจะถูกนำมาใช้ตอน compare

  // Store the user data
  const userData = { email, password: hash };

  try {
    const result = await conn.query("INSERT INTO ueser SET ?", userData);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "insert fail",
      error,
    });
  }

  res.status(201).send({ message: "User registered successfully" });
});
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const [result] = await conn.query("SELECT * from users WHERE email = ?", email);
  const user = result[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).send({ message: "Invalid email or password" });
  }

  res.send({ message: "Login successful" });
});
// Listen
app.listen(port, async () => {
  await initMySQL();
  console.log("Server started at port 8080");
});