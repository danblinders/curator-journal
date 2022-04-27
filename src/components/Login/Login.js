import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({changeLoginInfo}) => {
  const [login, setLogin] = useState(''),
        [password, setPassword] = useState('');

  const navigate = useNavigate();

  const sendLoginCredentials = () => {
    axios.post('http://localhost:3001/login', {login, password}).then(response => {
      if(response.data[0]) {
        changeLoginInfo(response.data[0]);
        navigate('/');
      }
    });
  }
  
  return (
    <div className="login-form">
      <label className="login-form__field">
        <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
      </label>
      <label className="login-form__field">
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit" onClick={sendLoginCredentials}>Отправить</button>
    </div>
  )
}

export default Login