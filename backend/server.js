// https://www.npmjs.com/package/dotenv
//bedziemy korzystać ze zmiennych środowiskowych
require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 8081; //przechowywany w zmiennych środowiskowych
const SECRET_KEY = process.env.SECRET_KEY; //przechowywany w zmiennych środowiskowych

// Parsowanie treści JSON
app.use(express.json());

app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
//-----------------------------------------------------------------------------
//Middleware  to funkcja lub zestaw funkcji, które są wykonywane podczas przetwarzania żądań HTTP. 
// Służy do modyfikowania obiektów żądania (req) i odpowiedzi (res), 
//zakończenia cyklu żądania/odpowiedzi lub wywołania kolejnej funkcji middleware w stosie.
//-----------------------------------------------------------------------------
//Middleware do weryfikacji tokenów JWT - zabezpieczenie endpointów wymagających autoryzacji
const authenticateToken = (req, res, next) => {
  //Funkcja sprawdza, czy nagłówek authorization istnieje i jeśli tak, wyodrębnia token z tego nagłówka.
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  //Jeśli token jest null lub nie istnieje, funkcja zwraca odpowiedź 401 (Unauthorized) i przerywa dalsze przetwarzanie.
  if (token == null) return res.sendStatus(401); //401 - unauthorized
  //Funkcja jwt.verify  weryfikuje token przy użyciu klucza SECRET_KEY.
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); //403 - forbidden
    req.user = user;
    next(); //przekazanie kontroli do następnej funkcji middleware w stosie lub do funkcji obsługującej żądanie.
  });
};
//-----------------------------------------------------------------------------
// Chroniony endpoint
app.get("/protected", authenticateToken, (req, res) => {
  //Kiedy middleware authenticateToken wywołuje next(), kontrola przechodzi do funkcji (req, res) => { ... }.
  //Funkcja ta tworzy odpowiedź w formacie JSON, która zawiera name i surname użytkownika z req.user.
  res.json({
    name: req.user.name,
    surname: req.user.surname,
  });
  //Kiedy middleware authenticateToken wywołuje next(), kontrola przechodzi do funkcji (req, res) => { ... }.
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
          return res
            .status(401)
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
      return res.status(409).json({
        //409 - konflikt
        success: false,
        message: "Taki użytkownik już istnieje!",
      });
    }

    // Haszowanie hasła
    bcrypt.hash(password, 10, (err, hashedPass) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Błąd haszowania hasła" });
      }

      // Wstawienie nowego użytkownika do bazy danych
      sql =
        "INSERT INTO data (user, hashedPass, name, surname) VALUES (?, ?, ?, ?)";
      db.query(sql, [user, hashedPass, name, surname], (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Wystąpił błąd przy rejestracji",
          });
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
//Globalny middleware do obsługi błędów. przechwytuje wszelkie błędy, które mogą wystąpić podczas przetwarzania żądania, i obsługuje je w jednolity sposób. 
//Tego typu middleware umieszcza się na końcu listy middleware, aby przechwytywał błędy z innych części aplikacji.
//Ten middleware zostanie wywołany automatycznie, gdy jakikolwiek inny middleware lub trasa wywoła next(err), przekazując obiekt błędu do next.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Coś poszło nie tak!");
});

//-------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Nasłuchuję na porcie ${PORT}...`);
});
