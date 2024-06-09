import { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [error, setError] = useState('')
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem('token')){
        navigate('/main');
        }
    })

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Wysyłamy zapytanie do bazy danych, aby sprawdzić istnienie użytkownika oraz pobrać imię i nazwisko
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({user,password}),
                });
            if (response.ok) {
                const res = await response.json();
                // console.log(res); 
                if(res.token){
                    localStorage.setItem('token', res.token);
                    onLogin({ name: res.name, surname: res.surname }) ;
                    navigate('/main');            
                }
                else{
                    setError(res.message);
                }
               
            } else{
                 setError('Błędne dane logowania.');   
            }
        }
        catch (err) {
            setError('Wystąpił błąd: \n'+ err);
        }

    };
    return (
        <div className="main">
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
        </div>
    )

}
export default Login;