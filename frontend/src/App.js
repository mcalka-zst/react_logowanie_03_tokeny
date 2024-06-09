import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login"
import Main from "./components/Main"
import Subpage1 from "./components/Subpage1"
import Subpage2 from "./components/Subpage2"
import NotFound from "./components/NotFound";
import "./App.css";
import { useState } from "react";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };
  //Trzeba doinstalować moduł React Router. W konsoli wpisujemy: npm i react-router-dom
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/main" element={<Main/>} />
        <Route path="/subpage1" element={<Subpage1/>} />
        <Route path="/subpage2" element={<Subpage2/>} />
        <Route path="/" element={<Login onLogin={handleLogin}/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
