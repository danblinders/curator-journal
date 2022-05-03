import { useState, useEffect } from 'react'
import CuratorsList from '../CuratorsList/CuratorsList';
import axios from 'axios';

const AdminDashboardCurators = () => {

  const [curators, setCurators] = useState([]);

  const curatorsString = JSON.stringify(curators);

  useEffect(() => {
    axios.get('http://localhost:3001/all-curators').then(response => {
      setCurators(response.data);
    })
  }, [curatorsString]);

  const deleteCurator= (id) => {
    axios.post(
      "http://localhost:3001/delete", 
      {table_name: "curators", column_name: "curator_id", column_value: id}
    ).then(() => {
      setCurators(curators.filter(({curator_id}) => curator_id !== id));
    });
  }


  return (
    <>
      <div className="curators-list">
        <CuratorsList curatorsToShow={curators} deleteRow={deleteCurator}/>
      </div>
      <div className="curators-form">
        <AddCuratorForm updateCurators={setCurators}/>
      </div>
    </>
  )
}

const AddCuratorForm = ({updateCurators}) => {
  const [firstName, setFirstName] = useState(''),
        [lastName, setLastName] = useState(''),
        [email, setEmail] = useState(''),
        [phone, setPhone] = useState(''),
        [login, setLogin] = useState(''),
        [password, setPassword] = useState(''),
        [passwordRepeat, setPasswordRepeat] = useState('');

  const addCurator = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/add-curator', 
              {first_name: firstName, last_name: lastName, email, phone, login, password}
    ).then(() => {
      updateCurators([]);
    });
  }

  return (
    <div className="add-curator">
      <form action="#" method="POST" className="add-curator__form form" onSubmit={addCurator}>
        {/* {error ? <span className="form__error">{error}</span>: null} */}
        <label className="form__field">
          <span className="form__label">Имя:</span> 
          <input className="form__input" type="text" name="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Фамилия:</span>
          <input className="form__input" type="text" name="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">E-mail:</span>
          <input className="form__input" type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Телефон:</span>
          <input className="form__input" type="text" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Логин:</span>
          <input className="form__input" type="text" name="login" value={login} onChange={(e) => setLogin(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Пароль:</span>
          <input className="form__input" type="text" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label className="form__field">
          <span className="form__label">Повторите пароль:</span>
          <input className="form__input" type="text" name="password_repeat" value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)} required />
        </label>
        <button className="form__submit" type="submit" >Отправить</button>
      </form>
    </div>
  )
}

export default AdminDashboardCurators;