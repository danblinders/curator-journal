import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [group, setGroup] = useState('');
  const [curator, setCurator] = useState('');

  const addGroup = () => {
    axios.post('http://localhost:3001/groups', {group, curator}).then(response => {
      console.log('success');
    });
  }

  return (
    <>
      <div className="container">
        <nav className="navbar">
          <div className="navbar__item">
            <NavLink activeclassname="navbar__link_active" to="/admin">
              Главная
            </NavLink>
          </div>
          <div className="navbar__item">
            <NavLink activeclassname="navbar__link_active" to="curators">
              Кураторы
            </NavLink>
          </div>
          <div className="navbar__item">
            <NavLink activeclassname="navbar__link_active" to="students">
              Студенты
            </NavLink>
          </div>
          <div className="navbar__item">
            <NavLink activeclassname="navbar__link_active" to="events">
              События
            </NavLink>
          </div>
        </nav>
      </div>
      <div className="page__content">
        <div className="container">
          <div className="page__content-wrapper">
            <Outlet/>
          </div>
        </div>
      </div>
      {/* <div>
        <label className="add-group__field">
          Введите название группы
          <input type="text" value={group} onChange={(e) => setGroup(e.target.value)} />
        </label>
        <label className="add-group__field">
          Введите id куратора
          <input type="text" value={curator} onChange={(e) => setCurator(e.target.value)} />
        </label>
        <button type="submit" onClick={addGroup}>Отправить</button>
      </div> */}
    </>
  )
}

export default AdminDashboard;