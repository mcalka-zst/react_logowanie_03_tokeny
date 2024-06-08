import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './components/Main';
import RegisterForm from './components/RegisterForm';
import NotFound from './components/NotFound';


const App = () => {
  //Trzeba doinstalować moduł React Router. W konsoli wpisujemy: npm i react-router-dom
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
  
}
export default App;
