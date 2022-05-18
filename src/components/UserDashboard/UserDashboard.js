import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import authContext from '../../context';
import './UserDashBoard.scss';

const UserDashboard = ({logoutUser}) => {
  const loggedUser = useContext(authContext);
  const signOut = () => {
    sessionStorage.removeItem('user');
    logoutUser(null);
  }

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__user">
              <h1 className="header__user-name">{loggedUser.first_name} {loggedUser.last_name}</h1>
            </div>
            <nav className="navbar">
              <div className="navbar__item">
                <NavLink end className={(navData) => navData.isActive ? "navbar__link navbar__link_active" : "navbar__link" } to="/user/:id">
                  Главная
                </NavLink>
              </div>
              <div className="navbar__item">
                <NavLink className={(navData) => navData.isActive ? "navbar__link navbar__link_active" : "navbar__link" } to="students">
                  Студенты
                </NavLink>
              </div>
              <div className="navbar__item">
                <NavLink className={(navData) => navData.isActive ? "navbar__link navbar__link_active" : "navbar__link" } to="management">
                  Успеваемость и посещаемость
                </NavLink>
              </div>
              <div className="navbar__item">
                <NavLink className={(navData) => navData.isActive ? "navbar__link navbar__link_active" : "navbar__link" } to="events">
                  События
                </NavLink>
              </div>
            </nav>
            <button className="header__logout" onClick={signOut}>Выйти</button>
          </div>
        </div>
      </header>     
      <div className="page__content">
        <div className="container">
          <div className="page__content-wrapper">
            <Outlet/>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserDashboard;