require('dotenv').config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 8081; //przechowywany w zmiennych środowiskowych
const SECRET_KEY = process.env.SECRET_KEY; //przechowywany w zmiennych środowiskowych

app.use(bodyParser.json());

app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "logowanie_02_react",
});
//-----------------------------------------------------------------------------
app.post("/login", (req, res) => {
  const sql = "SELECT user, hashedPass, name, surname FROM data WHERE user=?";
  db.query(sql, [req.body.user], (err, data) => {
    if (err)
      return res.status(500).json({ success: false, message: "Błąd serwera" }); //zwracamy poprawny kod HTTP w przypadku błędu serwera
    if (data.length > 0) {
      // console.log(data);
      // console.log(req.body.password);
      // console.log(data[0].hashedPass);
      bcrypt.compare(req.body.password, data[0].hashedPass, (err, result) => {
        if (err) {
          // console.error('Błąd porównywania haseł:', err);
          return res.status(500).json({
            success: false,
            message: "Błąd porównywania haseł",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              success: true,
              name: data[0].name,
              surname: data[0].surname,
            },
            SECRET_KEY,
            { expiresIn: "1h" } //Token wygaśnie za godzinę - bez jednostek będą liczone sekundy
          );
          return res.json({ token });
        } else
          return res.status
            .apply(401)
            .json({ success: false, message: "Błędne hasło!" });
      });
    } else
      return res.status(401).json({ success: false, message: "Błędny login!" });
  });
});
//-------------------------------------------------------------------
app.post("/register", (req, res) => {
  const { user, password, name, surname } = req.body;
  // Sprawdzenie, czy użytkownik już istnieje
  let sql = "SELECT user FROM data WHERE user=?";
  db.query(sql, [user], (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Błąd serwera" });
    }
    if (data.length > 0) {
      return res.status(409).json({ //409 - konflikt
        success: false,
        message: "Taki użytkownik już istnieje!",
      });
    }

    // Haszowanie hasła
    bcrypt.hash(password, 10, (err, hashedPass) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Błąd haszowania hasła" });
      }

      // Wstawienie nowego użytkownika do bazy danych
      sql = "INSERT INTO data (user, hashedPass, name, surname) VALUES (?, ?, ?, ?)";
      db.query(sql, [user, hashedPass, name, surname], (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Wystąpił błąd przy rejestracji" });
        } else {
          return res.status(201).json({
            success: true,
            message: "Rejestracja powiodła się",
          });
        }
      });
    });
  });
});
//-------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Nasłuchuję na porcie ${PORT}...`);
});

//Middleware do weryfikacji tokenów JWT
//Zabezpieczenie endpointów wymagających autoryzacji
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Przykład chronionego endpointu
app.get('/protected', authenticateToken, (req, res) => {
  res.send('This is protected content');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Coś poszło nie tak!');
});