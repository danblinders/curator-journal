import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import authContext from '../../context';

const UserDashboard = () => {
  const user = useContext(authContext);
  return (
    <div className="container">
      <nav className="navbar">
        <div className="navbar__item">
          <NavLink activeclassname="navbar__link_active" to="/user/:id">
            Главная
          </NavLink>
        </div>
        <div className="navbar__item">
          <NavLink activeclassname="navbar__link_active" to="students">
            Студенты
          </NavLink>
        </div>
        <div className="navbar__item">
          <NavLink activeclassname="navbar__link_active" to="management">
            Успеваемость и Посещаемость
          </NavLink>
        </div>
        <div className="navbar__item">
          <NavLink activeclassname="navbar__link_active" to="events">
            События
          </NavLink>
        </div>
        <div className="navbar__item">
          <NavLink activeclassname="navbar__link_active" to="reports">
            Отчеты
          </NavLink>
        </div>
      </nav>
      <div className="page__content">
        <div className="container">
          <div className="page__content-wrapper">
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard;