import "../App.css";
import { useState } from "react";
import LoginForm from "./LoginForm";


const Main = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (userData) => {
    //dodajemy logikę autoryzacji, np. wysłanie danych do serwera
    setLoggedInUser(userData);
  };
  const handleLogout = () => {
    //dodać logikę wylogowywania
    setLoggedInUser(null);
  };

  return (
    <div className="main">
      {loggedInUser ? (
        <div>
          <h3>
            Witaj {loggedInUser.name} {loggedInUser.surname}{" "}
          </h3>
          <button onClick={handleLogout}>Wyloguj </button>
        </div>
      ) : (
        <div>
          <LoginForm onLogin={handleLogin} />
        </div>

        //  Renderuje komponent LoginForm.
        //  onLogin={handleLogin} - przekazanie propsa do komponentu LoginForm.
        //  Props o nazwie onLogin jest przypisany do funkcji handleLogin, która została zdefiniowana w komponencie App.
        // LoginForm może przekazać dane logowania z powrotem do komponentu App, który może je przetworzyć i aktualizować stan aplikacji.
      )}
    </div>
  );
};

export default Main;
