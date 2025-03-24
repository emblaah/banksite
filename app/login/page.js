"use client";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [view, setView] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState(0);
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedBalance = localStorage.getItem("balance");
    const savedUsername = localStorage.getItem("username");

    console.log("Loaded from localStorage:", { savedToken, savedBalance, savedUsername });

    if (savedToken) {
      setToken(savedToken);
      setBalance(parseFloat(savedBalance));
      setUsername(savedUsername);
      setLoggedIn(true);
    }
  }, []);

  const handleCreateAccount = async () => {
    try {
      const response = await fetch("http://localhost:3001/users", {
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

      if (response.ok) {
        console.log(data);
        alert("Account created successfully");
        setView("login");
      } else {
        alert("Failed to create account:" + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occured while creating account");
    }
  };

  const handleLogout = () => {
    // Clear localStorage and reset state
    localStorage.removeItem("token");
    localStorage.removeItem("balance");
    localStorage.removeItem("username");
    console.log("Cleared localStorage");

    setLoggedIn(false);
    setToken("");
    setBalance(0);
    setUsername("");
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/sessions", {
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

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);
        console.log("Saved to localStorage:", { token: data.token, username });

        // Om inloggning lyckades
        setToken(data.token);
        setLoggedIn(true);
        fetchBalance(data.token);
      } else {
        // Om inloggning misslyckades
        alert("Invalid login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchBalance = async (token) => {
    try {
      const response = await fetch("http://localhost:3001/me/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      setBalance(data.balance);

      localStorage.setItem("balance", data.balance);
      console.log("Saved balance to localStorage:", data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  if (loggedIn) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center flex-col gap-2">
        <h1 className="text-2xl pt-4">Welcome, {username}!</h1>
        <div className="border w-[600px] justify-center flex h-[600px] rounded-xl">
          <h2>Your account balance is: {balance} kr</h2>
        </div>
        <button
          className="border p-2 rounded-lg"
          onClick={() => setLoggedIn(false)}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center flex-col gap-2">
      {view === "createAccount" ? (
        <div className="flex flex-col gap-2">
          <h2 className="text-xl">Create Account</h2>
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
              onKeyDown={handleKeyDown}
            />
          </label>
          <div className="flex flex-col">
            <button
              className="border p-2 rounded-lg"
              onClick={handleCreateAccount}>
              Create Account
            </button>
            <button className="underline" onClick={() => setView("login")}>
              Already have an account? Log in!
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <h2 className="text-xl">Log in</h2>
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
              onKeyDown={handleKeyDown}
            />
          </label>
          <div className="flex flex-col gap-2">
            <button className="border p-2 rounded-lg" onClick={handleLogin}>
              Log in
            </button>
            <button
              className="underline"
              onClick={() => setView("createAccount")}>
              Don't have an account? Create one!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
