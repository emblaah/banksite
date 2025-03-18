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
app.get("/me/accounts", (req, res) => {
  const { username, password } = req.body;

  // Skapa unikt id för användaren
  const newUserId = users.length + 1;
  const newUser = { id: newUserId, username, password };

  // Lägg till användaren i users-arrayen
  users.push(newUser);

  // Skapa ett nytt konto för användaren med 0 kr från början
  const newAccount = { id: accounts.length + 1, userId: newUserId, amount: 0 };
  accounts.push(newAccount);

  // Svara med användarens id och konto-id
  res.json({
    message: "User created successfully",
    user: newUser,
    account: newAccount,
  });
});

app.post("/me/accounts/transactions", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    // Genererar engångslösenord (OTP)
    const token = generateOTP();

    // Lägg till i sessions-arrayen
    sessions.push({ token, userId: user.id });

    // Skicka tillbaka engångslösenordet
    res.json({ message: "Login successful", token });
  } else {
    // Om användarnamn/lösenord inte matchar
    res.status(401).json({ message: "Invalid login" });
  }
});

// Din kod här. Skriv dina routes:

// Starta servern
app.listen(PORT, () => {
  console.log(`Bankens backend körs på http://localhost:${PORT}`);
});
