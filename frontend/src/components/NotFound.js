import { Link, redirect } from "react-router-dom";
import  { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

    const navigate = useNavigate();
    useEffect(()=>{
        if(!localStorage.getItem('token')){
        navigate('/login');
        }
    })

    return (
        <div className='main'>
                <h1>Błąd 404!</h1>
                <h3>Nie ma takiej strony! </h3>
                <Link to="/">Strona główna</Link>
        </div>
    )
}

export default NotFound;