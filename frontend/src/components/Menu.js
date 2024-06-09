import { useNavigate } from "react-router-dom";

const Menu = ()=>{
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
      };

    return(
        <ul id="menu">
            <li><a href="/main">Strona główna</a></li>
            <li><a href="/subpage1">Podstrona 1</a></li>
            <li><a href="/subpage2">Podstrona 2</a></li>
            <li><a href="" onClick={handleLogout}>Wyloguj </a></li>
        </ul>
    )
}

export default Menu;