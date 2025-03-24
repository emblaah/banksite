"use client";
import { parse } from "path";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [accountDetails, setAccountDetails] = useState({
    createdUsername: "",
    createdPassword: "",
  });

  // deposit, withdrawal, balance states
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("deposit");
  // const [withdrawAmount, setWithdrawAmount] = useState("");
  // const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedBalance = localStorage.getItem("balance");
    const savedUsername = localStorage.getItem("username");

    console.log("Loaded from localStorage:", {
      savedToken,
      savedBalance,
      savedUsername,
    });

    if (savedToken && savedUsername) {
      setToken(savedToken);
      setUsername(savedUsername);
      setLoggedIn(true);
    }
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    } else {
      fetchAccount(savedToken);
    }
  }, []);

  const loginButtonRef = useRef(null);

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
        console.log("data", data);
        alert("Account created successfully");
        setAccountDetails({
          createdUsername: username,
          createdPassword: password,
        });
        console.log("createdUsername", username);
        setUsername("");
        setPassword("");

        if (loginButtonRef.current) {
          loginButtonRef.current.focus();
        }
      } else {
        alert("Failed to create account: " + data.message);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: accountDetails.createdUsername,
          password: accountDetails.createdPassword,
        }),
      });
      const data = await response.json();
      console.log("Login Reponse sessions:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", accountDetails.createdUsername);
        // Om inloggning lyckades
        setToken(data.token);
        setUsername(accountDetails.createdUsername);
        setLoggedIn(true);
        fetchAccount(data.token);
      } else {
        // Om inloggning misslyckades
        alert("Invalid login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occured while logging in");
    }
  };

  const fetchAccount = async (token) => {
    try {
      const response = await fetch("http://localhost:3001/me/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      console.log("Response Data fetchAccount:", data);
      setAccountDetails(data);
      setBalance(data.amount);

      localStorage.setItem("balance", data.amount);
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  };

  const handleTransaction = async (e, amount) => {
    e.preventDefault();

    const transactionAmount = parseFloat(amount);

    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3001/me/accounts/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            depositAmount:
              transactionType === "deposit"
                ? transactionAmount
                : transactionType === "withdraw"
                ? -transactionAmount
                : 0,
          }),
        }
      );
      const data = await response.json();
      console.log("Response Data handleTransaction:", data);

      if (response.ok) {
        setBalance(data.account.amount);
        localStorage.setItem("balance", data.account.amount);
        setAmount("");
        alert("Transaction successful");
      } else {
        console.error("Transation failed:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during transaction:", error);
      alert("An error occured while making a transaction");
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

        <div className="border w-[600px] flex justify-center flex-col items-center h-[300px] p-6 rounded-xl shadow-lg">
          <h2 className="text-xl mb-4">Your account balance is:</h2>
          <p className="text-3xl font-bold text-green-600">{balance} kr</p>
        </div>

        <div className="border w-[600px] flex flex-col items-center gap-4 p-6 rounded-xl shadow-lg mt-6">
          <h2 className="text-lg font-semibold">Make a Transaction</h2>

          <label className="flex flex-col gap-2 w-full">
            <span className="text-sm">
              Enter amount to withdraw or deposit:
            </span>
            <input
              placeholder="Amount in kr"
              type="number"
              className="p-2 border rounded-lg w-full"
              value={amount}
              onChange={(e) => {
                const newAmount = e.target.value;
                if (!newAmount || !isNaN(newAmount)) {
                  setAmount(newAmount);
                }
              }}
            />
          </label>

          <div className="flex gap-4">
            <button
              className={`border p-2 rounded-lg ${
                transactionType === "deposit" ? "bg-green-400" : ""
              }`}
              onClick={() => setTransactionType("deposit")}>
              Deposit
            </button>
            <button
              className={`border p-2 rounded-lg ${
                transactionType === "withdraw" ? "bg-red-400" : ""
              }`}
              onClick={() => setTransactionType("withdraw")}>
              Withdraw
            </button>
          </div>

          <button
            className="bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-blue-600"
            onClick={handleTransaction}>
            {transactionType === "deposit" ? "Deposit" : "Withdraw"} Amount
          </button>
        </div>

        <button className="border p-2 rounded-lg" onClick={handleLogout}>
          Log out
        </button>
      </div>
    );
  }

  // if (loggedIn) {
  //   return (
  //     <div className="min-h-screen bg-base-100 flex items-center flex-col gap-2">
  //       <h1 className="text-2xl pt-4">Welcome, {username}!</h1>
  //       <div className="border w-[600px] justify-center flex h-[600px] rounded-xl">
  //         <h2>Your account balance is: {balance} kr</h2>
  //       </div>

  //     </div>
  //   );
  // }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="flex gap-8 border p-10 rounded-xl">
        {/* Create Account */}

        <div className="flex flex-col gap-2">
          <h2 className="text-xl">Create Account</h2>
          <label className="border p-2 rounded-xl flex items-center gap-2">
            <input
              type="text"
              fill="currentColor"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="border p-2 rounded-xl  flex items-center gap-2">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleCreateAccount)}
            />
          </label>
          <div className="flex flex-col">
            <button
              className="border p-2 rounded-lg"
              onClick={handleCreateAccount}>
              Create Account
            </button>
          </div>
        </div>

        {/* Log in */}

        <div className="flex flex-col gap-2">
          <h2 className="text-xl">Log in</h2>
          <label className="border p-2 rounded-xl flex items-center gap-2">
            <input
              type="text"
              fill="currentColor"
              placeholder="Username"
              value={accountDetails.createdUsername}
              onChange={(e) =>
                setAccountDetails({
                  ...accountDetails,
                  createdUsername: e.target.value,
                })
              }
              onKeyDown={(e) => handleKeyDown(e, handleLogin)}
            />
          </label>
          <label className="border p-2 rounded-xl  flex items-center gap-2">
            <input
              type="password"
              className="text-base-content"
              placeholder="Password"
              value={accountDetails.createdPassword}
              onChange={(e) =>
                setAccountDetails({
                  ...accountDetails,
                  createdPassword: e.target.value,
                })
              }
              onKeyDown={(e) => handleKeyDown(e, handleLogin)}
            />
          </label>
          <div className="flex flex-col gap-2">
            <button
              className="border p-2 rounded-lg"
              onClick={handleLogin}
              ref={loginButtonRef}>
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
