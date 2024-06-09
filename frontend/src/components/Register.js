import { useState, useEffect} from "react";
import { Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [error, setError] = useState('')
    const [user, setUser] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
 
    const navigate = useNavigate();
    useEffect(()=>{
        if(localStorage.getItem('token')){
        navigate('/main');
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Wysyłamy zapytanie do bazy danych, aby sprawdzić istnienie użytkownika i pobrać imię i nazwisko
        try {
            if(password!==password2) throw new Error("Hasła nie zgadzają się");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({user, password, name, surname }),
                });
            if (response.ok) {
                const res = await response.json();
                console.log(res); 
                if(res.success){
                    alert(res.message); 
                    navigate('/');      
                }
                else{
                    setError(res.message);
                }
            }
        }
        catch (err) {
            setError('Wystąpił błąd: \n'+ err.message);
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
                Imię:<br />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} id="name" name="name" autoComplete="on" placeholder="Imię"/><br />
            </label>
            <label>
                Nazwisko:<br />
                <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} id="surname" name="surname" autoComplete="on" placeholder="Nazwisko"/><br />
            </label>
            <label>
                Hasło:<br />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}  id="password" name="password" autoComplete="on" placeholder="Hasło"/> <br /> 
            </label>
            <label>
                Powtórz hasło:<br />
                <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)}  id="password2" name="password2" autoComplete="on" placeholder="Powtórz hasło"/> <br /><br/>
            </label>
            <button type="submit">Zarejestruj</button>
            <p className="error">{error}</p>
            <Link to="/">Strona główna</Link>
        </form>
        </div>
        
    )

}
export default Register;