"use client";
import { useState } from "react";

export default function LoginPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      setLoggedIn(true);
    } else {
      alert("Invalid login");
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-base-100 flex justify-center items-center flex-col gap-2">
        <label className="border p-2 rounded-xl flex items-center gap-2">
          <input
            type="text"
            className="text-base-content"
            fill="currentColor"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="border p-2 rounded-xl  flex items-center gap-2">
          <input
            type="password"
            className="text-base-content"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="border p-2 rounded-lg" onClick={handleLogin}>
          Log in
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-base-100 flex justify-center items-center flex-col gap-2">

      <h1 className="text-2xl">Welcome, {username}</h1>
      <button className="btn rounded-lg" onClick={() => setLoggedIn(false)}>
        Log out
      </button>
    </div>
  );
}
