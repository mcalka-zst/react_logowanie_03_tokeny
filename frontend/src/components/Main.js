import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";

const Main = ({ user }) => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

   useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/protected`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              /*
              Prefiks "Bearer" jest częścią standardu autoryzacji w protokole HTTP, 
              który informuje serwer, jak interpretować dane autoryzacyjne przekazane w nagłówku "Authorization".
              W przypadku tokenów JWT, prefiks "Bearer" oznacza, że przesyłany jest token autoryzacyjny, 
              który powinien być używany do uwierzytelniania użytkownika lub dostępu do chronionych zasobów.
              Prefiks "Bearer" informuje serwer, że token przesyłany w nagłówku "Authorization" jest samym tokenem autoryzacyjnym, 
              a nie na przykład hasłem, kluczem API lub innym rodzajem danych autoryzacyjnych.
              W backendzie słowo "Authorization" Express normalizuje nagłówki do małych liter i tam bedzie:
              req.headers["authorization"]
              */
            },
          }
        );

        if (!response.ok) {
          throw new Error("Nieautoryzowany dostęp");
        }
        const data = await response.json();
        setMessage(`${data.name} ${data.surname}`);
      } catch (error) {
        navigate("/login");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Menu />
      <div id="username">Użytkownik: {message}</div>
      <hr/>
      <div className="main">
      <h2>Witaj {message}!</h2>
      <img src="/img/welcome.jpg" alt="Witaj"/>
        
      </div>
    </div>
  );
};

export default Main;
