import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Generera engångslösenord
function generateOTP() {
  // Generera en sexsiffrig numerisk OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// Din kod här. Skriv dina arrayer
const users = [];
const accounts = [];
const sessions = [];

// Skapa användare
app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  // Skapa användare
  const userId = users.length + 101;
  const user = { id: userId, username, password };
  users.push(user);

  // Skapa konto
  const accountId = accounts.length + 1;
  const account = { id: accountId, userId, amount: 0 };
  accounts.push(account);

  console.log("users", users);
  console.log("accounts", accounts);

  res.json({ message: "User created" });
});

// Hitta användare baserat på användarnamn och lösenord
function getUser(username, password) {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user;
}

app.post("/sessions", async (req, res) => {
  const { username, password } = req.body;

  const user = getUser(username, password);

  if (user) {
    // Genererar engångslösenord (OTP)
    const token = generateOTP();

    // Lägg till i sessions-arrayen
    const session = { userId: user.id, token, username };
    sessions.push(session);
    console.log("sessions", sessions);

    res.json(session);
  } else {
    // Om användarnamn/lösenord inte matchar
    res.status(401).json({ message: "Invalid login" });
  }
});

app.post("/me/accounts", async (req, res) => {
  const { token } = req.body;

  const session = sessions.find((session) => session.token === token);

  if (session) {
    const { userId } = session;
    const account = accounts.find((account) => account.userId === userId);
    if (account) {
      res.json(account);
    } else {
      return res.status(404).json({ message: "Account not found" });
    }
  } else {
    res.status(401).json({ message: "Invalid session" });
  }
});

app.post("/me/accounts/transactions", async (req, res) => {
  const { token, depositAmount } = req.body;

  const session = sessions.find((session) => session.token === token);

  if (session) {
    const { userId } = session.userId;
    const account = accounts.find((account) => account.userId === userId);
    if (account && session) {
      account.amount += Number(depositAmount);
      res.json({ message: "Deposit successful", account });
    } else {
      res.status(401).json({ message: "Account not found" });
    }
  } else {
    res.status(401).json({ message: "Invalid session" });
  }
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Bankens backend körs på http://localhost:${PORT}`);
});
