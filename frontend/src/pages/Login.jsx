import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log("Login button clicked");
    console.log("Username:", username);
    console.log("Password:", password);

    // STEP 1: Login and get token
    const loginResponse = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!loginResponse.ok) {
      alert("Invalid username or password");
      return;
    }

    const tokenData = await loginResponse.json();

    // Save tokens
    localStorage.setItem("access", tokenData.access);
    localStorage.setItem("refresh", tokenData.refresh);

    alert("Login successful (token saved)");

    // STEP 2: Check if user is Teacher
    const teacherCheck = await fetch(
      "http://127.0.0.1:8000/api/dashboard/teacher/summary/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenData.access}`,
        },
      }
    );

    if (teacherCheck.ok) {
      // User is Teacher
      window.location.href = "/teacher/dashboard";
    } else {
      // User is Student
      window.location.href = "/student/dashboard";
    }

  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong. Check console.");
  }
};

  return (
    <div>
      <h1>Login Page</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;