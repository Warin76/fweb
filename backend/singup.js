import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
  import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

  // 🔥 Config ของโปรเจกต์คุณ (ไปคัดลอกจาก Firebase console → Project settings → Your apps)
  const firebaseConfig = {
  apiKey: "AIzaSyD93BGyai8OVSk5XCDRSjVjro31rL0XFT4",
  authDomain: "otopstode12.firebaseapp.com",
  projectId: "otopstode12",
  storageBucket: "otopstode12.firebasestorage.app",
  messagingSenderId: "743097656869",
  appId: "1:743097656869:web:0accb77b6d37a3f18241cc"
};

  // เริ่มต้น Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // 📥 เมื่อผู้ใช้กดสมัคร
  const form = document.getElementById('signupForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ดึงค่าจากฟอร์ม
    const firstname = form.firstname.value;
    const lastname = form.lastname.value;
    const email = form.email.value;
    const address = form.address.value;
    const phone = form.phone.value;
    const password = form.password.value;
    const confirm = form.confirm.value;

    // ตรวจสอบรหัสผ่าน
    if (password !== confirm) {
      alert("รหัสผ่านไม่ตรงกัน!");
      return;
    }

    try {
      // 🔐 สมัครด้วย Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🗂 บันทึกข้อมูลเพิ่มเติมลง Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstname,
        lastname,
        email,
        address,
        phone,
        createdAt: new Date()
      });

      alert("สมัครสมาชิกสำเร็จ!");
      window.location.href = "login.html";

    } catch (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    }
  });