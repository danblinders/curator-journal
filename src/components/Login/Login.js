import { useState } from 'react'
import axios from 'axios';


const Login = () => {
  const [login, setLogin] = useState(''),
        [password, setPassword] = useState('');
  const sendLoginCredentials = () => {
    axios.post('http://localhost:3001/login', {login, password}).then(response => {
      console.log(response.data);
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