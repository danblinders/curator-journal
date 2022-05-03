import './Login.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({loginUser}) => {
  const [login, setLogin] = useState(''),
        [password, setPassword] = useState(''),
        [error, setError] = useState(false);

  const navigate = useNavigate();

  const sendLoginCredentials = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/login', {login, password}).then(response => {
      if(response.data[0]) {
        sessionStorage.setItem('user', JSON.stringify(response.data[0]));
        loginUser(response.data[0]);
        if (response.data[0].curator_id === 1) {
          navigate('/admin');
        } else {
          navigate(`/user/${response.data[0].curator_id}`);
        }

      } else {
        setError('Введены неверные данные');
      }
    });
  }

  const setCredential = (credentialFunc, credentialFuncValue) => {
    credentialFunc(credentialFuncValue);
    if(error) {
      setError(false);
    }
  }

  return (
    <div className="login">
      <h2 className="title login__title">Войти</h2>
      <form action="#" method="POST" className="login-form form" onSubmit={sendLoginCredentials}>
        {error ? <span className="form__error">{error}</span>: null}
        <label className="form__field">
          <span className="form__label">Логин:</span> 
          <input className="form__input" type="text" value={login} onChange={(e) => setCredential(setLogin, e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Пароль:</span>
          <input className="form__input" type="password" value={password} onChange={(e) => setCredential(setPassword, e.target.value)} required />
        </label>
        <button className="form__submit" type="submit" >Отправить</button>
      </form>
    </div>
  )
}

export default Login;