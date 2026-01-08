import { useState } from "react";
import { apiRequest } from "../api/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await apiRequest(
        `/auth/login?email=${email}&password=${password}`,
        { method: "POST" }
      );
      localStorage.setItem("token", res.access_token);
      window.location.href = "/deals";
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <br />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <br />
        <button>Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
