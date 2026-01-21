import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // THIS IS THE SUBMIT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault(); // stops page refresh

    console.log("Login button clicked");
    console.log("Username:", username);
    console.log("Password:", password);

    // API CALL (we are only testing now)
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();
      console.log("TOKEN RESPONSE:", data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>

      {/* FORM SUBMIT HAPPENS HERE */}
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

        {/* THIS BUTTON TRIGGERS handleSubmit */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;