"use client";

import { useState } from "react";

export default function CreateAccountPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAccount = () => {
    fetch("http://localhost:3000/createAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Account created successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center flex-col gap-2">
      <label className="border p-2 rounded-xl flex items-center gap-2">
        <input
          type="text"
          fill="currentColor"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label className="border p-2 rounded-xl  flex items-center gap-2">
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button className="border p-2 rounded-lg" onClick={handleCreateAccount}>
        Create Account
      </button>
    </div>
  );
}
