import { useState} from "react";
import { Link } from "react-router-dom";
// import bcrypt from 'bcryptjs';

const LoginForm = ({ onLogin }) => {
    const [error, setError] = useState('')
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Wysyłamy zapytanie do bazy danych, aby sprawdzić istnienie użytkownika i pobrać imię i nazwisko
        try {
            // const hashedPass = await bcrypt.hash(password, 10); //10 koszt hashowania
            const response = await fetch('http://localhost:8081/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({user,password}),
                });
            if (response.ok) {
                const res = await response.json();
                console.log(res); 
                if(res.success){
                    onLogin({ name: res.name, surname: res.surname })              
                }
                else{
                    setError(res.message);
                }
            }
        }
        catch (err) {
            setError('Wystąpił błąd: \n'+ err);
        }

    };
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Login:<br />
                <input type="text" value={user} onChange={(e) => setUser(e.target.value)} id="user" name="user" autoComplete="on" placeholder="Login"/><br />
            </label>
            <label>
                Hasło:<br />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}  id="password" name="password" autoComplete="on" placeholder="Hasło"/> <br /> <br />
            </label>
            <button type="submit">Zaloguj</button>
            
            <p className="error">{error}</p>
            <Link to="/register">Zarejestruj</Link>
        </form>
    )

}
export default LoginForm;