"use client";
import { useState } from "react";

export default function LoginPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState(0);
  const [token, setToken] = useState("");

  const handleLogin = () => {
    fetch("http://localhost:3001/sessions", {
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
        if (data.token) {
          // Om inloggning lyckades
          setToken(data.token);
          setLoggedIn(true);
          fetchBalance(data.token);
        } else {
          // Om inloggning misslyckades
          alert("Invalid login");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchBalance = (token) => {
    fetch("http://localhost:3001/me/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((response) => response.json())
      .then((data) => setBalance(data.balance))
      .catch((error) => {
        console.error("Error fetching balance:", error);
      });
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
    <div className="min-h-screen bg-base-100 flex items-center flex-col gap-2">
      <h1 className="text-2xl pt-4">Welcome, {username}!</h1>
      <div className="border w-[600px] justify-center flex h-[600px] rounded-xl">
        <h2 className="">Your account balance is: {balance} kr</h2>
      </div>
      <button
        className="border p-2 rounded-lg"
        onClick={() => setLoggedIn(false)}>
        Log out
      </button>
    </div>
  );
}
