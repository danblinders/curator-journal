import './Login.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import loginBg from '../../img/login-bg.jpg';

const Login = ({loginUser}) => {
  const [error, setError] = useState(null);
  const formik_login = useFormik({
    initialValues: {
      login: '',
      password: ''      
    },
    validationSchema: yup.object({
      login: yup.string().required('Обязательное поле'),
      password: yup.string().required('Обязательное поле')
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      sendLoginCredentials();
    }
  });

  const navigate = useNavigate();

  const sendLoginCredentials = () => {
    axios.post('https://curator-backend.onrender.com/login', {login: formik_login.values.login, password: formik_login.values.password}).then(response => {
      if(response.data.type === 'success') {
        if(response.data.result[0]) {
          sessionStorage.setItem('user', JSON.stringify(response.data.result[0]));
          loginUser(response.data.result[0]);
          if (response.data.result[0].curator_id === 1) {
            navigate('/admin');
          } else {
            navigate(`/user/${response.data.result[0].curator_id}`);
          }
        } else {
          setError('Введены неверные данные');
        }
      }
    });
  }

  return (
    <div className="login" style={{background:`url(${loginBg}) center center/cover no-repeat`}}>
      <div className="login__content">
        <h2 className="title login__title">Войти</h2>
        <form action="#" method="POST" className="login-form form" onSubmit={formik_login.handleSubmit}>
          {error ? <span className="form__error">{error}</span>: null}
          <label className="form__field">
            <span className="form__label">Логин:</span> 
            <input className="form__input" type="text" name="login" value={formik_login.values.login} onChange={(e) => {
              formik_login.setFieldValue('login', e.target.value);
              setError(null);
            }}/>
            {formik_login.errors.login ? <span className="form__error">{formik_login.errors.login}</span>: null}
          </label>
          <label className="form__field">
            <span className="form__label">Пароль:</span>
            <input className="form__input" type="password" name="password" value={formik_login.values.password} onChange={(e) => {
              formik_login.setFieldValue('password', e.target.value);
              setError(null);
            }} />
            {formik_login.errors.password ? <span className="form__error">{formik_login.errors.password}</span>: null}
          </label>
          <button className="form__submit" type="submit">Отправить</button>
        </form>
      </div>
    </div>
  )
}

export default Login;