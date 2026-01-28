import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // STEP 1: Get JWT token
      const tokenResponse = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!tokenResponse.ok) {
        alert("Invalid username or password");
        return;
      }

      const tokenData = await tokenResponse.json();

      // Save tokens
      localStorage.setItem("access", tokenData.access);
      localStorage.setItem("refresh", tokenData.refresh);

      // STEP 2: Fetch logged-in user profile (ROLE)
      const profileRes = await fetch(
        "http://127.0.0.1:8000/api/users/me/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenData.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!profileRes.ok) {
        alert("Failed to fetch user profile");
        return;
      }

      const profile = await profileRes.json();

      // STEP 3: Role-based redirect
      if (profile.role === "student") {
        window.location.href = "/student/dashboard";
      } else if (profile.role === "teacher") {
        window.location.href = "/teacher/dashboard";
      } else if (profile.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        alert("Role not recognized");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="page">
      <h1>Login Page</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;